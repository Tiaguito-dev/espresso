// BackEnd/models/AdministradorPedidos.js

const Pedido = require('./Pedido');
const LineaPedido = require('./LineaPedido');
const AdministradorMesas = require('./AdministradorMesas'); 
const Menu = require('./Menu'); 
const PedidoBD = require('../repositories/PedidoBD');

class AdministradorPedidos {
    constructor() {
        // Instancias de Managers para acceder a su lógica y datos
        this.menu = new Menu(); 
        this.mesas = new AdministradorMesas(); 
    }

    async getPedidos() {
        try {
            const pedidos = await PedidoBD.obtenerPedidosHoy();
            // Ya asumimos que PedidoBD devuelve un array, por lo que convertimos
            return await this.convertirPedidoBD(pedidos);
        } catch (error) {
            // El error 'categorias.forEach is not a function' proviene de una de estas dependencias
            console.error("Error al obtener pedidos en AdministradorPedidos:", error.message);
            throw new Error(`Error en la capa de negocio al obtener pedidos: ${error.message}`);
        }
    }

    // =================================================================
    // 🛑 MÉTODOS REINSERTADOS PARA CORREGIR EL ERROR this.[metodo] is not a function
    // =================================================================
    
    // Método para crear un pedido: Lógica central de negocio
    async crearPedido(datosPedido) {
        const { mesa: nroMesa, lineas, observacion } = datosPedido;

        if (!lineas || !Array.isArray(lineas) || lineas.length === 0) {
            throw new Error('Se requiere al menos una línea de pedido.');
        }

        const mesaObj = await this.mesas.buscarMesaPorNumero(nroMesa);
        if (!mesaObj) {
            throw new Error(`Mesa ${nroMesa} no encontrada.`);
        }

        // 1. Obtener y calcular datos del nuevo pedido
        const ultimoNro = await PedidoBD.obtenerUltimoNroPedido();
        const nroPedido = (ultimoNro ? parseInt(ultimoNro, 10) : 0) + 1;
        const now = new Date();
        const fechaParaBD = now; 

        let montoTotal = 0;
        const lineasBD = [];
        const lineasObj = [];

        for (const linea of lineas) {
            // Se asume que buscarProductoPorId es ASÍNCRONO
            const productoObj = await this.menu.buscarProductoPorId(linea.idProducto);
            if (!productoObj) {
                throw new Error(`Producto con id ${linea.idProducto} no encontrado.`);
            }
            
            // Asumiendo que productoObj tiene un método getPrecio()
            const subtotal = productoObj.getPrecio() * linea.cantidad;
            montoTotal += subtotal; 
            
            // Datos para el Repositorio (BD)
            lineasBD.push({
                idProducto: productoObj.id,
                cantidad: linea.cantidad,
                monto: subtotal,
                nombreProducto: productoObj.getNombre() // Asumiendo getNombre()
            });

            // Objetos para devolver al Controlador
            lineasObj.push(new LineaPedido({
                producto: productoObj,
                cantidad: linea.cantidad
            }));
        }

        // 2. Crear el objeto Pedido (para validación y respuesta)
        const datosPedidoObj = {
            nroPedido: nroPedido,
            fecha: now, 
            total: montoTotal,
            mesa: mesaObj,
            lineasPedido: lineasObj,
            // Asumiendo que necesita el estado inicial
            estadoPedido: 'pendiente' 
        };
        let nuevoPedido;
        try {
            nuevoPedido = new Pedido(datosPedidoObj);
        } catch (error) {
            throw new Error(`Error de validación al crear el objeto Pedido: ${error.message}`);
        }

        // 3. Guardar el Pedido Principal en la BD
        await PedidoBD.crearPedido({
            nroPedido: nroPedido,
            // La fechaParaBD se maneja mejor en la BD, si no, se agrega aquí
            observacion: observacion || null,
            monto: montoTotal,
            idMozo: 1, // Placeholder
            idMesa: mesaObj.nroMesa,
        });

        // 4. Guardar las Líneas de Pedido en la BD
        for (const lineaBD of lineasBD) {
            await PedidoBD.crearLineaPedido({
                idPedido: nroPedido,
                ...lineaBD
            });
        }

        // 5. Devolver el objeto Pedido creado
        return nuevoPedido;
    }

    async convertirPedidoBD(pedidos) {
    const pedidosObj = [];
    // ESTO LO HACE BIEN console.log('Pedidos recibidos de BD:', pedidos);

    for (const pedido of pedidos) {
        // 1. Búsqueda de la Mesa por nro_mesa (Asumiendo que PedidoBD.js la devuelve)
        // 🛑 CORRECCIÓN CLAVE: Usamos 'pedido.nro_mesa' para buscar la mesa.
        const mesaObj = await this.mesas.buscarMesaPorNumero(pedido.nro_mesa); 

        // 🛑 NUEVO CHEQUEO DE SEGURIDAD: 
        // Si la mesa no se encuentra (por datos inconsistentes en la BD),
        // evitamos crear el objeto Pedido para prevenir el error.
        if (!mesaObj) {
            console.error(`ERROR DE DATOS: Mesa con número ${pedido.nro_mesa} no encontrada para el pedido ${pedido.nro_pedido}. SALTANDO.`);
            continue; // Saltar al siguiente pedido. Esto previene el error 500.
        }

        // Se asume que obtenerLineasPorNroPedido devuelve un array de objetos
        const lineasBD = await PedidoBD.obtenerLineasPorNroPedido(pedido.nro_pedido); 

        const lineasObj = [];

        for (const linea of lineasBD) {
            // Se asume que buscarProductoPorId es ASÍNCRONO
            const productoObj = await this.menu.buscarProductoPorId(linea.id_producto);

            if (productoObj) {
                lineasObj.push(new LineaPedido({
                    producto: productoObj,
                    cantidad: linea.cantidad
                }));
            } else {
                console.warn(`El producto con ID ${linea.id_producto} del pedido ${pedido.nro_pedido} ya no existe.`); 
            }
        }


        pedidosObj.push(new Pedido({
            nroPedido: pedido.nro_pedido,
            fecha: pedido.fecha_registro,
            total: pedido.monto,
            estadoPedido: pedido.estado,
            mesa: mesaObj, // mesaObj ya NO es null gracias al chequeo de arriba
            lineasPedido: lineasObj
        }));
    }
    console.log('Lineas de pedido convertidas:', pedidosObj.map(p => p.lineasPedido));
    return pedidosObj;
}

    async buscarPedidoPorNumero(nroPedido) {
        // PedidoBD.obtenerPedidoPorNro ya devuelve una fila (objeto) o null
        const pedido = await PedidoBD.obtenerPedidoPorNro(nroPedido); 
        if (!pedido) {
            return null;
        }
        // convertirPedidoBD espera un array, por eso se le pasa [pedido]
        const pedidoObj = await this.convertirPedidoBD([pedido]); 
        return pedidoObj[0];
    }

    eliminarPedidoPorNumero(nroPedido) {
        // Lógica de eliminación...
    }

    async modificarEstadoPedido(nroPedido, nuevoEstado) {
        const pedido = await this.buscarPedidoPorNumero(nroPedido);
        if (!pedido) {
            throw new Error("Pedido no encontrado.");
        }
        const estadoActual = pedido.getEstadoPedido();
        const estadoActualLower = estadoActual.toLowerCase();
        let estadoFinal = estadoActual;
        
        // Lógica de validación del nuevo estado (se mantiene tu lógica)
        if (nuevoEstado) {
            const nuevoEstadoLower = nuevoEstado.toLowerCase();
            if ((estadoActualLower === "finalizado" || estadoActualLower === "cancelado") && nuevoEstadoLower !== estadoActualLower) {
                throw new Error("No se puede cambiar un pedido finalizado o cancelado");
            }

            const estadosValidos = ['pendiente', 'listo', 'finalizado', 'cancelado', 'pagado'];
            if (!estadosValidos.includes(nuevoEstadoLower)) {
                throw new Error(`Estado '${nuevoEstado}' no es válido`);
            }
            estadoFinal = nuevoEstado;
        } else {
            // Lógica de avance automático
            switch (estadoActualLower) {
                case "pendiente":
                    estadoFinal = "listo";
                    break;
                case "listo":
                    estadoFinal = 'finalizado';
                    break;
                default:
                    estadoFinal = estadoActual;
            }
        }

        // Persistencia si hay cambio
        if (estadoFinal !== estadoActual) {
            await PedidoBD.modificarEstadoPedido(nroPedido, estadoFinal);
            // Actualizar el objeto en memoria
            pedido.estadoPedido = estadoFinal; 
        }
        return pedido;
    }
}

module.exports = AdministradorPedidos;
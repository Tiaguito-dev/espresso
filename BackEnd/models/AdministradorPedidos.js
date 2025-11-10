const Pedido = require('./Pedido');
const LineaPedido = require('./LineaPedido');
const Mesa = require('./Mesa');
const Menu = require('./Menu');
const AdministradorMesas = require('./AdministradorMesas');
const PedidoBD = require('../repositories/PedidoBD');
const { existeNombreProducto } = require('../repositories/ProductoBD');

class AdministradorPedidos {
    constructor() {
        this.menu = new Menu();
        this.mesas = new AdministradorMesas();
    }

    async convertirPedidoBD(pedidos) {
        const pedidosObj = [];
        // ESTO LO HACE BIEN console.log('Pedidos recibidos de BD:', pedidos);
        console.log("--- Iniciando convertirPedidoBD ---");
        for (const pedido of pedidos) {
            console.log(`Procesando Pedido Nro: ${pedido.nro_pedido}`);
            const mesaObj = await this.mesas.buscarMesaPorNumero(pedido.id_mesa);
            if (!mesaObj) {
                console.warn(`ADVERTENCIA: Pedido ${pedido.nro_pedido} omitido. La mesa (ID: ${pedido.id_mesa}) no existe.`);
                continue; 
            }
            const lineasBD = await PedidoBD.obtenerLineasPorNroPedido(pedido.nro_pedido);

            // ESTO LO HACE BIENconsole.log(`Líneas recibidas de BD para el pedido ${pedido.nro_pedido}:`, lineasBD);

            console.log("recupera los pedidos de la bd bien");

            const lineasObj = [];

            for (const linea of lineasBD) {
                console.log(`Procesando línea ${linea.id_linea_pedido}...`);
                const productoObj = await this.menu.buscarProductoPorId(linea.id);
                if (!productoObj) {
                    console.warn(`ADVERTENCIA: Pedido ${pedido.nro_pedido} - Línea omitida. El producto (ID: ${linea.id}) no existe.`);
                    continue;
                }
                if (productoObj) {
                    lineasObj.push(new LineaPedido({
                        //id: productoObj.id, //TODO: VER SI ESTO ANDA BIEN
                        id: linea.id_linea_pedido,
                        producto: productoObj,
                        cantidad: linea.cantidad
                    }));
                    //console.log(`Producto Numero ${productoObj.id} agregado a la línea de pedido ${pedido.nro_pedido}:`);
                } else {
                    console.warn(`El producto con ID ${linea.id} del pedido ${pedido.nro_pedido} ya no existe.`); //CASO MUY EXTRAÑO
                }
            }


            pedidosObj.push(new Pedido({
                nroPedido: pedido.nro_pedido,
                fecha: pedido.fecha_registro, //.slice(0, 10),
                total: pedido.total,
                estadoPedido: pedido.estado,
                observacion: pedido.observacion, 
                mozo: pedido.nombre_mozo,
                mesa: mesaObj,
                lineasPedido: lineasObj
            }));
            console.log("'new Pedido' creado con éxito.");
        }
        // Imprimo las lineas de pedido para verificar 
        // console.log('Lineas de pedido convertidas:', pedidosObj.map(p => p.lineasPedido));
        console.log("--- Finalizando convertirPedidoBD ---");
        return pedidosObj;
    }

    async crearPedido(datosPedido, usuarioToken) {
        const { mesa: nroMesa, lineas, observacion } = datosPedido;

        if (!lineas || !Array.isArray(lineas) || lineas.length === 0) {
            throw new Error('Se requier al menos una linea de pedido');
        }

        const mesaObj = await this.mesas.buscarMesaPorNumero(nroMesa);
        if (!mesaObj) {
            throw new Error(`Mesa ${nroMesa} no encontrada`);
        }
        
        if (mesaObj.estadoMesa.toLowerCase() !== 'disponible') {
            throw new Error(`La mesa ${nroMesa} no está disponible. Estado actual: ${mesaObj.estadoMesa}`);
        }

        try {
            await this.mesas.cambiarEstadoMesa(nroMesa, 'ocupada');
            mesaObj.estadoMesa = 'ocupada';
        } catch (error) {
            throw new Error(`Error al intentar ocupar la mesa ${nroMesa}: ${error.message}`);
        }

        let montoTotal = 0;
        const lineasBD = [];
        const lineasObj = [];

        console.log(datosPedido);

        for (const linea of lineas) {
            const productoObj = await this.menu.buscarProductoPorId(linea.idProducto);
            if (!productoObj) {
                throw new Error(`Producto con id ${linea.idProducto} no encontrado`);
            }
            const subtotal = productoObj.getPrecio() * linea.cantidad;
            montoTotal = montoTotal + subtotal;

            lineasBD.push({
                idProducto: productoObj.id,
                cantidad: linea.cantidad,
                monto: subtotal,
                nombre: productoObj.getNombre()
            });

            lineasObj.push(new LineaPedido({
                producto: productoObj,
                cantidad: linea.cantidad
            }));
        }
        const ultimoNro = await PedidoBD.obtenerUltimoNroPedido();
        console.log(ultimoNro);
        const nroPedido = (ultimoNro ? ultimoNro : 0) + 1;

        const now = new Date();
        const fecha = now.toISOString().replace('T', ' ').replace('Z', '+00');
        console.log(fecha);

        const datosNuevoPedido = {
            nroPedido: nroPedido,
            fecha: fecha, //chequear q funque
            mesa: mesaObj,
            lineasPedido: lineasObj,
            observacion: observacion || null
        };

        let nuevoPedido;
        try {
            nuevoPedido = new Pedido(datosNuevoPedido);
        } catch (error) {
            throw new Error(`Error de validacion: ${error.message}`);
        }

        console.log('nroPedido calculado:', nroPedido);

        await PedidoBD.crearPedido({
            pedido: nroPedido,
            // fecha: fecha, no anda el campo fecha
            observacion: observacion || null,
            monto: montoTotal,
            mozo: usuarioToken.codigo,
            mesa: mesaObj.nroMesa,
        });

        for (const lineaBD of lineasBD) {
            await PedidoBD.crearLineaPedido({
                pedido: nroPedido,
                codigo: lineaBD.idProducto,
                cantidad: lineaBD.cantidad,
                monto: lineaBD.monto,
                nombre: lineaBD.nombre
            });
        }

        return nuevoPedido;
    }
    

    async getPedidos() {
        const pedidos = await PedidoBD.obtenerPedidosHoy();
        console.log(pedidos);
        return this.convertirPedidoBD(pedidos);
    }
    /*
        cargarPedidos(pedidosData, menu, administradorMesas){
            try {
                pedidosData.forEach(dataPedido => {
                    const mesaObj = administradorMesas.buscarMesaPorNumero(dataPedido.mesa);
                    if (!mesaObj){
                        throw new Error(`Mesa ${dataPedido.mesa} no encontrada`)
                    }
                    
                    const lineasPedidoObj = dataPedido.lineas.map(linea => {
                        const productoObj = menu.buscarProductoPorId(linea.idProducto);
                        if (!productoObj){
                            throw new Error(`Producto ${linea.idProducto} no encontrado`);
                        }
                        return new LineaPedido({
                            producto: productoObj,
                            cantidad: linea.cantidad                        
                        });
                    });
    
                    const datos ={
                        nroPedido: dataPedido.nroPedido,
                        fecha: new Date(dataPedido.fecha),
                        mesa: mesaObj,
                        estadoPedido: dataPedido.estadoPedido,
                        lineasPedido: lineasPedidoObj
                    };
                    const nuevoPedido = new Pedido(datos);
                    this.agregarPedido(nuevoPedido);
                });
            } catch (error){
                console.error('Error cargando pedidos iniciales:', error.message);
            }        
        }
    
        agregarPedido(pedido) {
            if (pedido instanceof Pedido) {
                this.pedidos.push(pedido);
            }   
        }
    */
    async buscarPedidoPorNumero(nroPedido) {
        const pedido = await PedidoBD.obtenerPedidoPorNro(nroPedido);
        if (!pedido) {
            return null;
        }
        const pedidoObj = await this.convertirPedidoBD([pedido]);
        return pedidoObj[0];
    }

    async modificarEstadoPedido(nroPedido, nuevoEstado) {
        const pedido = await this.buscarPedidoPorNumero(nroPedido);
        if (!pedido) {
            throw new Error("Pedido no encontrado.");
        }
        const estadoActual = pedido.getEstadoPedido();
        const estadoActualLower = estadoActual.toLowerCase();
        let estadoFinal = estadoActual;
        if (nuevoEstado) {
            const nuevoEstadoLower = nuevoEstado.toLowerCase();
            if ((estadoActualLower === "finalizado" || estadoActualLower === "cancelado") && nuevoEstadoLower !== estadoActualLower) {
                throw new Error("No se puede cambiar un pedido finalizado o cancelado");
            }

            const estadosValidos = ['pendiente', 'listo', 'finalizado', 'cancelado'];
            if (!estadosValidos.includes(nuevoEstadoLower)) {
                throw new Error(`Estado '${nuevoEstado}' no es válido`);
            }
            estadoFinal = nuevoEstado;
        } else {
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

        if (estadoFinal !== estadoActual) {
            await PedidoBD.modificarEstadoPedido(nroPedido, estadoFinal);
            pedido.estadoPedido = estadoFinal;
        }
        return pedido;
    }

    async agregarLinea(nroPedido, datosLinea) {
        const { idProducto, cantidad } = datosLinea;

        const pedido = await this.buscarPedidoPorNumero(nroPedido);
        if (!pedido) {
            throw new Error("Pedido no encontrado.");
        }
        if (pedido.estadoPedido.toLowerCase() !== 'pendiente') {
            throw new Error("No se pueden agregar líneas a un pedido que no esté 'pendiente'.");
        }

        const productoObj = await this.menu.buscarProductoPorId(idProducto);
        if (!productoObj) {
            throw new Error(`Producto con id ${idProducto} no encontrado`);
        }

        const subtotal = productoObj.getPrecio() * cantidad;
        const nuevoTotal = parseFloat(pedido.total) + subtotal; 

        await PedidoBD.crearLineaPedido({
            pedido: nroPedido,
            codigo: idProducto,
            cantidad: cantidad,
            monto: subtotal
        });

        await PedidoBD.actualizarTotalPedido(nroPedido, nuevoTotal);

        return this.buscarPedidoPorNumero(nroPedido);
    }

    async eliminarLinea(nroPedido, idLinea) {
        const pedido = await this.buscarPedidoPorNumero(nroPedido);

        if (!pedido) {
            throw new Error("Pedido no encontrado.");
        }

        if (pedido.estadoPedido.toLowerCase() !== 'pendiente') {
            throw new Error("No se pueden eliminar líneas de un pedido que no esté 'pendiente'.");
        }

        const linea = await PedidoBD.obtenerLineaPorId(idLinea);
        if (!linea) {
            throw new Error("Línea de pedido no encontrada.");
        }

        const subtotalLinea = parseFloat(linea.subtotal);
        const nuevoTotal = parseFloat(pedido.total) - subtotalLinea;
        
        await PedidoBD.eliminarLineaPorId(idLinea);
        await PedidoBD.actualizarTotalPedido(nroPedido, nuevoTotal);
        return this.buscarPedidoPorNumero(nroPedido);
    }
    async actualizarObservacion(nroPedido, observacion) {
        const pedido = await this.buscarPedidoPorNumero(nroPedido);
        if (!pedido) {
            throw new Error("Pedido no encontrado.");
        }

        if (observacion !== undefined && observacion !== null && observacion !== pedido.observacion) {
            await PedidoBD.modificarObservacionPedido(nroPedido, observacion);
            pedido.observacion = observacion; 
        }
        return pedido;
    }
}



module.exports = AdministradorPedidos;
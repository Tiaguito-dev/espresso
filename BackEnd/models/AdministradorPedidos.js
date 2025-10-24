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

    async convertirPedidoBD(pedidos){
        const pedidosObj = [];
        for (const pedido of pedidos){
            const mesaObj = await this.mesas.buscarMesaPorNumero(pedido.id_mesa);

            const lineasBD = await PedidoBD.obtenerLineasPorNroPedido(pedido.nro_pedido);
            console.log('LINEAS', lineasBD);
            const lineasObj = [];

            for (const linea of lineasBD) {
                const productoObj = await this.menu.buscarProductoPorId(linea.id_producto);

                if (productoObj){
                    lineasObj.push(new LineaPedido({
                        producto: productoObj,
                        cantidad: linea.cantidad
                    }));
                }else{
                    console.warn(`El producto con ID ${linea.id_producto} del pedido ${pedido.nro_pedido} ya no existe.`); //CASO MUY EXTRAÑO
                }
            }

            pedidosObj.push(new Pedido({
                nroPedido: pedido.nro_pedido,
                fecha: pedido.fecha_registro,
                estadoPedido: pedido.estado,
                mesa: mesaObj,
                lineasPedido: lineasObj
            }));
        }
        return pedidosObj;
    }

    async crearPedido(datosPedido){
        const { mesa: nroMesa, lineas, observacion } = datosPedido;

        if (!lineas || !Array.isArray(lineas) || lineas.length === 0){
            throw new Error('Se requier al menos una linea de pedido');
        }

        const mesaObj = await this.mesas.buscarMesaPorNumero(nroMesa);
        if(!mesaObj){
            throw new Error(`Mesa ${nroMesa} no encontrada`);
        }

        let montoTotal = 0;
        const lineasBD = [];
        const lineasObj = [];

        console.log(datosPedido)
        
        for (const linea of lineas){
            const productoObj = await this.menu.buscarProductoPorId(linea.idProducto);
            if (!productoObj){
                throw new Error(`Producto con id ${linea.idProducto} no encontrado`);
            }
            const subtotal = productoObj.getPrecio() * linea.cantidad;
            montoTotal = montoTotal + subtotal;

            lineasBD.push({
                idProducto: productoObj.id,
                cantidad: linea.cantidad,
                monto: subtotal,
                nombreProducto: productoObj.getNombre()
            });

            lineasObj.push(new LineaPedido({
                producto: productoObj,
                cantidad: linea.cantidad
            }));
            
            const ultimoNro = await PedidoBD.obtenerUltimoNroPedido();
            console.log(ultimoNro);
            const nroPedido = (ultimoNro ? ultimoNro : 0) + 1;
            const fecha = Date.now()

            const datosPedido = {
                nroPedido: nroPedido,
                fecha: fecha.toISOString().split('T')[0], //chequear q funque
                mesa: mesaObj,
                lineasPedido: lineasObj
            };

            let nuevoPedido;
            try {
                nuevoPedido = new Pedido(datosPedido);
            }catch(error){
                throw new Error(`Error de vaidacion: ${error.message}`);
            }

            await PedidoBD.crearPedido({
                nroPedido: nroPedido,
                // fecha: fecha, no anda el campo fecha
                observacion: observacion || null,
                monto: montoTotal,
                idMozo: 1,
                idMesa: mesaObj.nroMesa,
            });

            /*const pruebaPedido = {
                nroPedido: nroPedido,
                //fecha: fecha,
                observacion: observacion || null,
                monto: montoTotal,
                idMozo: 1,
                idMesa: mesaObj.nroMesa,
            }

            console.log('Creando pedido en BD:', pruebaPedido);

            await PedidoBD.crearPedido(pruebaPedido);*/

            for (const lineaBD of lineasBD){
                await PedidoBD.crearLineaPedido({
                    idPedido: nroPedido,
                    ...lineaBD
                });
            }

            return nuevoPedido;
        }
    }

    async getPedidos(){
        const pedidos = await PedidoBD.obtenerPedidosHoy();
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
        if (!pedido){
            return null;
        }
        const pedidoObj = await this.convertirPedidoBD([pedido]);
        return pedidoObj[0];
    }

    eliminarPedidoPorNumero(nroPedido) {

    }

    async modificarEstadoPedido(nroPedido, nuevoEstado) {
        const pedido = await this.buscarPedidoPorNumero(nroPedido);  
        if (!pedido) {
            throw new Error("Pedido no encontrado.");
        }
        const estadoActual = pedido.getEstadoPedido();
        const estadoActualLower = estadoActual.toLowerCase();
        let estadoFinal = estadoActual;
        if (nuevoEstado){
            const nuevoEstadoLower = nuevoEstado.toLowerCase();
            if ((estadoActualLower === "finalizado" || estadoActualLower === "cancelado") && nuevoEstadoLower !== estadoActualLower){
                throw new Error("No se puede cambiar un pedido finalizado o cancelado");
            } 

            const estadosValidos = ['pendiente', 'listo', 'finalizado', 'cancelado'];
            if (!estadosValidos.includes(nuevoEstadoLower)){
                throw new Error(`Estado '${nuevoEstado}' no es válido`);
            }
            estadoFinal = nuevoEstado;
        }else{
            switch (estadoActualLower){
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

        if (estadoFinal !== estadoActual){
            await PedidoBD.modificarEstadoPedido(nroPedido, estadoFinal);
            pedido.estadoPedido = estadoFinal;
        }
        return pedido;
    }
}

module.exports = AdministradorPedidos;
const Pedido = require('./Pedido');
const Producto = require('./Producto');
constLineaPedido = require('./LineaPedido');

class AdministradorPedidos {
    constructor() {
        this.pedidos = [];
    }   

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

    buscarPedidoPorNumero(nroPedido) {
        return this.pedidos.find(pedido => pedido.nroPedido === nroPedido);
    }

    eliminarPedidoPorNumero(nroPedido) {

    }

    modificarEstadoPedido(nroPedido, nuevoEstado) {
        const pedido = this.buscarPedidoPorNumero(nroPedido);  
        if (pedido) {
            pedido.estadoPedido = nuevoEstado;
            return true;
        }
        return false;
    }
}

module.exports = AdministradorPedidos;
const Pedido = require('./Pedido');

class AdministradorPedidos {
    constructor() {
        this.pedidos = [];
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
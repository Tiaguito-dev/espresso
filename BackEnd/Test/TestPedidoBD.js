const PedidoBD = require('../repositories/PedidoBD');

exports.runTests = () => {

    PedidoBD.obtenerPedidosHoy()
        .then(pedidosData => {
            console.log('Pedidos de hoy:', pedidosData);
        })
        .catch(error => {
            console.error('Error al obtener los pedidos de hoy:', error);
        });

    PedidoBD.obtenerPedidosFecha('2025-10-23')
        .then(pedidosData => {
            console.log('Pedidos de 2025-10-23:', pedidosData);
        })
        .catch(error => {
            console.error('Error al obtener los pedidos de 2025-10-23:', error);
        });

    PedidoBD.obtenerUltimoNroPedido()
        .then(ultimoNro => {
            console.log('Último número de pedido:', ultimoNro);
        })
        .catch(error => {
            console.error('Error al obtener el último número de pedido:', error);
        });

    PedidoBD.modificarEstadoPedido(1, 'Pagado')
        .then(resultado => {
            console.log(resultado.message);
        })
        .catch(error => {
            console.error('Error al obtener el último número de pedido:', error);
        });
    PedidoBD.obtenerPedidoPorNro(1)
        .then(pedido => {
            console.log('Pedido nro 1:', pedido);
        })
        .catch(error => {
            console.error('Error al obtener el pedido nro 1:', error);
        });

    /*
    PedidoBD.crearPedido({
        nroPedido: 5,
        fecha: new Date(),
        observacion: 'Pedido de prueba',
        monto: 100,
        idMozo: 1,
        idMesa: 1
    })
    .then(resultado => {
        console.log(resultado.message);
    })
    .catch(error => {
        console.error('Error al crear el pedido:', error);
    });
    */
}
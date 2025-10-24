const PedidoBD = require('../repositories/PedidoBD');

exports.runTests = async () => {

    try {
        const pedidosHoy = await PedidoBD.obtenerPedidosHoy();
        console.log('Pedidos de hoy:', pedidosHoy);
    } catch (error) {
        console.error('Error al obtener los pedidos de hoy:', error);
    }

    try {
        const pedidosFecha = await PedidoBD.obtenerPedidosFecha('2025-10-23');
        console.log('Pedidos de 2025-10-23:', pedidosFecha);
    } catch (error) {
        console.error('Error al obtener los pedidos de 2025-10-23:', error);
    }

    try {
        const ultimoNro = await PedidoBD.obtenerUltimoNroPedido();
        console.log('Último número de pedido:', ultimoNro);
    } catch (error) {
        console.error('Error al obtener el último número de pedido:', error);
    }

    try {
        const resultado = await PedidoBD.modificarEstadoPedido(1, 'Pagado');
        console.log(resultado.message);
    } catch (error) {
        console.error('Error al modificar el estado del pedido:', error);
    }

    try {
        const pedido = await PedidoBD.obtenerPedidoPorNro(1);
        console.log('Pedido nro 1:', pedido);
    } catch (error) {
        console.error('Error al obtener el pedido nro 1:', error);
    }

    /*
    try {
        const resultado = await PedidoBD.crearLineaPedido({
            idPedido: 5,           
            idProducto: 1,         
            cantidad: 3,
            monto: 4500,           
            nombreProducto: 'Milanesa a caballo'
        });
        
        console.log('Resultado de crear línea de pedido:', resultado.message);
    } catch (error) {
        console.error('Error al crear la línea de pedido:', error);
    }
    
    */
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
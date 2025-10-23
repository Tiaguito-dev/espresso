const Gateway = require('../DB/Gateway');

// === SECCIÓN DE QUERYS ===
const selectPedidos = 'SELECT * FROM pedido';
const selectPedidoPorId = 'SELECT * FROM pedido WHERE nro_pedido = $1'; // En la base de datos lo tuve uqe llamar id pero la idea es que se llame codigo, PORQUE EN TODOS LADOS LE PUSIMOS ID LA PUTA MADRE
const insertPedido = 'INSERT INTO pedido (nro_pedido, fecha, id_mesa) VALUES ($1, $2, $3)';
const selectUltimoNroPedido = 'SELECT MAX(nro_pedido) FROM pedido';
const updateEstadoPedidoPorId = 'UPDATE pedido SET estado = $2 WHERE nro_pedido = $1';
const insertLineaPedido = 'INSERT INTO linea_pedido (nro_pedido, id_producto, cantidad) VALUES ($1, $2, $3)';
// TODO: FALTA HACER ESTO
const selectPedidoPorMozo = 'SELECT * FROM pedido WHERE nombre = $1';

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES ===

//TODO: OBTENER PEDIDOS DEL DÍA
exports.obtenerPedidos = async () => {
    try {
        const pedido = await Gateway.ejecutarQuery(selectPedidos);
        return pedido;
    } catch (error) {
        throw new Error('Error al obtener pedidos desde la base de datos: ' + error.message);
    }
};

exports.obtenerPedidoPorNro = async (nroPedido) => {
    try {
        const pedidos = await Gateway.ejecutarQuery({ text: selectPedidoPorId, values: [nroPedido] });
        return pedidos[0]; // Retornar el primer pedido encontrado
    } catch (error) {
        throw new Error(`Error al obtener pedido ${nroPedido} desde la base de datos: ${error.message}`);
    }
};

exports.crearPedido = async (datosDePedido) => {

    // TODO: En el controller tengo que hacer una función para obtener el último y para obtener el id de la categoria
    const { nroPedido, fecha, idMesa } = datosDePedido;

    try {
        await Gateway.ejecutarQuery({ text: insertPedido, values: [nroPedido, fecha, idMesa] });
        // TODO: Acá deberíamos manejar una respuesta como devolver el id de producto o un mensaje de éxito
    } catch (error) {
        throw new Error('Error al crear un pedido desde la base de datos: ' + error.message);
    }

}

//TODO: FALTA EL MODIFICAR PEDIDO, pero no sé en qué se puede modificar si es que se puede modificar además del estado

exports.modificarEstadoPedido = async (nroPedido, nuevoEstado) => {
    try {
        await Gateway.ejecutarQuery({ text: updateEstadoPedidoPorId, values: [nroPedido, nuevoEstado] });
        // TODO: Acá deberíamos manejar una respuesta como devolver el id de producto o un mensaje de éxito
    } catch (error) {
        throw new Error(`Error al modificar el estado del pedido ${nroPedido} desde la base de datos: ${error.message}`);
    }
};

exports.obtenerUltimoNroPedido = async () => {
    try {
        const resultado = await Gateway.ejecutarQuery(selectUltimoNroPedido);
        return resultado[0]; // Retornar el último número de pedido
    } catch (error) {
        throw new Error('Error al obtener el último número de pedido desde la base de datos: ' + error.message);
    }
};

// === SECCIÓN DE EJECUCIÓN DE LINEAS DE PEDIDO ===
// TODO: Hay que ver cómo manejamos esto porque tendría que primero crearse el pedido y luego las líneas por el tema del id
exports.crearLineaPedido = async (datosDeLineaPedido) => {
    // TODO: Hay que pasarle el monto también
    const { idPedido, idProducto, cantidad, monto } = datosDeLineaPedido;

    try {
        await Gateway.ejecutarQuery({ text: insertLineaPedido, values: [idPedido, idProducto, cantidad, monto] });
        // TODO: Acá deberíamos manejar una respuesta como devolver el id de producto o un mensaje de éxito
    } catch (error) {
        throw new Error('Error al crear una línea de pedido desde la base de datos: ' + error.message);
    }
};

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES DE VALIDACIÓN ===
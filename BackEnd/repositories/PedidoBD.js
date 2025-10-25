// 📄 BackEnd/repositories/PedidoBD.js

// === SECCIÓN DE QUERYS ===
const selectPedidosFecha = 'SELECT * FROM pedido WHERE date(fecha_registro)= date($1)';
const selectPedidoPorNro = 'SELECT * FROM pedido WHERE nro_pedido = $1'; // En la base de datos lo tuve uqe llamar id pero la idea es que se llame codigo, PORQUE EN TODOS LADOS LE PUSIMOS ID LA PUTA MADRE
const insertPedido = 'INSERT INTO pedido (nro_pedido, observacion, monto, id_mozo, id_mesa) VALUES ($1, $2, $3, $4, $5)';
const selectUltimoNroPedido = 'SELECT MAX(nro_pedido) FROM pedido';
const updateEstadoPedidoPorId = 'UPDATE pedido SET estado = $2 WHERE nro_pedido = $1';
const insertLineaPedido = 'INSERT INTO linea_pedido (id_pedido, id_producto, cantidad, monto, nombre_producto) VALUES ((SELECT id_pedido FROM pedido WHERE nro_pedido = $1),(SELECT id_producto FROM producto WHERE id = $2), $3, $4, $5);';
const selectLineasPorNroPedido = ("SELECT linea.id_linea_pedido, linea.cantidad, linea.monto, producto.nombre, linea.id_pedido, linea.id_producto FROM pedido JOIN linea_pedido AS linea ON pedido.id_pedido = linea.id_pedido JOIN producto ON linea.id_producto = producto.id_producto WHERE pedido.nro_pedido = $1;");

// TODO: FALTA HACER ESTO
const selectPedidoPorMozo = 'SELECT * FROM pedido WHERE nombre = $1';

// ------------------------------------------------------------------
// QUERIES - Define tus sentencias SQL (Ajusta los nombres de tabla y columna)
// ------------------------------------------------------------------

// ⚠️ Asegúrate de que esta SELECT traiga todos los campos necesarios
const SELECT_PEDIDOS_HOY = `
    SELECT * FROM pedido 
    WHERE DATE(fecha_registro) = CURRENT_DATE 
    ORDER BY nro_pedido DESC
`;

const SELECT_ULTIMO_NRO = `
    SELECT nro_pedido 
    FROM pedido 
    ORDER BY nro_pedido DESC 
    LIMIT 1
`;

const INSERT_PEDIDO = `
    INSERT INTO pedido (nro_pedido, fecha_registro, observacion, monto, estado, id_mozo, id_mesa)
    VALUES ($1, $2, $3, $4, 'Pendiente', $5, $6)
`;

const INSERT_LINEA_PEDIDO = `
    INSERT INTO lineas_pedido (id_pedido, id_producto, cantidad, monto, nombre_producto)
    VALUES ($1, $2, $3, $4, $5)
`;

const UPDATE_ESTADO_PEDIDO = `
    UPDATE pedido 
    SET estado = $2 
    WHERE nro_pedido = $1
`;

// ------------------------------------------------------------------
// EXPORTS - Funciones de Repositorio
// ------------------------------------------------------------------

exports.obtenerPedidosHoy = async () => {
    try {
        const result = await query(SELECT_PEDIDOS_HOY);
        return result.rows;
    } catch (error) {
        throw new Error('Error al obtener pedidos desde la base de datos: ' + error.message);
    }
};

// Obtener los pedidos de una fecha detereminada
exports.obtenerPedidosFecha = async (fecha) => {
    try {
        const pedidos = await Gateway.ejecutarQuery({ text: selectPedidosFecha, values: [fecha] });
        return pedidos;
    } catch (error) {
        throw new Error('Error al obtener pedidos desde la base de datos: ' + error.message);
    }
};

// Le paso un nro de pedido, y me devuelve un pedido
exports.obtenerPedidoPorNro = async (nroPedido) => {
    try {
        const pedidos = await Gateway.ejecutarQuery({ text: selectPedidoPorNro, values: [nroPedido] });
        return pedidos[0] || null; // Retornar el primer pedido encontrado
    } catch (error) {
        throw new Error(`Error al obtener pedido ${nroPedido} desde la base de datos: ${error.message}`);
    }
};

// Guardo un pedido en la bd, le paso el nro de pedido ya actualizado, la fecha Y HORA de hoy , y el idMesa
exports.crearPedido = async (datosDePedido) => {

    // TODO: En el controller tengo que hacer una función para obtener el último y para obtener el id de la categoria
    const { nroPedido, observacion, monto, idMozo, idMesa } = datosDePedido;

    try {
        await Gateway.ejecutarQuery({ text: insertPedido, values: [nroPedido, observacion, monto, idMozo, idMesa] });
        return {
            success: true,
            message: `El pedido ${nroPedido} se creó correctamente.`
        };
    } catch (error) {
        throw new Error('Error al crear un pedido desde la base de datos: ' + error.message);
    }

}

exports.modificarEstadoPedido = async (nroPedido, nuevoEstado) => {
    try {
        await Gateway.ejecutarQuery({ text: updateEstadoPedidoPorId, values: [nroPedido, nuevoEstado] });
        return {
            success: true,
            message: `El estado del pedido ${nroPedido} se actualizó correctamente a "${nuevoEstado}".`
        };
    } catch (error) {
        throw new Error(`Error al modificar el estado del pedido ${nroPedido} desde la base de datos: ${error.message}`);
    }
};

exports.obtenerUltimoNroPedido = async () => {
    try {
        const resultado = await Gateway.ejecutarQuery(selectUltimoNroPedido);
        return resultado[0]?.max || 0; // Retornar el último número de pedido
    } catch (error) {
        throw new Error('Error al obtener el último número de pedido: ' + error.message);
    }
};

// === SECCIÓN DE EJECUCIÓN DE LINEAS DE PEDIDO ===
// TODO: Hay que ver cómo manejamos esto porque tendría que primero crearse el pedido y luego las líneas por el tema del id
exports.crearLineaPedido = async (datosDeLineaPedido) => {
    // TODO: Hay que pasarle el monto porque lo registramos como variable
    const { idPedido, idProducto, cantidad, monto, nombreProducto } = datosDeLineaPedido;

    try {
        await Gateway.ejecutarQuery({
            text: insertLineaPedido,
            values: [idPedido, idProducto, cantidad, monto, nombreProducto]
        });

        return {
            success: true,
            message: `La línea del pedido ${idPedido} se creó correctamente.`
        };
    } catch (error) {
        throw new Error('Error al crear el pedido principal: ' + error.message);
    }
};

exports.obtenerLineasPorNroPedido = async (nroPedido) => {
    try {
        const lineas = await Gateway.ejecutarQuery({ text: selectLineasPorNroPedido, values: [nroPedido] });
        return lineas || [];
    } catch (error) {
        throw new Error(`Error al obtener líneas del pedido ${nroPedido} desde la base de datos: ${error.message}`);
    }
};

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES DE VALIDACIÓN ===

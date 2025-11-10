const Gateway = require('../DB/Gateway');

// === SECCIÓN DE QUERYS ===
//const selectPedidosFecha = 'SELECT * FROM pedido WHERE date(fecha_registro)= date($1)';
const selectPedidosFecha = `SELECT pedido.*, usuario.nombre AS nombre_mozo FROM pedido JOIN usuario ON pedido.id_mozo = usuario.id_usuario WHERE date(pedido.fecha_registro)= date($1)`;
//const selectPedidoPorNro = 'SELECT * FROM pedido WHERE nro_pedido = $1';
const selectPedidoPorNro = `SELECT pedido.*, usuario.nombre AS nombre_mozo FROM pedido JOIN usuario ON pedido.id_mozo = usuario.id_usuario WHERE pedido.nro_pedido = $1`;
const insertPedido = 'INSERT INTO pedido (nro_pedido, observacion, total, id_mozo, id_mesa) VALUES ($1, $2, $3, (SELECT id_usuario FROM usuario WHERE codigo = $4), (SELECT nro_mesa FROM mesa WHERE nro_mesa = $5))';
const selectUltimoNroPedido = 'SELECT MAX(nro_pedido) FROM pedido';
const updateEstadoPedidoPorNro = 'UPDATE pedido SET estado = $2 WHERE nro_pedido = $1';
const insertLineaPedido = `INSERT INTO linea_pedido (id_pedido, id_producto, cantidad, subtotal) VALUES ((SELECT id_pedido FROM pedido WHERE nro_pedido = $1), (SELECT id FROM producto WHERE id = $2), $3, $4);`;

const selectLineasPorNroPedido = ("SELECT linea.id_linea_pedido, linea.cantidad, linea.subtotal, producto.nombre, linea.id_pedido, producto.id, linea.id_producto FROM pedido JOIN linea_pedido AS linea ON pedido.id_pedido = linea.id_pedido JOIN producto ON linea.id_producto = producto.id WHERE pedido.nro_pedido = $1;");
const deleteLineaPorId = 'DELETE FROM linea_pedido WHERE id_linea_pedido = $1';
const updatePedidoTotal = 'UPDATE pedido SET total = $1 WHERE nro_pedido = $2';
const selectLineaPorId = 'SELECT * FROM linea_pedido WHERE id_linea_pedido = $1';
const updateObservacionPedidoPorNro = 'UPDATE pedido SET observacion = $2 WHERE nro_pedido = $1';

// TODO: FALTA HACER ESTO
const selectPedidoPorMozo = 'SELECT * FROM pedido WHERE nombre = $1';

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES ===

// Obtener los pedidos de la fecha de hoy
exports.obtenerPedidosHoy = async () => {
    try {
        const now = 'now()';
        const pedido = await Gateway.ejecutarQuery({ text: selectPedidosFecha, values: [now] });
        return pedido;
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

// Le paso un nro de pedido, y me devuelve un pedido INCLUYENDO el nombre de producto, las líneas de pedido, el nombre de mozo (nombre de usuario), el número de meza, y los pagos si los tuviera
// PARA MANU: cualquier cosa los pagos no los uses. Pero yo supongo que va a servir para más adelante y es una función que se puede reutilizar
// PARA MANU: a partir de ahora no te voy a pasar ninguna fk más, todo objetoso pa
exports.obtenerPedidoPorNro = async (pedido) => {
    try {
        const pedidos = await Gateway.ejecutarQuery({ text: selectPedidoPorNro, values: [pedido] });
        return pedidos[0] || null; // Retornar el primer pedido encontrado
    } catch (error) {
        throw new Error(`Error al obtener pedido ${pedido} desde la base de datos: ${error.message}`);
    }
};

// Guardo un pedido en la bd, le paso el nro de pedido ya actualizado, la fecha Y HORA de hoy , y el idMesa
exports.crearPedido = async (data) => {

    const { pedido, observacion, monto, mozo, mesa } = data;

    try {
        console.log('INSERT Pedido ->', { pedido, observacion, monto, mozo, mesa });
        await Gateway.ejecutarQuery({ text: insertPedido, values: [pedido, observacion, monto, mozo, mesa] });
        return {
            success: true,
            message: `El pedido ${pedido} se creó correctamente.`
        };
    } catch (error) {
        console.error('Error SQL crearPedido:', error);
        throw new Error('Error al crear un pedido desde la base de datos: ' + error.message);
    }

}


// Le paso un nroPedido y le paso un nuevo estado
// PARA MANU: conviene más que me pases un pedido entero y un estado y yo le hago un deconstructor? Creo que se podría terminar reutilizando una función
exports.modificarEstadoPedido = async (pedido, estado) => {
    try {
        await Gateway.ejecutarQuery({ text: updateEstadoPedidoPorNro, values: [pedido, estado] });
        return {
            success: true,
            message: `El estado del pedido ${pedido} se actualizó correctamente a "${estado}".`
        };
    } catch (error) {
        throw new Error(`Error al modificar el estado del pedido ${pedido} desde la base de datos: ${error.message}`);
    }
};

// Le paso todos los valores y actualiza el correspondiente
// PARA MANU: acá es donde me refiero a que se puede reutilizar la función modificarEstado. Si vos le pasas el objeto con el nuevo estado la vas a poder utilizar. Pero vas a tener que armar el objeto y por ahí es más laburo. Lo dejo a tu criterio
exports.modificarPedido = async (pedido, data) => {
    // PARA MANU: Ojo acá con el nroMesa y el nroMozo, tiene que ser el mismo nombre porque sino no lo toma el deconstructor
    const { observacion, monto, mozo, mesa } = data;
    try {
        await Gateway.ejecutarQuery({ text: updatePedidoPorNro, values: [pedido, observacion, monto, mozo, mesa] });
        return {
            success: true,
            message: `El pedido ${pedido} se modificó correctamente.`
        };
    } catch (error) {
        throw new Error(`Error al modificar el pedido ${pedido} desde la base de datos: ${error.message}`);
    }
};

// Retornar el último número de pedido
// PARA MANU: ver mensaje en CategoriaBD sobre lo mismo
exports.obtenerUltimoNroPedido = async () => {
    try {
        const resultado = await Gateway.ejecutarQuery(selectUltimoNroPedido);
        return resultado[0]?.max || 0;
    } catch (error) {
        throw new Error('Error al obtener el último número de pedido desde la base de datos: ' + error.message);
    }
};

// === SECCIÓN DE EJECUCIÓN DE LINEAS DE PEDIDO ===
// TODO: Hay que ver cómo manejamos esto porque tendría que primero crearse el pedido y luego las líneas por el tema del id
// PARA MANU: le saco el nombreProducto a la pija y lo saco de la BD. Total con que me pases el nroProducto ya puedo hacer un join y obtener el nombre
exports.crearLineaPedido = async (data) => {
    // const { idPedido, idProducto, cantidad, monto, nombreProducto } = datosDeLineaPedido;
    // PARA MANU: no le pases más el OID como parámetro, a partir de ahora el nroPedido y el id (de producto)
    // PARA MANU: es más, si queres ni siquiera le tenes que pasar el monto y puedo hacer que lo calcule solo
    const { pedido, codigo, cantidad, monto } = data; // FIXME: acá debería ir codProducto en vez de id así nos dejamos de hinchar

    try {
        await Gateway.ejecutarQuery({
            text: insertLineaPedido,
            values: [pedido, codigo, cantidad, monto]
        });

        return {
            success: true,
            message: `La línea del pedido ${pedido} se creó correctamente.`
        };
    } catch (error) {
        console.error('DEBUG crearLineaPedido:', error);
        throw new Error('Error al crear una línea de pedido desde la base de datos: ' + error.message);
    }
};

// obtengo todas las lineas de pedido de un pedido por su nroPedido incluyendo cantidad, nombre del producto y monto
// PARA MANU: ojo manu que ahora devuelve cantidad, nombre del producto y monto como si fuera puramente un objeto
// PARA MANU: le pongo un nro de linea? va a ser un quilombo porque se van a tener que repetir valores por cada pedido pero veo como hago
exports.obtenerLineasPorNroPedido = async (pedido) => {
    try {
        const lineas = await Gateway.ejecutarQuery({ text: selectLineasPorNroPedido, values: [pedido] });
        return lineas || [];
    } catch (error) {
        throw new Error(`Error al obtener líneas del pedido ${pedido} desde la base de datos: ${error.message}`);
    }
};

// TODO: No hice un modificar línea pedido, porque no sé si los chicos la hicieron
// TODO: No hice un select pedido por mozo

exports.eliminarLineaPorId = async (idLinea) => {
    try {
        await Gateway.ejecutarQuery({
            text: deleteLineaPorId,
            values: [idLinea]
        });
        return { success: true, message: 'Línea eliminada.' };
    } catch (error) {
        throw new Error(`Error al eliminar la línea ${idLinea}: ${error.message}`);
    }
};

exports.actualizarTotalPedido = async (nroPedido, nuevoTotal) => {
    try {
        await Gateway.ejecutarQuery({
            text: updatePedidoTotal,
            values: [nuevoTotal, nroPedido]
        });
        return { success: true, message: 'Total actualizado.' };
    } catch (error) {
        throw new Error(`Error al actualizar total del pedido ${nroPedido}: ${error.message}`);
    }
};

exports.obtenerLineaPorId = async (idLinea) => {
    try {
        const lineas = await Gateway.ejecutarQuery({
            text: selectLineaPorId,
            values: [idLinea]
        });
        return lineas[0] || null;
    } catch (error) {
        throw new Error(`Error al obtener la línea ${idLinea}: ${error.message}`);
    }
};

exports.modificarObservacionPedido = async (pedido, observacion) => {
    try {
        await Gateway.ejecutarQuery({ text: updateObservacionPedidoPorNro, values: [pedido, observacion] });
        return {
            success: true,
            message: `La observación del pedido ${pedido} se actualizó correctamente.`
        };
    } catch (error) {
        throw new Error(`Error al modificar la observación del pedido ${pedido} desde la base de datos: ${error.message}`);
    }
};
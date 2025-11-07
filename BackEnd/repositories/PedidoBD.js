const Gateway = require('../DB/Gateway');

// === SECCIÓN DE QUERYS ===
const selectPedidosFecha = 'SELECT * FROM pedido WHERE date(fecha_registro)= date($1)';
const selectPedidoPorNro = 'SELECT * FROM pedido WHERE nro_pedido = $1';
const insertPedido = 'INSERT INTO pedido (nro_pedido, observacion, total, id_mozo, id_mesa) VALUES ($1, $2, $3, (SELECT id_usuario FROM usuario WHERE cod_usuario = $4), (SELECT id_mesa FROM mesa WHERE nro_mesa = $5))';
const selectUltimoNroPedido = 'SELECT MAX(nro_pedido) FROM pedido';
const updateEstadoPedidoPorId = 'UPDATE pedido SET estado = $2 WHERE nro_pedido = $1';
const insertLineaPedido = 'INSERT INTO linea_pedido (id_pedido, id_producto, cantidad, monto, nombre_producto) VALUES ((SELECT id_pedido FROM pedido WHERE nro_pedido = $1),(SELECT id_producto FROM producto WHERE id = $2), $3, $4, $5);';
const selectLineasPorNroPedido = ("SELECT linea.id_linea_pedido, linea.cantidad, linea.subtotal, producto.nombre, linea.id_pedido, producto.id,linea.id_producto FROM pedido JOIN linea_pedido AS linea ON pedido.id_pedido = linea.id_pedido JOIN producto ON linea.id_producto = producto.id_producto WHERE pedido.nro_pedido = $1;");

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
        throw new Error(`Error al obtener pedido ${nroPedido} desde la base de datos: ${error.message}`);
    }
};

// Guardo un pedido en la bd, le paso el nro de pedido ya actualizado, la fecha Y HORA de hoy , y el idMesa
exports.crearPedido = async (data) => {

    // FIXME: acá le cambién idMozo por nroMozo, pero en la bd está como cod_usuario
    // PARA MANU: si queres que deje idMozo porque se rompe no hay problema, eso ya depende cómo queres pasarlo vos. Pero me tenes que avisar por el deconstructor
    const { pedido, observacion, monto, mozo, mesa } = data;

    try {
        await Gateway.ejecutarQuery({ text: insertPedido, values: [pedido, observacion, monto, mozo, mesa] });
        return {
            success: true,
            message: `El pedido ${pedido} se creó correctamente.`
        };
    } catch (error) {
        throw new Error('Error al crear un pedido desde la base de datos: ' + error.message);
    }

}


// Le paso un nroPedido y le paso un nuevo estado
// PARA MANU: conviene más que me pases un pedido entero y un estado y yo le hago un deconstructor? Creo que se podría terminar reutilizando una función
exports.modificarEstadoPedido = async (pedido, estado) => {
    try {
        // 🎯 CORRECCIÓN CLAVE: Cambiar 'updateEstadoPedidoPorNro' por 'updateEstadoPedidoPorId'
        // Esto asume que 'updateEstadoPedidoPorId' es la variable de query SQL declarada.
        await Gateway.ejecutarQuery({ text: updateEstadoPedidoPorId, values: [pedido, estado] }); 

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
    const { pedido, codigo, cantidad, monto, nombre } = data; // FIXME: acá debería ir codProducto en vez de id así nos dejamos de hinchar

    try {
        await Gateway.ejecutarQuery({
            text: insertLineaPedido,
            values: [pedido, codigo, cantidad, monto, nombre]
        });

        return {
            success: true,
            message: `La línea del pedido ${pedido} se creó correctamente.`
        };
    } catch (error) {
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
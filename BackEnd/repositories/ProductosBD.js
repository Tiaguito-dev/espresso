const Gateway = require('../DB/Gateway');

// === SECCIÓN DE QUERYS ===
const selectProductos = 'SELECT * FROM producto';
const selectProductoPorId = 'SELECT * FROM producto WHERE id = $1'; // En la base de datos lo tuve uqe llamar id pero la idea es que se llame codigo, PORQUE EN TODOS LADOS LE PUSIMOS ID LA PUTA MADRE
const insertProducto = 'INSERT INTO producto (id, precio, nombre, descripcion, id_categoria) VALUES ($1, $2, $3, $4, $5)';
const selectUltimoCodigo = 'SELECT MAX(id) FROM producto';
const deleteProductoPorId = 'DELETE FROM producto WHERE id = $1';
const selectProductoPorNombre = 'SELECT * FROM producto WHERE nombre = $1';

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES ===
exports.obtenerProductos = async () => {
    try {
        const productos = await Gateway.ejecutarQuery(selectProductos);
        return productos;
    } catch (error) {
        throw new Error('Error al obtener productos desde la base de datos: ' + error.message);
    }
};

exports.obtenerPorId = async (cod_producto) => {
    try {
        const productos = await Gateway.ejecutarQuery({ text: selectProductoPorId, values: [cod_producto] });
        //HAY QUE DEFINIR SI LO VA A BUSCAR POR NOMBRE O POR CODIGO, Porque de eso depende también que sea unique o no
        return productos[0]; // Retornar el primer producto encontrado
    } catch (error) {
        throw new Error(`Error al obtener producto ${id} desde la base de datos: ${error.message}`);
    }
};

exports.crearProducto = async (datosDeProducto) => {

    // TODO: En el controller tengo que hacer una función para obtener el último y para obtener el id de la categoria
    const { id, precio, nombre, descripcion, id_categoria } = datosDeProducto;

    try {
        await Gateway.ejecutarQuery({ text: insertProducto, values: [id, precio, nombre, descripcion, id_categoria] });
        // TODO: Acá deberíamos manejar una respuesta como devolver el id de producto o un mensaje de éxito
    } catch (error) {
        throw new Error('Error al crear un producto desde la base de datos: ' + error.message);
    }

}

exports.eliminarProducto = async (id) => {
    try {
        await Gateway.ejecutarQuery({ text: deleteProductoPorId, values: [id] });
        // TODO: Acá deberíamos manejar una respuesta como devolver el id de producto o un mensaje de éxito
    } catch (error) {
        throw new Error(`Error al eliminar el producto ${id} desde la base de datos: ${error.message}`);
    }
};

exports.obtenerUltimoCodigo = async () => {
    try {
        const resultado = await Gateway.ejecutarQuery(selectUltimoCodigo);
        return resultado[0]; // Retornar el último código
    } catch (error) {
        throw new Error('Error al obtener el último código desde la base de datos: ' + error.message);
    }
};

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES DE VALIDACIÓN ===
exports.existeNombreProducto = async (nombre) => {
    try {
        const productos = await Gateway.ejecutarQuery({ text: selectProductoPorNombre, values: [nombre] });
        if (!productos || productos.length === 0) {
            return true; // No se encontró ningún producto con ese nombre
        }
        return false; // Se encontró un producto con ese nombre
    } catch (error) {
        throw new Error(`Error al obtener producto ${nombre} desde la base de datos: ${error.message}`);
    }
};
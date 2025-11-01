const Gateway = require('../DB/Gateway');

// === SECCIÓN DE QUERYS ===
const selectProductos = 'SELECT * FROM producto';
// TODO: ESTÁ BUSCANDO POR id_producto PERO DEBERÍA SER POR ID, hay que cambiar cómo se construye la línea de pedidos ya que no puede almacenar OID
const selectProductoPorId = 'SELECT * FROM producto WHERE codigo = $1'; // En la base de datos lo tuve uqe llamar id pero la idea es que se llame codigo, PORQUE EN TODOS LADOS LE PUSIMOS ID LA PUTA MADRE
const insertProducto = 'INSERT INTO producto (id, precio, nombre, descripcion, id_categoria) VALUES ($1, $2, $3, $4, $5)';
const selectUltimoCodigo = 'SELECT MAX(id) FROM producto';
const deleteProductoPorId = 'DELETE FROM producto WHERE id = $1';
const selectProductoPorNombre = 'SELECT * FROM producto WHERE nombre = $1';
const updateProductoPorId = 'UPDATE producto SET precio = $2, nombre = $3, descripcion = $4, id_categoria = $5 WHERE id = $1';

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES ===
exports.obtenerProductos = async () => {
    try {
        const productos = await Gateway.ejecutarQuery(selectProductos);
        return productos || [];
    } catch (error) {
        throw new Error('Error al obtener productos desde la base de datos: ' + error.message);
    }
};

// Esto en realidad sería por codigo, pero en la bd lo puse id
exports.obtenerProductoPorId = async (cod_producto) => {
    try {
        const productos = await Gateway.ejecutarQuery({ text: selectProductoPorId, values: [cod_producto] });
        //HAY QUE DEFINIR SI LO VA A BUSCAR POR NOMBRE O POR CODIGO, Porque de eso depende también que sea unique o no
        return productos[0] || null; // Retornar el primer producto encontrado
    } catch (error) {
        throw new Error(`Error al obtener producto ${cod_producto} desde la base de datos: ${error.message}`);
    }
};

exports.crearProducto = async (datosDeProducto) => {

    // TODO: En el controller tengo que hacer una función para obtener el último y para obtener el id de la categoria
    const { id, precio, nombre, descripcion, id_categoria } = datosDeProducto;

    try {
        await Gateway.ejecutarQuery({ text: insertProducto, values: [id, precio, nombre, descripcion, id_categoria] });
        return {
            success: true,
            message: `El producto ${id} se creó correctamente.`
        };
    } catch (error) {
        throw new Error('Error al crear un producto desde la base de datos: ' + error.message);
    }

}

exports.eliminarProducto = async (id) => {
    try {
        await Gateway.ejecutarQuery({ text: deleteProductoPorId, values: [id] });
        return {
            success: true,
            message: `El producto ${id} se eliminó correctamente.`
        };
    } catch (error) {
        throw new Error(`Error al eliminar el producto ${id} desde la base de datos: ${error.message}`);
    }
};

exports.obtenerUltimoCodigo = async () => {
    try {
        const resultado = await Gateway.ejecutarQuery(selectUltimoCodigo);
        return resultado[0]?.max || 0; // Retornar el último código
    } catch (error) {
        throw new Error('Error al obtener el último código desde la base de datos: ' + error.message);
    }
};

exports.modificarProducto = async (id, datosActualizados) => {
    const { precio, nombre, descripcion, id_categoria } = datosActualizados;

    try {
        await Gateway.ejecutarQuery({ text: updateProductoPorId, values: [id, precio, nombre, descripcion, id_categoria] });
        return {
            success: true,
            message: `El producto ${id} se modificó correctamente.`
        };
    } catch (error) {
        throw new Error(`Error al modificar el producto ${id} desde la base de datos: ${error.message}`);
    }
};

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES DE VALIDACIÓN ===
// TODO: Hay que implementar esto en la Producto porque el nombre de un producto lo puse como unique
exports.existeNombreProducto = async (nombre) => {
    try {
        const productos = await Gateway.ejecutarQuery({ text: selectProductoPorNombre, values: [nombre] });
        if (!productos || productos.length === 0) {
            return false; // No se encontró ningún producto con ese nombre
        }
        return true; // Se encontró un producto con ese nombre
    } catch (error) {
        throw new Error(`Error al obtener producto ${nombre} desde la base de datos: ${error.message}`);
    }
};
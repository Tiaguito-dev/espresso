// BackEnd/repositories/ProductoBD.js

const Gateway = require('../DB/Gateway');

// === SECCIÓN DE QUERYS ===
const selectProductos = 'SELECT * FROM producto';
// Nota: Uso 'id_producto' en la query para ser consistente con la base de datos
const selectProductoPorId = 'SELECT * FROM producto WHERE id_producto = $1'; 
const insertProducto = 'INSERT INTO producto (id, precio, nombre, descripcion, id_categoria) VALUES ($1, $2, $3, $4, $5)';
const selectUltimoCodigo = 'SELECT MAX(id) FROM producto';
const deleteProductoPorId = 'DELETE FROM producto WHERE id = $1';
const selectProductoPorNombre = 'SELECT * FROM producto WHERE nombre = $1';
const updateProductoPorId = 'UPDATE producto SET precio = $2, nombre = $3, descripcion = $4, id_categoria = $5 WHERE id = $1';

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES ===
exports.obtenerProductos = async () => {
    try {
        const result = await Gateway.ejecutarQuery(selectProductos);
        // ✅ CORRECCIÓN: Devolver el array de filas. Esto resuelve 'forEach is not a function' si se llama aquí.
        return result.rows || []; 
    } catch (error) {
        throw new Error('Error al obtener productos desde la base de datos: ' + error.message);
    }
};


// Esto en realidad sería por codigo, pero en la bd lo puse id
exports.obtenerProductoPorId = async (cod_producto) => {
    try {
        // Asumimos que Gateway.ejecutarQuery devuelve el objeto resultado completo de pg
        const result = await Gateway.ejecutarQuery({ text: selectProductoPorId, values: [cod_producto] });
        
        // 🛑 CORRECCIÓN CLAVE: Accede a 'rows' de forma segura y al primer elemento.
        // Si 'result' es undefined/null, result.rows fallaría. 
        // Si 'result.rows' es undefined/null, devolvemos null.
        const productos = result && result.rows ? result.rows : [];
        
        return productos[0] || null; // Retorna el primer producto encontrado o null
        
    } catch (error) {
        // Incluir el ID del producto en el error es útil para la depuración
        throw new Error(`Error al obtener producto ${cod_producto} desde la base de datos: ${error.message}`);
    }
};
exports.crearProducto = async (datosDeProducto) => {
    // La creación no devuelve filas, no necesita corrección .rows
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
    // La eliminación no devuelve filas, no necesita corrección .rows
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
        const result = await Gateway.ejecutarQuery(selectUltimoCodigo);
        // ✅ CORRECCIÓN: Devolver el valor 'max' de la primera fila o 0.
        return result.rows[0]?.max || 0; 
    } catch (error) {
        throw new Error('Error al obtener el último código desde la base de datos: ' + error.message);
    }
};

exports.modificarProducto = async (id, datosActualizados) => {
    // La modificación no devuelve filas, no necesita corrección .rows
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
exports.existeNombreProducto = async (nombre) => {
    try {

        const result = await Gateway.ejecutarQuery({ text: selectProductoPorNombre, values: [nombre] });
        // ✅ CORRECCIÓN: Devolver el array de filas, y chequear su longitud.
        const productos = result.rows || [];
        
        // Retorna true si NO hay productos (el nombre está disponible)
        return productos.length === 0; 
        
    } catch (error) {
        throw new Error(`Error al obtener producto ${nombre} desde la base de datos: ${error.message}`);
    }
};
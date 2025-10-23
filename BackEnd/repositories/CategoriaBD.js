const Gateway = require('../DB/Gateway');

// === SECCIÓN DE QUERYS ===
const insertCategoria = 'INSERT INTO categoria (nombre) VALUES ($1)';
const selectCategorias = 'SELECT * FROM categoria';
const selectCategoriaPorNombre = 'SELECT * FROM categoria WHERE nombre = $1';

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES ===
exports.obtenerIdCategoriaPorNombre = async (nombreCategoria) => {
    try {
        const resultado = await Gateway.ejecutarQuery({ text: selectCategoriaPorNombre, values: [nombreCategoria] });
        return resultado[0].id; // Retornar el id de la categoría
    } catch (error) {
        throw new Error(`Error al obtener el id de la categoría ${nombreCategoria} desde la base de datos: ${error.message}`);
    }
};

exports.crearCategoria = async (nombreCategoria) => {
    try {
        await Gateway.ejecutarQuery({ text: insertCategoria, values: [nombreCategoria] });
        // TODO: Acá deberíamos manejar una respuesta como devolver el id de categoría o un mensaje de éxito
    } catch (error) {
        throw new Error(`Error al crear la categoría ${nombreCategoria} desde la base de datos: ${error.message}`);
    }
};

exports.obtenerCategorias = async () => {
    try {
        const categorias = await Gateway.ejecutarQuery(selectCategorias);
        return categorias;
    } catch (error) {
        throw new Error('Error al obtener categorías desde la base de datos: ' + error.message);
    }
};

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES DE VALIDACIÓN ===
// TODO: Hay que implementar esto porque el nombre de un producto lo puse como unique
exports.existeNombreCategoria = async (nombre) => {
    try {
        const categorias = await Gateway.ejecutarQuery({ text: selectCategoriaPorNombre, values: [nombre] });
        if (!categorias || categorias.length === 0) {
            return true; // No se encontró ninguna categoría con ese nombre
        }
        return false; // Se encontró una categoría con ese nombre
    } catch (error) {
        throw new Error(`Error al obtener categoría ${nombre} desde la base de datos: ${error.message}`);
    }
};
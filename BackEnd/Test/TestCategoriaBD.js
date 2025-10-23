const CategoriaBD = require('../repositories/CategoriaBD');

exports.runTests = async () => {

    try {
        const categorias = await CategoriaBD.obtenerCategorias();
        console.log('Listado de categorías:', categorias);
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
    }

    try {
        const idCategoria = await CategoriaBD.obtenerIdCategoriaPorNombre('Bebidas');
        console.log('ID de la categoría "Bebidas":', idCategoria);
    } catch (error) {
        console.error('Error al obtener el ID de la categoría "Bebidas":', error);
    }

    try {
        const existe = await CategoriaBD.existeNombreCategoria('Desayuno');
        console.log('¿Existe la categoría "Desayuno"?', !existe);
    } catch (error) {
        console.error('Error al verificar existencia de la categoría "Desayuno":', error);
    }

    /*
    try {
        const resultado = await CategoriaBD.crearCategoria('Desayuno');
        console.log(resultado.message);
    } catch (error) {
        console.error('Error al crear la categoría:', error);
    }
    */

};
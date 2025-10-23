const ProductoBD = require('../repositories/ProductoBD');

exports.runTests = async () => {
    try {
        const productos = await ProductoBD.obtenerProductos();
        console.log('Productos:', productos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }

    try {
        const producto = await ProductoBD.obtenerProductoPorId(1);
        console.log('Producto con ID 1:', producto);
    } catch (error) {
        console.error('Error al obtener el producto con ID 1:', error);
    }

    try {
        const ultimoCodigo = await ProductoBD.obtenerUltimoCodigo();
        console.log('Último código de producto:', ultimoCodigo);
    } catch (error) {
        console.error('Error al obtener el último código de producto:', error);
    }

    try {
        const existe = await ProductoBD.existeNombreProducto('Coca-Cola');
        console.log('¿Existe el producto "Coca-Cola"?', !existe ? 'Sí' : 'No');
    } catch (error) {
        console.error('Error al verificar si existe el producto:', error);
    }

    try {
        const nuevoProducto = {
            id: 10,
            precio: 1200,
            nombre: 'Cerveza Andes IPA',
            descripcion: 'Botella 1L',
            id_categoria: 1
        };
        const resultado = await ProductoBD.crearProducto(nuevoProducto);
        console.log(resultado.message);
    } catch (error) {
        console.error('Error al crear el producto:', error);
    }

    try {
        const actualizacion = {
            precio: 1300,
            nombre: 'Cerveza Andes IPA',
            descripcion: 'Botella 1L (Actualizada)',
            id_categoria: 1
        };
        const resultado = await ProductoBD.modificarProducto(10, actualizacion);
        console.log(resultado.message);
    } catch (error) {
        console.error('Error al modificar el producto:', error);
    }

    try {
        const resultado = await ProductoBD.eliminarProducto(10);
        console.log(resultado.message);
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
};
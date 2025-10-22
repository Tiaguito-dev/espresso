const Menu = require('../models/Menu');
const Producto = require('../models/Producto');
const ProductoBD = require('../repositories/ProductoBD');
const CategoriaBD = require('../repositories/CategoriaBD');
const { json } = require('express');

const menu = new Menu();

function guardarCategoria(categoria) {
    try {
        CategoriaBD.crearCategoria(categoria);
    } catch (error) {
        console.error('Error guardando la categoría:', error);
    }
}

async function inicializarMenu() {
    try {
        const productos = await ProductoBD.obtenerProductos();
        menu.cargarProductos(productos);
        console.log(`${productos.length} productos cargados en el menú`);
    } catch (error) {
        console.error('Error cargando los productos en el Menú:', error);
    }
}

// INICIALIZACIÓN DEL MENÚ UNA SOLA VEZ
inicializarMenu();

exports.obtenerProductos = async (req, res) => {
    try {
        res.json(menu.getProductos());
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

exports.obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await ProductoBD.obtenerProductoPorId(4); // Acá lo unico que hice fue probarlo

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    // ESTO NO VA A FUNCIONAR PORQUE LO DEVUELVE EN RESPUESTA ANTES DE QUE LLEGUE LA CONSULTA
    /*
    res.json(producto);
    console.log('Devolviendo el producto con ID:', id);
    console.log(producto);
    */
};

exports.crearProducto = (req, res) => {

    console.log(req.body);

    const { nombre, descripcion, precio, categoria } = req.body;

    const ultimoId = ProductoBD.obtenerUltimoCodigo();

    if (ProductoBD.existeNombreProducto(nombre)) {
        res.status(400).json({ message: 'El nombre del producto ya existe' });
    };

    // TENEMOS QUE GUARDAR LA CATEGORÍA EN LA BD
    const categoriaObj = menu.obtenerOCrearCategoria(categoria);

    guardarCategoria(categoriaObj);

    const idCategoria = categoriaObj.id;

    const datosDeProducto = {
        id: ultimoId + 1,
        precio: precio,
        nombre: nombre,
        descripcion: descripcion,
        id_categoria: idCategoria,
    };

    const nuevoProducto = new Producto(datosDeProducto);

    const productoAgregado = menu.agregarProducto(nuevoProducto);

    res.status(201).json(productoAgregado); // Responde con status 201 (Created)
};

exports.modificarProducto = (req, res) => {
    const { id } = req.params;
    const datosModificados = req.body;

    const productoParaModificar = menu.buscarProductoPorId(id);

    if (!productoParaModificar) {
        return res.status(404), json({ message: 'Producto para modificar no encontrado' });
    }

    productoParaModificar.nombre = datosModificados.nombre ?? productoParaModificar.nombre;
    productoParaModificar.descripcion = datosModificados.descripcion ?? productoParaModificar.descripcion;
    productoParaModificar.precio = datosModificados.precio ?? productoParaModificar.precio;
    productoParaModificar.disponible = datosModificados.disponible ?? productoParaModificar.disponible;

    res.status(200).json(productoParaModificar);
};

exports.eliminarProducto = (req, res) => {
    const { id } = req.params;
    const exito = menu.eliminarProductoPorId(id);

    if (exito) {
        res.status(200).json({ message: `El producto ${id} fue eliminado exitosamente` });
    } else {
        res.status(404).json({ message: `No fue posible elminar el producto ${id}` });
    }
};

module.exports.menu = menu;
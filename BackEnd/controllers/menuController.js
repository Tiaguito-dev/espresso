const Menu = require('../models/Menu');
const Producto = require('../models/Producto');
const ProductosBD = require('../repositories/ProductosBD');
const { json } = require('express');

const menu = new Menu();

async function inicializarMenu() {
    try {
        const productos = await ProductosBD.obtenerProductos();
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
        const producto = await ProductosBD.obtenerPorId(4); // Acá lo unico que hice fue probarlo

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.crearProducto = (req, res) => {

    console.log(req.body);

    const { nombre, descripcion, precio, disponible } = req.body;

    const datosDeProducto = {
        id: Date.now.toString(), // Id temporal (lo mismo q antes)
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        disponible: disponible
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
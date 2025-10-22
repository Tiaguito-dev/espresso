const Menu = require('../models/Menu');
const Producto = require('../models/Producto');
const productosIniciales = require('../DB/productos.json');
const { json } = require('express');

const menu = new Menu();
menu.cargarProductos(productosIniciales);

exports.obtenerProductos = (req, res) => {
    res.json(menu.getProductos());
};

exports.obtenerProductoPorId = (req, res) => {
    // Tiene que devolver un solo producto con ese ID en particular
    const { id } = req.params;
    const producto = menu.buscarProductoPorId(id);
    if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
    console.log('Devolviendo el producto con ID:', id);
    console.log(producto);
};

exports.crearProducto = (req, res) => {
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

    if (!productoParaModificar){
        return res.status(404),json({ message: 'Producto para modificar no encontrado'});
    }

    productoParaModificar.nombre = datosModificados.nombre ?? productoParaModificar.nombre;
    productoParaModificar.descripcion = datosModificados. descripcion ?? productoParaModificar.descripcion;
    productoParaModificar.precio = datosModificados.precio ?? productoParaModificar.precio;
    productoParaModificar.disponible = datosModificados.disponible ?? productoParaModificar.disponible;

    res.status(200).json(productoParaModificar);
};

exports.eliminarProducto = (req, res) => {
    const { id } = req.params;  
    const exito = menu.eliminarProductoPorId(id);

    if (exito){
        res.status(200).json({ message: `El producto ${id} fue eliminado exitosamente` });
    } else {
        res.status(404).json({message:`No fue posible elminar el producto ${id}`});
    }
};

module.exports.menu = menu;
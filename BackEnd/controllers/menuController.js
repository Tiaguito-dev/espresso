const Menu = require('../models/Menu');
//const Producto = require('../models/Producto');
//const productosIniciales = require('../DB/productos.json');
const { json } = require('express');

const menu = new Menu();

exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await menu.getProductos();
        res.json(productos);
    }catch(error){
        res.status(500).json({ message: 'Error a obtener productos', error: error.message});
    }
};

exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await menu.getCategorias();
        res.json(categorias);
    }catch(error){
        res.status(500).json({ message: 'Error al obtener categorias', error: error.message});
    }
};

exports.obtenerProductoPorId = async(req, res) => {
    try {
        const { id } = req.params;
        const producto = await menu.buscarProductoPorId(id);
        if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
        res.json(producto);
    }catch(error){
        res.status(500).json({message: 'Error al buscar producto', error: error.message});
    }
};

exports.crearProducto = async (req, res) => {
    try{
        const productoAgregado = await menu.agregarProducto(req.body);
        res.status(201).json(productoAgregado);
    }catch(error){
        console.error('Error en crearProducto:', error);
        if (error.message.startsWith('Datos de producto inválidos')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al crear el producto', error: error.message });
    }
};

exports.modificarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const datosModificados = req.body;
        console.log(`--- 1. CONTROLLER: ID recibido de la URL (req.params.id): '${id}' ---`);
        console.log('--- 1. CONTROLLER (req.body) ---', datosModificados);
        const productoExiste = await menu.buscarProductoPorId(id);
        console.log(`--- 1.5. CONTROLLER: Resultado de buscarProductoPorId:`, productoExiste);
        if (!productoExiste){
            return res.status(404).json({ message: 'Producto para modificar no encontrado' });
        }
        console.log('--- 1.8. CONTROLLER: Llamando a menu.modificarProducto... ---');
        const productoModificado = await menu.modificarProducto(id, datosModificados);

        res.status(200).json(productoModificado);

    }catch(error){
        res.status(500).json({ message: 'Error al modificar prodcuto', error: error.message});
    }
};

exports.eliminarProducto = async (req, res) => {
    try{
        const { id } = req.params;
        const exito = await menu.eliminarProductoPorId(id);

        if (exito) {
            res.status(200).json({ message: `El producto ${id} fue eliminado exitosamente` });
        } else {
            res.status(404).json({ message: `No fue posible elminar el producto ${id}` });
        }
    }catch(error){
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
};

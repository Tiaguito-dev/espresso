// routes/productosRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Ruta para obtener todos los productos  GET/
router.get('/', menuController.obtenerProductos);

// Ruta para obtener todas las categorias  GET/categorias  GET/categoria
router.get('/categorias', menuController.obtenerCategorias);
router.get('/categoria', menuController.obtenerCategorias);

// Ruta para crear un nuevo producto  POST/
router.post('/', menuController.crearProducto);


// Ruta para obtener un producto por ID  GET/123
router.get('/:id', menuController.obtenerProductoPorId);

// Ruta para actualizar un producto  PUT/123
router.put('/:id', menuController.modificarProducto);

// ruta para eliminar un producto  DELETE/123
router.delete('/:id', menuController.eliminarProducto);

// ruta para modificar el estado de un producto
router.patch('/:id/estado', menuController.modificarEstadoProducto);

module.exports = router;

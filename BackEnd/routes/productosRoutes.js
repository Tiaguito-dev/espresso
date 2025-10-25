// routes/productosRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Ruta para obtener todos los productos
router.get('/', menuController.obtenerProductos);

// Ruta para obtener un producto por ID
router.get('/:id', menuController.obtenerProductoPorId);

router.get('/', menuController.obtenerCategorias);

// Ruta para crear un nuevo producto
router.post('/', menuController.crearProducto);

router.get('/', menuController.obtenerCategorias);

// Ruta para actualizar un producto
router.put('/:id', menuController.modificarProducto);

// ruta para eliminar un producto
router.delete('/:id', menuController.eliminarProducto);


module.exports = router;
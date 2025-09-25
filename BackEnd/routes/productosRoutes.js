// routes/productosRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Ruta para obtener todos los productos
router.get('/', menuController.obtenerProductos);

// Ruta para crear un nuevo producto
router.post('/', menuController.crearProducto);

// Ruta para actualizar un producto
router.put('/:id', menuController.actualizarProducto);

module.exports = router;
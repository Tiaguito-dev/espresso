// routes/pedidosRoutes.js
const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/menuController');

// Ruta para obtener todos los pedidos
router.get('/', menuController.obtenerProductos);

// Ruta para crear un nuevo pedido
router.post('/', menuController.crearProducto);

// Ruta para actualizar un pedido
router.put('/:id', menuController.actualizarProducto);

module.exports = router;
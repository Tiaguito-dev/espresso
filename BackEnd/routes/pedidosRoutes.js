// routes/pedidosRoutes.js
const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// Ruta para obtener todos los pedidos
router.get('/', pedidosController.obtenerPedidos);

// Ruta para crear un nuevo pedido
router.post('/', pedidosController.crearPedido);

// Ruta para actualizar un pedido
router.put('/:id', pedidosController.actualizarPedido);

// 🎯 RUTA NECESARIA para OBTENER UN pedido por su ID (e.g., /api/pedidos/1)
router.get('/:id', pedidosController.obtenerPedidoPorId);

module.exports = router;
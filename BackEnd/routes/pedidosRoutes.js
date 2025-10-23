// routes/pedidosRoutes.js
const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// 1. OBTENER TODOS
router.get('/', pedidosController.obtenerPedidos);

// 2. OBTENER POR ID (¡Necesario para la edición!)
router.get('/:id', pedidosController.obtenerPedidoPorId); 

// 3. ACTUALIZAR (Maneja tanto estado como edición completa)
router.put('/:id', pedidosController.actualizarPedido);

// 4. CREAR NUEVO
router.post('/', pedidosController.crearPedido);
module.exports = router;
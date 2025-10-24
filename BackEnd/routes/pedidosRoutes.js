// BackEnd/routes/pedidosRoutes.js

const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// Rutas Generales
router.get('/', pedidosController.obtenerPedidos);
router.post('/', pedidosController.crearPedido);

// Rutas por ID (GET y PUT)
router.get('/:id', pedidosController.obtenerPedidoPorId); // Para Modificar (traer datos)
router.put('/:id', pedidosController.actualizarPedido);    // Para Cambiar Estado
router.delete('/:id', pedidosController.eliminarPedido);  // Para Dar de Baja

module.exports = router;
// routes/pagosRoutes.js

const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');

// Ruta para obtener todos los pagos
router.get('/', pagosController.obtenerPagos);

// Ruta para crear un nuevo pago
router.post('/', pagosController.crearPago);

// Ruta para ver todos los pagos de un pedido específico
router.get('/pedido/:nroPedido', pagosController.obtenerPagosDePedido);

module.exports = router;
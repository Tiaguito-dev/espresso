// routes/pagosRoutes.js

const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');
const { verificarToken, verificarPerfil } = require('../middlewares/auth');

// Ruta para obtener todos los pagos
router.get('/', 
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    pagosController.obtenerPagos);

// Ruta para crear un nuevo pago
router.post('/', 
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    pagosController.crearPago);

// Ruta para ver todos los pagos de un pedido específico
router.get('/pedido/:nroPedido', 
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    pagosController.obtenerPagosDePedido);

module.exports = router;
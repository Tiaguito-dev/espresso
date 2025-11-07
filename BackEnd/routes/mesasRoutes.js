// routes/pedidosRoutes.js
const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesasController');

// Ruta para obtener todos los pedidos
router.get('/', mesaController.obtenerMesas);

// Ruta para crear un nuevo pedido
router.post('/', mesaController.crearMesa);

// Ruta para actualizar un pedido
router.put('/:nroMesa', mesaController.cambiarEstadoMesa);

router.delete('/:nroMesa', mesaController.eliminarMesa);

module.exports = router;
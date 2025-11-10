// routes/ mesasRoutes.js
const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesasController');
const { verificarToken, verificarPerfil } = require('../middlewares/auth');

// Ruta para obtener todos los mesas
router.get('/', 
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    mesaController.obtenerMesas);

// Ruta para crear un nueva mesa
router.post('/', 
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    mesaController.crearMesa);

// Ruta para actualizar un pedido
router.put('/:nroMesa', 
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    mesaController.cambiarEstadoMesa);

router.delete('/:nroMesa', 
    verificarToken,
    verificarPerfil(['admin']),
    mesaController.eliminarMesa);

module.exports = router;
const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesasController');

// --- Rutas de MESAS ---

// Ruta para obtener TODAS las mesas
router.get('/', mesaController.obtenerMesas);

// 🚨 CORRECCIÓN: Usar el nombre de función que SÍ existe y está exportado en el controlador
router.get('/:nroMesa', mesaController.obtenerMesaPorNumero); 

// Ruta para crear una nueva mesa
router.post('/', mesaController.crearMesa);

// Ruta para actualizar una mesa (usada para cambiar el estado)
router.put('/:nroMesa', mesaController.cambiarEstadoMesa);

// Ruta para eliminar una mesa
router.delete('/:nroMesa', mesaController.eliminarMesa);


module.exports = router;
const express = require('express');
const router = express.Router();
const mesasController = require('../controllers/mesasController'); // Asegúrate de que esta ruta sea correcta

// 🎯 Rutas de Mesa
router.get('/', mesasController.getMesas);
router.post('/', mesasController.createMesa); 
router.get('/:id', mesasController.getMesaById); 
router.put('/:id', mesasController.updateMesa); // ESTA RUTA NO SE ENCUENTRA
router.delete('/:id', mesasController.deleteMesa); // ESTA RUTA NO SE ENCUENTRA

module.exports = router;
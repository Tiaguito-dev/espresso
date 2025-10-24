// 📄 mesasRoutes.js (CORREGIDO)

const express = require('express');
const router = express.Router();
const mesasController = require('../controllers/mesasController');

// 🎯 Rutas de Mesa
router.get('/', mesasController.obtenerMesas);          // 🎯 CAMBIADO de getMesas
router.post('/', mesasController.crearMesa);           // 🎯 CAMBIADO de createMesa
router.get('/:id', mesasController.obtenerMesaPorNumero); // 🎯 CAMBIADO de getMesaById
router.put('/:id', mesasController.cambiarEstadoMesa); // 🎯 CAMBIADO de updateMesa (y la lógica es para estado)
router.delete('/:id', mesasController.eliminarMesa);   // 🎯 CAMBIADO de deleteMesa

module.exports = router;
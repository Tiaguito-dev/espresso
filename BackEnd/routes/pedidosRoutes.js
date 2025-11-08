// routes/pedidosRoutes.js
const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const { verificarToken, verificarPerfil } = require('../middlewares/auth');

// Ruta para obtener todos los pedidos
router.get('/', pedidosController.obtenerPedidos);

// Ruta para crear un nuevo pedido
router.post('/', verificarToken, pedidosController.crearPedido);

// Ruta para actualizar un pedido
router.put('/:id', pedidosController.actualizarPedido);


// Solo mozos pueden crear pedidos
router.post('/',
    verificarToken,
    verificarPerfil(['mozo', 'admin']), // Array de perfiles permitidos
    pedidosController.crearPedido
);

// Cocineros y mozos pueden ver pedidos
router.get('/',
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    pedidosController.obtenerPedidos
);

router.get('/',
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    pedidosController.obtenerPedidos
);

module.exports = router;
// routes/pedidosRoutes.js
const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const { verificarToken, verificarPerfil } = require('../middlewares/auth');


// Ruta para actualizar un pedido
router.put('/:id', 
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    pedidosController.actualizarPedido);


// Solo mozos pueden crear pedidos
router.post('/',
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']), // Array de perfiles permitidos
    pedidosController.crearPedido
);

// Cocineros y mozos pueden ver pedidos
router.get('/',
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    pedidosController.obtenerPedidos
);

router.get('/:id',
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    pedidosController.obtenerPedidoPorId
);

router.post('/:id/lineas',
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    pedidosController.agregarLineaAPedido
);

router.delete('/:id/lineas/:idLinea',
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    pedidosController.eliminarLineaDePedido
);

module.exports = router;
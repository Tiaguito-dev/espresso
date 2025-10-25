// BackEnd/routes/pedidosRoutes.js

const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// Rutas Generales
router.get('/', pedidosController.obtenerPedidos);
router.post('/', pedidosController.crearPedido);

// Rutas por ID (GET y PUT)
router.get('/:id', pedidosController.obtenerPedidoPorId); // Para Modificar (traer datos)
router.put('/:nroPedido', async (req, res) => {
    try {
        const nroPedido = req.params.nroPedido;
        const data = req.body;
        
        // Asumiendo que esta es la ruta usada para updatePedido y cancelarPedido
        if (data.estado) {
             await pedidosBD.modificarEstadoPedido(Number(nroPedido), data.estado);
        } else {
             // Lógica para actualizar campos completos del pedido (si aplica)
             // await pedidosBD.actualizarPedidoCompleto(Number(nroPedido), data);
        }

        res.status(200).json({ message: 'Pedido actualizado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el pedido', error: error.message });
    }
});   // Para Cambiar Estado
router.delete('/:id', pedidosController.eliminarPedido);  // Para Dar de Baja

module.exports = router;
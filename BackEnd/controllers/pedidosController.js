const AdministradorPedidos = require('../models/AdministradorPedidos');
const administradorPedidos = new AdministradorPedidos();
exports.obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await administradorPedidos.getPedidos();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
    }
};

exports.crearPedido = async (req, res) => {
    try {
        const nuevoPedido = await administradorPedidos.crearPedido(req.body);
        res.status(201).json(nuevoPedido);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ESTE ES EL DI:", id);
        const nroPedido = parseInt(id, 10);
        console.log("ESTE ES EL NRO DE PEDIDO:", nroPedido);
        const { nuevoEstado } = req.body;

        const pedido = await administradorPedidos.modificarEstadoPedido(nroPedido, nuevoEstado);
        console.log("ZZZZZZZZZZZZZZZ", pedido);
        res.json({ message: `Pedido actualizado a ${estadoFinal}`, pedido: pedido });

    } catch (error) {
        if (error.message === "Pedido no encontrado.") {
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
}

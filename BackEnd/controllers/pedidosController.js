//http://localhost:3001/api/pedidos

const AdministradorPedidos = require('../models/AdministradorPedidos');

const administradorPedidos = new AdministradorPedidos();


exports.obtenerPedidos = async (req, res) => {
    try{
        const pedidos = await administradorPedidos.getPedidos();
        //console.log("Datos a enviar de pedidos:", pedidos);
        res.json(pedidos);
    }catch(error){
        res.status(500).json({ message: 'Error al obtener pedidos', error: error.message});
    }
};

exports.crearPedido = async (req, res) => {
    try {
        const nuevoPedido = await administradorPedidos.crearPedido(req.body);
        res.status(201).json(nuevoPedido);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
}

exports.actualizarPedido = async (req, res) => {
    try{
        const { id } = req.params;
        const nroPedido = parseInt(id, 10);
        const { nuevoEstado } = req.body;

        const pedido = await administradorPedidos.modificarEstadoPedido(nroPedido, nuevoEstado);
        
        res.json({ message: `Pedido actualizado a ${estadoFinal}`, pedido: pedido });
        
    }catch(error){
        if (error.message === "Pedido no encontrado.") {
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
}

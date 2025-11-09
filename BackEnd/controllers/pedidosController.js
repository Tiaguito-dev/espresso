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
        console.log('Usuario autenticado:', req.usuario);
        const nuevoPedido = await administradorPedidos.crearPedido(req.body, req.usuario);
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
        
        res.json({ message: `Pedido actualizado a ${pedido.estadoPedido}`, pedido: pedido });
        
    }catch(error){
        if (error.message === "Pedido no encontrado.") {
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
}

exports.agregarLineaAPedido = async (req, res) => {
    try {
        const nroPedido = parseInt(req.params.id, 10);
        const datosLinea = req.body; 

        if (isNaN(nroPedido)) {
            return res.status(400).json({ message: 'El ID del pedido debe ser un número' });
        }
        if (!datosLinea.idProducto || !datosLinea.cantidad || datosLinea.cantidad <= 0) {
            return res.status(400).json({ message: 'Se requiere idProducto y una cantidad válida' });
        }

        const pedidoActualizado = await administradorPedidos.agregarLinea(nroPedido, datosLinea);
        res.status(200).json(pedidoActualizado);

    } catch(error) {
        if (error.message.includes('encontrado') || error.message.includes('pendiente')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
};

exports.eliminarLineaDePedido = async (req, res) => {
    try {
        const nroPedido = parseInt(req.params.id, 10);
        const idLinea = parseInt(req.params.idLinea, 10);

        if (isNaN(nroPedido) || isNaN(idLinea)) {
            return res.status(400).json({ message: 'El ID del pedido y el ID de la línea deben ser números' });
        }

        const pedidoActualizado = await administradorPedidos.eliminarLinea(nroPedido, idLinea);
        res.status(200).json(pedidoActualizado);

    } catch(error) {
        if (error.message.includes('encontrado') || error.message.includes('pendiente')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
};
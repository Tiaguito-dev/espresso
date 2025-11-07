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

        // El modelo ejecuta el cambio de estado y devuelve el objeto Pedido actualizado.
        const pedido = await administradorPedidos.modificarEstadoPedido(nroPedido, nuevoEstado);
        
        // 🎯 CORRECCIÓN: Usar el estado actualizado del objeto 'pedido'
        const estadoFinal = pedido.getEstadoPedido(); 
        
        res.json({ message: `Pedido actualizado a ${estadoFinal}`, pedido: pedido });
        
    }catch(error){
        if (error.message.includes("Pedido no encontrado.")) { // Más robusto
            return res.status(404).json({ message: error.message });
        }
        
        // 🎯 MEJORA: Devolver el error real de la base de datos (que contiene la info del typo).
        // El error es del backend, pero se devuelve como 400 al cliente.
        res.status(400).json({ message: error.message });
    }
}

exports.obtenerPedidoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const nroPedido = parseInt(id, 10);
        
        const pedido = await administradorPedidos.buscarPedidoPorNumero(nroPedido);
        
        if (!pedido) {
            // ❌ ESTA ES LA RESPUESTA QUE ESTÁS RECIBIENDO (404)
            return res.status(404).json({ message: "Pedido no encontrado." });
        }

        res.json(pedido); // Responde con el objeto pedido
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener pedido', error: error.message });
    }
};
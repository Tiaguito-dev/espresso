// BackEnd/controllers/pedidosController.js

const AdministradorPedidos = require('../models/AdministradorPedidos');
// Las instancias de Mesa y Menu ya están dentro de AdministradorPedidos, 
// no es necesario importarlas aquí a menos que las uses en los exports:
// const mesas = require('../models/Mesa'); 
// const menu = require('../models/Menu'); 
// const pedidoBD = require('../repositories/PedidoBD'); 
//------------------------------------------------------------------------

// Se instancia el administrador una sola vez
const administradorPedidos = new AdministradorPedidos();


exports.obtenerPedidos = async (req, res) => {
    try {
        // Obtenemos los posibles filtros de la query string
        const { mesa, mozo } = req.query; 
        
        // El administrador ahora deberá manejar los filtros (tendrás que actualizarlo si quieres filtrar en BD)
        // Por ahora, asumimos que 'getPedidos' sigue trayendo todos y el front-end filtra. 
        // Si necesitas filtrar en BD, debes pasar { mesa, mozo } a 'getPedidos' y modificar el Manager/Repository.
        
        const pedidos = await administradorPedidos.getPedidos(); 
        
        // 🚨 SI QUIERES FILTRAR AQUÍ ANTES DE ENVIAR AL CLIENTE (mejor práctica para grandes datasets):
        let pedidosFiltrados = pedidos;

        if (mesa) {
            pedidosFiltrados = pedidosFiltrados.filter(p => p.nro_mesa === parseInt(mesa, 10));
        }

        if (mozo) {
            pedidosFiltrados = pedidosFiltrados.filter(p => p.nombre_mozo && p.nombre_mozo.toLowerCase().includes(mozo.toLowerCase()));
        }

        // Enviamos los datos filtrados (en el caso de que el front-end use un GET con queries)
        // Pero para el alcance del Front-end, asumimos que el endpoint base trae todo lo necesario.
        res.json(pedidos); 
        
    } catch (error) {
        console.error("Error DETALLADO al obtener pedidos (Controller):", error.message); 
        res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
    }
};

exports.obtenerPedidoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const nroPedido = parseInt(id, 10);

        const pedido = await administradorPedidos.buscarPedidoPorNumero(nroPedido); 

        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado.' });
        }
        res.json(pedido);
    } catch (error) {
        console.error("Error DETALLADO al obtener pedido por ID (Controller):", error.message);
        res.status(500).json({ message: 'Error al obtener el pedido', error: error.message });
    }
};

exports.crearPedido = async (req, res) => { 
    try {
        // El controlador solo pasa los datos esenciales al Manager
        const nuevoPedido = await administradorPedidos.crearPedido(req.body); 
        
        // El Manager devuelve el objeto Pedido creado
        res.status(201).json(nuevoPedido); 

    } catch (error) {
        // Si el Manager lanza un error de negocio (Mesa no encontrada, Producto no encontrado), devuelve 400
        console.error("Error al crear pedido (Controller):", error.message);
        res.status(400).json({ message: error.message });
    }
}

exports.actualizarPedido = async (req, res) => {
    try{
        const { id } = req.params;
        const nroPedido = parseInt(id, 10);
        const { nuevoEstado } = req.body; 

        // El Manager se encarga de la lógica y la persistencia
        const pedido = await administradorPedidos.modificarEstadoPedido(nroPedido, nuevoEstado);
        
        res.json({ message: `Pedido actualizado a ${pedido.estadoPedido}`, pedido: pedido }); 
        
    }catch(error){
        if (error.message.includes("no encontrado")) {
            return res.status(404).json({ message: error.message });
        }
        console.error("Error DETALLADO al actualizar pedido (Controller):", error.message);
        res.status(400).json({ message: error.message });
    }
}

exports.eliminarPedido = async (req, res) => {
    // Esto debería llamar al Manager
    // await administradorPedidos.eliminarPedidoPorNumero(req.params.id);
    res.status(501).json({ message: "Eliminar pedido no implementado." });
};
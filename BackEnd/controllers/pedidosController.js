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
};

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

// --- [ RUTA POST /api/pedidos ] ---
exports.crearPedido = async (req, res) => { 
    try {
        const { mesa, lineas, observacion = '' } = req.body;

        const mesaObj = mesas.buscarMesaPorNumero(mesa);
        if (!mesaObj) throw new Error('Mesa no encontrada.');

        if (!lineas || !Array.isArray(lineas) || lineas.length === 0) {
            throw new Error('Se requiere al menos una línea de pedido');
        }

        let montoTotal = 0;
        const lineasPedidoParaBD = lineas.map(linea => {
            const productoObj = menu.buscarProductoPorId(linea.idProducto);

            if (!productoObj) {
                throw new Error(`Producto con id ${linea.idProducto} no encontrado.`)
            }
            
            const montoLinea = productoObj.precio * linea.cantidad;
            montoTotal += montoLinea;
            
            return {
                idProducto: productoObj.id,
                cantidad: linea.cantidad,
                monto: montoLinea,
                nombreProducto: productoObj.nombre
            };
        });

        // 1. Obtener el siguiente número de pedido
        let ultimoNro = await pedidoBD.obtenerUltimoNroPedido();
        const nroPedido = (ultimoNro ? parseInt(ultimoNro, 10) : 1000) + 1; 
        const fechaActual = new Date(); 
        
        const datosPedidoBD = {
            nroPedido: nroPedido,
            fecha: fechaActual, 
            observacion: observacion,
            monto: montoTotal,
            idMozo: 1, // ⚠️ Placeholder
            idMesa: mesaObj.nroMesa,
        };

        // 2. Guardar el Pedido principal
        await pedidoBD.crearPedido(datosPedidoBD); 

        // 3. Guardar las líneas del pedido
        for (const lineaData of lineasPedidoParaBD) { 
            await pedidoBD.crearLineaPedido({
                idPedido: nroPedido,
                idProducto: lineaData.idProducto,
                cantidad: lineaData.cantidad,
                monto: lineaData.monto,
                nombreProducto: lineaData.nombreProducto
            });
        }
        
        // Respuesta al cliente
        res.status(201).json({ 
            nroPedido, 
            montoTotal, 
            fecha: fechaActual, 
            idMesa: mesaObj.nroMesa,
            lineas: lineasPedidoParaBD 
        }); 

    } catch (error) {
        console.error("Error al crear pedido:", error.message);
        res.status(400).json({ message: error.message });
    }
}

// --- [ Funciones no implementadas en este fragmento ] ---

exports.eliminarPedido = async (req, res) => {
    // ... Implementación de eliminarPedido ...
    res.status(501).json({ message: "Eliminar pedido no implementado." });
};
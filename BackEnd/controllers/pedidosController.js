// pedidosController.js

const Pedido = require('../models/Pedido');
const LineaPedido = require('../models/LineaPedido');
const Mesa = require('../models/Mesa');

// 💡 Importamos el módulo de base de datos (Asegúrate que la ruta sea correcta)
const pedidoBD = require('../repositories/PedidoBD'); 

const { menu } = require('./menuController');
const { mesas } = require('./mesasController');

// --- [ RUTA GENERAL: GET /api/pedidos ] ---
exports.obtenerPedidos = async (req, res) => { 
    try {
        // 1. Obtener datos de la BD (asumimos que queremos los de hoy o todos)
        const pedidosDB = await pedidoBD.obtenerPedidosHoy();
        
        console.log("Datos a enviar de pedidos:", pedidosDB);
        res.json(pedidosDB);
    } catch (error) {
        console.error("Error al obtener pedidos:", error.message);
        res.status(500).json({ message: "Error al obtener pedidos de la BD: " + error.message });
    }
};

// --- [ RUTA INDIVIDUAL: GET /api/pedidos/:id ] ---
exports.obtenerPedidoPorId = async (req, res) => {
    try {
        const id = req.params.id;
        const nroPedido = parseInt(id, 10);
        
        // La función de BD devuelve un array de resultados
        const resultadosDB = await pedidoBD.obtenerPedidoPorNro(nroPedido);

        if (!resultadosDB || resultadosDB.length === 0) {
            return res.status(404).json({ message: "Pedido no encontrado." });
        }
        // Retorna el primer resultado (el pedido)
        res.json(resultadosDB[0]); 
    } catch (error) {
        console.error("Error al obtener pedido por ID:", error);
        res.status(500).json({ message: "Error interno del servidor al buscar pedido." });
    }
};

// --- [ RUTA INDIVIDUAL: PUT /api/pedidos/:id ] ---
exports.actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const nroPedido = parseInt(id, 10);
        const { nuevoEstado } = req.body;

        // 1. Obtener el estado actual de la BD
        const resultadosDB = await pedidoBD.obtenerPedidoPorNro(nroPedido);
        
        // 🎯 CORRECCIÓN: Tomamos el primer elemento del array de resultados
        const pedidoDB = resultadosDB && resultadosDB.length > 0 ? resultadosDB[0] : null; 
        
        if (!pedidoDB) {
            return res.status(404).json({ message: "Pedido no encontrado." });
        }
        
        // ⚠️ Asumimos que el campo de estado en la BD es 'estado'
        const estadoActual = pedidoDB.estado || 'pendiente'; 
        const estadoActualLower = estadoActual.toLowerCase();
        let estadoFinal = estadoActual;

        // Lógica de validación de cambio de estado (se mantiene)
        if (nuevoEstado) {
            const nuevoEstadoLower = nuevoEstado.toLowerCase();

            if ((estadoActualLower === "finalizado" || estadoActualLower === "cancelado") && nuevoEstadoLower !== estadoActualLower) {
                throw new Error("No se puede cambiar un pedido finalizado o cancelado");
            }

            const estadosValidos = ['pendiente', 'listo', 'finalizado', 'cancelado'];
            if (!estadosValidos.includes(nuevoEstadoLower)) {
                throw new Error(`Estado '${nuevoEstado}' no es válido`);
            }

            estadoFinal = nuevoEstado;
        } else {
            // Lógica para avanzar al siguiente estado (si no se especifica uno nuevo)
            switch (estadoActualLower) {
                case "pendiente":
                    estadoFinal = "Listo";
                    break;
                case "listo":
                    estadoFinal = 'Finalizado';
                    break;
                default:
                    estadoFinal = estadoActual;
            }
        }

        if (estadoFinal.toLowerCase() !== estadoActualLower) {
            // 2. Actualizar estado en la BD
            await pedidoBD.modificarEstadoPedido(nroPedido, estadoFinal); 

            res.json({ 
                message: `Pedido ${nroPedido} actualizado a ${estadoFinal}`, 
                nroPedido: nroPedido,
                nuevoEstado: estadoFinal
            });
        } else {
            res.status(200).json({ message: `El pedido ${nroPedido} ya está en estado ${estadoActual}. No se realizaron cambios.` });
        }
    } catch (error) {
        console.error("Error al actualizar pedido:", error.message);
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
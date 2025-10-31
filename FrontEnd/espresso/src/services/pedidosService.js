// src/services/pedidosService.js

// Importamos la data simulada
import { PEDIDOS_MOCK_DATA } from "../data/mockPedidos";

const API_URL = 'http://localhost:3001/api/pedidos';

// 🚨 Data in-memory para simular las modificaciones del front
let pedidosInMemory = [...PEDIDOS_MOCK_DATA]; 
let nextNroPedido = 1004;

const simularRetardo = () => new Promise(resolve => setTimeout(resolve, 300));

// 🔄 GET: Simula la obtención de pedidos
export const getPedidos = async () => {
    await simularRetardo();
    // 🚨 Devolvemos la copia en memoria
    return pedidosInMemory.map(p => ({
        ...p,
        // Aseguramos que el total siempre esté actualizado si el front lo modificó
        total: p.lineas.reduce((acc, item) => {
            // Nota: Aquí necesitaríamos la lista de productos para el precio real, 
            // pero confiamos en que el total ya viene calculado o lo calculamos en el front.
            // Para la simulación, usamos el total ya guardado.
            return p.total || 0; 
        }, 0)
    }));
};

// ➕ POST: Simula la creación de un nuevo pedido
export const createPedido = async (pedidoData) => {
    await simularRetardo();
    const nuevoPedido = {
        nroPedido: nextNroPedido++,
        fecha: new Date().toISOString(),
        estadoPedido: pedidoData.estadoPedido || "pendiente",
        ...pedidoData,
    };
    pedidosInMemory.push(nuevoPedido);
    return nuevoPedido;
};

// ✏️ PUT: Simula la actualización de un pedido (estado o contenido)
export const updatePedido = async (id, pedidoData) => {
    await simularRetardo();
    const index = pedidosInMemory.findIndex(p => p.nroPedido === Number(id));

    if (index === -1) {
        throw new Error('Pedido no encontrado para actualizar (Mock)');
    }

    // Lógica para manejar la actualización de estado desde PedidosLista.jsx
    if (pedidoData.estadoPedido) {
        pedidosInMemory[index] = {
            ...pedidosInMemory[index],
            estadoPedido: pedidoData.estadoPedido,
            // Aquí podrías añadir lógica de historial de estado si fuera real
        };
    } 
    // Lógica para manejar la actualización completa desde FormPedido.jsx (Modificar)
    else {
        pedidosInMemory[index] = {
            ...pedidosInMemory[index],
            ...pedidoData,
            // Aseguramos que nroPedido no se pierda/sobrescriba
            nroPedido: Number(id), 
        };
    }
    
    return pedidosInMemory[index];
};

// 🔎 GET por ID: Simula la búsqueda de un pedido específico
export const buscarPedidoPorId = async (id) => {
    await simularRetardo();
    const pedido = pedidosInMemory.find(p => p.nroPedido === Number(id));
    if (!pedido) {
        throw new Error(`Pedido ${id} no encontrado (Mock)`);
    }
    return pedido;
};

// 🗑️ DELETE (no usado, pero se deja por completitud): Simula la eliminación
export const deletePedido = async (id) => {
    await simularRetardo();
    const initialLength = pedidosInMemory.length;
    pedidosInMemory = pedidosInMemory.filter(p => p.nroPedido !== Number(id));
    if (pedidosInMemory.length === initialLength) {
        throw new Error('No se pudo eliminar el pedido (Mock)');
    }
    return true; 
};

/* // 🚨 NOTA IMPORTANTE: Para usar el BACKEND real en el futuro, 
// SOLO necesitas reemplazar este archivo con el código del servicio original.
*/
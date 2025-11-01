// src/services/pedidosService.js

// 🚨 URL base de la API para los pedidos
const API_URL = 'http://localhost:3001/api/pedidos';


/**
 * Función genérica para manejar errores de la respuesta de la API.
 * @param {Response} response - El objeto Response de fetch.
 * @throws {Error} - Lanza un error con el mensaje de la API o un mensaje por defecto.
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        let errorData = { message: `Error al obtener pedidos` };
        try {
            // 💡 Intenta leer el JSON del cuerpo del error (si el backend lo envía)
            errorData = await response.json(); 
            if (!errorData.message) {
                 // Si la API devuelve el error en otro campo
                 errorData.message = errorData.error || `Error ${response.status}: ${response.statusText}`;
            }
        } catch (e) {
            // Si el cuerpo no es JSON (ej: un error de HTML o texto plano)
            errorData.message = `Error ${response.status}: ${response.statusText}`;
        }
        // Lanza un error con el mensaje más detallado que pudimos encontrar
        throw new Error(errorData.message);
    }
    return response.json();
};

// 🔄 GET: Obtener todos los pedidos
export const getPedidos = async () => {
    try {
        const response = await fetch(API_URL);
        return handleResponse(response);
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        throw error;
    }
};

// 🔎 GET por ID: Buscar un pedido específico
export const buscarPedidoPorId = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        return handleResponse(response);
    } catch (error) {
        console.error(`Error al buscar el pedido ${id}:`, error);
        throw error;
    }
};

// ➕ POST: Crear un nuevo pedido
export const createPedido = async (pedidoData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Puedes necesitar un token de autorización aquí
            },
            body: JSON.stringify(pedidoData),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        throw error;
    }
};

// ✏️ PUT: Actualizar un pedido (estado o contenido)
export const updatePedido = async (id, pedidoData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT', // o PATCH
            headers: {
                'Content-Type': 'application/json',
                // Puedes necesitar un token de autorización aquí
            },
            body: JSON.stringify(pedidoData),
        });
        return handleResponse(response);
    } catch (error) {
        console.error(`Error al actualizar el pedido ${id}:`, error);
        throw error;
    }
};


// 🗑️ DELETE: Eliminar un pedido
export const deletePedido = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            // Puedes necesitar un token de autorización aquí
        });
        if (!response.ok) {
            await handleResponse(response);
        }
        return true; 
    } catch (error) {
        console.error(`Error al eliminar el pedido ${id}:`, error);
        throw error;
    }
};
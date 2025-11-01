// src/services/mesasService.js

// Importamos el modelo de Mesa para validación y/o tipado si fuera necesario.
// const Mesa = require('../models/Mesa'); 

// 🚨 URL base de la API para las mesas
const API_URL = 'http://localhost:3001/api/mesas';

/**
 * Función genérica para manejar errores de la respuesta de la API.
 * @param {Response} response - El objeto Response de fetch.
 * @throws {Error} - Lanza un error con el mensaje de la API o un mensaje por defecto.
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        let errorData = { message: `Error ${response.status}: ${response.statusText}` };
        try {
            // Intentamos leer el mensaje de error de la respuesta
            errorData = await response.json();
        } catch (e) {
            // Si falla la lectura del body, usamos el error por defecto
        }
        throw new Error(errorData.message || `Error en la solicitud: ${response.status}`);
    }
    return response.json();
};


// 🔄 GET: Obtener todas las mesas
export const getMesas = async () => {
    try {
        const response = await fetch(API_URL);
        return handleResponse(response);
    } catch (error) {
        console.error("Error al obtener las mesas:", error);
        throw error;
    }
};

// 🔎 GET por ID: Obtener una mesa por ID
export const getMesaById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        return handleResponse(response);
    } catch (error) {
        console.error(`Error al obtener la mesa ${id}:`, error);
        throw error;
    }
};

// ➕ POST: Crear una nueva mesa
export const createMesa = async (mesaData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Puedes necesitar un token de autorización aquí
            },
            body: JSON.stringify(mesaData),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Error al crear la mesa:", error);
        throw error;
    }
};

// ✏️ PUT: Actualizar una mesa
export const updateMesa = async (id, updatedFields) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT', // o PATCH si tu API solo espera los campos a actualizar
            headers: {
                'Content-Type': 'application/json',
                // Puedes necesitar un token de autorización aquí
            },
            body: JSON.stringify(updatedFields),
        });
        // La API puede devolver la mesa actualizada o solo un estado de éxito
        return handleResponse(response);
    } catch (error) {
        console.error(`Error al actualizar la mesa ${id}:`, error);
        throw error;
    }
};

// 🗑️ DELETE: Eliminar una mesa
export const deleteMesa = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            // Puedes necesitar un token de autorización aquí
        });
        // Las respuestas DELETE a menudo tienen un body vacío
        if (!response.ok) {
            await handleResponse(response); // Lanza el error si no es 2xx
        }
        return true; // Indicamos éxito
    } catch (error) {
        console.error(`Error al eliminar la mesa ${id}:`, error);
        throw error;
    }
};
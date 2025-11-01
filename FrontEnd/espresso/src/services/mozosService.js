// src/services/mozosService.js

// 🚨 URL base de la API para los mozos
const API_URL = 'http://localhost:3001/api/mozos';


/**
 * Función genérica para manejar errores de la respuesta de la API.
 * @param {Response} response - El objeto Response de fetch.
 * @throws {Error} - Lanza un error con el mensaje de la API o un mensaje por defecto.
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        let errorData = { message: `Error ${response.status}: ${response.statusText}` };
        try {
            errorData = await response.json();
        } catch (e) {}
        throw new Error(errorData.message || `Error en la solicitud: ${response.status}`);
    }
    return response.json();
};

// 🔄 GET: Obtener todos los mozos (incluyendo sus mesas asignadas)
export const getMozos = async () => {
    try {
        // Asumimos que la API devuelve los mozos activos con sus mesas asignadas
        const response = await fetch(API_URL);
        return handleResponse(response);
    } catch (error) {
        console.error("Error al obtener los mozos:", error);
        throw error;
    }
};

// 📌 FUNCIÓN CLAVE: Asigna una mesa a un mozo (cuando toma un pedido)
export const asignarMesaAMozo = async (mozoId, mesaId) => {
    try {
        // En lugar de manipular el estado local, enviamos la petición a la API
        const response = await fetch(`${API_URL}/${mozoId}/asignarMesa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Puedes necesitar un token de autorización aquí
            },
            body: JSON.stringify({ mesaId: Number(mesaId) }),
        });

        // Asumimos que la API maneja la lógica de:
        // 1. Desasignar la mesa de cualquier otro mozo.
        // 2. Asignar la mesa al nuevo mozo.
        // 3. (Opcional) Llamar internamente al mesasService para actualizar el estado de la mesa a 'ocupada'.
        
        return handleResponse(response); // La API podría devolver el mozo actualizado o un mensaje de éxito.
    } catch (error) {
        console.error(`Error al asignar la mesa ${mesaId} al mozo ${mozoId}:`, error);
        throw error;
    }
};

// NOTA: No se implementan create, update, delete, getById si solo se usan para asignación/listado.
// Si se necesitan, se harían llamadas fetch POST/PUT/DELETE/GET a ${API_URL}/...
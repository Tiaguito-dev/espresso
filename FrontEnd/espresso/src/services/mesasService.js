// src/services/mesasService.js (Completo y Corregido)
const API_URL = "http://localhost:3001/api/mesas";

// Función auxiliar para manejar la respuesta y los errores
const handleResponse = async (response) => {
    // Si la respuesta es 204 (No Content, común en DELETE), no intentamos parsear JSON
    if (response.status === 204) {
        return {};
    }
    
    // Si la respuesta no es OK (ej. 404, 500, 400), lanzamos un error
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Error en la petición: ${response.status}`);
    }
    
    // Devolvemos los datos parseados como JSON
    return response.json();
};

// ==========================================
// 1. OBTENER TODAS LAS MESAS (GET)
// ==========================================
export async function getMesas() {
    const response = await fetch(API_URL);
    return handleResponse(response);
}

// ==========================================
// 2. OBTENER MESA POR ID (GET)
// ==========================================
export async function getMesaById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return handleResponse(response);
}

// ==========================================
// 3. CREAR NUEVA MESA (POST)
// ==========================================
export async function createMesa(mesa) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(mesa),
    });
    return handleResponse(response);
}

// ==========================================
// 4. ACTUALIZAR MESA (PUT)
// ==========================================
export async function updateMesa(id, mesa) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(mesa),
    });
    return handleResponse(response);
}

// ==========================================
// 5. ELIMINAR MESA (DELETE)
// ==========================================
export async function deleteMesa(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    // DELETE a menudo devuelve 204 (No Content)
    return handleResponse(response);
}
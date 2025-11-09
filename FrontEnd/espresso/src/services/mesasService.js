// src/services/mesasService.js (Actualizado y Corregido)
const API_URL = "http://localhost:3001/api/mesas";

// Esta funcion la agregamos para unificar la gestión de cabeceras
// e incluir la autorización.
const getAuthHeaders = (includeContentType = true) => {
    const header = {};
    const token = localStorage.getItem('token');

    if (includeContentType) {
        header['Content-Type'] = 'application/json';
    }

    if (token) {
        header['Authorization'] = `Bearer ${token}`;
    }
    
    return header;
};


const handleResponse = async (response) => {
    
    if (response.status === 204) {
        // Para peticiones DELETE que devuelven 'No Content'
        return {};
    }

    
    if (!response.ok) {
        if (response.status === 401 || response.status === 403){
            console.error("Error de autenticación. Token inválido o permisos insuficientes.");
        }
        // Intentamos parsear el error del body si existe, si no, usamos el statusText
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Error en la petición: ${response.status}`);
    }

    
    return response.json();
};

// ==========================================
// 1. OBTENER TODAS LAS MESAS (GET)
// Corregido: La URL era incorrecta, no debería llevar un '/id' si es para obtener todas.
// Se incluye el header de autenticación.
// ==========================================
export async function getMesas() {
    // Para GET no necesitamos Content-Type, solo la autorización.
    const response = await fetch(API_URL, { 
        method: 'GET',
        headers: getAuthHeaders(false) 
    });

    return handleResponse(response);
}

// ==========================================
// 2. OBTENER MESA POR ID (GET)
// Se incluye el header de autenticación.
// ==========================================
export async function getMesaById(id) {
    // Para GET no necesitamos Content-Type, solo la autorización.
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET', // Aseguramos que sea 'GET' aunque es el valor por defecto
        headers: getAuthHeaders(false)
    }); 
    return handleResponse(response);
}

// ==========================================
// 3. CREAR NUEVA MESA (POST)
// Aplicamos getAuthHeaders para Content-Type y Authorization
// ==========================================
export async function createMesa(mesa) {
    const response = await fetch(API_URL, {
        method: "POST",
        // Aquí necesitamos Content-Type y Authorization
        headers: getAuthHeaders(true), 
        body: JSON.stringify(mesa),
    });
    return handleResponse(response);
}

// ==========================================
// 4. ACTUALIZAR MESA (PUT)
// Aplicamos getAuthHeaders para Content-Type y Authorization
// ==========================================
export async function updateMesa(id, mesa) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        // Aquí necesitamos Content-Type y Authorization
        headers: getAuthHeaders(true), 
        body: JSON.stringify(mesa),
    });
    return handleResponse(response);
}

// ==========================================
// 5. ELIMINAR MESA (DELETE)
// Se incluye el header de autenticación.
// ==========================================
export async function deleteMesa(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        // Para DELETE no necesitamos Content-Type, solo la autorización.
        headers: getAuthHeaders(false)
    });
    // DELETE a menudo devuelve 204 (No Content)
    return handleResponse(response);
}
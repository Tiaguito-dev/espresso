// src/services/productosService.js
const API_URL = 'http://localhost:3001/api/productos';

// Esta funcion la agrego porque el header se repite en cada petición
const getAuthHeaders = () => {
  const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
  return header
};

export const getProductos = async () => {
    console.log('Obteniendo todos los productos'); // Flag
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('No se pudieron obtener los productos');
    }
    return response.json();
};

export const buscarPorId = async (id) => {
    console.log('./services/productoService \n obteniendo el producto con ID:', id);
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('No se pudo obtener el producto');
    }
    return response.json();
};

export const createProducto = async (productoData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productoData),
    });
    if (!response.ok) {
        throw new Error('No se pudo crear el producto');
    }
    return response.json();
};

export const updateProducto = async (id, productoData) => {
    console.log('Actualizando el producto con ID:', id, 'Data:', productoData); // Línea de depuración
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productoData),
    });
    if (!response.ok) {
        throw new Error('No se pudo actualizar el producto');
    }
    return response.json();
};

export const deleteProducto = async (id) => {
    console.log('Eliminando producto con ID:', id);
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) {

        throw new Error(`No se pudo eliminar el producto con ID ${id}`);
    }
    return response.json();
};

export const obtenerCategorias = async () => {
    try {
        const response = await fetch(`${API_URL}/categoria`);
        if (!response.ok) {
            console.error('Error al obtener categorías:', response.statusText);
            return [];
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error de red al obtener categorías:", error);
        return [];
    }
};

export const updateEstadoProducto =  async (id, estadoData) => {
    console.log(`Enviando PATCH a: ${API_URL}/${id}/estado`);
    console.log('Enviando body:', estadoData);

    try {
        const response = await fetch(`${API_URL}/${id}/estado`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(estadoData),
        });

        if (!response.ok) {
            const errorInfo = await response.json();
            throw new Error(errorInfo.message || `Error del servidor: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Error en updateEstadoProducto:', error);
        throw error;
    }
}; 
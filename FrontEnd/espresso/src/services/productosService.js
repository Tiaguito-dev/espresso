// src/services/productosService.js
const API_URL = 'http://localhost:3001/api/productos';

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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData),
    });
    if (!response.ok) {
        throw new Error('No se pudo actualizar el producto');
    }
    return response.json();
};

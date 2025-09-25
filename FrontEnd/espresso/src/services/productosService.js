// src/services/productosService.js
const API_URL = 'http://localhost:3001/api/productos';

export const getProductos = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('No se pudieron obtener los productos');
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
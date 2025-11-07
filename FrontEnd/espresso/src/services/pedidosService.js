// src/services/pedidosService.js
const API_URL = 'http://localhost:3001/api/pedidos';

export const getPedidos = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('No se pudieron obtener los pedidos');
  }
  return response.json();
};

export const createPedido = async (pedidoData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedidoData),
  });
  if (!response.ok) {
    throw new Error('No se pudo crear el pedido');
  }
  return response.json();
};

export const updatePedido = async (id, pedidoData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData),
    });

    if (!response.ok) {
        // 🎯 AÑADIDO: Intenta leer el mensaje de error del backend
        const errorDetail = await response.text(); 
        console.error(`Detalle del error 400/404/500:`, errorDetail);
        
        // Lanza un error más útil en la consola y la interfaz
        throw new Error(`No se pudo actualizar el pedido. Detalle: ${errorDetail.substring(0, 100)}...`); 
    }
    
    // Si la actualización es exitosa (código 200 o 204), devuelve el JSON o un objeto vacío
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {};
    }
    return response.json();
};

export const deletePedido = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    // Un DELETE exitoso generalmente devuelve 200 o 204 sin cuerpo
    if (!response.ok) {
        throw new Error('No se pudo eliminar el pedido');
    }
    return {}; // Devuelve un objeto vacío en caso de éxito
};

export const buscarPedidoPorId = async (id) => {
    try {
        // 🎯 Llama a la URL con el ID: http://localhost:3001/api/pedidos/123
        const response = await fetch(`${API_URL}/${id}`); 

        if (!response.ok) {
            // Si el backend no encuentra el pedido (e.g., 404), lanzamos un error
            throw new Error(`Pedido no encontrado. Código de estado: ${response.status}`);
        }
        
        // Devuelve el objeto del pedido como JSON
        return await response.json(); 
        
    } catch (error) {
        console.error(`Error al buscar pedido por ID ${id}:`, error);
        throw error;
    }
};

export const getProductos = async () => {
    try {
        const response = await fetch(API_PRODUCTOS_URL);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener la lista de productos`);
        }
        
        // Asumimos que el backend devuelve un JSON con la lista de productos
        return await response.json(); 
    } catch (error) {
        console.error("Error en getProductos:", error);
        throw error; // Propagar el error para manejarlo en el componente
    }
};
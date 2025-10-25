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
        throw new Error('No se pudo actualizar el pedido');
    }
    return response.json();
};

export const deletePedido = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('No se pudo eliminar el pedido');
    }
    // No devuelve el JSON si es un DELETE (código 204), solo verifica el éxito
    return response.status === 204 ? null : response.json().catch(() => null); 
};

export const buscarPedidoPorId = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
 
 if (!response.ok) {
    // Si el pedido no existe o hay un error de servidor
    throw new Error(`Pedido no encontrado o error del servidor: ${response.statusText}`);
 }
 
 return response.json();
};
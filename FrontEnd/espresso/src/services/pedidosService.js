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
  const response = await api.delete(`/pedidos/${id}`);
  return response.data;
};

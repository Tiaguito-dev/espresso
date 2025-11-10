// src/services/pedidosService.js
const API_URL = 'http://localhost:3001/api/pedidos';

// Esta funcion la agrego porque el header se repite en cada petición
export const getAuthHeaders = () => {
  const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
  return header
};


// Lo único que hice es que tenemos que pasar el token que está en la variable global
export const getPedidos = async () => {
  const response = await fetch(API_URL, {
    // SOLAMENTE HAY QUE AGREGARLE ESTO A CADA PETICIÓN
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('No se pudieron obtener los pedidos');
  }

  console.log("TODO BIEN EN PEDIDOS (estoy en pedidosService)");

  return response.json();
};

export const createPedido = async (pedidoData,) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(pedidoData),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear el pedido');
  }

  return response.json();
};

export const updatePedido = async (id, pedidoData,) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(pedidoData),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar el pedido');
  }

  return response.json();
};

export const deletePedido = async (id,) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('No se pudo eliminar el pedido');
  }

  return response.json();
};

export const buscarPedidoPorId = async (id,) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`Pedido no encontrado o error del servidor: ${response.statusText}`);
  }

  return response.json();
};

export const agregarLineaAPedido = async (id, lineaData) => {
  const response = await fetch(`${API_URL}/${id}/lineas`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(lineaData),
  });
  if (!response.ok) {
    throw new Error(`Pedido no encontrado o error del servidor: ${response.statusText}`);
  }
  return response.json();
};

export const eliminarLineaAPedido = async (idPedido, idLinea) => {
  const response = await fetch(`${API_URL}/${idPedido}/lineas/${idLinea}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Pedido no encontrado o error del servidor: ${response.statusText}`);
  }
  return; 
};
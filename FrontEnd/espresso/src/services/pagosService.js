const API_URL = 'http://localhost:3001/api/pagos';

// Esta funcion la agrego porque el header se repite en cada petición
export const getAuthHeaders = () => {
    const header = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
    return header
};


// Lo único que hice es que tenemos que pasar el token que está en la variable global
export const getPagos = async () => {
    console.log("levanta el get pagos");
    const response = await fetch(API_URL, {
        // SOLAMENTE HAY QUE AGREGARLE ESTO A CADA PETICIÓN
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('No se pudieron obtener los pedidos');
    }

    console.log("Termino el get de pagos");

    return response.json();
};

export const crearPago = async (pagoData,) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(pagoData),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear el pago');
  }

  return response.json();
};

export const buscarPagoPorId = async (id,) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`Pedido no encontrado o error del servidor: ${response.statusText}`);
  }

  return response.json();
};
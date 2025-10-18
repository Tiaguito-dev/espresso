const API_URL = 'http://localhost:3001/api/mesas';

export async function getMesas() {
  const response = await api.get("/mesas");
  return response.data;
}

export async function updateMesa(id, body) {
  const response = await api.put(`/mesas/${id}`, body);
  return response.data;
}

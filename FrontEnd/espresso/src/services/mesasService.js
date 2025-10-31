// src/services/mesasService.js

// Datos de Mesas simulados (Mock Data)
let mesasInMemory = [
    { id: 1, numero: 1, mozoACargo: "Juan Pérez", estado: "Ocupada" },
    { id: 2, numero: 2, mozoACargo: "Ana Gómez", estado: "Disponible" },
    { id: 3, numero: 3, mozoACargo: "Juan Pérez", estado: "Listo Para Cobrar" },
    { id: 4, numero: 4, mozoACargo: "Sofía Díaz", estado: "Disponible" },
    { id: 5, numero: 5, mozoACargo: "Sofía Díaz", estado: "Listo Para Ordenar" },
];
let nextId = 6;

const simularRetardo = () => new Promise(resolve => setTimeout(resolve, 300));

// 🔄 GET: Obtener todas las mesas
export const getMesas = async () => {
    await simularRetardo();
    // Devolvemos una copia para evitar mutaciones directas
    return [...mesasInMemory];
};

// 🔎 GET por ID: Obtener una mesa por ID (útil para modificar)
export const getMesaById = async (id) => {
    await simularRetardo();
    const mesa = mesasInMemory.find(m => m.id === Number(id));
    if (!mesa) {
        throw new Error(`Mesa ${id} no encontrada (Mock)`);
    }
    return mesa;
};

// ➕ POST: Crear una nueva mesa
export const createMesa = async (mesaData) => {
    await simularRetardo();
    const nuevaMesa = {
        id: nextId++,
        ...mesaData,
        // Aseguramos que el estado se guarde como lo espera el front
        estado: mesaData.estado || "Disponible", 
        numero: Number(mesaData.numero) // Aseguramos que sea número
    };
    mesasInMemory.push(nuevaMesa);
    return nuevaMesa;
};

// ✏️ PUT: Actualizar una mesa
export const updateMesa = async (id, updatedFields) => {
    await simularRetardo();
    const index = mesasInMemory.findIndex(m => m.id === Number(id));

    if (index === -1) {
        throw new Error('Mesa no encontrada para actualizar (Mock)');
    }

    // Actualizamos la mesa con los campos nuevos
    mesasInMemory[index] = {
        ...mesasInMemory[index],
        ...updatedFields,
        id: Number(id), // Mantenemos el ID original
    };
    
    return mesasInMemory[index];
};

// 🗑️ DELETE: Eliminar una mesa
export const deleteMesa = async (id) => {
    await simularRetardo();
    const initialLength = mesasInMemory.length;
    mesasInMemory = mesasInMemory.filter(m => m.id !== Number(id));
    if (mesasInMemory.length === initialLength) {
        throw new Error('No se pudo eliminar la mesa (Mock)');
    }
    return true; 
};
// src/services/mozosService.js

// Mock de datos de Mozos basado en tu tabla de usuarios, 
// usando 'correo' como el 'nombre' del mozo temporalmente.
let mozosInMemory = [
    { id: 1, nombre: "Juliana", correo: "juliana@gmail.com" }, // Perfil 1
    { id: 2, nombre: "Admin", correo: "admin@gmail.com" }, // Perfil 2 (no lo usaremos como mozo real)
    { id: 3, nombre: "Juan Pérez", correo: "juan@cafe.com" }, // Mozo simulado
    { id: 4, nombre: "Ana Gómez", correo: "ana@cafe.com" }, // Mozo simulado
    { id: 5, nombre: "Sofía Díaz", correo: "sofia@cafe.com" }, // Mozo simulado
];

// Asignaremos las mesas que tienen pedidos en curso aquí (mozoId: [mesaNum1, mesaNum2, ...])
let asignacionesMesas = {
    3: [1, 3], // Juan Pérez tiene mesas 1 y 3 asignadas
    4: [],     // Ana Gómez no tiene asignaciones (aunque tiene la mesa 2 en la lista de mesas)
    5: [5]     // Sofía Díaz tiene la mesa 5 asignada
};

const simularRetardo = () => new Promise(resolve => setTimeout(resolve, 300));

// 🔄 GET: Obtener solo los mozos activos (simularemos que son los IDs > 2)
export const getMozos = async () => {
    await simularRetardo();
    // Filtramos para solo mostrar a los mozos que trabajarán en el café.
    const mozosActivos = mozosInMemory.filter(m => m.id > 2);
    
    // Adjuntamos las mesas asignadas a cada mozo
    const mozosConMesas = mozosActivos.map(mozo => ({
        ...mozo,
        mesasAsignadas: asignacionesMesas[mozo.id] || [],
    }));
    
    return mozosConMesas;
};

// 📌 FUNCIÓN CLAVE: Asigna una mesa a un mozo (cuando toma un pedido)
// Nota: Esta función también necesitará llamar al updateMesa del mesasService 
// para cambiar el estado a 'Ocupada', lo cual haremos después.
export const asignarMesaAMozo = async (mozoId, mesaId) => {
    await simularRetardo();
    const mozoIdNum = Number(mozoId);
    const mesaIdNum = Number(mesaId);
    
    // 1. Eliminar la mesa de cualquier otro mozo (para evitar duplicados)
    Object.keys(asignacionesMesas).forEach(id => {
        asignacionesMesas[id] = asignacionesMesas[id].filter(m => m !== mesaIdNum);
    });

    // 2. Asignar la mesa al mozo
    if (!asignacionesMesas[mozoIdNum]) {
        asignacionesMesas[mozoIdNum] = [];
    }
    if (!asignacionesMesas[mozoIdNum].includes(mesaIdNum)) {
        asignacionesMesas[mozoIdNum].push(mesaIdNum);
    }
    
    // Lógica adicional (FUERA DE ESTE ARCHIVO): 
    // Llamar a updateMesa(mesaId, { estado: 'Ocupada', mozoACargo: mozoNombre })

    return true;
};
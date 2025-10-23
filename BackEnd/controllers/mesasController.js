// controllers/mesasController.js

// Array para simular la base de datos de mesas
let mesas = [
  { id: 'M01', numero: 1, capacidad: 4, mozoACargo: 'Juan Pérez', estado: "Disponible" },
  { id: 'M02', numero: 2, capacidad: 2, mozoACargo: 'María Gómez', estado: "Ocupada" },
  { id: 'M03', numero: 3, capacidad: 6, mozoACargo: 'Juan Pérez', estado: "Listo Para Ordenar" },
  { id: 'M04', numero: 4, capacidad: 4, mozoACargo: 'Pedro Ledesma', estado: "Listo Para Cobrar" },
];

// ===============================================
// 1. OBTENER TODAS LAS MESAS
// ===============================================
exports.getMesas = (req, res) => {
  res.json(mesas);
};

// ===============================================
// 2. OBTENER MESA POR ID (Para Modificar)
// ===============================================
exports.getMesaById = (req, res) => {
  const { id } = req.params;
  const mesa = mesas.find((m) => m.id === id);

  if (!mesa) {
    return res.status(404).json({ message: "Mesa no encontrada" });
  }

  res.json(mesa);
};

// ===============================================
// 3. CREAR NUEVA MESA
// ===============================================
exports.createMesa = (req, res) => {
  const nuevaMesa = { 
    ...req.body, 
    id: 'M' + Date.now().toString().slice(-4), // ID simple de ejemplo
    estado: req.body.estado || "Disponible", 
  };

  // Validación simple para evitar duplicados en el número de mesa
  if (mesas.find(m => m.numero === nuevaMesa.numero)) {
    return res.status(400).json({ message: "El número de mesa ya existe" });
  }

  mesas.push(nuevaMesa);
  res.status(201).json(nuevaMesa);
};

// ===============================================
// 4. ACTUALIZAR MESA (Unificada: Estado o Edición)
// ===============================================
exports.updateMesa = (req, res) => {
    const { id } = req.params;
    
    // Capturamos ambos posibles datos
    const { nuevoEstado, numero, capacidad, mozoACargo } = req.body; 

    const index = mesas.findIndex((m) => m.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Mesa no encontrada" });
    }

    let mesaActual = mesas[index];

    // ==============================================================
    // A. Lógica de CAMBIO DE ESTADO (Prioridad)
    // ==============================================================
    // Si 'nuevoEstado' está presente Y ningún campo de edición está presente,
    // asumimos que es una solicitud de cambio de estado.
    if (nuevoEstado !== undefined && 
        numero === undefined && 
        capacidad === undefined && 
        mozoACargo === undefined) 
    {
        mesaActual.estado = nuevoEstado;

        // Si la mesa se libera/vuelve a disponible, resetear el mozo
        if (nuevoEstado === "Disponible") {
            mesaActual.mozoACargo = ''; 
        }

        mesas[index] = mesaActual; // Actualizar el array en memoria
        
        return res.json({ 
            message: `Estado de la mesa ${id} actualizado a ${nuevoEstado}`, 
            mesa: mesaActual 
        });
    }

    // ==============================================================
    // B. Lógica de EDICIÓN COMPLETA (Modificación)
    // ==============================================================
    // Asumimos edición si al menos un campo de edición está presente.
    if (numero !== undefined || capacidad !== undefined || mozoACargo !== undefined) {
        
        // Aplicamos la actualización PARCIAL (solo los campos que vienen)
        mesaActual = {
            ...mesaActual,
            numero: numero !== undefined ? Number(numero) : mesaActual.numero,
            capacidad: capacidad !== undefined ? Number(capacidad) : mesaActual.capacidad,
            mozoACargo: mozoACargo !== undefined ? mozoACargo : mesaActual.mozoACargo,
            // NOTA: No actualizamos 'estado' desde aquí para evitar conflictos, 
            // solo se hace en el paso A.
        };

        mesas[index] = mesaActual; // Actualizar el array en memoria

        return res.json({ 
            message: `Mesa ${id} modificada completamente`, 
            mesa: mesaActual 
        });
    }

    // ==============================================================
    // C. RESPUESTA DE ERROR (Si no entra en A ni en B)
    // ==============================================================
    // Si la solicitud no contiene datos válidos (cuerpo vacío o solo datos irrelevantes)
    res.status(400).json({ message: "Datos de actualización inválidos." });
};

// ===============================================
// 5. ELIMINAR/DAR DE BAJA MESA
// ===============================================
exports.deleteMesa = (req, res) => {
  const { id } = req.params;
  const initialLength = mesas.length;
  
  // Filtramos para eliminar la mesa
  mesas = mesas.filter((m) => m.id !== id);

  if (mesas.length === initialLength) {
    return res.status(404).json({ message: "Mesa no encontrada para eliminar" });
  }

  res.json({ message: `Mesa ${id} dada de baja correctamente.` });
};
const validarDataMesa = (data) => {
    const errores = [];
    if (!data || typeof data !== 'object') {
        errores.push('Se requieren los datos de la mesa');
        return errores;
    }

    if (!data.nroMesa || typeof data.nroMesa !== 'number' || data.nroMesa <= 0) {
        errores.push('El número de mesa es obligatorio, debe ser un numero positivo');
    }

    if (data.estadoMesa) {
        const estadosValidos = ['disponible', 'ocupada', 'No Disponible'];
        if (!estadosValidos.includes(data.estadoMesa)) {
            errores.push(`El estado de la mesa debe ser uno de los siguientes: ${estadosValidos.join(', ')}`);
        }
    }

    return errores;
}

class Mesa {
    constructor({ nroMesa, estadoMesa, mozoACargo, capacidad }) {
        if (!nroMesa) {
            throw new Error("El número de mesa es obligatorio.");
        }
        
        // 🚨 CRÍTICO: Asignación de propiedades. ¡Esto faltaba!
        this.nroMesa = nroMesa;
        this.estadoMesa = estadoMesa || 'disponible';
        
        // 🚨 CORRECCIÓN: Si el mozo viene de la BD como null/undefined, lo aceptamos.
        // El error 500 se producía porque esta propiedad no se asignaba en la versión anterior.
        this.mozoACargo = mozoACargo || null;
        
    }

    // 🚨 CORRECCIÓN: El método estaba mal escrito, se elimina la coma y la llave.
    cambiarEstadoMesa(nuevoEstado) {
        this.estadoMesa = nuevoEstado;
        
        // Lógica adicional: si la mesa está disponible o fuera de servicio, el mozo se libera.
        if (nuevoEstado === 'disponible' || nuevoEstado === 'fuera de servicio') {
            this.mozoACargo = null;
        }
    }

    // Puedes añadir más métodos aquí (ej. asignarMozo, etc.)
}

module.exports = Mesa;
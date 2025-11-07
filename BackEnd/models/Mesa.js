// Mesa.js

const validarDataMesa = (data) => {
    const errores = [];
    if (!data || typeof data !== 'object') {
        errores.push('Se requieren los datos de la mesa');
        return errores;
    }

    if (!data.nroMesa || typeof data.nroMesa !== 'number' || data.nroMesa <= 0) {
        errores.push('El número de mesa es obligatorio y debe ser un número positivo.');
    }

    if (data.estadoMesa) {
        // Se sincronizan los estados válidos con AdministradorMesas
        const estadosValidos = ['disponible', 'ocupada', 'fuera de servicio']; 
        if (!estadosValidos.includes(data.estadoMesa)) {
            errores.push(`El estado de la mesa debe ser uno de los siguientes: ${estadosValidos.join(', ')}`);
        }
    }

    return errores;
}

class Mesa {
    constructor({ nroMesa, estadoMesa, capacidad }) { 
        // 🚨 Se ejecuta la validación
        const errores = validarDataMesa({ nroMesa, estadoMesa }); 
        if (errores.length > 0) {
            throw new Error(`Errores de validación al crear Mesa: ${errores.join(', ')}`);
        }
        
        // Asignación de propiedades
        this.nroMesa = nroMesa;
        this.estadoMesa = estadoMesa || 'disponible';
        
        
        
    }

    cambiarEstadoMesa(nuevoEstado) {
        this.estadoMesa = nuevoEstado;
    }
}

module.exports = Mesa;
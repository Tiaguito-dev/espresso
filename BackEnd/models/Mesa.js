const validarDataMesa = (data) => {
    const errores = []; 
    if (!data || typeof data !== 'object') {
        errores.push('Se requieren los datos de la mesa');
        return errores; 
    }

    if (!data.nroMesa || typeof data.nroMesa !== 'number' || data.nroMesa <= 0) {
        errores.push('El número de mesa es obligatorio, debe ser un numero positivo');
    }
}

class Mesa {
    constructor (data) {
        const errores = validarDataMesa(data);
        if (errores.length > 0) {
            throw new Error(`Errores de validacion: ${errores.join(', ')}`);
        }

        this.nroMesa = data.nroMesa;
        this.estadoMesa = data.estadoMesa || 'disponible'; //si no tiene estado, lo inicializa en disponible
    }
}
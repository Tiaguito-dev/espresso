const validarDataMesa = (data) => {
    const errores = []; 
    if (!data || typeof data !== 'object') {
        errores.push('Se requieren los datos de la mesa');
        return errores; 
    }

    if (!data.nroMesa || typeof data.nroMesa !== 'number' || data.nroMesa <= 0) {
        errores.push('El número de mesa es obligatorio, debe ser un numero positivo');
    }

    if (data.estadoMesa){
        const estadosValidos = ['disponible', 'ocupada', 'reservada', 'fuera de servicio'];
        if (!estadosValidos.includes(data.estadoMesa)) {
            errores.push(`El estado de la mesa debe ser uno de los siguientes: ${estadosValidos.join(', ')}`);
        }
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
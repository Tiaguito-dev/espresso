const Pedido = require('./Pedido');

const validarDataPago = (data) => {
    const errores = []; 
    if (!data || typeof data !== 'object') {
        errores.push('Se requieren los datos del pago');
        return errores; 
    }

    if (!data.pedido || !(data.pedido instanceof Pedido)) {
        errores.push('El pedido es obligatorio y debe ser una instancia de la clase Pedido');
    }

    if (data.monto == undefined) {
        errores.push('El monto es obligatorio');
    } else if (typeof data.monto !== 'number' || data.monto < 0) {
        errores.push('El monto debe ser un número positivo');
    }
    return errores;
}

class Pago {
    constructor (data) {
        const errores = validarDataPago(data);
        if (errores.length > 0) {
            throw new Error(`Errores de validacion: ${errores.join(', ')}`);
        }

        this.pedido = data.pedido;
        this.monto = data.monto;
        this.fechaPago = data.fechaPago || getFecha(data.pedido); //si no tiene fecha de pago, la inicializa con la fecha del pedido

        //PREGUNTA no pusimos metodo de pago
    }

    getMonto() {
        return this.monto;
    }   

    getFechaPago() {
        return this.fechaPago;
    }
    getPedido() {
        return this.pedido;
    }
}
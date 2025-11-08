const Pedido = require('./Pedido');
const metodosPermitidos = ['efectivo', 'transferencia bancaria', 'tarjeta de crédito', 'tarjeta de debito'];

const validarDataPago = (data) => {
    const errores = []; 
    if (!data || typeof data !== 'object') {
        errores.push('Se requieren los datos del pago');
        return errores; 
    }

    if (!data.pedido || !(data.pedido instanceof Pedido)) {
        errores.push('El pedido es obligatorio y debe ser una instancia de la clase Pedido');
    }
    if (data.nroPago === undefined || typeof data.nroPago !== 'number') {
        errores.push('El idPago es obligatorio.');
    }

    if (data.monto == undefined) {
        errores.push('El monto es obligatorio');
    } else if (typeof data.monto !== 'number' || data.monto < 0) {
        errores.push('El monto debe ser un número positivo');
    }

    if (!data.metodo){
        errores.push('El método de pago es obligatorio');
    }else if(!metodosPermitidos.includes(data.metodo.toLowerCase())){
        errores.push(`Método de pago no válido. Permitidos: ${metodosPermitidos.join(', ')}`);
    }

    return errores;
}

class Pago {
    constructor (data) {
        const errores = validarDataPago(data);
        if (errores.length > 0) {
            throw new Error(`Errores de validacion: ${errores.join(', ')}`);
        }
        this.nroPago = data.nroPago;
        this.pedido = data.pedido;
        this.monto = data.monto;

        this.metodo = data.metodo.toLowerCase();

        this.fecha = data.fecha || new Date(); 
        
    }

    getId(){
        return this.idPago;
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
    getMetodo() {
        return this.metodo;
    }

    toJSON() {
        return {
            idPago: this.idPago,
            nroPedido: this.pedido.getNroPedido(),
            monto: this.monto,
            fecha: this.fecha,
            metodo: this.metodo
        }
    }
}

module.exports = Pago;
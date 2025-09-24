const Pago = require('./Pago');

class AdministradorPagos {
    constructor() {
        this.pagos = []; //inicializa el array de pagos como vacío
    }  
    registrarPago(data) {
        const pago = new Pago(data);
        this.pagos.push(pago);
        return pago;
    }
}
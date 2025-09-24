const Mesa = require('./Mesa');

class AdministradosMesas {
    constructor() {
        this.mesas = [];
    }

    agregarMesa(mesa) {
        if (mesa instanceof Mesa) {
            this.mesas.push(mesa);
        }
    }

    buscarMesaPorNumero(nroMesa) {
        return this.mesas.find(mesa => mesa.nroMesa === nroMesa);
    }

    cambiarEstadoMesa(nroMesa, nuevoEstado) {
        const mesa = this.buscarMesaPorNumero(nroMesa); 
        if (mesa) {
            mesa.estadoMesa = nuevoEstado;
            return true;
        }
        return false;
    }
}
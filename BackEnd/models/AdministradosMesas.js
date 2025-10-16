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

    getMesas() {
        return this.mesas;
    }

    buscarMesaPorNumero(nroMesa) {
        return this.mesas.find(mesa => mesa.nroMesa === nroMesa);
    }

    eliminarMesaPorNumero(nroMesa){
        const i = this.mesas.findIndex(m => m.nroMesa === nroMesa);
        if (i !== -1) {
            this.mesas.splice(i, 1);
            return true;
        }
        return false;
    }
}

module.exports = AdministradosMesas;
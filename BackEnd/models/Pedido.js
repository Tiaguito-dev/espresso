const Mesa = require('./Mesa');
const LineaPedido = require('./LineaPedido');

const validarDataPedido = (data) => {
    const errores = [];

    if (!data || typeof data !== 'object') {
        errores.push('Se requieren los datos del pedido');
        return errores; //este es el unico que retorna aca porque no tiene sentido seguir validando si no es un objeto
    }

    if (!data.nroPedido) {
        errores.push('El número de pedido es obligatorio');
    } else if (typeof data.nroPedido !== 'number') {
        errores.push('El número de pedido debe ser un número'); //PREGUNTA si puede ser negativo
    }

    if (!data.fecha) {
        errores.push('La fecha es obligatoria');
    }
    //PREGUUNTAR si habria que validar que fecha sea Date

    if (data.estadoPedido) {
        const estadosValidos = ['pendiente', 'listo', 'finalizado', 'cancelado', 'pagado'];
        const estadoRecibido = data.estadoPedido.toLowerCase();
        if (!estadosValidos.includes(estadoRecibido)) {
            errores.push(`Estado de pedido no válido. Recibido: '${data.estadoPedido}'. Válidos: ${estadosValidos.join(', ')}`);
        }
    }

    if (data.mesa && !(data.mesa instanceof Mesa)) {
        errores.push('La mesa debe ser una instancia de la clase Mesa');
    } else if (!data.mesa) {
        errores.push('La mesa es obligatoria');
    }

    return errores;

}

class Pedido {
    constructor(data) {

        const errores = validarDataPedido(data);
        if (errores.length > 0) {
            throw new Error(`Errores de validacion: ${errores.join(', ')}`);
        }

        this.nroPedido = data.nroPedido;
        this.fecha = data.fecha;
        this.estadoPedido = data.estadoPedido || 'pendiente'; //si no tiene estado, lo inicializa en pendiente
        this.mesa = data.mesa;
        this.total = data.total;

        this.lineasPedido = data.lineasPedido || []; // inicializar como un array vacío si no contiene las lineas de pedido NOTA: A DEFINIR UCANDO SE HACE ESTO
    }
    toJSON() {
        return {
            nroPedido: this.nroPedido,
            fecha: this.fecha,
            total: this.total,
            estadoPedido: this.estadoPedido,
            mesa: this.mesa,
            lineasPedido: this.lineasPedido
    };
}

    agregarLineaPedido() {
        const lineaPedido = new LineaPedido();
        this.lineasPedido.push(lineaPedido);
    }

    // TODO: Esto debería hacerlo el controller porque hay una variable que se llama monto. No debería ser un atributo derivado
    getTotal() {
        return this.lineasPedido.reduce((total, linea) => total + linea.getSubTotal(), 0);
    }

    getNroPedido() {
        return this.nroPedido;
    }
    getFecha() {
        return this.fecha;
    }
    getEstadoPedido() {
        return this.estadoPedido;
    }
    getMesa() {
        return this.mesa;
    }
    getLineasPedido() {
        return this.lineasPedido;
    }

}

module.exports = Pedido;
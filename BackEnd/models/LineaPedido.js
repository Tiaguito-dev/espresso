const Producto = require('./Producto');

const validarDataLineaPedido = (data) => {
    const errores = []; 
    if (!data || typeof data !== 'object') {
        errores.push('Se requieren los datos de la línea de pedido');
        return errores; 
    }
    
    if (!data.producto) {
        errores.push('El producto es obligatorio');
        return errores;
    } else if (!(data.producto  instanceof Producto)) {    
        errores.push('El producto debe ser una instancia de la clase Producto');
    } // no doy la opcion de crear el producto en el momento

    if (!data.cantidad || typeof data.cantidad !== 'number' || data.cantidad <= 0) {
        errores.push('La cantidad es obligatoria, debe ser un numero positivo');
    }
    return errores;
}


class LineaPedido {
    constructor (data) {
        const errores = validarDataLineaPedido(data);
        if (errores.length > 0) {
            throw new Error(`Errores de validacion: ${errores.join(', ')}`);
        }
        this.cantidad = data.cantidad;
        this.producto = data.producto;
    }

    toJSON(){
        return{
            idProducto: this.producto.id,
            cantidad: this.cantidad,
            nombreProducto: this.producto.getNombre(),
            precioUnitario: this.producto.getPrecio()
        }
    }
    getSubTotal() {
        return this.cantidad * this.precioUnitario;
    }
}

module.exports = LineaPedido;
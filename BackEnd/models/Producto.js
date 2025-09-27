const Categoria = require('./Categoria');

const validarDataProducto = (data) => {
    const errores = [];

    if (!data || typeof data !== 'object') {
        errores.push('Se requieren los datos del producto');
        return errores;
    }

    if (!data.nombre) {
        errores.push('El nombre es obligatorio');
    }

    if (data.disponible != undefined && typeof data.disponible !== 'boolean') {
        errores.push('El campo disponible debe ser booleano');
    }

    if (data.categoria && !(data.categoria instanceof Categoria)) {
        errores.push('La categoría debe ser una instancia de la clase Categoria');
    }
}

class Producto {
    constructor(data) {
        const errores = validarDataProducto(data);
        if (errores.length > 0) {
            throw new Error(`Errores de validacion: ${errores.join(', ')}`);
        }
        this.nombre = data.nombre;
        this.descripcion = data.descripcion || ''; //si no tiene descripcion, la inicializa en cadena vacia
        this.precio = data.precio || 0; //si no tiene precio, lo inicializa en 0
        this.disponible = data.disponible || false; //si no tiene disponible, lo inicializa en false (no disponible)
        this.categoria = data.categoria || null; //si no tiene categoria, lo inicializa en null

    }

    getNombre() {
        return this.nombre;
    }
    getPrecio() {
        return this.precio;
    }
    isDisponible() {
        return this.disponible;
    }
    getDescripcion() {
        return this.descripcion;
    }

}
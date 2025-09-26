const Producto = require('./Producto');

class Menu {
    constructor (){
        this.productos = [];
    }
    
    agregarProducto(producto) {
        if (producto instanceof Producto) {
            this.productos.push(producto);
        }
    }

    buscarProducto(nombre) {   
        return this.productos.find(prod => prod.getNombre() === nombre);
    }
}
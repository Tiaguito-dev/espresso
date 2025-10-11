const Producto = require('./Producto');

class Menu {
    constructor (){
        this.productos = [];
    }
    
    cargarProductos(productosData) {
        productosData.forEach(producto => {
            const nuevoProducto = new Producto(producto);
            this.productos.push(nuevoProducto)
        });
    }

    agregarProducto(producto) {
        if (producto instanceof Producto) {
            this.productos.push(producto);
        }
    }

    getProductos(){
        return this.productos;
    }

    buscarProductoPorNombre(nombre) {   
        return this.productos.find(prod => prod.getNombre() === nombre);
    }

    buscarProductoPorId(id){
        return this.productos.find(prod => prod.id === id)
    }

    eliminarProductoPorId(id){
        const i = this.productos.findIndex(p => p.id === id);
        if (i !== -1) {
            this.productos.splice(i, 1);
            return true;
        }
        return false; // cuando no lo encuentra
    }
}

module.exports = Menu;
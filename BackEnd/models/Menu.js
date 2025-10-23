const Producto = require('./Producto');
const Categoria = require('./Categoria');

class Menu {
    constructor() {
        this.productos = [];
        this.categorias = [];
    }

    obtenerOCrearCategoria(nombreCategoria) {
        if (!nombreCategoria || typeof nombreCategoria !== 'string') {
            return null;
        }

        const nombreMinusculas = nombreCategoria.trim().toLowerCase();

        const categoriaExistente = this.categorias.find(
            cat => cat.nombre.toLowerCase() === nombreMinusculas
        );

        if (categoriaExistente) {
            return categoriaExistente;

        }

        const nuevaCategoria = new Categoria({ nombre: nombreCategoria.trim() });
        this.categorias.push(nuevaCategoria);
        console.log("categoria creada correctamemte");
        return nuevaCategoria;
    }

    cargarProductos(productosData) {
        productosData.forEach(producto => {
            const nombreCategoria = producto.categoria;

            const categoriaObj = this.obtenerOCrearCategoria(nombreCategoria);

            const dataProducto = {
                ...producto,
                categoria: categoriaObj
            };

            const nuevoProducto = new Producto(dataProducto);
    
            this.productos.push(nuevoProducto)

        });
    }

    agregarProducto(producto) {
        if (producto instanceof Producto) {
            this.productos.push(producto);
            return producto;
        }
        return null;
    }

    getProductos() {
        return this.productos;
    }

<<<<<<< HEAD
    buscarProductoPorNombre(nombre) {
=======
    getCategorias(){
        return this.categorias;
    }

    buscarProductoPorNombre(nombre) {   
>>>>>>> avi-rama
        return this.productos.find(prod => prod.getNombre() === nombre);
    }

    buscarProductoPorId(id) {
        return this.productos.find(prod => prod.id === id)
    }

    eliminarProductoPorId(id) {
        const i = this.productos.findIndex(p => p.id === id);
        if (i !== -1) {
            this.productos.splice(i, 1);
            return true;
        }
        return false; // cuando no lo encuentra
    }
}

module.exports = Menu;
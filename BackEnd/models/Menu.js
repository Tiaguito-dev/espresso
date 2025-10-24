const Producto = require('./Producto');
const Categoria = require('./Categoria');
const ProductoBD = require('../repositories/ProductoBD');
const CategoriaBD = require('../repositories/CategoriaBD');

class Menu {
    constructor() {

    }

    async convertirProductoBD(productos) {
        if (!productos || productos.length === 0) {
            return [];
        }

        const categorias = await CategoriaBD.obtenerCategorias();
        // LO HACE BIEN console.log('CATEGORIAS EN MENU:', categorias);
        const recorroCategorias = new Map();
        categorias.forEach(cat => {
            recorroCategorias.set(cat.id_categoria, new Categoria(cat));
            // LO HACE BIEN console.log('Mapeando categoria:', cat);
            // LO HACE BIEN console.log('IMPRIMO EL TIPO DEL id:', cat.id_categoria, typeof cat.id_categoria);
        })

        return productos.map(prod => {
            const categoriaObj = recorroCategorias.get(prod.id_categoria);
            // LO HACE BIEN console.log('PRODUCTO EN MENU:', prod);
            // LO HACE BIEN console.log('CATEGORIA DEL PRODUCTO:', categoriaObj);
            return new Producto({
                ...prod,
                disponible: prod.disponible,
                categoria: categoriaObj
            });
        });
    }

    async obtenerOCrearCategoria(nombreCategoria) {
        try {
            const id = await CategoriaBD.obtenerIdCategoriaPorNombre(nombreCategoria);
            return id;
        } catch (error) {
            console.log('Categoria no encontrada, creando:', nombreCategoria);
            await CategoriaBD.crearCategoria(nombreCategoria);
            return await CategoriaBD.obtenerIdCategoriaPorNombre(nombreCategoria);
        }
    }


    /*   cargarProductos(productosData) {
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
   */
    async agregarProducto(datosProducto) {
        const { nombre, categoria: nombreCategoria, descripcion, precio, disponible } = datosProducto;

        const id_categoria = await this.obtenerOCrearCategoria(nombreCategoria);

        const ultimoCodigo = await ProductoBD.obtenerUltimoCodigo();

        const id = (ultimoCodigo && ultimoCodigo.max) ? ultimoCodigo.max + 1 : 1;

        const categoriaObj = new Categoria({ nombre: nombreCategoria });
        try {
            new Producto({
                ...datosProducto,
                id: id,
                categoria: categoriaObj
            });
        } catch (error) {
            throw new Error(`Datos de producto inváidos: ${error.message}`);
        }
        const datosBD = {
            id: id,
            precio,
            nombre,
            descripcion,
            id_categoria,
        }

        await ProductoBD.crearProducto(datosBD);

        return new Producto({
            id: id,
            nombre,
            descripcion,
            precio,
            disponible,
            categoria: categoriaObj
        });
    }

    async getProductos() {
        const productos = await ProductoBD.obtenerProductos();
        // LO HACE BIEN console.log('PRODUCTOS EN MENU:', productos);
        return this.convertirProductoBD(productos);
    }

    async getCategorias() {
        const categorias = await CategoriaBD.obtenerCategorias();
        return categorias.map(cat => new Categoria(cat));
    }

    /*    buscarProductoPorNombre(nombre) {
            return this.productos.find(prod => prod.getNombre() === nombre);
        }
    */
    async buscarProductoPorId(id) {
        const producto = await ProductoBD.obtenerProductoPorId(id);
        if (!producto) {
            return null;
        }
        const productoObj = await this.convertirProductoBD([producto]);
        return productoObj[0];
    }

    async eliminarProductoPorId(id) {
        await ProductoBD.eliminarProducto(id);
        return true;
    }

    async modificarProducto(id, datosModificados) {
        const { precio, nombre, descripcion, id_categoria } = datosModificados;
        //validaciones

        const productoActualBD = await ProductoBD.obtenerProductoPorId(id);
        if (!productoActualBD) {
            throw new Error('Producto no encontrado');
        }
        if (datosModificados.precio !== undefined && typeof datosModificados.precio !== 'number') {
            throw new Error('El precio debe ser un número.');
        }
        if (datosModificados.nombre !== undefined && (typeof datosModificados.nombre !== 'string' || datosModificados.nombre.trim() === '')) {
            throw new Error('El nombre debe ser un texto no vacío.');
        }

        let idCategoria = productoActualBD.id_categoria;
        if (datosModificados.categoria) {
            idCategoria = await this.obtenerOCrearCategoria(datosModificados.categoria);
        }

        await ProductoBD.modificarProducto(id, datosModificados);
        return this.buscarProductoPorId(id);
    }
}

module.exports = Menu;
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
                id: prod.id,
                nombre: prod.nombre,
                precio: prod.precio,
                descripcion: prod.descripcion,
                disponible: prod.disponible,
                categoria: categoriaObj || null
            });
        });
    }

    async obtenerOCrearCategoria(nombreCategoria) {
        let id = await CategoriaBD.obtenerIdCategoriaPorNombre(nombreCategoria);
        if (!id) {
            await CategoriaBD.crearCategoria(nombreCategoria);
            id = await CategoriaBD.obtenerIdCategoriaPorNombre(nombreCategoria);
        }
        return id;
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
        console.log('datos recibidos', datosProducto)
        const { nombre, categoria: nombreCategoria, descripcion, precio, disponible } = datosProducto;

        const existeProducto = await ProductoBD.existeNombreProducto(nombre);
        if (existeProducto) {
            throw new Error(`Ya existe producto con ese nombre`);
        }

        const categoria = await this.obtenerOCrearCategoria(nombreCategoria);

        const ultimoCodigo = await ProductoBD.obtenerUltimoCodigo();
        console.log('El ultimo id:', ultimoCodigo);
        const id = ultimoCodigo + 1;
        console.log('el nuevo id:', id);

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
            categoria,
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
        console.log(categorias);
        return categorias.map(cat => new Categoria(cat));
    }

    /*    buscarProductoPorNombre(nombre) {
            return this.productos.find(prod => prod.getNombre() === nombre);
        }
    */
    async buscarProductoPorId(id) {
        const idInt = parseInt(id, 10);
        if (isNaN(idInt)) {
            console.error('Error: buscarProductoPorId recibió un ID inválido:', id);
            return null; // Devuelve null si el ID no es un número
        }
        const producto = await ProductoBD.obtenerProductoPorId(idInt);
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
        const idInt = parseInt(id, 10);
        if (isNaN(idInt)) {
            throw new Error('ID de producto inválido');
        }

        const productoActualBD = await ProductoBD.obtenerProductoPorId(idInt);

        if (!productoActualBD) {
            throw new Error('Producto no encontrado');
        }
        if (datosModificados.precio !== undefined && typeof datosModificados.precio !== 'number') {
            throw new Error('El precio debe ser un número.');
        }
        if (datosModificados.nombre !== undefined && (typeof datosModificados.nombre !== 'string' || datosModificados.nombre.trim() === '')) {
            throw new Error('El nombre debe ser un texto no vacío.');
        }
        if (descripcion !== undefined && typeof descripcion !== 'string') {
            throw new Error('La descripción debe ser un texto.');
        }
        if (id_categoria !== undefined && typeof id_categoria !== 'number') {
            throw new Error('El id_categoria debe ser un número.');
        }
        if (datosModificados.disponible !== undefined && typeof datosModificados.disponible !== 'boolean') {
            throw new Error('La disponibilidad debe ser un valor booleano (true/false).');
        }

        let idCategoria = productoActualBD.id_categoria;
        const categoriaNueva = datosModificados.categoria;
        if (categoriaNueva) {
            let nombreCategoria = null;
            if (typeof categoriaNueva === 'object' && categoriaNueva.nombre) {
                nombreCategoria = categoriaNueva.nombre;
            } else if (typeof categoriaNueva === 'string') {
                nombreCategoria = categoriaNueva;
            }
            if (nombreCategoria && nombreCategoria.trim() !== '') {
                idCategoria = await this.obtenerOCrearCategoria(nombreCategoria);
            }
        }

        const datosParaBD = {
            precio: datosModificados.precio ?? productoActualBD.precio,
            nombre: datosModificados.nombre ?? productoActualBD.nombre,
            descripcion: datosModificados.descripcion ?? productoActualBD.descripcion,
            id_categoria: idCategoria,
            disponible: datosModificados.disponible ?? productoActualBD.disponible
        };
        console.log('--- 2. MENU (datosParaBD) ---', datosParaBD);
        await ProductoBD.modificarProducto(idInt, datosParaBD);
        return this.buscarProductoPorId(idInt);
    }
}

module.exports = Menu;
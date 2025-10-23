const Menu = require('../models/Menu');
const Producto = require('../models/Producto');
const ProductoBD = require('../repositories/ProductoBD');
const CategoriaBD = require('../repositories/CategoriaBD');
const { json } = require('express');

// Crea la categoría si no existe y retorna
const obtenerOCrearCategoria = async (categoriaNombre) => {
    const existe = menu.existeNombreCategoria(categoriaNombre);
    if (existe) {
        throw new Error('La categoría ya existe');
    }

    try {
        // La agrega a la BD
        await CategoriaBD.crearCategoria(categoriaNombre);
    } catch (error) {
        throw new Error('Error al agregar la categoría a la base de datos: ' + error.message);
    }
    // La agrega al menú en memoria
    const categoriaObj = new Categoria({ nombre: categoriaNombre });
    menu.agregarCategoria(categoriaObj);
    return categoriaObj;
};

const crearProducto = async (dataProducto) => {
    const existe = await ProductoBD.existeNombreProducto(dataProducto.nombre);
    if (existe) {
        throw new Error('El nombre del producto ya existe');
    }

    try {
        // Lo agrega a la BD
        await ProductoBD.crearProducto(dataProducto);
    } catch (error) {
        throw new Error('Error al agregar el producto a la base de datos: ' + error.message);
    }

    // Lo agrega al menú en memoria
    const nuevoProducto = new Producto(dataProducto);
    const productoAgregado = menu.agregarProducto(nuevoProducto);
    return productoAgregado;
};


async function inicializarMenu() {
    // Lo pongo aquí para que se ejecute solo una vez al iniciar el servidor
    const menu = new Menu();
    try {
        const productos = await ProductoBD.obtenerProductos();
        menu.cargarProductos(productos);
        console.log(`${productos.length} productos cargados en el menú`);
    } catch (error) {
        console.error('Error cargando los productos en el Menú:', error);
    }
}

// INICIALIZACIÓN DEL MENÚ UNA SOLA VEZ
inicializarMenu();

exports.obtenerProductos = async (req, res) => {
    try {
        res.json(menu.getProductos());
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

exports.obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await ProductoBD.obtenerProductoPorId(4); // Acá lo unico que hice fue probarlo

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    // ESTO NO VA A FUNCIONAR PORQUE LO DEVUELVE EN RESPUESTA ANTES DE QUE LLEGUE LA CONSULTA
    /*
    res.json(producto);
    console.log('Devolviendo el producto con ID:', id);
    console.log(producto);
    */
};

exports.crearProducto = async (req, res) => {
    const { nombre, descripcion, precio, categoria } = req.body;

    try {
        // Obtiene o crea categoría
        const categoriaObj = await obtenerOCrearCategoria(categoria);

        // Calcula el nuevo código de producto
        const codigoUltimoProducto = await ProductoBD.obtenerUltimoCodigo();

        // Arma los datos del producto
        const datosDeProducto = {
            id: codigoUltimoProducto + 1,
            nombre,
            descripcion,
            precio,
            id_categoria: categoriaObj.id, // <- lo correcto es usar el ID, no el objeto completo
        };

        // Crea el producto (en BD y en memoria)
        const productoAgregado = await crearProducto(datosDeProducto);

        // Responde con éxito
        return res.status(201).json(productoAgregado);

    } catch (error) {
        // Captura cualquier error de las funciones auxiliares
        return res.status(500).json({ message: error.message });
    }
};

// TODO: FALTA ESTO
exports.modificarProducto = (req, res) => {
    const { id } = req.params;
    const datosModificados = req.body;

    const productoParaModificar = menu.buscarProductoPorId(id);

    if (!productoParaModificar) {
        return res.status(404), json({ message: 'Producto para modificar no encontrado' });
    }

    productoParaModificar.nombre = datosModificados.nombre ?? productoParaModificar.nombre;
    productoParaModificar.descripcion = datosModificados.descripcion ?? productoParaModificar.descripcion;
    productoParaModificar.precio = datosModificados.precio ?? productoParaModificar.precio;
    productoParaModificar.disponible = datosModificados.disponible ?? productoParaModificar.disponible;

    res.status(200).json(productoParaModificar);
};

exports.eliminarProducto = (req, res) => {
    const { id } = req.params;
    const exito = menu.eliminarProductoPorId(id);

    if (exito) {
        res.status(200).json({ message: `El producto ${id} fue eliminado exitosamente` });
    } else {
        res.status(404).json({ message: `No fue posible elminar el producto ${id}` });
    }
};

module.exports.menu = menu;
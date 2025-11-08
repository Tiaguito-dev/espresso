// routes/productosRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { verificarToken, verificarPerfil } = require('../middlewares/auth');


//---- RUTAS PUBLICAS ---
// Ruta para obtener todos los productos  GET/
router.get('/', menuController.obtenerProductos);

// Ruta para obtener todas las categorias  GET/categorias  GET/categoria
router.get('/categorias', menuController.obtenerCategorias);
router.get('/categoria', menuController.obtenerCategorias);

// Ruta para obtener un producto por ID  GET/123
router.get('/:id', menuController.obtenerProductoPorId);

// --- RUTAS PRIVADAS ---
// Ruta para crear un nuevo producto  POST/
router.post('/', 
    verificarToken,
    verificarPerfil(['admin']),
    menuController.crearProducto);

// Ruta para actualizar un producto  PUT/123
router.put('/:id', 
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    menuController.modificarProducto);

// ruta para eliminar un producto  DELETE/123
router.delete('/:id', 
    verificarToken,
    verificarPerfil(['admin']),
    menuController.eliminarProducto);

// ruta para modificar el estado de un producto
router.patch('/:id/estado', 
    verificarToken,
    verificarPerfil(['mozo', 'cocinero', 'admin']),
    menuController.modificarEstadoProducto);

module.exports = router;

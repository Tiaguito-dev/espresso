const express = require('express');
const router = express.Router();
const perfilesController = require('../controllers/perfilesController');
const { verificarToken, verificarPerfil } = require('../middlewares/auth');

router.get(
    '/',
    verificarToken,
    verificarPerfil(['admin']),
    perfilesController.obtenerPerfiles
);

module.exports = router;
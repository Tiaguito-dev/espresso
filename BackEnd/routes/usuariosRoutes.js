const express = require('express');
const router = express.Router();


const usuariosController = require('../controllers/usuariosController');

const auth = require('../middlewares/auth');


router.get(
  '/mi-perfil', 
  auth.verificarToken, 
  usuariosController.obtenerMiPerfil
);

module.exports = router;
  const express = require('express');
  const router = express.Router();


  const usuariosController = require('../controllers/usuariosController');
  const autenticacionController = require('../controllers/autenticacionController');
  const auth = require('../middlewares/auth');


  router.get(
    '/mi-perfil', 
    auth.verificarToken, 
    usuariosController.obtenerPerfil
  );

  router.get(
    '/',
    auth.verificarToken,
    auth.verificarPerfil(['admin']),
    usuariosController.obtenerUsuarios
  );

  router.get(
    '/:id',
    auth.verificarToken,
    auth.verificarPerfil(['admin']),
    usuariosController.obtenerUsuarioPorId
  );

  router.put(
    '/:id',
    auth.verificarToken,
    auth.verificarPerfil(['admin']),
    usuariosController.actualizarUsuario
  );

  
    router.post(
      '/',
      auth.verificarToken,
      auth.verificarPerfil(['admin']),
      autenticacionController.registrar
    );
  module.exports = router;
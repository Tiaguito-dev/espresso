const express = require('express');
const router = express.Router();
const autenticacionController = require('../controllers/autenticacionController');

router.post('/registrar', autenticacionController.registrar);
router.post('/login', autenticacionController.login);

module.exports = router;
const administradorPerfiles = require('../models/AdministradorPerfiles.js');

exports.obtenerPerfiles = async (req, res) => {
    try {
        const perfiles = await administradorPerfiles.obtenerPerfiles();
        res.status(200).json(perfiles);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor al obtener perfiles', error: error.message });
    }
};
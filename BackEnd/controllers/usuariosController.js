const AdministradorUsuarios = require('../models/AdministradorUsuarios.js');
const administradorUsuarios = new AdministradorUsuarios();

exports.obtenerPerfil = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const usuario = await administradorUsuarios.buscarPorId(usuarioId);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json({ perfil: usuario.perfil });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await administradorUsuarios.obtenerTodosLosUsuarios();
        res.status(200).json({ usuarios: usuarios });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }  
};
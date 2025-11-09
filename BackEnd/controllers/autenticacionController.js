const AdministradorUsuarios = require('../models/AdministradorUsuarios.js');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'clave';

const administradorUsuarios = new AdministradorUsuarios();

exports.registrar = async (req, res) => {
    try {
        const { nombre, correo, contraseña, perfil } = req.body;

        if (!nombre || !correo || !contraseña || !perfil) {
            return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
        }
        const nuevoUsuario = await administradorUsuarios.registrarUsuario({
            nombre,
            correo,
            contraseña,
            perfil
        });
        res.status(201).json({ mensaje: 'Usuario registrado', usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        if (!correo || !contraseña) {
            return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
        }

        const usuario = await administradorUsuarios.buscarPorCorreo(correo);
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const contraseñaValida = await usuario.compararContraseña(contraseña);
        if (!contraseñaValida) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
        const token = jwt.sign({
            codigo: usuario.codigo,
            nombre: usuario.nombre,
            correo: usuario.correo,
            perfilCodigo: usuario.perfil.codigo,
            perfilNombre: usuario.perfil.nombre
        },
            SECRET_KEY, { expiresIn: '4h' }
        );
        res.status(200).json({
            mensaje: 'Login exitoso',
            token: token,
            nombreUsuario: usuario.nombre,
            perfil: usuario.perfil.nombre // Solo el nombre del perfil
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message});
    }
}

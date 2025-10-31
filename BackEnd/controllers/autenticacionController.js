const AdministradorUsuarios = require('../models/AdministradorUsuarios.js');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'clave'; 

const administradorUsuarios = new AdministradorUsuarios();

exports.registrar = async (req, res) => {
    try {
        const { nombre, email, contraseña, nombrePerfil } = req.body;

        if (!nombre || !email || !contraseña || !nombrePerfil) {
            return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
        }
        const nuevoUsuario = await administradorUsuarios.registrarUsuario({
            nombre,
            email,
            contraseña,
            nombrePerfil
        });
        res.status(201).json({ mensaje: 'Usuario registrado', usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, contraseña } = req.body;

        if (!email || !contraseña) {
            return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
        }

        const usuario = await administradorUsuarios.buscarPorEmail(email);
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const contraseñaValida = await usuario.compararContraseña(contraseña);
        if (!contraseñaValida) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ 
            id: usuario.id, 
            nombre: usuario.nombre, 
            email: usuario.email,
            perfil: usuario.perfil
            },
            SECRET_KEY, { expiresIn: '4h' }
        );
        res.status(200).json({
        message: 'Login exitoso',
        token: token,
        usuario: usuario });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
}
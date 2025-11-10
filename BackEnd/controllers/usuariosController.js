const AdministradorUsuarios = require('../models/AdministradorUsuarios.js');
const administradorUsuarios = new AdministradorUsuarios();

exports.obtenerPerfil = async (req, res) => {
    try {
        const usuarioId = req.usuario.codigo;
        const usuario = await administradorUsuarios.buscarPorCodigo(usuarioId);
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
        const usuarios = await administradorUsuarios.obtenerTodosConPerfil();
        res.status(200).json({ usuarios: usuarios });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }  
};

exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        const codigoUsuario = parseInt(req.params.id, 10);

        if (isNaN(codigoUsuario)) {
            return res.status(400).json({ mensaje: 'El ID del usuario debe ser un número' });
        }

        const usuario = await administradorUsuarios.buscarPorCodigo(codigoUsuario);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

exports.actualizarUsuario = async (req, res) => {
    try {
        const codigoUsuario = parseInt(req.params.id, 10);
        const datosNuevos = req.body;

        if (isNaN(codigoUsuario)) {
            return res.status(400).json({ mensaje: 'El ID del usuario debe ser un número' });
        }
        const usuarioActualizado = await administradorUsuarios.actualizarUsuario(codigoUsuario, datosNuevos);
        res.status(200).json({
            mensaje: 'Usuario actualizado correctamente',
            usuario: usuarioActualizado
        });

    } catch (error) {
        if (error.message.includes('encontrado') || error.message.includes('registrado')) {
            return res.status(404).json({ mensaje: error.message });
        }
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

exports.obtenerPedidoPorId = async (req, res) => {
    try {
        const nroPedido = parseInt(req.params.id, 10);

        if (isNaN(nroPedido)) {
            return res.status(400).json({ message: 'El ID del pedido debe ser un número' });
        }

        const pedido = await administradorPedidos.buscarPedidoPorNumero(nroPedido);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};
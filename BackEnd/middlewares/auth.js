// middleware/auth.js
const jwt = require('jsonwebtoken');
// Esto puede ser cualquiera
const SECRET_KEY = 'clave';

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensaje: 'No se proporcionó token' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensaje: 'Token malformado' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        // Setea req.user
        req.usuario = {
            codigo: decoded.codigo,
            nombre: decoded.nombre,
            correo: decoded.correo,
            perfilNombre: decoded.perfilNombre
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ mensaje: 'Token expirado' });
        }
        return res.status(401).json({ mensaje: 'Token inválido' });
    }
};

// Middleware simple para verificar perfil
const verificarPerfil = (perfilesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ mensaje: 'No autenticado' });
        }

        // Utiliza el req.user que antes había seteado la otra función
        if (!perfilesPermitidos.includes(req.usuario.perfilNombre)) {
            return res.status(403).json({
                mensaje: `Acceso denegado. Perfil requerido: ${perfilesPermitidos.join(' o ')}`
            });
        }

        next();
    };
};

module.exports = { verificarToken, verificarPerfil };


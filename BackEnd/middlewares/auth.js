const jwt = require('jsonwebtoken');
const SECRET_KEY = 'clave';

exports.verificarToken = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;    
        if(!authHeader){
            return res.status(401).json({mensaje: 'Acceso denegado. Se requiere token.'});
        }
        const token = authHeader.split(' ')[1];

        if(!token){
            return res.status(401).json({mensaje: 'Acceso denegado. Token inválido.'});
        }

        const payload = jwt.verify(token, SECRET_KEY);
        req.usuario = payload;
        next();
    } catch(error){
        return res.status(401).json({mensaje: 'Acceso denegado. Token inválido o expirado.'});
    }
};

exports.verificarPermiso = (permiso) => {
    return (req, res, next) => {
        const permisosUsuario = req.usuario.perfil ? req.usuario.perfil.permisos : [];
        if (!permisosUsuario.includes(permiso)) {
            return res.status(403).json({ mensaje: 'Acceso denegado. Permiso insuficiente.' });
        }
        next();
    };
}   



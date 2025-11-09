const Gateway = require('../DB/Gateway');

// === SECCIÓN DE QUERYS ===
const selectUsuarios = `
    SELECT 
        usuario.codigo, 
        usuario.nombre, 
        usuario.correo, 
        usuario.contrasenia as contraseñaHash,
        perfil.codigo as perfil_codigo,
        perfil.nombre as perfil_nombre
    FROM usuario 
    JOIN perfil ON usuario.id_perfil = perfil.id_perfil
`;
const selectUsuarioPorCodigo = `
    SELECT 
        usuario.codigo, 
        usuario.nombre, 
        usuario.correo, 
        usuario.contrasenia as contraseñaHash,
        perfil.codigo as perfil_codigo,
        perfil.nombre as perfil_nombre
    FROM usuario 
    JOIN perfil ON usuario.id_perfil = perfil.id_perfil 
    WHERE usuario.codigo = $1
`;
// Ahora también tiene JOIN
const selectUsuarioPorCorreo = `
    SELECT 
        usuario.codigo, 
        usuario.nombre, 
        usuario.correo, 
        usuario.contrasenia as contraseñaHash,
        perfil.codigo as perfil_codigo,
        perfil.nombre as perfil_nombre
    FROM usuario 
    JOIN perfil ON usuario.id_perfil = perfil.id_perfil 
    WHERE usuario.correo = $1
`;
//  Cambié nombre de columna y subquery más clara
const insertUsuario = `
    INSERT INTO usuario (codigo, nombre, correo, contrasenia, id_perfil) 
    VALUES ($1, $2, $3, $4, (SELECT id_perfil FROM perfil WHERE codigo = $5))
`;
const selectUltimoCodigo = 'SELECT MAX(codigo) FROM usuario';
const deleteUsuarioPorCodigo = 'DELETE FROM usuario WHERE codigo = $1';
// CORREGIDO: Mantener consistencia con UPDATE
const updateUsuarioPorCodigo = `
    UPDATE usuario 
    SET nombre = $2, correo = $3, contrasenia = $4, 
        id_perfil = (SELECT id_perfil FROM perfil WHERE codigo = $5)
    WHERE codigo = $1
`;

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES ===

exports.obtenerUsuarios = async () => {
    try {
        const usuarios = await Gateway.ejecutarQuery(selectUsuarios);
        return usuarios || [];
    } catch (error) {
        throw new Error('Error al obtener usuarios desde la base de datos: ' + error.message);
    }
};

exports.obtenerUsuarioPorCodigo = async (codigo) => {
    try {
        const usuarios = await Gateway.ejecutarQuery({
            text: selectUsuarioPorCodigo,
            values: [codigo]
        });
        return usuarios[0] || null; // Retornar el primer usuario encontrado
    } catch (error) {
        throw new Error(`Error al obtener usuario ${codigo} desde la base de datos: ${error.message}`);
    }
};

exports.obtenerUsuarioPorCorreo = async (correo) => {
    try {
        const usuarios = await Gateway.ejecutarQuery({
            text: selectUsuarioPorCorreo,
            values: [correo]
        });
        return usuarios[0] || null; // Retornar el primer usuario encontrado
    } catch (error) {
        throw new Error(`Error al obtener usuario con correo ${correo} desde la base de datos: ${error.message}`);
    }
};

exports.crearUsuario = async (datosDeUsuario) => {
    const { codigo, nombre, correo, contraseñaHash, codigoPerfil } = datosDeUsuario;

    try {
        await Gateway.ejecutarQuery({
            text: insertUsuario,
            values: [codigo, nombre, correo, contraseñaHash, codigoPerfil]
        });
        return {
            success: true,
            message: `El usuario ${nombre} se creó correctamente.`
        };
    } catch (error) {
        // Detectar error de correo duplicado
        if (error.code === '23505') { // Código de error de PostgreSQL para UNIQUE violation
            throw new Error('El correo ya está registrado');
        }
        throw new Error('Error al crear un usuario desde la base de datos: ' + error.message);
    }
};

exports.eliminarUsuario = async (codigo) => {
    try {
        await Gateway.ejecutarQuery({
            text: deleteUsuarioPorCodigo,
            values: [codigo]
        });
        return {
            success: true,
            message: `El usuario ${codigo} se eliminó correctamente.`
        };
    } catch (error) {
        throw new Error(`Error al eliminar el usuario ${codigo} desde la base de datos: ${error.message}`);
    }
};

exports.obtenerUltimoCodigo = async () => {
    try {
        const resultado = await Gateway.ejecutarQuery(selectUltimoCodigo);
        return resultado[0]?.max || 0; // Retornar el último código o 0 si no hay usuarios
    } catch (error) {
        throw new Error('Error al obtener el último código de usuario desde la base de datos: ' + error.message);
    }
};

exports.modificarUsuario = async (codigo, datosActualizados) => {
    const { nombre, correo, contraseñaHash, codigoPerfil } = datosActualizados;

    try {
        await Gateway.ejecutarQuery({
            text: updateUsuarioPorCodigo,
            values: [codigo, nombre, correo, contraseñaHash, codigoPerfil]
        });
        return {
            success: true,
            message: `El usuario ${codigo} se modificó correctamente.`
        };
    } catch (error) {
        throw new Error(`Error al modificar el usuario ${codigo} desde la base de datos: ${error.message}`);
    }
};

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES DE VALIDACIÓN ===

exports.existeCorreo = async (correo) => {
    try {
        const usuarios = await Gateway.ejecutarQuery({
            text: selectUsuarioPorCorreo,
            values: [correo]
        });
        return usuarios && usuarios.length > 0;
    } catch (error) {
        throw new Error(`Error al validar correo ${correo} desde la base de datos: ${error.message}`);
    }
};

exports.obtenerTodosLosUsuarios = async () => {
    const query = `
        SELECT u.codigo, u.nombre, u.correo, u.contrasenia as contraseniaHash,
               p.codigo AS perfil_codigo, p.nombre AS perfil_nombre
        FROM usuario u
        JOIN perfil p ON u.id_perfil = p.codigo
    `;
    try {
        const usuarios = await Gateway.ejecutarQuery(query);
        return usuarios; // Array de usuarios
    } catch (error) {
        throw new Error("Error al obtener todos los usuarios: " + error.message);
    }
};
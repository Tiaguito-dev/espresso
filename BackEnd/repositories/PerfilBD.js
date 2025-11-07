const Gateway = require('../DB/Gateway');

// === SECCIÓN DE QUERYS ===
const selectPerfiles = 'SELECT * FROM perfil';
const selectPerfilPorCodigo = 'SELECT * FROM perfil WHERE codigo = $1';
const selectPerfilPorNombre = 'SELECT * FROM perfil WHERE nombre = $1';
const insertPerfil = 'INSERT INTO perfil (codigo, nombre) VALUES ($1, $2)';
const selectUltimoCodigo = 'SELECT MAX(codigo) FROM perfil';
const deletePerfilPorCodigo = 'DELETE FROM perfil WHERE codigo = $1';
const updatePerfilPorCodigo = 'UPDATE perfil SET nombre = $2 WHERE codigo = $1';

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES ===

exports.obtenerPerfiles = async () => {
    try {
        const perfiles = await Gateway.ejecutarQuery(selectPerfiles);
        return perfiles || [];
    } catch (error) {
        throw new Error('Error al obtener perfiles desde la base de datos: ' + error.message);
    }
};

exports.obtenerPerfilPorCodigo = async (codigo) => {
    try {
        const perfiles = await Gateway.ejecutarQuery({
            text: selectPerfilPorCodigo,
            values: [codigo]
        });
        return perfiles[0] || null; // Retornar el primer perfil encontrado
    } catch (error) {
        throw new Error(`Error al obtener perfil ${codigo} desde la base de datos: ${error.message}`);
    }
};

exports.obtenerPerfilPorNombre = async (nombre) => {
    try {
        const perfiles = await Gateway.ejecutarQuery({
            text: selectPerfilPorNombre,
            values: [nombre]
        });
        return perfiles[0] || null; // Retornar el primer perfil encontrado
    } catch (error) {
        throw new Error(`Error al obtener perfil con nombre ${nombre} desde la base de datos: ${error.message}`);
    }
};

exports.crearPerfil = async (datosDePerfil) => {
    const { codigo, nombre } = datosDePerfil;

    try {
        await Gateway.ejecutarQuery({
            text: insertPerfil,
            values: [codigo, nombre]
        });
        return {
            success: true,
            message: `El perfil ${nombre} se creó correctamente.`
        };
    } catch (error) {
        // Detectar error de nombre duplicado
        if (error.code === '23505') { // Código de error de PostgreSQL para UNIQUE violation
            throw new Error('El nombre de perfil ya existe');
        }
        throw new Error('Error al crear un perfil desde la base de datos: ' + error.message);
    }
};

exports.eliminarPerfil = async (codigo) => {
    try {
        await Gateway.ejecutarQuery({
            text: deletePerfilPorCodigo,
            values: [codigo]
        });
        return {
            success: true,
            message: `El perfil ${codigo} se eliminó correctamente.`
        };
    } catch (error) {
        throw new Error(`Error al eliminar el perfil ${codigo} desde la base de datos: ${error.message}`);
    }
};

exports.obtenerUltimoCodigo = async () => {
    try {
        const resultado = await Gateway.ejecutarQuery(selectUltimoCodigo);
        return resultado[0]?.max || 0; // Retornar el último código o 0 si no hay perfiles
    } catch (error) {
        throw new Error('Error al obtener el último código de perfil desde la base de datos: ' + error.message);
    }
};

exports.modificarPerfil = async (codigo, datosActualizados) => {
    const { nombre } = datosActualizados;

    try {
        await Gateway.ejecutarQuery({
            text: updatePerfilPorCodigo,
            values: [codigo, nombre]
        });
        return {
            success: true,
            message: `El perfil ${codigo} se modificó correctamente.`
        };
    } catch (error) {
        throw new Error(`Error al modificar el perfil ${codigo} desde la base de datos: ${error.message}`);
    }
};

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES DE VALIDACIÓN ===

exports.existeNombrePerfil = async (nombre) => {
    try {
        const perfiles = await Gateway.ejecutarQuery({
            text: selectPerfilPorNombre,
            values: [nombre]
        });
        return perfiles && perfiles.length > 0;
    } catch (error) {
        throw new Error(`Error al validar perfil ${nombre} desde la base de datos: ${error.message}`);
    }
};
const Gateway = require('../DB/Gateway');

// === SECCIÓN DE QUERYS ===
const selectMesas = 'SELECT * FROM mesa';
const insertMesa = 'INSERT INTO mesa (nro_mesa) VALUES ($1)';
const selectUltimoCodigo = 'SELECT MAX(nro_mesa) FROM mesa';
const deleteMesaPorId = 'DELETE FROM mesa WHERE nro_mesa = $1';
const updateMesaPorId = 'UPDATE mesa SET estado_mesa = $2 WHERE nro_mesa = $1';
const selectMesaPorNumero = 'SELECT * FROM mesa WHERE nro_mesa = $1';

// === SECCIÓN DE EJECUCIÓN DE FUNCIONES ===

exports.obtenerMesas = async () => {
    try {
        const mesas = await Gateway.ejecutarQuery(selectMesas);
        return mesas;
    } catch (error) {
        throw new Error('Error al obtener mesas desde la base de datos: ' + error.message);
    }
};

exports.obtenerMesaPorNumero = async (nroMesa) => {
    try {
        const mesas = await Gateway.ejecutarQuery({ text: selectMesaPorNumero, values: [nroMesa] });
        return mesas[0];
    } catch (error) {
        throw new Error(`Error al obtener mesa ${nroMesa} desde la base de datos: ${error.message}`);
    }
};

exports.crearMesa = async (nroMesa) => {
    // estado_mesa no se pasa porque en la BD tiene default 'disponible'

    try {
        await Gateway.ejecutarQuery({ text: insertMesa, values: [nroMesa] });
        return {
            success: true,
            message: `La mesa ${nroMesa} se creó correctamente.`
        };
    } catch (error) {
        throw new Error('Error al crear una mesa en la base de datos: ' + error.message);
    }
};

exports.eliminarMesa = async (nroMesa) => {
    try {
        await Gateway.ejecutarQuery({ text: deleteMesaPorId, values: [nroMesa] });
        return {
            success: true,
            message: `La mesa ${nroMesa} se eliminó correctamente.`
        };
    } catch (error) {
        throw new Error(`Error al eliminar la mesa ${nroMesa} desde la base de datos: ${error.message}`);
    }
};

exports.obtenerUltimoNumeroMesa = async () => {
    try {
        const resultado = await Gateway.ejecutarQuery(selectUltimoCodigo);
        return resultado[0].max; // Retornar el último número de mesa
    } catch (error) {
        throw new Error('Error al obtener el último número de mesa desde la base de datos: ' + error.message);
    }
};

exports.modificarEstadoMesa = async (datos) => {
    const { nroMesa, estadoMesa } = datos;

    try {
        await Gateway.ejecutarQuery({ text: updateMesaPorId, values: [nroMesa, estadoMesa] });
        return {
            success: true,
            message: `La mesa ${nroMesa} se modificó correctamente.`
        };
    } catch (error) {
        throw new Error(`Error al modificar la mesa ${nroMesa} desde la base de datos: ${error.message}`);
    }
};

// === SECCIÓN DE VALIDACIÓN ===
// (por si el número de mesa debe ser único)
exports.existeNumeroMesa = async (nroMesa) => {
    try {
        const mesas = await Gateway.ejecutarQuery({ text: selectMesaPorNumero, values: [nroMesa] });
        return mesas.length > 0; // true si ya existe
    } catch (error) {
        throw new Error(`Error al verificar número de mesa ${nroMesa}: ${error.message}`);
    }
};
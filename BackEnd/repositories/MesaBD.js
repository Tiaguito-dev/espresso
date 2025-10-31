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
        const result = await Gateway.ejecutarQuery(selectMesas);
        // 🛑 CORRECCIÓN CLAVE: Devolver 'result.rows' (el array de mesas), no el objeto 'result'.
        // Añadí '|| []' por seguridad.
        return result.rows || []; 
    } catch (error) {
        // ⚠️ El error es lanzado para que el AdministradorMesas lo capture.
        throw new Error('Error al obtener mesas desde la base de datos: ' + error.message);
    }
};
exports.obtenerMesaPorNumero = async (nroMesa) => {
    try {
        // Asegúrate de que estás pasando nroMesa como valor
        const result = await Gateway.ejecutarQuery({ 
            text: selectMesaPorNumero, 
            values: [nroMesa] // El valor del nroMesa es lo que se pasa a $1
        }); 
        
        // 🛑 CORRECCIÓN CLAVE: Acceder de forma segura a la primera fila o null
        return result?.rows?.[0] || null; 
        
    } catch (error) {
        // Si hay un error de sintaxis en la query, aparecerá aquí.
        throw new Error(`Error de BD al obtener mesa ${nroMesa}: ${error.message}`);
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
        return resultado[0]?.max || 0; // Retornar el último número de mesa
    } catch (error) {
        throw new Error('Error al obtener el último número de mesa desde la base de datos: ' + error.message);
    }
};

exports.modificarEstadoMesa = async (nroMesa, estadoMesa) => { // Cambié la firma para recibir nroMesa y estadoMesa directamente
    try {
        // ...
        await Gateway.ejecutarQuery({ text: updateMesaPorId, values: [nroMesa, estadoMesa] });
        // ...
    } catch (error) {
        // ...
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
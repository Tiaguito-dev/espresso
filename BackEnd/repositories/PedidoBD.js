// 📄 BackEnd/repositories/PedidoBD.js

// 🎯 Asegúrate de que esta ruta sea correcta para tu archivo db.js
// Asumo que db.js está un nivel arriba del repositorio.
const { pool, query } = require('../config/db'); 

// ------------------------------------------------------------------
// QUERIES - Define tus sentencias SQL (Ajusta los nombres de tabla y columna)
// ------------------------------------------------------------------

// ⚠️ Asegúrate de que esta SELECT traiga todos los campos necesarios
const SELECT_PEDIDOS_HOY = `
    SELECT * FROM pedidos 
    WHERE DATE(fecha_registro) = CURRENT_DATE 
    ORDER BY nro_pedido DESC
`;

const SELECT_ULTIMO_NRO = `
    SELECT nro_pedido 
    FROM pedidos 
    ORDER BY nro_pedido DESC 
    LIMIT 1
`;

const INSERT_PEDIDO = `
    INSERT INTO pedidos (nro_pedido, fecha_registro, observacion, monto, estado, id_mozo, id_mesa)
    VALUES ($1, $2, $3, $4, 'Pendiente', $5, $6)
`;

const INSERT_LINEA_PEDIDO = `
    INSERT INTO lineas_pedido (id_pedido, id_producto, cantidad, monto, nombre_producto)
    VALUES ($1, $2, $3, $4, $5)
`;

const UPDATE_ESTADO_PEDIDO = `
    UPDATE pedidos 
    SET estado = $2 
    WHERE nro_pedido = $1
`;

// ------------------------------------------------------------------
// EXPORTS - Funciones de Repositorio
// ------------------------------------------------------------------

exports.obtenerPedidosHoy = async () => {
    try {
        const result = await query(SELECT_PEDIDOS_HOY);
        return result.rows;
    } catch (error) {
        throw new Error('Error al obtener pedidos de hoy: ' + error.message);
    }
};

exports.obtenerUltimoNroPedido = async () => {
    try {
        const result = await query(SELECT_ULTIMO_NRO);
        // Si hay un resultado, devuelve el nro_pedido, si no hay, devuelve null/undefined
        return result.rows.length > 0 ? result.rows[0].nro_pedido : 0;
    } catch (error) {
        throw new Error('Error al obtener el último número de pedido: ' + error.message);
    }
};

exports.crearPedido = async (data) => {
    try {
        const values = [
            data.nroPedido, 
            data.fecha, 
            data.observacion, 
            data.monto, 
            data.idMozo, 
            data.idMesa
        ];
        await query(INSERT_PEDIDO, values);
    } catch (error) {
        throw new Error('Error al crear el pedido principal: ' + error.message);
    }
};

exports.crearLineaPedido = async (data) => {
    try {
        const values = [
            data.idPedido, 
            data.idProducto, 
            data.cantidad, 
            data.monto, 
            data.nombreProducto
        ];
        await query(INSERT_LINEA_PEDIDO, values);
    } catch (error) {
        throw new Error('Error al crear la línea de pedido: ' + error.message);
    }
};

exports.modificarEstadoPedido = async (nroPedido, estado) => {
    try {
        await query(UPDATE_ESTADO_PEDIDO, [nroPedido, estado]);
    } catch (error) {
        throw new Error('Error al modificar el estado del pedido: ' + error.message);
    }
};


// ------------------------------------------------------------------
// FUNCIÓN CLAVE CORREGIDA: Obtener Pedido + Líneas (Transacción)
// ------------------------------------------------------------------

/**
 * Obtiene un pedido específico y sus líneas de detalle en una sola operación.
 * @param {number} nro - El número del pedido.
 * @returns {Promise<Object | null>} El objeto del pedido con su array 'lineas', o null si no se encuentra.
 */
exports.obtenerPedidoPorNro = async (nro) => {
    // 🛑 Corrección: Usamos pool.connect() para manejar transacciones y liberar el error 'pool is not defined'
    const client = await pool.connect(); 
    try {
        await client.query('BEGIN'); // Iniciar transacción

        // 1. Obtener el Pedido principal
        const SELECT_PEDIDO_BY_NRO = 'SELECT * FROM pedidos WHERE nro_pedido = $1';
        const pedidoRes = await client.query(SELECT_PEDIDO_BY_NRO, [nro]);
        
        if (pedidoRes.rows.length === 0) {
            await client.query('COMMIT'); // Commit aunque no haya cambios, por seguridad
            return null; 
        }
        
        const pedido = pedidoRes.rows[0];

        // 2. Obtener las Líneas/Detalles del pedido
        // ⚠️ Asumo que el campo de la FK en lineas_pedido es 'id_pedido'
        const SELECT_LINEAS_BY_ID = 'SELECT * FROM lineas_pedido WHERE id_pedido = $1';
        const lineasRes = await client.query(SELECT_LINEAS_BY_ID, [nro]); 
        
        // 3. Combinar y devolver
        pedido.lineas = lineasRes.rows;

        await client.query('COMMIT'); // Finalizar transacción
        return [pedido]; // Devolvemos el pedido en un array, para la consistencia con el Controller
    } catch (e) {
        await client.query('ROLLBACK'); // Deshacer si hay error
        console.error("Error en obtenerPedidoPorNro:", e.message);
        throw new Error('Error de BD al buscar el pedido: ' + e.message);
    } finally {
        client.release(); // Liberar el cliente de la conexión
    }
};
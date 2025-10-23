const pool = require('../config/db');

// esta es función genérica para otras consultas
// Función genérica para queries simples
exports.ejecutarQuery = async (query, params) => {
    const client = await pool.connect();
    try {
        const resultado = await client.query(query, params);
        return resultado.rows;
    } catch (error) {
        console.error('Error en ejecutarQuery:', error);
        throw new Error('Error en ejecutarQuery:', error);
    } finally {
        client.release(); // Esto asegura que la conexión se libere siempre
    }
};

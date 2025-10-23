const pool = require('../config/db');

// esta es función genérica para otras consultas
exports.ejecutarQuery = async (query, params) => {
    const resultado = await pool.query(query, params);
    return resultado.rows;
};

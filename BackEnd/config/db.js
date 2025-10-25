const { Pool } = require('pg');

// Configure the connection pool
const pool = new Pool({
    user: 'postgres.dyzevlhzjbwlwuowophi',
    // Cambia el host al directo (sin pooler)
    host: 'aws-1-sa-east-1.pooler.supabase.com',
    database: 'postgres',
    password: 'espresso',
    port: 6543, // session pool
    ssl: {
        rejectUnauthorized: false
    },
    // Configuración adicional para estabilidad
    max: 15, // Máximo de conexiones en el pool (también lo configué en supa)
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});
    const query = (text, params) => pool.query(text, params);
// Exportar el pool para usarlo en otros modulos
module.exports = {
    pool, // Exporta el objeto pool (necesario para transacciones)
    query // Exporta la función query (necesario para PedidoBD.js)
};
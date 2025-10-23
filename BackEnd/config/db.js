const { Pool } = require('pg');

// Configure the connection pool
const pool = new Pool({
    user: 'postgres.dyzevlhzjbwlwuowophi',
    host: 'aws-1-sa-east-1.pooler.supabase.com',
    database: 'postgres',
    password: 'espresso',
    port: 5432, // Default PostgreSQL port
});

// Exportar el pool para usarlo en otros modulos
module.exports = pool;
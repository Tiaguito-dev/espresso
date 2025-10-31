// 📄 BackEnd/db/Gateway.js

// 🚨 CORRECCIÓN CLAVE: Desestructurar la importación o acceder a la propiedad.
// Como tu 'config/db.js' exporta { pool: instancia_real, query: funcion_query },
// necesitamos extraer 'pool' o 'query'.

// Opción recomendada: Importar el objeto completo para acceder a ambos
const dbExports = require('../config/db');

// Ahora accedemos a la instancia real del Pool (que tiene el método .connect)
const poolInstance = dbExports.pool; 

// Accedemos a la función simplificada de query (si la quieres usar)
const querySimple = dbExports.query; 

// Función genérica para consultas avanzadas (como transacciones)
exports.ejecutarQuery = async (queryText, params) => {
    
    // 1. Si estás pasando un string simple, usa la función simplificada 'querySimple'
    if (typeof queryText === 'string' && !params) {
        // Asume que la función querySimple maneja el pool.query() internamente
        // y devuelve result.rows.
        return await querySimple(queryText);
    }
    
    // 2. Para transacciones o consultas con parámetros que necesitan el cliente:
    const client = await poolInstance.connect(); // ✅ ¡poolInstance ahora sí tiene .connect()!
    try {
        const resultado = await client.query(queryText, params);
        return resultado.rows;
    } catch (error) {
        console.error('Error en ejecutarQuery:', error);
        throw new Error('Error de DB al ejecutar query: ' + error.message);
    } finally {
        client.release();
    }
};
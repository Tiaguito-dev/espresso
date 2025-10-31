// 📄 BackEnd/repositories/PedidoBD.js

// Importar módulo de conexión a BD (Asumimos que está aquí)
const Gateway = require('../DB/Gateway'); 
const query = Gateway.ejecutarQuery; // Usaremos el alias 'query' para simplificar

// === SECCIÓN DE QUERYS ===
const SELECT_PEDIDOS_HOY = `
  SELECT 
    p.id_pedido, 
    p.nro_pedido, 
    p.estado, 
    p.observacion, 
    p.monto, 
    p.fecha_registro,
    m.nro_mesa, 
    u.nombre AS nombre_mozo,
    u.id_usuario AS id_mozo,
    m.id_mesa
  FROM 
    pedido p
  JOIN 
    mesa m ON p.id_mesa = m.id_mesa
  LEFT JOIN 
    usuario u ON p.id_mozo = u.id_usuario
  -- 🛑 CORRECCIÓN: Usar AT TIME ZONE para convertir la marca de tiempo a la zona horaria local 
    -- y luego extraer la fecha para compararla con la fecha actual del servidor Node.
  WHERE DATE(timezone('America/Argentina/Buenos_Aires', p.fecha_registro)) = CURRENT_DATE 
  ORDER BY p.nro_pedido DESC
`;
const selectPedidosFecha = 'SELECT * FROM pedido WHERE date(fecha_registro)= date($1)';
const selectPedidoPorNro = 'SELECT * FROM pedido WHERE nro_pedido = $1'; 
const insertPedido = 'INSERT INTO pedido (nro_pedido, observacion, monto, id_mozo, id_mesa) VALUES ($1, $2, $3, $4, $5)';
const selectUltimoNroPedido = 'SELECT MAX(nro_pedido) FROM pedido';
const updateEstadoPedidoPorId = 'UPDATE pedido SET estado = $2 WHERE nro_pedido = $1';
const insertLineaPedido = 'INSERT INTO linea_pedido (id_pedido, id_producto, cantidad, monto, nombre_producto) VALUES ((SELECT id_pedido FROM pedido WHERE nro_pedido = $1),(SELECT id_producto FROM producto WHERE id = $2), $3, $4, $5);';
const selectLineasPorNroPedido = ("SELECT linea.id_linea_pedido, linea.cantidad, linea.monto, producto.nombre, linea.id_pedido, linea.id_producto FROM pedido JOIN linea_pedido AS linea ON pedido.id_pedido = linea.id_pedido JOIN producto ON linea.id_producto = producto.id_producto WHERE pedido.nro_pedido = $1;");


// ------------------------------------------------------------------
// FUNCIONES DE REPOSITORIO (Usamos 'const' para que sean variables locales)
// ------------------------------------------------------------------

// ✅ Función que faltaba y que conecta con el AdministradorPedidos.getPedidos()
const obtenerPedidosHoy = async () => {
    try {
        // 1. Ejecutar la query y obtener el objeto de resultado COMPLETO de la BD.
        const result = await Gateway.ejecutarQuery(SELECT_PEDIDOS_HOY);
        
        // 🛑 CORRECCIÓN CLAVE: Devolver la propiedad 'rows', que es el ARRAY.
        // Usamos '|| []' para asegurarnos de que siempre devolvemos un array, 
        // aunque 'result' fuera nulo o no tuviera 'rows' (por seguridad).
        return result.rows || []; 
        
    } catch (error) {
        throw new Error('Error de BD al obtener pedidos de hoy: ' + error.message);
    }
};
const obtenerPedidosFecha = async (fecha) => {
    try {
        const pedidos = await query({ text: selectPedidosFecha, values: [fecha] });
        return pedidos;
    } catch (error) {
        throw new Error('Error de BD al obtener pedidos por fecha: ' + error.message);
    }
};
const obtenerPedidoPorNro = async (nroPedido) => {
    try {
        // Usando el alias 'query' o Gateway.ejecutarQuery directamente
        const result = await query({ text: selectPedidoPorNro, values: [nroPedido] }); 
        
        // Asumiendo que 'result' devuelve el objeto completo de la BD
        return result.rows[0] || null; 
    } catch (error) {
        throw new Error(`Error de BD al obtener pedido ${nroPedido}: ${error.message}`);
    }
};
const crearPedido = async (datosDePedido) => {
    const { nroPedido, observacion, monto, idMozo, idMesa } = datosDePedido;
    try {
        await query({ text: insertPedido, values: [nroPedido, observacion, monto, idMozo, idMesa] });
        return { success: true, message: `El pedido ${nroPedido} se creó correctamente.` };
    } catch (error) {
        throw new Error('Error de BD al crear un pedido: ' + error.message);
    }
}

const modificarEstadoPedido = async (nroPedido, nuevoEstado) => {
    try {
        await query({ text: updateEstadoPedidoPorId, values: [nroPedido, nuevoEstado] });
        return { success: true, message: `El estado del pedido ${nroPedido} se actualizó correctamente a "${nuevoEstado}".` };
    } catch (error) {
        throw new Error(`Error de BD al modificar el estado del pedido ${nroPedido}: ${error.message}`);
    }
};

const obtenerUltimoNroPedido = async () => {
    try {
        const resultado = await query(selectUltimoNroPedido);
        // Ajusta la forma de acceder al resultado si es diferente
        return resultado.rows[0]?.max || 0; 
    } catch (error) {
        throw new Error('Error de BD al obtener el último número de pedido: ' + error.message);
    }
};

const crearLineaPedido = async (datosDeLineaPedido) => {
    const { idPedido, idProducto, cantidad, monto, nombreProducto } = datosDeLineaPedido;
    try {
        await query({
            text: insertLineaPedido,
            values: [idPedido, idProducto, cantidad, monto, nombreProducto]
        });
        return { success: true, message: `La línea del pedido ${idPedido} se creó correctamente.` };
    } catch (error) {
        throw new Error('Error de BD al crear la línea de pedido: ' + error.message);
    }
};

const obtenerLineasPorNroPedido = async (nroPedido) => {
    try {
        const lineas = await query({ text: selectLineasPorNroPedido, values: [nroPedido] });
        return lineas || [];
    } catch (error) {
        throw new Error(`Error de BD al obtener líneas del pedido ${nroPedido}: ${error.message}`);
    }
};


// ------------------------------------------------------------------
// EXPORTACIÓN FINAL (Ahora las variables son locales y funcionan)
// ------------------------------------------------------------------

module.exports = {
    obtenerPedidosHoy,
    obtenerPedidosFecha,
    obtenerPedidoPorNro,
    crearPedido,
    modificarEstadoPedido,
    obtenerUltimoNroPedido,
    crearLineaPedido,
    obtenerLineasPorNroPedido
};
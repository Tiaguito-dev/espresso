// 📄 BackEnd/repositories/PedidoBD.js

// Importar módulo de conexión a BD (Asumimos que está aquí)
const Gateway = require('../DB/Gateway'); 
const query = Gateway.ejecutarQuery; // Usaremos el alias 'query' para simplificar

// === SECCIÓN DE QUERYS CORREGIDAS ===
const SELECT_PEDIDOS_HOY = `
 SELECT 
  p.id_pedido, 
  p.nro_pedido, 
  p.estado, 
  p.observacion, 
  p.total AS monto,  
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
 WHERE DATE(timezone('America/Argentina/Buenos_Aires', p.fecha_registro)) = CURRENT_DATE 
 ORDER BY p.nro_pedido DESC
`;
// Asumo que 'pedido' sí tiene la columna 'monto' para el insert. Si no, debería ser 'monto_total'
const insertPedido = 'INSERT INTO pedido (nro_pedido, observacion, monto, id_mozo, id_mesa) VALUES ($1, $2, $3, $4, $5)'; 

// 🔴 CORRECCIÓN: Cambié 'monto' por 'subtotal' en linea_pedido
const insertLineaPedido = 'INSERT INTO linea_pedido (id_pedido, id_producto, cantidad, subtotal, nombre_producto) VALUES ((SELECT id_pedido FROM pedido WHERE nro_pedido = $1),(SELECT id_producto FROM producto WHERE id = $2), $3, $4, $5);';

// El resto de las queries se mantienen igual:
const selectPedidosFecha = 'SELECT * FROM pedido WHERE date(fecha_registro)= date($1)';
const selectPedidoPorNro = 'SELECT * FROM pedido WHERE nro_pedido = $1'; 
const selectUltimoNroPedido = 'SELECT MAX(nro_pedido) FROM pedido';
const updateEstadoPedidoPorId = 'UPDATE pedido SET estado = $2 WHERE nro_pedido = $1';
const selectLineasPorNroPedido = ("SELECT linea.id_linea_pedido, linea.cantidad, linea.subtotal, producto.nombre, linea.id_pedido, linea.id_producto FROM pedido JOIN linea_pedido AS linea ON pedido.id_pedido = linea.id_pedido JOIN producto ON linea.id_producto = producto.id_producto WHERE pedido.nro_pedido = $1;");


// ------------------------------------------------------------------
// FUNCIONES DE REPOSITORIO
// ------------------------------------------------------------------

const obtenerPedidosHoy = async () => {
  try {
    const result = await Gateway.ejecutarQuery(SELECT_PEDIDOS_HOY);
    return result.rows || []; 
    
  } catch (error) {
    // 💡 Este es el mensaje que aparece en el log del backend
    throw new Error('Error de BD al obtener pedidos de hoy: ' + error.message); 
  }
};
const obtenerPedidosFecha = async (fecha) => {
  try {
    const pedidos = await query({ text: selectPedidosFecha, values: [fecha] });
    return pedidos.rows || [];
  } catch (error) {
    throw new Error('Error de BD al obtener pedidos por fecha: ' + error.message);
  }
};
const obtenerPedidoPorNro = async (nroPedido) => {
  try {
    const result = await query({ text: selectPedidoPorNro, values: [nroPedido] }); 
    return result.rows[0] || null; 
  } catch (error) {
    throw new Error(`Error de BD al obtener pedido ${nroPedido}: ${error.message}`);
  }
};
const crearPedido = async (datosDePedido) => {
  // Aquí se usa 'monto', que debe coincidir con el campo de la tabla 'pedido'
    const { nroPedido, observacion, monto, mozo: idMozo, mesa: idMesa } = datosDePedido;
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
    return resultado.rows[0]?.max || 0; 
  } catch (error) {
    throw new Error('Error de BD al obtener el último número de pedido: ' + error.message);
  }
};

const crearLineaPedido = async (datosDeLineaPedido) => {
  // Aquí se usa 'monto', que se mapea a $4 en la query (subtotal)
    const { idPedido: nroPedido, idProducto, cantidad, monto, nombreProducto } = datosDeLineaPedido;
  try {
    await query({
      text: insertLineaPedido,
      values: [nroPedido, idProducto, cantidad, monto, nombreProducto]
    });
    return { success: true, message: `La línea del pedido ${nroPedido} se creó correctamente.` };
  } catch (error) {
    throw new Error('Error de BD al crear la línea de pedido: ' + error.message);
  }
};

const obtenerLineasPorNroPedido = async (nroPedido) => {
  try {
    const lineas = await query({ text: selectLineasPorNroPedido, values: [nroPedido] });
    // 🛑 CORRECCIÓN: Asegurarse de devolver el array 'rows' o un array vacío.
    return lineas.rows || []; 
  } catch (error) {
    throw new Error(`Error de BD al obtener líneas del pedido ${nroPedido}: ${error.message}`);
  }
};


// ------------------------------------------------------------------
// EXPORTACIÓN FINAL
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
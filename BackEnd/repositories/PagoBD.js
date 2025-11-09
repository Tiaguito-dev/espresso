const { text } = require('express');
const Gateway = require('../DB/Gateway');

// === SECCIÓN DE QUERYS ===

const insertPago = `INSERT INTO pago (nro_pago, fecha_pago, id_pedido, metodo, monto) VALUES ($1, $2, $3, $4, $5)`;
const selectUltimoNroPago = 'SELECT MAX(nro_pago) FROM pago';
const selectPagosPorNroPedido = `SELECT p.*, pe.nro_pedido FROM pago p JOIN pedido pe ON p.id_pedido = pe.nro_pedido WHERE pe.nro_pedido = $1`;
const selectPagos = `SELECT p.*, pe.nro_pedido FROM pago p JOIN pedido pe ON p.id_pedido = pe.nro_pedido ORDER BY p.fecha_pago DESC
`;

exports.crearPago = async (data) => {
    const { nroPago, fecha, nroPedido, metodo, monto } = data;

    try {
        await Gateway.ejecutarQuery({
            text: insertPago,
            values: [nroPago, fecha, nroPedido, metodo, monto]
        });
        return{
            success: true,
            message: `El pago ${nroPago} se creó correctamente.`
        };
    } catch(error){
        throw new Error('Error al crear un pago desde la base de datos: ' + error.message);
    }
};

exports.obtenerUltimoNroPago = async () => {
    try{
        const resultado = await Gateway.ejecutarQuery(selectUltimoNroPago);
        return resultado[0]?.max || 0;
    }catch(error){
        throw new Error('Error al obtener el último número de pago: ' + error.message);
    }
};

exports.obtenerPagosPorNroPedido = async (nroPedido) => {
    try {
        const pagos = await Gateway.ejecutarQuery({
            text: selectPagosPorNroPedido,
            values: [nroPedido]
        });
        return pagos || [];
    }catch(error){
        throw new Error(`Error al obtener pagos del pedido ${nroPedido}: ${error.message}`);
    }
};

exports.obtenerPagos = async () => {
    try {
        const pagos = await Gateway.ejecutarQuery(selectPagos);
        return pagos || [];
    } catch (error) {
         throw new Error('Error al obtener todos los pagos desde la base de datos: ' + error.message);
    }
};
const Pago = require('./Pago');
const PagoBD = require('../repositories/PagoBD');
const AdministradorPedidos = require('./AdministradorPedidos');

class AdministradorPagos {
    constructor() {
        this.administradorPedidos = new AdministradorPedidos;
    }  

    async convertirPagoBD(pagosBD){
        const pagosObj = [];
        for (const pago of pagosBD){
            const pedidoObj = await this.administradorPedidos.buscarPedidoPorNumero(pago.nro_pedido);
            if (!pedidoObj){
                console.warn(`El pedido ${pago.nro_pedido} asociado al pago ${pago.nro_pago} no fue encontrado.`);
                continue;
            }

            pagosObj.push(new Pago({
                nroPago: pago.nro_pago,
                fecha: pago.fecha_pago,
                monto: parseFloat(pago.monto),
                metodo: pago.metodo,
                pedido: pedidoObj
            }));
        }
        return pagosObj;
    }


    async crearPago(datosPago){
        const { nroPedido, monto, metodo } = datosPago;

        const pedidoObj = await this.administradorPedidos.buscarPedidoPorNumero(nroPedido);

        if (!pedidoObj){
            throw new Error(`Pedido ${nroPedido} no encontrado`);
        }
        const ultimoNro = await PagoBD.obtenerUltimoNroPago();
        const nroPago = (ultimoNro ? ultimoNro : 0) +1;

        const fecha = datosPago.fecha ? new Date(datosPago.fecha) : new Date();

        const datosNuevoPago = {
            nroPago: nroPago,
            fecha: fecha,
            monto: parseFloat(monto),
            metodo: metodo,
            pedido: pedidoObj
        };

        let nuevoPago;
        try{
            nuevoPago = new Pago(datosNuevoPago);
        }catch(error){
            throw new Error(`Error de validacion: ${error.message}`);
        }

        const datosParaBD = {
            nroPago: nroPago,
            fecha: fecha,
            nroPedido: nroPedido,
            metodo: nuevoPago.getMetodo(),
            monto: nuevoPago.getMonto()
        };

        await PagoBD.crearPago(datosParaBD);

        return nuevoPago;
    }

    async getPagos(){
        const pagosBD = await PagoBD.obtenerPagos();
        if (pagosBD.length === 0) {
            return [];
        }
        return this.convertirPagoBD(pagosBD);
    }


    async getPagosPorPedido(nroPedido){
        const pagosBD = await PagoBD.obtenerPagosPorNroPedido(nroPedido);
        if (pagosBD.length === 0) {
            return [];
        }
        return this.convertirPagoBD(pagosBD);
    }
}

module.exports = AdministradorPagos;


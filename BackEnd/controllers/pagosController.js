const AdministradorPagos = require('../models/AdministradorPagos');
const AdministradorPedidos = require('../models/AdministradorPedidos');
const Pedido = require('../models/Pedido');

const administradorPagos = new AdministradorPagos;
const administradorPedidos = new AdministradorPedidos;

exports.obtenerPagos = async (req, res) => {
    try{
        const pagos = await administradorPagos.getPagos();
        res.json(pagos.map(p => p.toJSON()));
    }catch (error){
        res.status(500).json({ message: 'Error al obtener pagos', error: error.message});
    }
};

exports.crearPago = async (req, res) => {
    try{
        const { nroPedido, monto, fecha, metodo } = req.body;

        const datosPago = req.body;

        const nuevoPago = await administradorPagos.crearPago(datosPago);

        res.status(201).json(nuevoPago.toJSON());

    } catch(error){
        res.status(400).json({ message: error.message });
    }
};

exports.obtenerPagosDePedido = async (req, res) => {
    try {
        const {nroPedido} = req.params;
        const pagos = await administradorPagos.getPagosPorPedido(parseInt(nroPedido));
        res.json(pagos.map(p => p.toJSON()));
    }catch (error){
        res.status(500).json({ message: 'Error al obtener pagos del pedido', error: error.message});
    }
};
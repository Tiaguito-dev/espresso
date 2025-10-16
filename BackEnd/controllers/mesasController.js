const Mesa = require('../models/Mesa');
const Pedido = require('../models/Pedido');
const AdministradorMesas = require('../models/AdministradorMesas');
const Producto = require('../models/Producto');
const { json } = require('express');

const administradorMesas = new AdministradorMesas();

exports.obtenerMesas = (req, res) => {
    res.json(administradorMesas.getMesas());
};

exports.obtenerMesaPorNumero = (req, res) => {
    const { nroMesa } = req.params;
    const mesa = administradorMesas.buscarMesaPorNumero(parseInt(nroMesa));
    if (!mesa) {
        return res.status(404).json({ message: 'Mesa no encontrada'});
    }
    res.json(mesa);
    console.log('Devolviendo la mesa con numero: ', nroMesa);
    console.log(mesa);
};

exports.crearMesa = (req, res) => {
    const { nroMesa, estado } = req.body;

    const mesaExistente = administradorMesas.buscarMesaPorNumero(nroMesa);
    if (mesaExistente){
        console.log(`Mesa con número ${nroMesa} ya existente.`)
        return mesaExistente;
    }

    const datosMesa = {
        nroMesa: nroMesa,
        estadoMesa: estado
    }

    const nuevaMesa = new Mesa(datosMesa);

    const mesaAgregada = administradorMesas.agregarMesa(nuevaMesa);

    res.status(201).json(mesaAgregada);
};

exports.cambiarEstadoMesa = (req, res) => {
    const { nroMesa } = req.params;
    const nuevoEstado = req.body;

    const mesaAModificar = administradorMesas.buscarMesaPorNumero(nroMesa);

    if (!mesaAModificar){
        return res.status(404),json({ message: `Mesa para modificar no encontrada`});
    }

    mesa.cambiarEstadoMesa(nuevoEstado);

    res.status(200).json(mesaAModificar);
}

exports.eliminarMesa = (req, res) => {
    const { nroMesa } = req.params;
    const exito = administradorMesas.eliminarMesaPorNumero(nroMesa);

    if (exito){
        res.status(200).json({ message: `'La mesa ${nroMesa} fue eliminada correctamente.`});
    } else {
        res.status(404).json({message: `No fue posible eliminar la mesa ${nroMesa}`});
    }
}
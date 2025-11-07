const AdministradorMesas = require('../models/AdministradorMesas');

const { json } = require('express');

const administradorMesas = new AdministradorMesas();

exports.obtenerMesas = async (req, res) => {
    try {
        const mesas = await administradorMesas.getMesas();
        res.json(mesas);
    }catch(error){
        res.status(500).json({ message: 'Error al obtener mesas', error: error.message });
    }
};

exports.obtenerMesaPorNumero = async (req, res) => {
    try {
        const { nroMesa } = req.params;
        const mesa =  await administradorMesas.buscarMesaPorNumero(parseInt(nroMesa));
        if (!mesa) {
            return res.status(404).json({ message: 'Mesa no encontrada' });
        }
        res.json(mesa);
    }catch(error){
        res.status(500).json({ message: 'Error al buscar mesa', error: error.message });
    }
};

exports.crearMesa = async (req, res) => {
    try {
        const datosMesa = {
            nroMesa: req.body.nroMesa,
            estadoMesa: req.body.estado
        };

    const nuevaMesa = await administradorMesas.crearMesa(datosMesa);
    res.status(201).json(nuevaMesa);
    }catch(error){
        res.status(400).json({ message: error.message });
    }
};

exports.cambiarEstadoMesa = async (req, res) => {
    try{
        const { nroMesa } = req.params;
        const { estado } = req.body;

        // 🚨 DEBUGGING: Verificar qué datos recibe el servidor
        console.log(`[DEBUG] Recibida petición PUT para mesa ${nroMesa}. Nuevo estado: ${estado}`);

        if (!estado){
            return res.status(400).json({ message: ' Se requiere el nuevo estado de la mesa en el body'});
        }
        
        // El nroMesa viene de req.params como string, lo parseamos a entero:
        const mesaAModificar = await administradorMesas.cambiarEstadoMesa(parseInt(nroMesa), estado); 
        
        res.status(200).json(mesaAModificar);
    }catch(error){
        if (error.message.includes('encontrada')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
}

exports.eliminarMesa = async (req, res) => {
    try {
        const { nroMesa } = req.params;
        await administradorMesas.eliminarMesaPorNumero(parseInt(nroMesa));
        res.status(200).json({ message: `'La mesa ${nroMesa} fue eliminada correctamente.` });
    }catch(error){
            res.status(404).json({ message: `No fue posible eliminar la mesa ${nroMesa}` });
    }
}
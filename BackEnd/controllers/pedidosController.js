const AdministradorPedidos = require('../models/AdministradorPedidos');
const Pedido = require('../models/Pedido');
const LineaPedido = require('../models/LineaPedido');
const Mesa = require('../models/Mesa');

const { menu } = require('./menuController');
const { mesas } = require('./mesasController');

const pedidosIniciales = require('../DB/pedidos.json');

const administradorPedidos = new AdministradorPedidos();
administradorPedidos.cargarPedidos(pedidosIniciales, menu, mesas)

exports.obtenerPedidos = (req, res) => {
    res.json(administradorPedidos.pedidos);
};

exports.crearPedido = (req, res) => {
    try {
        const { mesa, lineas } = req.body;

        const mesaObj = mesas.buscarMesaPorNumero(mesa);

        if (!lineas || !Array.isArray(lineas) || lineas.length === 0){
            throw new Error('Se requiere al menos una inea de pedido');
        }

        const lineasPedidoObj = lineas.map(linea => {
            const productoObj = menu.buscarProductoPorId(linea.idProducto);

            if (!productoObj){
                throw new Error(`Producto con id ${linea.idProducto} no encontrado.`)
            }

            return new LineaPedido({
                producto: productoObj,
                cantidad: linea.cantidad
            })
            
        })

        const datosPedido = {
            nroPedido: Date.now(), //temporal
            fecha: new Date(),
            mesa: mesaObj,
            lineasPedido: lineasPedidoObj,
        };

        const nuevoPedido = new Pedido(datosPedido);

        administradorPedidos.agregarPedido(nuevoPedido);

        res.status(201).json(nuevoPedido);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
}

exports.actualizarPedido = (req, res) => {
    try{
        const { id } = req.params;
        const nroPedido = parseInt(id, 10);
        const { nuevoEstado } = req.body;

        const pedido = administradorPedidos.buscarPedidoPorNumero(nroPedido);
        if (!pedido){
            return res.status(404).json({ message: "Pedido no encontrado."});
        }

        const estadoActual = pedido.getEstadoPedido();
        const estadoActualLower = estadoActual.toLowerCase();
        let estadoFinal = estadoActual;

        if (nuevoEstado){
            const nuevoEstadoLower = nuevoEstado.toLowerCase();

            if ((estadoActualLower === "finalizado" || estadoActualLower === "cancelado") && nuevoEstadoLower !== estadoActualLower) {
                throw new Error("No se puede cambiar un pedidp finalizado o cancelado");
            }

            const estadosValidos = ['pendiente', 'listo', 'finalizado', 'cancelado'];
            if (!estadosValidos.includes(nuevoEstadoLower)){
                throw new Error(`Estado '${nuevoEstado}' no es válido`);
            }

            estadoFinal = nuevoEstado;
        } else{
            switch (estadoActualLower){
                case "pendiente":
                    estadoFinal = "listo";
                    break;
                case "listo":
                    estadoFinal = 'finalizado';
                    break;
                default:
                    estadoFinal = estadoActual;
            }
        }

        if (estadoFinal !== estadoActual){
            administradorPedidos.modificarEstadoPedido(nroPedido, estadoFinal);

            res.json({ message: `Pedido actualizado a ${estadoFinal}`, pedido: pedido });
        }
    } catch (error){
        res.status(400).json({ message: error.message });
    }
}

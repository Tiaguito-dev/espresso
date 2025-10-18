// controllers/pedidosController.js
import FormPedido from './pages/pedidos/FormPedido';
// Array para simular la base de datos de pedidos
let pedidos = [
  {
    id: '001',
    mesa: 5,
    mozo: 'Juan',

    total: 800,
    estado: 'Listo',
  },
  {
    id: '002',
    mesa: 3,
    mozo: 'María',
    productos: [
      { id: "hamburguesa", nombre: "Hamburguesa", precio: 1500, cantidad: 1 },
      { id: "agua", nombre: "Agua", precio: 500, cantidad: 1 },
    ],
    total: 2000,
    estado: 'Pendiente',
  },
  {
    id: '003',
    mesa: 10,
    mozo: 'Pedro',
    productos: [
      { id: "te", nombre: "Té", precio: 250, cantidad: 1 },
    ],
    total: 250,
    estado: 'Finalizado',
  },
  {
    id: '004',
    mesa: 8,
    mozo: 'Ana',
    productos: [
      { id: "sandwich", nombre: "Sándwich", precio: 800, cantidad: 1 },
      { id: "jugo", nombre: "Jugo", precio: 600, cantidad: 1 },
    ],
    total: 1400,
    estado: 'Listo',
  },
];

exports.obtenerPedidos = (req, res) => {
  res.json(pedidos);
};

exports.crearPedido = (req, res) => {
  const nuevoPedido = { ...req.body, id: Date.now().toString() };
  pedidos.push(nuevoPedido);
  res.status(201).json(nuevoPedido);
};

exports.actualizarPedido = (req, res) => {
  const { id } = req.params;
  // Se espera que el frontend envíe { nuevoEstado: "..." } para cambio específico.
  const { nuevoEstado } = req.body;
  const pedidoIndex = pedidos.findIndex((p) => p.id === id);

  if (pedidoIndex === -1) {
    return res.status(404).json({ message: "Pedido no encontrado" });
  }

  const pedido = pedidos[pedidoIndex];
  let estadoFinal = pedido.estado;

  // 1. Lógica cuando se envía un estado específico (como "Cancelado")
  if (nuevoEstado) {
    const estadoActualLower = pedido.estado.toLowerCase();

    // No permitir cambio si ya está en estado terminal, a menos que el nuevo estado sea el mismo.
    if ((estadoActualLower === "finalizado" || estadoActualLower === "cancelado") &&
      nuevoEstado.toLowerCase() !== estadoActualLower) {
      return res.status(400).json({ message: "No se puede cambiar un pedido finalizado o cancelado" });
    }
    estadoFinal = nuevoEstado;
  }

  pedidos[pedidoIndex] = { ...pedido, estado: estadoFinal };
  res.json({ message: `Pedido actualizado a ${estadoFinal}`, pedido: pedidos[pedidoIndex] });
};
// controllers/pedidosController.js

// Array para simular la base de datos de pedidos
let pedidos = [
  {
    id: '001',
    mesa: 5,
    mozo: 'Juan',
    productos: [
      { id: "cafe", nombre: "Café", precio: 200, cantidad: 1 },
      { id: "medialuna", nombre: "Medialuna", precio: 300, cantidad: 2 },
    ],
    total: 800,
    estado: 'Pendiente',
    historial: 'Pendiente',
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
    estado: 'Listo',
    historial: 'Pendiente → Listo',
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
    historial: 'Pendiente → Finalizado',
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
    estado: 'Pendiente',
    historial: 'Pendiente',
  },
];

exports.obtenerPedidos = (req, res) => {
  res.json(pedidos); // ← Devuelve TODOS los pedidos como JSON
};

exports.crearPedido = (req, res) => {
  const nuevoPedido = { ...req.body, id: Date.now().toString() }; // Esto es meramente temporal, ya que después lo va a manejar la base de datos
  pedidos.push(nuevoPedido); // Agrega al array de pedidos que antes se definió
  res.status(201).json(nuevoPedido); // Responde con status 201 (Created)
};

exports.actualizarPedido = (req, res) => {
  const { id } = req.params;
  const { estado, ...resto } = req.body;
  const pedidoIndex = pedidos.findIndex((p) => p.id === id);

  if (pedidoIndex !== -1) {
    pedidos[pedidoIndex] = {
      ...pedidos[pedidoIndex],
      ...resto,
      estado,
      historial: pedidos[pedidoIndex].historial + ' → ' + estado,
    };
    res.json(pedidos[pedidoIndex]);
  } else {
    res.status(404).json({ message: 'Pedido no encontrado' });
  }
};
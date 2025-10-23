// controllers/pedidosController.js

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
    const nuevoPedido = { 
        ...req.body, 
        id: Date.now().toString(),
        estado: req.body.estado || "Pendiente", // estado inicial
    };
    pedidos.push(nuevoPedido);
    res.status(201).json(nuevoPedido);
};

exports.obtenerPedidoPorId = (req, res) => {
    const { id } = req.params;

    const pedido = pedidos.find((p) => p.id === id);

    if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Devuelve el pedido completo, incluyendo productos y total
    res.json(pedido);
};


exports.actualizarPedido = (req, res) => {
    const { id } = req.params;
    
    // Capturamos TODOS los posibles datos que el frontend puede enviar (estado O edición completa)
    const { nuevoEstado, mesa, mozo, productos, total } = req.body; 

    const pedidoIndex = pedidos.findIndex((p) => p.id === id);

    if (pedidoIndex === -1) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const pedidoActual = pedidos[pedidoIndex];

  
    if (nuevoEstado && Object.keys(req.body).length === 1) { // Si solo viene 'nuevoEstado'
        const estadoActualLower = pedidoActual.estado.toLowerCase();
        const nuevoEstadoLower = nuevoEstado.toLowerCase();

        // Evitar cambios si ya está en estado terminal (Finalizado o Cancelado)
        if ((estadoActualLower === "finalizado" || estadoActualLower === "cancelado") &&
            nuevoEstadoLower !== estadoActualLower) {
            return res.status(400).json({ message: "No se puede cambiar un pedido finalizado o cancelado" });
        }
        
        // Aplica solo el cambio de estado
        pedidos[pedidoIndex] = { ...pedidoActual, estado: nuevoEstado };
        const estadoFinal = pedidos[pedidoIndex].estado;

        return res.json({ 
            message: `Estado del pedido ${id} actualizado a ${estadoFinal}`, 
            pedido: pedidos[pedidoIndex] 
        });
    }

    // Si viene mesa, mozo, productos y total, asumimos edición completa
    if (mesa !== undefined && mozo !== undefined && productos !== undefined && total !== undefined) {
        
        // Los pedidos en estado Finalizado o Cancelado NO se pueden editar completamente
        const estadoLower = pedidoActual.estado.toLowerCase();
        if (estadoLower === "finalizado" || estadoLower === "cancelado") {
             return res.status(400).json({ message: "No se puede editar un pedido finalizado o cancelado" });
        }

        // Aplicamos la actualización completa
        pedidos[pedidoIndex] = {
            ...pedidoActual, // Mantenemos ID, estado actual, fecha, etc.
            mesa: mesa,
            mozo: mozo,
            productos: productos,
            total: total,
        };
        
        return res.json({ 
            message: `Pedido ${id} modificado completamente`, 
            pedido: pedidos[pedidoIndex] 
        });
    }

    // Respuesta si la solicitud no contiene datos válidos
    res.status(400).json({ message: "Datos de actualización inválidos o incompletos." });
};

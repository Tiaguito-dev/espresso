// Array para simular la base de datos de productos
let productos = [
    {
        id: '001',
        nombre: 'Medialuna',
        descripcion: 'Dulce o salada, vos elegís',
        precio: 800,
        disponible: true,
    },
    {
        id: '002',
        nombre: 'Café americano',
        descripcion: 'Para comenzar el día con todo',
        precio: 1600,
        disponible: true,
    },
    {
        id: '003',
        nombre: 'Submarino',
        descripcion: 'Con una barra de chocoloate águila',
        precio: 4000,
        disponible: true,
    },
    {
        id: '004',
        nombre: 'Tostado jyq',
        descripcion: 'Jamón y queso, clásico entre los clásicos',
        precio: 3500,
        disponible: false,
    },
];

exports.obtenerProductos = (req, res) => {
    res.json(productos); // Devuelve TODOS los productos como JSON
};

exports.obtenerProductoPorId = (req, res) => {
    // Tiene que devolver un solo producto con ese ID en particular
    const { id } = req.params;
    const producto = productos.find((p) => p.id === id);
    if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(productos); // Devuelve TODOS los productos como JSON
    console.log('./controllers/menuController.js \n devolviendo el producto con ID:', id);
    console.log(producto);
};

exports.crearProducto = (req, res) => {
    const nuevoProducto = { ...req.body, id: Date.now().toString() }; // Esto es meramente temporal, ya que después lo va a manejar la base de datos
    productos.push(nuevoProducto); // Agrega al array de producto que antes se definió
    res.status(201).json(nuevoProducto); // Responde con status 201 (Created)
};

exports.actualizarProducto = (req, res) => {
    const { id } = req.params;
    const { ...resto } = req.body;
    const productoIndex = productos.findIndex((p) => p.id === id);

    // El -1 significa que no lo encontró y es una respuesta automática de findIndex
    if (productoIndex !== -1) {
        productos[productoIndex] = {
            ...productos[productoIndex],
            ...resto,
        };
        res.json(productos[productoIndex]);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
};
// Array para simular la base de datos de productos
let productos = [
    {
        id: '001',
        nombre: 'Medialuna',
        descripcion: 'La que le gusta a la trola de tu abuela',
        precio: 800,
        disponible: true,
    },
    {
        id: '002',
        nombre: 'Café',
        descripcion: 'Caliente como tu vieja',
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
        disponible: true,
    },
];

exports.obtenerProductos = (req, res) => {
    res.json(productos); // Devuelve TODOS los productos como JSON
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
const Gateway = require('../DB/Gateway');

// === SECCIÓN DE QUERYS ===
const consultarProductos = 'SELECT * FROM producto';
const consultarProductoPorId = 'SELECT * FROM producto WHERE id = $1'; // En la base de datos lo tuve uqe llamar id pero la idea es que se llame codigo, PORQUE EN TODOS LADOS LE PUSIMOS ID LA PUTA MADRE


// === SECCIÓN DE EJECUCIÓN DE FUNCIONES
exports.obtenerProductos = async () => {
    try {
        const productos = await Gateway.ejecutarQuery(consultarProductos);
        return productos;
    } catch (error) {
        throw new Error('Error al obtener productos desde la base de datos: ' + error.message);
    }
};

exports.obtenerPorId = async (cod_producto) => {
    try {
        const productos = await Gateway.ejecutarQuery({ text: consultarProductoPorId, values: [cod_producto] });
        //HAY QUE DEFINIR SI LO VA A BUSCAR POR NOMBRE O POR CODIGO, Porque de eso depende también que sea unique o no
        return productos[0]; // Retornar el primer producto encontrado
    } catch (error) {
        throw new Error('Error al obtener producto desde la base de datos: ' + error.message);
    }
};

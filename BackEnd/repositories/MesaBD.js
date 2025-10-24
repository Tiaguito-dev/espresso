const selectMesas = 'SELECT * FROM mesa';
const selectProductoPorId = 'SELECT * FROM producto WHERE id = $1'; // En la base de datos lo tuve uqe llamar id pero la idea es que se llame codigo, PORQUE EN TODOS LADOS LE PUSIMOS ID LA PUTA MADRE
const insertProducto = 'INSERT INTO producto (id, precio, nombre, descripcion, id_categoria) VALUES ($1, $2, $3, $4, $5)';
const selectUltimoCodigo = 'SELECT MAX(id) FROM producto';
const deleteProductoPorId = 'DELETE FROM producto WHERE id = $1';


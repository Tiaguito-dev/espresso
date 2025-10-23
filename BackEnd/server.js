// server.js
const express = require('express');
const app = express();
const cors = require('cors');
<<<<<<< HEAD
=======
console.log(' Iniciando servidor...');

>>>>>>> jere
// Importar rutas
const pedidosRoutes = require('./routes/pedidosRoutes');
const productosRoutes = require('./routes/productosRoutes');

console.log(' Iniciando servidor...');

// Middlewares
app.use(express.json());
app.use(cors());

// nota manu: esto lo agregue pq no me mostraba el cambio de disponibilidad 
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Registrar rutas
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/productos', productosRoutes);

const PORT = 3001;
// Esto me lo dio chat para depurar, así que podríamos sacarlo
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
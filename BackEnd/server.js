// server.js
const express = require('express');
const app = express();
const cors = require('cors');

console.log('🚀 Iniciando servidor...');

// Importar rutas
console.log('📁 Importando rutas...');
const pedidosRoutes = require('./routes/pedidosRoutes');
const productosRoutes = require('./routes/productosRoutes');
console.log('✅ Rutas importadas correctamente');

// Middlewares
app.use(express.json());
app.use(cors());

// Registrar rutas
console.log('🔗 Registrando rutas...');
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/productos', productosRoutes);
console.log('✅ /api/productos registrado');

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log('🧪 Rutas disponibles:');
  console.log('   - GET http://localhost:3001/api/productos');
  console.log('   - GET http://localhost:3001/api/pedidos');
});
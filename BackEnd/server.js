// server.js
const express = require('express');
const app = express();
const cors = require('cors'); // Agrega cors para permitir que el front-end se comunique con el back-end
const pedidosRoutes = require('./routes/pedidosRoutes');

// Middlewares
app.use(express.json()); // Para que el servidor entienda los datos JSON
app.use(cors()); // Habilita CORS

// Rutas
app.use('/api/pedidos', pedidosRoutes); // Usamos el router de pedidos

const PORT = 3001; // Puedes usar el puerto que quieras
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
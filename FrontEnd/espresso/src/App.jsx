import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import PedidosLista from "./pages/pedidos/PedidosLista.jsx";
import AgregarPedido from "./pages/pedidos/AgregarPedido.jsx";
<<<<<<< HEAD
import Menu from "./pages/menu/Menu.jsx";
import FormProducto from "./pages/menu/FormProducto.jsx";
=======
>>>>>>> 5d4ba000b058c793dc0599fd40f4714cc4af4cfa

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pedidos" element={<PedidosLista />} />
          <Route path="/pedidos/agregar" element={<AgregarPedido />} />
<<<<<<< HEAD
          <Route path="/menu" element={<Menu />} />
          {/* Se pone ? para que el indicar que el parámetro sea opcional */}
          <Route path="/menu/productos/:id?" element={<FormProducto />} />
=======
>>>>>>> 5d4ba000b058c793dc0599fd40f4714cc4af4cfa
        </Routes>
      </div>
    </Router>
  );
}

export default App;

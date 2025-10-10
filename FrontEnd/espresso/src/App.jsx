import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import PedidosLista from "./pages/pedidos/PedidosLista.jsx";
import AgregarPedido from "./pages/pedidos/AgregarPedido.jsx";
import Menu from "./pages/menu/Menu.jsx";
import FormProducto from "./pages/menu/FormProducto.jsx";
import GestionCaja from "./pages/caja/GestionCaja.jsx";
import GestionCocina from "./pages/cocina/GestionCocina.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pedidos" element={<PedidosLista />} />
          <Route path="/pedidos/agregar" element={<AgregarPedido />} />
          <Route path="/menu" element={<Menu />} />
          {/* Se pone ? para que el indicar que el parámetro sea opcional */}
          <Route path="/menu/productos/:id?" element={<FormProducto />} />
          <Route path="/caja" element={<GestionCaja/>} />
          <Route path="/cocina" element={<GestionCocina/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import PedidosLista from "./pages/pedidos/PedidosLista.jsx";
import AgregarPedido from "./pages/pedidos/AgregarPedido.jsx";
import Menu from "./pages/menu/Menu.jsx";
import FormProducto from "./pages/menu/FormProducto.jsx";
import GestionCaja from "./pages/caja/GestionCaja.jsx";
import GestionCocina from "./pages/cocina/GestionCocina.jsx";
import MenuCliente from "./pages/menu/ClienteMenu.jsx";
import MesasLista from "./pages/mesas/MesasLista.jsx";
import FormPedido from "./pages/pedidos/FormPedido.jsx";
import Login from "./pages/login/Login.jsx";

// Estos son componentes validadores
import ValidarSesion from "./components/ValidarSesion.jsx"
import ValidarPerfil from "./components/ValidarPerfil.jsx"


// Esto es lo de la variable global que yo les decía
import { useContext } from 'react';
import { UsuarioContext } from './contexts/UsuarioContext.jsx';



function App() {
  // Para lo que lo voy a usar es para decirle: che, vos estás autenticado ? entonces te devuelvo el navbar
  // Sin el navbar no va a poder hacer nada. Pero incluso si navega entre rutas, va a tener que autenticarse
  const { autenticado } = useContext(UsuarioContext);

  return (
    <Router>
      {autenticado && <Navbar />}
      <div className="p-4">
        <Routes>
          {/*ESTAS SON TODAS RUTAS PROTEGIDAS*/}
          <Route element={<ValidarSesion />}>
            {/* Rutas para Mozo */}
            <Route element={<ValidarPerfil perfilesPermitidos={["mozo", "admin"]} />}>
              <Route path="/pedidos" element={<PedidosLista />} />
              <Route path="/pedidos/agregar" element={<AgregarPedido />} />
              <Route path="/pedidos/modificar/:id" element={<FormPedido />} />
            </Route>

            {/* Rutas para Cocinero */}
            <Route element={<ValidarPerfil perfilesPermitidos={["cocinero", "admin"]} />}>
              <Route path="/cocina" element={<GestionCocina />} />
            </Route>

            {/* Rutas para Cajero */}
            <Route element={<ValidarPerfil perfilesPermitidos={["cajero", "admin"]} />}>
              <Route path="/caja" element={<GestionCaja />} />
            </Route>

            {/* Rutas para Admin */}
            <Route element={<ValidarPerfil perfilesPermitidos={["admin", "cajero"]} />}>
              <Route path="/menu/productos/:id?" element={<FormProducto />} />
              <Route path="/mesas" element={<MesasLista />} />
              <Route path="/menu" element={<Menu />} />
            </Route>
          </Route>

          {/* ESTAS RUTAS SON PÚBLICAS */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/menu/menuEspresso" element={<MenuCliente />} />
        </Routes>
      </div>
    </Router >
  );
}

export default App;

import { NavLink } from "react-router-dom";
import './Navbar.css';

export default function Navbar() {
  return (
    <nav>
      <div className="brand">Espresso</div>
      <ul>
        <li><NavLink to="/" end>Inicio</NavLink></li>
<<<<<<< HEAD
        <li><NavLink to="/pedidos">Gestión de pedidos</NavLink></li>
        <li><NavLink to="/menu">Gestión de menú</NavLink></li>
=======
        <li><NavLink to="/pedidos">Lista de pedidos</NavLink></li>
        <li><NavLink to="/pedidos/agregar">Agregar pedido</NavLink></li>
>>>>>>> 5d4ba000b058c793dc0599fd40f4714cc4af4cfa
      </ul>
    </nav>
  );
}

import { NavLink } from "react-router-dom";
import './Navbar.css';

export default function Navbar() {
  return (
    <nav>
      <div className="brand">Espresso</div>
      <ul>
        <li><NavLink to="/" end>Inicio</NavLink></li>
        <li><NavLink to="/pedidos">Gestión de pedidos</NavLink></li>
        <li><NavLink to="/menu">Gestión de menú</NavLink></li>
      </ul>
    </nav>
  );
}

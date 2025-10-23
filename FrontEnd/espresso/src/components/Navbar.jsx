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
        <li><NavLink to="/caja">Gestión de caja</NavLink></li>
        <li><NavLink to="/cocina">Gestión de cocina</NavLink></li>
      </ul>
    </nav>
  );
}

import { isRouteErrorResponse, NavLink } from "react-router-dom";
import './Navbar.css';
import { useState } from "react";

export default function Navbar() {
  
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <nav>
      <div className="espresso">espresso</div>
      <button className={`hamburguesa ${menuAbierto ? "open" : ""}`} 
      onClick={() => setMenuAbierto(!menuAbierto)}
      aria-label="Abrir menú">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`nav-links ${menuAbierto ? "open" : ""}`}>
        <li><NavLink to="/" end onClick={cerrarMenu}>Inicio</NavLink></li>
        <li><NavLink to="/pedidos" onClick={cerrarMenu}>Gestión de pedidos</NavLink></li>
        <li><NavLink to="/menu" onClick={cerrarMenu}>Gestión de menú</NavLink></li>
        <li><NavLink to="/caja" onClick={cerrarMenu}>Gestión de caja</NavLink></li>
        <li><NavLink to="/cocina" onClick={cerrarMenu}>Gestión de cocina</NavLink></li>
        <li><NavLink to="/menu/menuEspresso/" onClick={cerrarMenu}>Ver Menú Espresso</NavLink></li>
      </ul>
    </nav>
  ); 
};


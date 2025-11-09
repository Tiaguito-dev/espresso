import { isRouteErrorResponse, NavLink } from "react-router-dom";
import "../UnicoCSS.css";
import { useState, useContext } from "react";
import { UsuarioContext } from "../contexts/UsuarioContext";

export default function Navbar() {

  const [menuAbierto, setMenuAbierto] = useState(false);

  const { perfil } = useContext(UsuarioContext);

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <nav className="navbar">
      <div className="titulo-navbar">espresso</div>
      <button className={`menu-hamburguesa ${menuAbierto ? "open" : ""}`}
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Abrir menú">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`navbar-links ${menuAbierto ? "open" : ""}`}>
        <li><NavLink to="/" end onClick={cerrarMenu}>Inicio</NavLink></li>
        <li><NavLink to="/menu/menuEspresso/" onClick={cerrarMenu}>Ver Menú Espresso</NavLink></li>
        {/* ESTO ES ÚNICAMENTE PARA EXPERIENCIA DE USUARIO */}
        {perfil === "admin" && (
          <li><NavLink to="/menu" onClick={cerrarMenu}>Gestión de menú</NavLink></li>
        )}

        {(perfil === "mozo" || perfil === "admin") && (
          <li><NavLink to="/pedidos" onClick={cerrarMenu}>Gestión de pedidos</NavLink></li>
        )}

        {(perfil === "caja" || perfil === "admin") && (
          <li><NavLink to="/caja" onClick={cerrarMenu}>Gestión de caja</NavLink></li>
        )}

        {(perfil === "caja" || perfil === "admin") && (
          <li><NavLink to="/pagos" onClick={cerrarMenu}>Gestión de pagos</NavLink></li>
        )}

        {(perfil === "cocina" || perfil === "admin") && (
          <li><NavLink to="/cocina" onClick={cerrarMenu}>Gestión de cocina</NavLink></li>
        )}

        {(perfil === "mozo" || perfil === "admin") && (
          <li><NavLink to="/mesas" onClick={cerrarMenu}>Gestión de mesas</NavLink></li>
        )}

        {(perfil === "admin") && (
          <li><NavLink to="/usuarios" onClick={cerrarMenu}>Gestión de perfiles</NavLink></li>
        )}
      </ul>
    </nav>
  );
};


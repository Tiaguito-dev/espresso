// src/pages/usuarios/UsuariosLista.jsx
import React, { useEffect, useState } from "react";
import { obtenerUsuarios } from "../../services/usuariosService";
import { useNavigate } from "react-router-dom";
import "../../UnicoCSS.css";
import IconoModificar from "../../components/IconoModificar";

export default function UsuariosLista() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await obtenerUsuarios();
        console.log("Usuarios obtenidos:", data);
        setUsuarios(data || []);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setError("No se pudieron obtener los usuarios.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const handleAgregar = () => navigate("/usuarios/nuevo");
  const handleEditar = (id) => navigate(`/usuarios/${id}`);

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div className="tabla-contenedor">
      <div className="div-espacio-navbar"></div>
      <h1 className="titulo-tabla">Gestión de Usuarios</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="div-botones">
        <button className="boton-agregar" onClick={handleAgregar}> + Agregar Usuario</button>
      </div>
      
      <table className="tabla">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Perfil</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((u) => (
              <tr key={u.codigo}>
                <td>{u.codigo}</td>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.perfil?.nombre ?? u.perfil ?? "—"}</td>
                <td>
                  <button className="modificar-user" onClick={() => handleEditar(u.codigo)}> <IconoModificar size={18}></IconoModificar>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

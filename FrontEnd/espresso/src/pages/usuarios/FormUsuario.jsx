// src/pages/usuarios/FormUsuario.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  obtenerUsuarioPorId,
  createUsuario,
  updateUsuario,
  obtenerPerfiles,
} from "../../services/usuariosService";

const USUARIO_INICIAL = {
  nombre: "",
  correo: "",
  contraseña: "",
  perfil: "",
};

export default function FormUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(USUARIO_INICIAL);
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  const esModificar = !!id;

  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        const perfilesData = await obtenerPerfiles();
        if (!perfilesData || perfilesData.length === 0) {
          console.warn("Backend no devolvió perfiles, usando valores por defecto");
          setPerfiles(["admin", "mozo", "cocina"]);
        } else {
          setPerfiles(perfilesData);
        }
      } catch (err) {
        console.error("Error obteniendo perfiles:", err);
        setPerfiles(["admin", "mozo", "cocina"]); // fallback
      } finally {
        setLoading(false);
      }
    };

    const fetchUsuario = async () => {
      try {
        const data = await obtenerUsuarioPorId(id);
        const perfilNombre = data?.perfil?.nombre ?? data?.perfil ?? "";
        setUsuario({
          nombre: data?.nombre || "",
          correo: data?.correo || "",
          contraseña: "", // no traer contraseña
          perfil: perfilNombre,
        });
      } catch (err) {
        console.error("Error cargando usuario:", err);
        setError("No se pudo cargar el usuario para modificar.");
      } finally {
        setLoading(false);
      }
    };

    // Ejecutar ambas funciones según corresponda
    fetchPerfiles();
    if (esModificar) fetchUsuario();
  }, [id, esModificar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError(null);

    if (!usuario.nombre || !usuario.correo || !usuario.perfil) {
      setError("Nombre, correo y perfil son obligatorios.");
      return;
    }

    try {
      const payload = { ...usuario, perfil: usuario.perfil?.nombre ?? usuario.perfil };
      if (esModificar) {
        if (!payload.contraseña) delete payload.contraseña;
        await updateUsuario(id, payload);
        alert(`Usuario ${id} modificado con éxito.`);
      } else {
        await createUsuario(payload);
        alert("Usuario agregado con éxito.");
      }
      navigate("/usuarios");
    } catch (err) {
      console.error("Error guardando usuario:", err);
      setError(`Error al guardar el usuario: ${err.message || "Verifique los datos."}`);
    }
  };

  const handleCancelar = () => navigate("/usuarios");

  if (loading) return <div className="container">Cargando usuario...</div>;

  return (
    <div className="form-mesa-container">
      <h2>{esModificar ? `Modificar Usuario ${usuario.nombre || "..."}` : "Registrar Nuevo Usuario"}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleGuardar}>
        <input
          type="text"
          name="nombre"
          value={usuario.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <input
          type="email"
          name="correo"
          value={usuario.correo}
          onChange={handleChange}
          placeholder="Correo"
          required
        />
        {!esModificar && (
          <input
            type="password"
            name="contraseña"
            value={usuario.contraseña}
            onChange={handleChange}
            placeholder="Contraseña"
            required
          />
        )}
        {esModificar && (
          <input
            type="password"
            name="contraseña"
            value={usuario.contraseña}
            onChange={handleChange}
            placeholder="Nueva contraseña (opcional)"
          />
        )}
        <select name="perfil" value={usuario.perfil} onChange={handleChange} required>
          <option value="">Seleccione un perfil</option>
          {perfiles.map((p) => (
            <option key={p.codigo ?? p.nombre ?? p} value={p.nombre ?? p}>
              {p.nombre ?? p}
            </option>
          ))}
        </select>
        <button type="submit">{esModificar ? "Guardar Cambios" : "Agregar Usuario"}</button>
        <button type="button" onClick={handleCancelar}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

// src/pages/usuarios/FormUsuario.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {obtenerUsuarioPorId,createUsuario,updateUsuario,obtenerPerfiles,} from "../../services/usuariosService";
import "../../UnicoCSS.css";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const esModificar = Boolean(id);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        let perfilesData = await obtenerPerfiles();
        if (!Array.isArray(perfilesData) || perfilesData.length === 0) {
          console.warn("Backend no devolvió perfiles, usando por defecto");
          setPerfiles(["admin", "mozo", "cocina"]);
        } else {
          console.log("✅ Perfiles cargados en el form:", perfilesData);
          setPerfiles(perfilesData); // <-- acá se guardan los perfiles del backend
        }

        if (esModificar) {
          const data = await obtenerUsuarioPorId(id);
          const perfilNombre = data?.perfil?.nombre ?? data?.perfil ?? "";
          setUsuario({
            nombre: data?.nombre || "",
            correo: data?.correo || "",
            contraseña: "", // no traer contraseña
            perfil: perfilNombre,
          });
        }
      } catch (err) {
        console.error("Error cargando usuario:", err);
        setError("No se pudo cargar el usuario para modificar.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
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
      const payload = { ...usuario };
      if (!usuario.contraseña) delete payload.contraseña; 

      if (esModificar) {
        await updateUsuario(id, payload);
        alert("Usuario modificado con éxito.");
      } else {
        await createUsuario(payload);
        alert("Usuario agregado con éxito.");
      }

      navigate("/usuarios");
    } catch (err) {
      console.error("Error guardando usuario:", err);
      setError(
        err.message ||
          "Ocurrió un error al guardar el usuario. Verifique los datos."
      );
    }
  };

  const handleCancelar = () => navigate("/usuarios");

  if (loading) return <div className="container">Cargando datos...</div>;

  return (
    <div>
    <div className="div-espacio-navbar"></div>
    <div className="agregar-item">

      <h2 className="titulo-accion">{esModificar ? "Modificar Usuario" : "Registrar Nuevo Usuario"}</h2>
      {error && <p className="error-message">{error}</p>}

      <form className="formulario" onSubmit={handleGuardar}>
        <div>
          <input
          type="text"
          name="nombre"
          value={usuario.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          required
          />
        </div>
        
        <div>
          <select
          name="perfil"
          value={usuario.perfil}
          onChange={handleChange}
          required
          >
            <option value="">Seleccione un perfil</option>
            {perfiles.map((p) => (
              <option key={p.codigo} value={p.nombre}>
                {p.nombre}
              </option>
          ))}
          </select>
        </div>

        <div>
          <input
          type="email"
          name="correo"
          value={usuario.correo}
          onChange={handleChange}
          placeholder="Correo"
          required
          />
        </div>

        <div>
          <input
          type="password"
          name="contraseña"
          value={usuario.contraseña}
          onChange={handleChange}
          placeholder={esModificar ? "Nueva contraseña (opcional)" : "Contraseña"}
          required={!esModificar}
          />
        </div>
        
        <div className="form-buttons">
          <button className="btn-guardar" type="submit">
            {esModificar ? "Guardar Cambios" : "Agregar Usuario"}
          </button>
          <button className="btn-cancelar" type="button" onClick={handleCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
    </div>
    
  );
}
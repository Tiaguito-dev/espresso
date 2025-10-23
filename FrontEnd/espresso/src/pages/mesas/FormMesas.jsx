// src/pages/mesas/FormMesa.jsx

import React, { useState } from "react";
import "./FormMesa.css";

export default function FormMesa({ onGuardar, onCancelar }) {
  const [mesa, setMesa] = useState({
    numero: "",
    mozoACargo: "",
    estado: "Disponible",
  });

  const handleChange = (e) => {
    setMesa({ ...mesa, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-mesa-container">
      <h2>Registrar Mesa</h2>
      <form className="form-mesa">
        <div>
          <label>Número de Mesa</label>
          <input
            type="number"
            name="numero"
            value={mesa.numero}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Mozo a Cargo</label>
          <input
            type="text"
            name="mozoACargo"
            value={mesa.mozoACargo}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Estado</label>
          <select name="estado" value={mesa.estado} onChange={handleChange}>
            <option>Disponible</option>
            <option>Ocupada</option>
            <option>Lista para ordenar</option>
            <option>Lista para pagar</option>
          </select>
        </div>

        <div className="form-mesa-buttons">
          <button
            type="button"
            className="btn-guardar"
            onClick={() => onGuardar(mesa)}
          >
            Guardar
          </button>
          <button type="button" className="btn-cancelar" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
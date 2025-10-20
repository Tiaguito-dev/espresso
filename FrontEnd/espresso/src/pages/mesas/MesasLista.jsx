import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../pedidos/Pedidos.css";

export default function MesasLista() {
  const [mesas, setMesas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulamos una carga inicial de datos
    const mesasSimuladas = [
      { id: 1, numero: 1, estado: "Disponible" },
      { id: 2, numero: 2, estado: "Ocupada" },
      { id: 3, numero: 3, estado: "No disponible" },
      { id: 4, numero: 4, estado: "Disponible" },
    ];
    setMesas(mesasSimuladas);
  }, []);

  const cambiarEstado = (id) => {
    setMesas((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              estado: m.estado === "Disponible" ? "Ocupada" : "Disponible",
            }
          : m
      )
    );
  };

  const darDeBaja = (id) => {
    setMesas((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, estado: "No disponible" } : m
      )
    );
  };

  return (
    <div className="container">
      <div className="filtros-estado">
        <h2>Mesas</h2>
        <button className="btn-agregar" onClick={() => navigate("/mesas/agregar")}>
          + Agregar Mesa
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>N° Mesa</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mesas.map((mesa) => (
            <tr key={mesa.id} data-estado={mesa.estado}>
              <td>{mesa.numero}</td>
              <td>
                <span className={`estado ${mesa.estado?.toLowerCase().replace(" ", "-")}`}>
                  {mesa.estado}
                </span>
              </td>
              <td className="acciones">
                <button
                  className="modificar"
                  onClick={() => cambiarEstado(mesa.id)}
                  disabled={mesa.estado === "No disponible"}
                >
                  {mesa.estado === "Disponible"
                    ? "Marcar Ocupada"
                    : mesa.estado === "Ocupada"
                    ? "Marcar Disponible"
                    : "No disponible"}
                </button>

                <button
                  className="baja"
                  onClick={() => darDeBaja(mesa.id)}
                  disabled={mesa.estado === "No disponible"}
                >
                  Dar de Baja
                </button>

                <button className="info" onClick={() => alert("Modificar aún no implementado")}>
                  Modificar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

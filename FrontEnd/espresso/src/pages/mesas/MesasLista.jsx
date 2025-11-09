import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TablaMesas from "./TablaMesas";
import { getMesas, updateMesa } from "../../services/mesasService";

const ESTADOS = {
  DISPONIBLE: "disponible",
  OCUPADA: "ocupada",
  FUERA_SERVICIO: "fuera de servicio",
};

export default function MesasLista() {
  const [mesas, setMesas] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("todas");
  const navigate = useNavigate();

  // 🔹 Cargar mesas al montar el componente
  useEffect(() => {
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    try {
      const data = await getMesas();
      setMesas(data || []);
    } catch (error) {
      console.error("Error cargando mesas:", error);
      alert("No se pudieron cargar las mesas");
    }
  };

  // 🔹 Cambiar estado de una mesa (Disponible ↔ Ocupada)
  const cambiarEstado = async (nroMesa) => {
    const mesa = mesas.find((m) => m.nroMesa === nroMesa);
    if (!mesa) return;

    let nuevoEstado =
      mesa.estadoMesa === ESTADOS.DISPONIBLE
        ? ESTADOS.OCUPADA
        : ESTADOS.DISPONIBLE;

    try {
      await updateMesa(nroMesa, { estado: nuevoEstado });
      setMesas((prev) =>
        prev.map((m) =>
          m.nroMesa === nroMesa ? { ...m, estadoMesa: nuevoEstado } : m
        )
      );
    } catch (error) {
      console.error("No se pudo cambiar el estado:", error);
    }
  };

  // 🔹 Dar de baja una mesa (pasar a "fuera de servicio")
  const eliminarMesa = async (nroMesa) => {
    if (!window.confirm(`¿Dar de baja mesa ${nroMesa}?`)) return;

    try {
      await updateMesa(nroMesa, { estado: ESTADOS.FUERA_SERVICIO });
      setMesas((prev) =>
        prev.map((m) =>
          m.nroMesa === nroMesa
            ? { ...m, estadoMesa: ESTADOS.FUERA_SERVICIO }
            : m
        )
      );
    } catch (error) {
      console.error("No se pudo eliminar la mesa:", error);
    }
  };

  // 🔹 Filtrado por estado
  const mesasFiltradas =
    estadoFiltro === "todas"
      ? mesas
      : mesas.filter((m) => m.estadoMesa === estadoFiltro);

  const arrayCampos = ["Número", "Estado", "Acciones"];

  // 🔹 Render
  return (
    <div className="container">
      <div className="filtros-estado">
        <div className="estados">
          <button
            onClick={() => setEstadoFiltro("todas")}
            className="btn btn-estado"
          >
            Todas
          </button>

          <button
            onClick={() => setEstadoFiltro(ESTADOS.DISPONIBLE)}
            className="btn btn-estado"
          >
            Disponible
          </button>

          <button
            onClick={() => setEstadoFiltro(ESTADOS.OCUPADA)}
            className="btn btn-estado"
          >
            Ocupada
          </button>

          <button
            onClick={() => setEstadoFiltro(ESTADOS.FUERA_SERVICIO)}
            className="btn btn-estado"
          >
            Fuera de Servicio
          </button>
        </div>

        <button
          className="btn-agregar"
          onClick={() => navigate("/mesas/nueva")}
        >
          + Agregar Mesa
        </button>
      </div>

      <TablaMesas
        mesas={mesasFiltradas}
        arrayCampos={arrayCampos}
        funcionCambiarEstado={cambiarEstado}
        funcionEliminar={eliminarMesa}
      />
    </div>
  );
}

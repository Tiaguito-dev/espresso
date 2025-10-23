import React, { useState, useEffect } from "react";
import { getMesas, updateMesa, deleteMesa } from "../../services/mesasService";
import { useNavigate } from "react-router-dom";
import "./Mesas.css";

import Filtro from "../menu/Filtro";
import TablaMesas from "./TablaMesas"; // tabla separada

export default function MesasLista() {
    const [mesas, setMesas] = useState([]);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState("todas");
    const navigate = useNavigate();

    // 🔄 Cargar mesas al iniciar
    useEffect(() => {
        fetchMesas();
    }, []);

    const fetchMesas = async () => {
        try {
            const data = await getMesas();
            setMesas(data);
        } catch (error) {
            console.error("Error al obtener las mesas:", error);
        }
    };

    // 🎚️ Mostrar/Ocultar filtros
    const toggleFiltros = () => {
        setMostrarFiltros(!mostrarFiltros);
    };

    const filtrarEstado = (estado) => {
        setEstadoFiltro(estado);
    };

    // 🔄 Cambiar estado (ejemplo: Disponible → Ocupada → Listo Para Ordenar → Listo Para Cobrar)
    const cambiarEstado = async (id) => {
    try {
        const mesaActual = mesas.find((m) => m.id === id);
        if (!mesaActual) return;

        // ... (Lógica para determinar 'siguiente' estado) ...
        const estados = ["Disponible", "Ocupada", "Listo-Para-Ordenar", "Listo-Para-Cobrar"];
        const indice = estados.indexOf(mesaActual.estado);
        const siguiente = estados[(indice + 1) % estados.length];

        // 🎯 CLAVE: Cambiar 'estado: siguiente' a 'nuevoEstado: siguiente'
        await updateMesa(id, { nuevoEstado: siguiente }); 
        
        fetchMesas();
    } catch (error) {
        // ...
    }
};

    // 🗑️ Eliminar mesa
    const eliminarMesa = async (id) => {
        if (window.confirm("¿Seguro que desea eliminar esta mesa?")) {
            try {
                await deleteMesa(id);
                fetchMesas();
            } catch (error) {
                console.error("Error al eliminar la mesa:", error);
                alert("No se pudo eliminar la mesa.");
            }
        }
    };

    // ✏️ Navegar a modificar
    const navegarAModificar = (id) => {
        navigate(`/mesas/modificar/${id}`);
    };

    // Filtrar por estado
    const mesasFiltradas = (() => {
        switch (estadoFiltro) {
            case "disponible":
                return mesas.filter((m) => m.estado === "Disponible");
            case "ocupada":
                return mesas.filter((m) => m.estado === "Ocupada");
            case "Listo-Para-Ordenar":
                return mesas.filter((m) => m.estado === "Listo Para Ordenar");
            case "Listo-Para-Cobrar":
                return mesas.filter((m) => m.estado === "Listo Para Cobrar");
            default:
                return mesas;
        }
    })();

    // Campos de la tabla
    const arrayCampos = ["ID", "Número", "Mozo a cargo", "Estado", "Acciones"];

    return (
        <div className="container">
            <button className="toggle-filtros" onClick={toggleFiltros}>
                Filtros
            </button>

            {mostrarFiltros && (
                <div className="filtros">
                    <input type="text" placeholder="Buscar por número" />
                    <input type="text" placeholder="Buscar por estado" />
                </div>
            )}

            {/* Estados + botón agregar */}
            <div className="filtros-estado">
                <div className="estados">
                    <Filtro estadoActual={estadoFiltro} estadoValor="todas" nombreFiltro="Todas" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="disponible" nombreFiltro="Disponible" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="ocupada" nombreFiltro="Ocupada" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="Listo-Para-Ordenar" nombreFiltro="Listo Para Ordenar" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="Listo-Para-Cobrar" nombreFiltro="Listo Para Cobrar" onClick={filtrarEstado} />
                </div>

                <button className="btn-agregar" onClick={() => navigate("/mesas/FormMesas")}>
                    + Agregar Mesa
                </button>
            </div>

            {/* Tabla de Mesas */}
            <TablaMesas
                mesas={mesasFiltradas}
                arrayCampos={arrayCampos}
                funcionCambiarEstado={cambiarEstado}
                funcionModificar={navegarAModificar}
                funcionEliminar={eliminarMesa}
            />
        </div>
    );
}

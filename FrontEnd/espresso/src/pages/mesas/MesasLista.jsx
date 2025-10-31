// src/pages/mesas/MesasLista.jsx

import React, { useState, useEffect } from "react";
// Solo usamos getMesas y updateMesa, ya que no hay delete físico.
import { getMesas, updateMesa } from "../../services/mesasService"; 
import { useNavigate } from "react-router-dom";
import "./Mesas.css";

import Filtro from "../menu/Filtro";
import TablaMesas from "./TablaMesas"; 

export default function MesasLista() {
    const [mesas, setMesas] = useState([]);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    // 🎯 Incluimos el nuevo filtro al estado
    const [estadoFiltro, setEstadoFiltro] = useState("todas"); 
    const [filtroNumero, setFiltroNumero] = useState(""); 
    const [filtroMozo, setFiltroMozo] = useState(""); 
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

    const toggleFiltros = () => {
        setMostrarFiltros(!mostrarFiltros);
    };

    const filtrarEstado = (estado) => {
        setEstadoFiltro(estado);
    };
    
    const handleFiltroNumeroChange = (e) => {
        setFiltroNumero(e.target.value);
    };

    const handleFiltroMozoChange = (e) => {
        setFiltroMozo(e.target.value);
    };

    // 🔄 Cambiar estado (SOLO Disponible <-> Ocupada)
    const cambiarEstado = async (id) => {
        try {
            const mesaActual = mesas.find((m) => m.id === id);
            // Si la mesa está No Disponible, no permitimos el cambio de ciclo.
            if (!mesaActual || mesaActual.estado === "No Disponible") return;

            // Ciclo: Ocupada -> Disponible, o Disponible -> Ocupada
            const siguienteEstado = mesaActual.estado === "Ocupada" ? "Disponible" : "Ocupada";
            
            const updates = { 
                estado: siguienteEstado,
            };
            
            // Si pasa a Disponible, eliminamos el mozo a cargo
            if (siguienteEstado === "Disponible") {
                updates.mozoACargo = null;
            }

            await updateMesa(id, updates); 
            fetchMesas();
        } catch (error) {
            console.error("Error al cambiar el estado de la mesa:", error);
        }
    }; 


    // 🧹 Función 1: Poner mesa en 'Disponible' (Libera/reactiva la mesa)
    const liberarMesa = async (id) => {
        if (window.confirm("¿Desea liberar/activar la mesa? Se pondrá en 'Disponible' y se desasignará el mozo.")) {
            try {
                await updateMesa(id, { 
                    estado: "Disponible", 
                    mozoACargo: null,
                });
                fetchMesas();
            } catch (error) {
                console.error("Error al liberar la mesa:", error);
                alert("No se pudo liberar/activar la mesa.");
            }
        }
    };

    // ❌ Función 2: Poner mesa en 'No Disponible' (Eliminación suave)
    const ponerNoDisponible = async (id) => {
        if (window.confirm("¿Seguro que quiere dejar esta mesa como NO DISPONIBLE? Esto la quita de servicio.")) {
            try {
                await updateMesa(id, { 
                    estado: "No Disponible", 
                    mozoACargo: null, 
                });
                fetchMesas();
            } catch (error) {
                console.error("Error al poner la mesa como no disponible:", error);
                alert("No se pudo poner la mesa como no disponible.");
            }
        }
    };

    // ✏️ Navegar a modificar (igual)
    const navegarAModificar = (id) => {
        navigate(`/mesas/modificar/${id}`);
    };

    // 🔎 Filtrar por estado, número y mozo
    const mesasFiltradas = mesas.filter((mesa) => {
        const estadoMap = {
            "disponible": "Disponible",
            "ocupada": "Ocupada",
            "no-disponible": "No Disponible", 
        };

        const estadoBD = mesa.estado || "";
        const numeroBD = mesa.numero ? String(mesa.numero) : "";
        const mozoBD = mesa.mozoACargo ? mesa.mozoACargo.toLowerCase() : "";

        // 1. Filtro por Estado (botones)
        let pasaFiltroEstado = true;
        if (estadoFiltro !== "todas") {
            const estadoEsperado = estadoMap[estadoFiltro];
            pasaFiltroEstado = estadoBD === estadoEsperado;
        }

        // 2. Filtro por Número
        let pasaFiltroNumero = true;
        if (filtroNumero) {
            pasaFiltroNumero = numeroBD.includes(filtroNumero);
        }
        
        // 3. Filtro por Mozo
        let pasaFiltroMozo = true;
        if (filtroMozo) {
            pasaFiltroMozo = mozoBD.includes(filtroMozo.toLowerCase());
        }

        return pasaFiltroEstado && pasaFiltroNumero && pasaFiltroMozo;
    });

    const arrayCampos = ["ID", "Número", "Mozo a cargo", "Estado", "Acciones"];

    return (
        <div className="container">
            <button className="toggle-filtros" onClick={toggleFiltros}>
                Filtros
            </button>

            {mostrarFiltros && (
                <div className="filtros">
                    <input 
                        type="text" 
                        placeholder="Buscar por número" 
                        value={filtroNumero}
                        onChange={handleFiltroNumeroChange}
                    />
                    <input 
                        type="text" 
                        placeholder="Buscar por mozo" 
                        value={filtroMozo}
                        onChange={handleFiltroMozoChange}
                    />
                </div>
            )}

            <div className="filtros-estado">
                <div className="estados">
                    <Filtro estadoActual={estadoFiltro} estadoValor="todas" nombreFiltro="Todas" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="disponible" nombreFiltro="Disponible" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="ocupada" nombreFiltro="Ocupada" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="no-disponible" nombreFiltro="No Disponible" onClick={filtrarEstado} />
                </div>

                <button className="btn-agregar" onClick={() => navigate("/mesas/FormMesas")}>
                    + Agregar Mesa
                </button>
            </div>

            <TablaMesas
                mesas={mesasFiltradas}
                arrayCampos={arrayCampos}
                funcionCambiarEstado={cambiarEstado}
                funcionModificar={navegarAModificar}
                funcionLiberar={liberarMesa} 
                funcionPonerNoDisponible={ponerNoDisponible}
            />
        </div>
    );
}
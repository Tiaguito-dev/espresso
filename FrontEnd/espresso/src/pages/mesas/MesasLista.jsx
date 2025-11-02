// src/pages/mesas/MesasLista.jsx

import React, { useState, useEffect } from "react";
import { getMesas, updateMesa } from "../../services/mesasService"; 
import { useNavigate } from "react-router-dom";
import "./Mesas.css";

import Filtro from "../menu/Filtro";
import TablaMesas from "./TablaMesas"; 

export default function MesasLista() {
    const [mesas, setMesas] = useState([]);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
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

    // --- Lógica de Actualización de Estado (Envía al Backend: 'disponible', 'ocupada', 'fuera de servicio') ---

    // 🔄 Cambiar estado (Alterna entre disponible <-> ocupada)
    const cambiarEstado = async (id) => {
        try {
            const mesaActual = mesas.find((m) => m.nroMesa === id); 
            if (!mesaActual) return; 

            const estadoActualLower = (mesaActual.estadoMesa || "").toLowerCase();
            
            // Bloquear si la mesa está en "fuera de servicio"
            if (estadoActualLower === "fuera de servicio") return; 

            // Determina el siguiente estado (en minúscula, para la API)
            const siguienteEstadoAPI = 
                estadoActualLower === "ocupada" 
                    ? "disponible" 
                    : "ocupada";   
            
            const updates = { 
                estado: siguienteEstadoAPI, // Clave 'estado' y valor 'disponible'/'ocupada'
            };
            
            if (siguienteEstadoAPI === "disponible") { 
                updates.mozoACargo = null;
            }
            
            await updateMesa(id, updates); 
            fetchMesas(); // Refresca la lista

        } catch (error) {
            console.error("Error al cambiar el estado de la mesa:", error);
            alert(`Error al cambiar el estado: ${error.message || 'Verifique la consola para detalles.'}`);
        }
    };

    // 🧹 Función liberarMesa
    const liberarMesa = async (id) => {
        if (window.confirm("¿Desea liberar/activar la mesa?")) {
            try {
                await updateMesa(id, { 
                    estado: "disponible", // Valor esperado por el Backend
                    mozoACargo: null,
                });
                fetchMesas();
            } catch (error) {
                console.error("Error al liberar la mesa:", error);
                alert("No se pudo liberar/activar la mesa.");
            }
        }
    };

    const ponerNoDisponible = async (nroMesa) => {
        try {
            // ¡mesasService ahora está definido!
            const nuevoEstado = 'fuera de servicio'; 
            await mesasService.cambiarEstadoMesa(nroMesa, nuevoEstado);
            fetchMesas(); 
        } catch (error) {
            console.error("Error al poner la mesa no disponible:", error);
        }
    
    };
    
    // ✏️ Navegar a modificar
    const navegarAModificar = (id) => {
        navigate(`/mesas/modificar/${id}`);
    };

    // --- Funciones de Filtrado y Renderizado ---

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

    // 🔎 Lógica de Filtrado (Asegura la compatibilidad de estados)
    const mesasFiltradas = mesas.filter((mesa) => {
        // Mapea el estado del objeto Mesa a minúscula para la comparación
        const estadoBD = (mesa.estadoMesa || "").toLowerCase();
        const numeroBD = mesa.nroMesa ? String(mesa.nroMesa) : ""; 
        const mozoBD = mesa.mozoACargo ? mozoACargo.toLowerCase() : ""

        // 1. Filtro por Estado (botones)
        let pasaFiltroEstado = true;
        if (estadoFiltro !== "todas") {
            // Convierte el filtro del botón ('no-disponible') al valor real del backend
            const estadoEsperado = estadoFiltro === "no-disponible" 
                ? "fuera de servicio" 
                : estadoFiltro;   

            pasaFiltroEstado = estadoBD === estadoEsperado;
        }

        // 2. Filtro por Número
        let pasaFiltroNumero = !filtroNumero || numeroBD.includes(filtroNumero);
        
        // 3. Filtro por Mozo
        let pasaFiltroMozo = !filtroMozo || mozoBD.includes(filtroMozo.toLowerCase());

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
// src/pages/pedidos/PedidosLista.jsx

import React, { useState, useEffect } from "react";
// Asegúrate de que updatePedido esté correctamente exportado aquí
import { getPedidos, updatePedido, deletePedido } from "../../services/pedidosService"; 
import { useNavigate } from "react-router-dom";
import "./PedidosLista.css";

import Filtro from "../menu/Filtro";
import TablaPedidos from "../../components/TablaPedidos"; // Importamos el componente contenedor de la tabla

export default function PedidosLista() {
    const [pedidos, setPedidos] = useState([]);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    const navigate = useNavigate();

    // 🔄 Cargar pedidos del back-end al inicio
    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            const data = await getPedidos();
            setPedidos(data);
        } catch (error) {
            console.error("Error al obtener los pedidos:", error);
        }
    };

    // 🎚️ Mostrar/Ocultar filtros
    const toggleFiltros = () => {
        setMostrarFiltros(!mostrarFiltros);
    };

    const filtrarEstado = (estado) => {
        setEstadoFiltro(estado);
    };

    // 🔄 Cambiar estado del pedido (Pendiente -> Listo -> Finalizado)
    const cambiarEstado = async (id) => {
        try {
            const pedidoActual = pedidos.find((p) => p.id === id);
            if (!pedidoActual) return;

            let siguienteEstado;
            if (pedidoActual.estado === "Pendiente") {
                siguienteEstado = "Listo";
            } else if (pedidoActual.estado === "Listo") {
                siguienteEstado = "Finalizado";
            } else {
                alert(`El pedido ya está ${pedidoActual.estado} y no se puede avanzar.`);
                return;
            }

            // Llamada al servicio
            await updatePedido(id, { nuevoEstado: siguienteEstado });
            fetchPedidos();
        } catch (error) {
            console.error("Error al actualizar el estado del pedido:", error);
            alert("No se pudo actualizar el estado del pedido.");
        }
    };

    // ❌ Función para CANCELAR el pedido (usa updatePedido)
    const cancelarPedido = async (id) => {
        if (window.confirm("¿Seguro que desea CANCELAR el pedido? El estado pasará a 'Cancelado'.")) {
            try {
                // Llamada al servicio para actualizar el estado
                await updatePedido(id, { nuevoEstado: "Cancelado" });
                
                fetchPedidos(); 
                alert("Pedido cancelado correctamente.");
            } catch (error) {
                console.error("Error al cancelar el pedido:", error);
                alert("No se pudo cancelar el pedido.");
            }
        }
    };

    // ✏️ Navegar a modificar pedido
    const navegarAModificar = (id) => {
    // 🎯 La ruta debe incluir el ID del pedido
     navigate(`/pedidos/modificar/${id}`); 
   };

    // 🔍 Filtrar por estado
    const pedidosFiltrados = (() => {
        switch (estadoFiltro) {
            case "pendiente":
                return pedidos.filter((p) => p.estado === "Pendiente");
            case "listo":
                return pedidos.filter((p) => p.estado === "Listo");
            case "finalizado":
                return pedidos.filter((p) => p.estado === "Finalizado");
            case "cancelado":
                return pedidos.filter((p) => p.estado === "Cancelado");
            default:
                return pedidos;
        }
    })();
    
    // 📋 Definimos los campos de la tabla
    const arrayCampos = ["ID", "Mesa", "Mozo", "Fecha", "Estado", "Total", "Acciones"];


    return (
        <div className="container">
            {/* Botón de filtros */}
            <button className="toggle-filtros" onClick={toggleFiltros}>
                Filtros
            </button>

            {mostrarFiltros && (
                <div className="filtros">
                    <input type="text" placeholder="Buscar por mesa" />
                    <input type="text" placeholder="Buscar por estado" />
                </div>
            )}

            {/* Estados + botón agregar */}
            <div className="filtros-estado">
                <div className="estados">
                    <Filtro estadoActual={estadoFiltro} estadoValor="todos" nombreFiltro="Todos" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="pendiente" nombreFiltro="Pendiente" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="listo" nombreFiltro="Listo" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="finalizado" nombreFiltro="Finalizado" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="cancelado" nombreFiltro="Cancelado" onClick={filtrarEstado} />
                    {/* Podrías añadir un filtro para "Cancelado" si lo deseas */}
                </div>

                <button 
            className="btn-agregar" 
            // 🎯 Ruta para crear un nuevo pedido (normalmente sin ID)
            onClick={() => navigate("/pedidos/agregar")}
            >
               + Agregar Pedido
          </button>
            </div>

            {/* 📋 Uso del componente TablaPedidos, que ahora maneja el renderizado */}
            <TablaPedidos
                pedidos={pedidosFiltrados}
                arrayCampos={arrayCampos} // Pasamos los encabezados
                funcionCambiarEstado={cambiarEstado}
                funcionModificar={navegarAModificar}
                funcionEliminar={cancelarPedido} // Pasamos la función de cancelación para el botón "Baja"
            />
        </div>
    );
}
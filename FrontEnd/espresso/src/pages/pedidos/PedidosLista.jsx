// src/pages/pedidos/PedidosLista.jsx

import React, { useState, useEffect } from "react";
import { getPedidos, updatePedido, deletePedido } from "../../services/pedidosService";
import { useNavigate } from "react-router-dom";
import "./Pedidos.css";

import Filtro from "../menu/Filtro";
import TablaPedidos from "../../components/TablaPedidos"; 

export default function PedidosLista() {
    const [pedidos, setPedidos] = useState([]);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    
    // 🆕 Nuevos estados para los filtros de Mesa y Mozo
    const [filtroMesa, setFiltroMesa] = useState(""); 
    const [filtroMozo, setFiltroMozo] = useState(""); 
    
    const navigate = useNavigate();

    // 🔄 Cargar pedidos del back-end al inicio
    useEffect(() => {
        fetchPedidos();
    }, []);
    
    const fetchPedidos = async () => {
        try {
            const data = await getPedidos();
            // Asumo que tu backend devuelve la lista de pedidos con los campos que necesitas
            setPedidos(data);
        } catch (error) {
            console.error("Error al obtener los pedidos:", error);
        }
    };

    const toggleFiltros = () => {
        setMostrarFiltros(!mostrarFiltros);
    };

    const filtrarEstado = (estado) => {
        setEstadoFiltro(estado);
    };
    
    // 🆕 Manejadores de cambio para los inputs de Mesa y Mozo
    const handleFiltroMesaChange = (e) => {
        setFiltroMesa(e.target.value);
    };

    const handleFiltroMozoChange = (e) => {
        setFiltroMozo(e.target.value);
    };


    // 🔄 Cambiar estado del pedido
    const cambiarEstado = async (nroPedido) => { 
        try {
            // Buscamos el pedido en el estado local por su nroPedido
            const pedidoActual = pedidos.find((p) => p.nroPedido === nroPedido); 
            
            if (!pedidoActual) return;

            let siguienteEstado;
            // 🚨 CORRECCIÓN: Usamos 'estadoPedido' que es el nombre del campo en tus datos de ejemplo
            const estadoActual = pedidoActual.estadoPedido; 
            
            if (estadoActual === "pendiente") {
                siguienteEstado = "listo";
            } else if (estadoActual === "listo") {
                siguienteEstado = "finalizado";
            } else {
                alert(`El pedido ya está ${estadoActual} y no se puede avanzar.`);
                return;
            }

            // Llamada al servicio para actualizar solo el estado
            await updatePedido(nroPedido, { estadoPedido: siguienteEstado }); 
            fetchPedidos(); // Refrescamos la lista
        } catch (error) {
            console.error("Error al actualizar el estado del pedido:", error);
            alert("No se pudo actualizar el estado del pedido.");
        }
    };
    
    // 🗑️ Función para CANCELAR el pedido
    const cancelarPedido = async (nroPedido) => {
        if (window.confirm("¿Seguro que desea CANCELAR el pedido? El estado pasará a 'cancelado'.")) {
            try {
                // Llamada al servicio para actualizar el estado
                await updatePedido(nroPedido, { estadoPedido: "cancelado" }); 
                fetchPedidos();
                alert("Pedido cancelado correctamente.");
            } catch (error) {
                console.error("Error al cancelar el pedido:", error);
                alert("No se pudo cancelar el pedido.");
            }
        }
    };

    // 🛣️ Navegar a modificar pedido
    const navegarAModificar = (nroPedido) => { 
        navigate(`/pedidos/modificar/${nroPedido}`);
    };

    // 🔎 Lógica de Filtrado Combinado (Estado, Mesa y Mozo)
    // 🔎 Lógica de Filtrado Combinado (Estado, Mesa y Mozo)
    const pedidosFiltrados = pedidos.filter((p) => {
        // 🚨 AJUSTE AQUÍ: Usamos p.mozo, que es el campo simulado por el mock.
        const estadoBD = p.estadoPedido ? p.estadoPedido.toLowerCase() : 'desconocido'; 
        const mesaBD = p.mesa ? String(p.mesa) : ''; 
        const mozoBD = p.mozo ? p.mozo.toLowerCase() : ''; 

        // 1. Filtrar por Estado
        let pasaFiltroEstado = true;
        if (estadoFiltro !== "todos") {
            pasaFiltroEstado = estadoBD === estadoFiltro;
        }

        // 2. Filtrar por Mesa (Coincidencia parcial)
        let pasaFiltroMesa = true;
        if (filtroMesa) {
            pasaFiltroMesa = mesaBD.includes(filtroMesa);
        }

        // 3. Filtrar por Mozo (Coincidencia parcial, case-insensitive)
        let pasaFiltroMozo = true;
        if (filtroMozo) {
            pasaFiltroMozo = mozoBD.includes(filtroMozo.toLowerCase());
        }

        return pasaFiltroEstado && pasaFiltroMesa && pasaFiltroMozo;
    });

    // Definimos los campos de la tabla
    const arrayCampos = ["ID", "Mesa", "Mozo", "Fecha", "Estado", "Total", "Acciones"];


    return (
        <div className="container">
            {/* ... JSX restante ... */}
            <button className="toggle-filtros" onClick={toggleFiltros}>
                Filtros
            </button>

            {mostrarFiltros && (
                <div className="filtros">
                    {/* 🆕 Filtro por Mesa */}
                    <input 
                        type="text" 
                        placeholder="Buscar por nro. de Mesa" 
                        value={filtroMesa}
                        onChange={handleFiltroMesaChange}
                    />
                    {/* 🆕 Filtro por Mozo */}
                    <input 
                        type="text" 
                        placeholder="Buscar por Mozo (nombre)" 
                        value={filtroMozo}
                        onChange={handleFiltroMozoChange}
                    />
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
                </div>
                <button
                    className="btn-agregar"
                    onClick={() => navigate("/pedidos/agregar")}
                >
                    + Agregar Pedido
                </button>
            </div>

            {/* Uso del componente TablaPedidos */}
            <TablaPedidos
                pedidos={pedidosFiltrados}
                arrayCampos={arrayCampos} 
                funcionCambiarEstado={cambiarEstado}
                funcionModificar={navegarAModificar}
                funcionEliminar={cancelarPedido}
            />
        </div>
    );
}
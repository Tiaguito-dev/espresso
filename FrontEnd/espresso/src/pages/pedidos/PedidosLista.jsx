import React, { useState, useEffect } from "react";
// 🎯 CAMBIO: Importamos 'useLocation' para leer el estado de navegación
import { getPedidos, updatePedido } from "../../services/pedidosService";
import { useNavigate, useLocation } from "react-router-dom";
import "./Pedidos.css";

import Filtro from "../menu/Filtro";
import TablaPedidos from "../../components/TablaPedidos"; 

export default function PedidosLista() {
    const [pedidos, setPedidos] = useState([]);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    const navigate = useNavigate();
    const location = useLocation(); // 👈 Hook para acceder al estado de la URL

    // 🔄 Función para obtener pedidos del back-end
    const fetchPedidos = async () => {
        try {
            const data = await getPedidos();
            setPedidos(data);
        } catch (error) {
            console.error("Error al obtener los pedidos:", error);
        }
    };
    
    // 🎯 Lógica de Recarga Inicial y Forzada
    // 1. Cargar pedidos al montar.
    // 2. Cargar pedidos si el estado de navegación indica 'refresh'.
    useEffect(() => {
        const refreshRequired = location.state && location.state.refresh;
        
        fetchPedidos();

        // Si se detecta el flag 'refresh' de la navegación, lo limpiamos del historial
        // para evitar recargas accidentales si el usuario navega a otro lado y vuelve.
        if (refreshRequired) {
            console.log("Detectado refresh: Recargando pedidos y limpiando estado.");
            // Reemplazamos la entrada en el historial sin el estado 'refresh'
            navigate(location.pathname, { replace: true, state: {} });
        }
    // La dependencia 'location.key' asegura que el efecto se ejecute cuando la URL cambie, 
    // lo que incluye las navegaciones de vuelta desde 'modificar'
    }, [location.key]); 

    // Mostrar/Ocultar filtros
    const toggleFiltros = () => {
        setMostrarFiltros(!mostrarFiltros);
    };

    const filtrarEstado = (estado) => {
        setEstadoFiltro(estado);
    };

    // 🔄 Cambiar estado del pedido (Pendiente -> Listo -> Finalizado)
    const cambiarEstado = async (id) => {
        try {
            const pedidoActual = pedidos.find((p) => p.nroPedido === id);
            if (!pedidoActual) return;

            let siguienteEstado;
            if (pedidoActual.estadoPedido === "Pendiente") {
                siguienteEstado = "Listo";
            } else if (pedidoActual.estadoPedido === "Listo") {
                siguienteEstado = "Finalizado";
            } else {
                alert(`El pedido ya está ${pedidoActual.estadoPedido} y no se puede avanzar.`);
                return;
            }

            // Llamada al servicio
            await updatePedido(id, { nuevoEstado: siguienteEstado });
            // 🎯 Recargamos la lista inmediatamente después de una acción exitosa
            fetchPedidos();
        } catch (error) {
            console.error("Error al actualizar el estado del pedido:", error);
            alert("No se pudo actualizar el estado del pedido.");
        }
    };

    // Función para CANCELAR el pedido (usa updatePedido)
    const cancelarPedido = async (id) => {
        if (window.confirm("¿Seguro que desea CANCELAR el pedido? El estado pasará a 'Cancelado'.")) {
            try {
                // Llamada al servicio para actualizar el estado
                await updatePedido(id, { nuevoEstado: "Cancelado" });

                // 🎯 Recargamos la lista inmediatamente después de una acción exitosa
                fetchPedidos();
                alert("Pedido cancelado correctamente.");
            } catch (error) {
                console.error("Error al cancelar el pedido:", error);
                alert("No se pudo cancelar el pedido.");
            }
        }
    };

    // Navegar a modificar pedido
    const navegarAModificar = (id) => {
        // 🎯 La ruta debe incluir el ID del pedido
        navigate(`/pedidos/modificar/${id}`);
    };

    // Filtrar por estado
    const pedidosFiltrados = (() => {
        switch (estadoFiltro) {
            case "pendiente":
                return pedidos.filter((p) => p.estadoPedido === "Pendiente");
            case "listo":
                return pedidos.filter((p) => p.estadoPedido === "Listo");
            case "finalizado":
                return pedidos.filter((p) => p.estadoPedido === "Finalizado");
            case "cancelado":
                return pedidos.filter((p) => p.estadoPedido === "Cancelado");
            default:
                return pedidos;
        }
    })();

    //Definimos los campos de la tabla
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
                </div>
                <button
                    className="btn-agregar"
                    // Ruta para crear un nuevo pedido (normalmente sin ID)
                    onClick={() => navigate("/pedidos/agregar")}
                >
                    + Agregar Pedido
                </button>
            </div>

            {/* Uso del componente TablaPedidos, que ahora maneja el renderizado */}
            <TablaPedidos
                pedidos={pedidosFiltrados}
                arrayCampos={arrayCampos} // Pasamos los encabezados
                funcionCambiarEstado={cambiarEstado}
                funcionModificar={navegarAModificar}
                funcionEliminar={cancelarPedido}
            />
        </div>
    );
}
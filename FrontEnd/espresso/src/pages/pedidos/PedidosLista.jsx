import React, { useState, useEffect } from "react";
import { getPedidos, updatePedido } from "../../services/pedidosService";
import { useNavigate, useLocation } from "react-router-dom";
import "./Pedidos.css";

import Filtro from "../menu/Filtro";
import TablaPedidos from "../../components/TablaPedidos"; 


// ===========================================
// COMPONENTE PRINCIPAL
// ===========================================

export default function PedidosLista() {
    const [pedidos, setPedidos] = useState([]);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    
    // 🛑 AJUSTE: INICIALIZAMOS EL FILTRO DE ESTADO EN 'todos'
    const [estadoFiltro, setEstadoFiltro] = useState("todos"); 
    
    // 🛑 AJUSTE: Quitamos 'fecha' del estado de búsqueda
    const [filtroBusqueda, setFiltroBusqueda] = useState({
        mesa: "",
        mozo: "",
    });
    
    const navigate = useNavigate();
    const location = useLocation();

    // Maneja cambios en los campos de búsqueda de texto
    const handleFiltroBusquedaChange = (e) => {
        const { name, value } = e.target;
        setFiltroBusqueda((prev) => ({ ...prev, [name]: value }));
    };

    // Función para obtener pedidos del back-end
    const fetchPedidos = async () => {
        try {
            // Asumimos que getPedidos() SOLO trae los del día, sin necesidad de filtrar en el front
            const data = await getPedidos();
            setPedidos(data);
        } catch (error) {
            console.error("Error al obtener los pedidos:", error);
        }
    };
    
    // Lógica de Recarga Inicial y Forzada
    useEffect(() => {
        fetchPedidos();

        // Limpiar el flag 'refresh' si existe después de la navegación.
        if (location.state && location.state.refresh) {
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.key]); 

    // Mostrar/Ocultar filtros
    const toggleFiltros = () => {
        setMostrarFiltros(!mostrarFiltros);
    };

    const filtrarEstado = (estado) => {
        setEstadoFiltro(estado);
    };

    // Cambiar estado del pedido (Pendiente -> Listo -> Finalizado)
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

            await updatePedido(id, { nuevoEstado: siguienteEstado });
            fetchPedidos();
        } catch (error) {
            console.error("Error al actualizar el estado del pedido:", error);
            alert("No se pudo actualizar el estado del pedido.");
        }
    };

    // Función para CANCELAR el pedido (Dar de Baja)
    const cancelarPedido = async (id) => {
        if (window.confirm("¿Seguro que desea CANCELAR el pedido? El estado pasará a 'Cancelado'.")) {
            try {
                await updatePedido(id, { nuevoEstado: "Cancelado" }); 
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
        navigate(`/pedidos/modificar/${id}`);
    };

    // 🛑 LÓGICA DE FILTRADO UNIFICADA (Simplificada)
    const pedidosFiltrados = (() => {
        const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1).toLowerCase()) || "";
        let resultados = pedidos;
        
        // 1. FILTRO DE ESTADO (Prioritario)
        switch (estadoFiltro) {
            case "cancelado": 
                resultados = resultados.filter((p) => p.estadoPedido.toLowerCase() === "cancelado");
                break;
            case "todos":
                // Aquí, "todos" significa todos los pedidos del día (ya filtrados por el backend)
                break;
            default:
                // Aplicar filtros Pendiente, Listo, Finalizado...
                const estadoAComparar = capitalize(estadoFiltro);
                resultados = resultados.filter((p) => p.estadoPedido === estadoAComparar);
                break;
        }

        // 2. FILTROS DE BÚSQUEDA POR TEXTO
        const { mesa, mozo } = filtroBusqueda;

        if (mesa) {
            resultados = resultados.filter((p) =>
                String(p.mesa?.nroMesa).includes(mesa.trim())
            );
        }

        if (mozo) {
            resultados = resultados.filter((p) =>
                // Busca en mozoACargo o en el campo 'mozo' si existiera, sin distinguir mayúsculas/minúsculas
                String(p.mesa?.mozoACargo || p.mozo || '').toLowerCase().includes(mozo.trim().toLowerCase())
            );
        }
        
        return resultados;
    })();

    // Definimos los campos de la tabla
    // Quitamos "Fecha" de los campos ya que todos son de hoy
    const arrayCampos = ["ID", "Mesa", "Mozo", "Fecha" ,"Estado", "Total", "Acciones"];


    return (
        <div className="container">
            {/* Botón de filtros */}
            <button className="toggle-filtros" onClick={toggleFiltros}>
                {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>

            {/* 🛑 CAMPOS DE BÚSQUEDA AVANZADA (Mesa y Mozo) */}
            {mostrarFiltros && (
                <div className="filtros">
                    <input 
                        type="number" 
                        name="mesa"
                        placeholder="Buscar por mesa (Nro)" 
                        value={filtroBusqueda.mesa}
                        onChange={handleFiltroBusquedaChange}
                    />
                    <input 
                        type="text" 
                        name="mozo"
                        placeholder="Buscar por mozo (Nombre)" 
                        value={filtroBusqueda.mozo}
                        onChange={handleFiltroBusquedaChange}
                    />
                    {/* 🛑 Se elimina el input de fecha */}
                </div>
            )}

            {/* 🛑 ESTADOS + botones especiales + botón agregar */}
            <div className="filtros-estado">
                <div className="estados">

                    {/* 🛑 Se elimina el filtro "Pedidos de Hoy" */}
                    
                    <Filtro estadoActual={estadoFiltro} estadoValor="todos" nombreFiltro="Todos" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="pendiente" nombreFiltro="Pendiente" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="listo" nombreFiltro="Listo" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="finalizado" nombreFiltro="Finalizado" onClick={filtrarEstado} />
                    
                    {/* 🛑 BOTÓN CANCELADOS */}
                    <Filtro estadoActual={estadoFiltro} estadoValor="cancelado" nombreFiltro="Cancelados" onClick={filtrarEstado} />
                </div>
                <button
                    className="btn-agregar"
                    onClick={() => navigate("/pedidos/agregar")}
                >
                    + Agregar Pedido
                </button>
            </div>

            {/* Renderizado de la tabla de pedidos */}
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
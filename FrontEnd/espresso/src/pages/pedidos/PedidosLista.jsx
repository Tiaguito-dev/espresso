import React, { useState, useEffect } from "react";
import { getPedidos, updatePedido, deletePedido } from "../../services/pedidosService";
import { useNavigate } from "react-router-dom";
import "../../UnicoCSS.css";
import Filtro from "../menu/Filtro";
import TablaPedidos from "../../components/TablaPedidos";

export default function PedidosLista() {
    const [pedidos, setPedidos] = useState([]);
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    const navigate = useNavigate();

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

    const filtrarEstado = (estado) => {
        setEstadoFiltro(estado);
    };

    
    const cambiarEstado = async (id) => {
        try {
            const pedidoActual = pedidos.find((p) => p.nroPedido === id);
            if (!pedidoActual) return;

            let siguienteEstado;
            if (pedidoActual.estadoPedido === "pendiente") {
                siguienteEstado = "listo";
            } else if (pedidoActual.estadoPedido === "Pendiente") {
                siguienteEstado = "pendiente";
            } else if (pedidoActual.estadoPedido === "listo") {
                siguienteEstado = "finalizado";
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

    const cancelarPedido = async (id) => {
        if (window.confirm("¿Seguro que desea CANCELAR el pedido? El estado pasará a 'Cancelado'.")) {
            try {
                await updatePedido(id, { nuevoEstado: "cancelado" });

                fetchPedidos();
                alert("Pedido cancelado correctamente.");
            } catch (error) {
                console.error("Error al cancelar el pedido:", error);
                alert("No se pudo cancelar el pedido.");
            }
        }
    };

    const navegarAModificar = (id) => {
        navigate(`/pedidos/modificar/${id}`);
    };


    // Filtrar por estado
    const pedidosFiltrados = (() => {
        switch (estadoFiltro) {
            case "pendiente":
                return pedidos.filter((pedido) => pedido.estadoPedido === "pendiente");
            case "listo":
                return pedidos.filter((pedido) => pedido.estadoPedido === "listo");
            case "finalizado":
                return pedidos.filter((pedido) => pedido.estadoPedido === "finalizado");
            case "cancelado":
                return pedidos.filter((pedido) => pedido.estadoPedido === "cancelado");
            default:
                return pedidos;
        }
    })();


    const arrayCampos = ["ID", "Mesa", "Mozo", "Fecha", "Estado", "Total", "Acciones"];


    return (

        <div className="tabla-contenedor">
            
            <h1 className="titulo-tabla">Gestión de Pedidos</h1>

            <div className="div-botones">
                <div className="controles-izquierda">
                    <div className="filtros-estado">
                        <div className="estados">
                            <Filtro estadoActual={estadoFiltro} estadoValor="todos" nombreFiltro="Todos" onClick={filtrarEstado} />
                            <Filtro estadoActual={estadoFiltro} estadoValor="pendiente" nombreFiltro="Pendiente" onClick={filtrarEstado} />
                            <Filtro estadoActual={estadoFiltro} estadoValor="listo" nombreFiltro="Listo" onClick={filtrarEstado} />
                            <Filtro estadoActual={estadoFiltro} estadoValor="finalizado" nombreFiltro="Finalizado" onClick={filtrarEstado} />
                            <Filtro estadoActual={estadoFiltro} estadoValor="cancelado" nombreFiltro="Cancelado" onClick={filtrarEstado} />
                        </div>
                    </div>
                </div>
                <button
                    className="boton-agregar"
                    onClick={() => navigate("/pedidos/agregar")}
                >
                    + Agregar Pedido
                </button>
            </div>

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
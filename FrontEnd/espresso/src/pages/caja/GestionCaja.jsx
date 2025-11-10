import React, { useState, useEffect } from "react";
import { getPedidos, updatePedido } from "../../services/pedidosService";
import { useNavigate } from "react-router-dom";
import "../../UnicoCSS.css"
import Filtro from "./../menu/Filtro";
import DetallePedido from './DetallePedido';
import CabeceraTablaPedidos from "../../components/CabeceraTablaPedidos.jsx";


function GestionCaja() {
    const [pedidos, setPedidos] = useState([]);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
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

    const toggleFiltros = () => {
        setMostrarFiltros(!mostrarFiltros);
    };

    const filtrarEstado = (estado) => {
        setEstadoFiltro(estado);
    };

    const cambiarEstado = async (id) => {
        const nuevoEstado = prompt(
        "Ingrese nuevo estado (pendiente, listo, finalizado, cancelado):"
        );
        if (!nuevoEstado) return;

        try {
            await updatePedido(id, { estado: nuevoEstado });
            fetchPedidos(); // Vuelve a cargar los pedidos para ver el cambio
        } catch (error) {
            console.error("Error al actualizar el estado del pedido:", error);
        }
    };

    const pedidosFiltrados = estadoFiltro === "todos" ? pedidos : pedidos.filter((p) => p.estadoPedido === estadoFiltro);


//Funciones para cambios de estados fijos

    const cambiarEstadoFinalizado = async (id) => {
        const nuevoEstado = "finalizado";
        if (!nuevoEstado) return;
        try {
            await updatePedido(id, { estado: nuevoEstado });
            fetchPedidos(); // Vuelve a cargar los pedidos para ver el cambio
        } catch (error) {
            console.error("Error al actualizar el estado del pedido:", error);
        }
    };


//Detalle en ventana emergente

    const [estadoDetalle, setEstadoDetalle] = useState(false);
    const [pedidoDetalle, setPedidoDetalle] = useState(null);

    const abrirDetalle = (pedido) => {
        setPedidoDetalle(pedido);
        setEstadoDetalle(true);
    };

    const cerrarDetalle = () => {
        setEstadoDetalle(false);
        setPedidoDetalle(null);
    };

//Manejo de errores por si no se encuentra un pedido (se tiene que definir si o si para poder pasar el id del pedido)
    const idPedido = pedidoDetalle ? pedidoDetalle.nroPedido : 'No se encuentra el pedido';


//Definicion de las columnas de la tabla principal
    const camposTabla = ["N° Pedido", "Mozo", "N° Mesa", "Precio Total", "Estado", "Acciones"];

//Definicion de las columnas de la tabla de detalle
    const camposDetalle = ["ID", "Producto", "Cantidad"];

    return (
        <div className="tabla-contenedor">
        <div className="div-espacio-navbar"></div>

        <h1 className="titulo-tabla">Gestión de Caja</h1>

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
        </div>

        <table className="tabla">

            <CabeceraTablaPedidos arrayCampos={camposTabla}></CabeceraTablaPedidos>

            <tbody>
                {pedidosFiltrados.map((pedido) => (
                    <tr key={pedido.nroPedido} data-estado={pedido.estadoPedido}>
                        <td>{pedido.nroPedido}</td>
                        <td>{pedido.mozo}</td>
                        <td>{pedido.mesa.nroMesa}</td>
                        <td>{pedido.total}</td>     
                        <td>
                            <span className={`estado ${pedido.estadoPedido.toLowerCase()}`}>
                                {pedido.estadoPedido}
                            </span>
                        </td>
                        <td className="acciones">
                            <button
                                className="info"
                                onClick={() => abrirDetalle(pedido)}
                            >
                                Ver detalle
                            </button>
                            <button
                                className="modificarFinalizado"
                                onClick={() => cambiarEstadoFinalizado(pedido.nroPedido)}
                            >
                                Marcar Cobrado
                            </button>

                            <DetallePedido funcionAbrir={estadoDetalle} funcionCerrar={cerrarDetalle}>
                                <h2>Detalle del Pedido #{idPedido}</h2>
                                {pedidoDetalle && (
                                    <>
                                        <strong>Numero de Mesa: {pedidoDetalle.mesa.nroMesa}</strong>
                                        <table>

                                            <CabeceraTablaPedidos arrayCampos={camposDetalle}></CabeceraTablaPedidos>

                                            <tbody>
                                                {pedidoDetalle.lineasPedido.map((producto) => (
                                                        <tr>
                                                            <td>{producto.nombreProducto}</td>
                                                            <td>{producto.cantidad}</td>
                                                            <td>{producto.precioUnitario}</td>
                                                        </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <p><strong>Total: {pedidoDetalle.total}</strong></p>
                                    </>
                                )}
                            </DetallePedido>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}

export default GestionCaja;
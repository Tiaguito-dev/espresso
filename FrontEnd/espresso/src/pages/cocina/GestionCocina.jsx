import React, { useState, useEffect } from "react";
import { getPedidos, updatePedido } from "../../services/pedidosService";
import { useNavigate } from "react-router-dom";
import Filtro from "./../menu/Filtro";
import "../../UnicoCSS.css"
import CabeceraTablaPedidos from "../../components/CabeceraTablaPedidos.jsx";
import DetallePedido from "../caja/DetallePedido";
import Acordeon from "./Acordeon.jsx"


function GestionCocina() {
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

    const cambiarEstadoListo = async (id) => {
        const nuevoEstado = "listo";
        if (!nuevoEstado) return;

        try {
            await updatePedido(id, { estado: nuevoEstado });
            fetchPedidos(); // Vuelve a cargar los pedidos para ver el cambio
        } catch (error) {
            console.error("Error al actualizar el estado del pedido:", error);
        }
    };

//Detalle de acordeon
//    const [pedidoAcordeon, setPedidoAcordeon] = useState(null);

//    const cargarAcordeon = (pedido) => {
//        setPedidoAcordeon(pedido);
//    }

//    const idAcordeon = pedidoAcordeon ? pedidoAcordeon.id : 'No se encuentra el pedido';

//Defino los campos de la tabla principal
    const camposTabla = ["N° Pedido", "Mozo", "N° Mesa", "", "Estado", "Acciones"];

//Defino los campos del acordeon
    const camposAcordeon = ["ID", "Producto", "Cantidad"];


//Ventana emergente para las observaciones

    const [estadoObservacion, setEstadoObservacion] = useState(false);
    const [pedidoObservacion, setPedidoObservacion] = useState(null);

    const abrirObservacion = (pedido) => {
        setPedidoObservacion(pedido);
        setEstadoObservacion(true);
    };

    const cerrarObservacion = () => {
        setEstadoObservacion(false);
        setPedidoObservacion(null);
    };

//Manejo de errores por si no se encuentra un pedido (se tiene que definir si o si para poder pasar el id del pedido)
    const idPedido = pedidoObservacion ? pedidoObservacion.nroPedido : 'No se encuentra el pedido';



    return (
        <div className="tabla-contenedor">
            <h1 className="titulo-tabla">Gestión de Cocina</h1>
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
                        <tr key={pedido.nroPedido} data-estado={pedido.estadoPedido} className="fila-cocina">

                            <td>{pedido.nroPedido}</td>
                            <td>{pedido.mozo}</td>
                            <td>{pedido.mesa.nroMesa}</td>

                            <td> 
                                <Acordeon> 
                                    <table className="tabla-acordeon">
                                        
                                        <CabeceraTablaPedidos arrayCampos={camposAcordeon}></CabeceraTablaPedidos>

                                        <tbody>
                                            {pedido.lineasPedido.map((producto, index) => (
                                                <tr key={index} className="fila">
                                                    <td>{producto.idProducto}</td>
                                                    <td>{producto.nombreProducto}</td>
                                                    <td>{producto.cantidad}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Acordeon>
                            </td>

                            <td>
                                <span className={`estado ${pedido.estadoPedido.toLowerCase()}`}>
                                    {pedido.estadoPedido}
                                </span>
                            </td>
                            
                            <td className="acciones">
                                <button
                                    className="info"
                                    onClick={() => abrirObservacion(pedido)}
                                >
                                    Observación
                                </button>
                                <button
                                    className="modificar"
                                    onClick={() => cambiarEstado(pedido.nroPedido)}
                                >
                                    Cambiar Estado
                                </button>
                                <button
                                    className="modificarFinalizado"
                                    onClick={() => cambiarEstadoListo(pedido.nroPedido)}
                                >
                                    Marcar Listo
                                </button>

                                <DetallePedido funcionAbrir={estadoObservacion} funcionCerrar={cerrarObservacion}>
                                    <h2>Detalle del Observacion #{idPedido}</h2>
                                    {pedidoObservacion && (
                                        <>
                                            <div className="filtros">
                                                <p>{pedidoObservacion.observacion}</p>
                                            </div>
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

export default GestionCocina;
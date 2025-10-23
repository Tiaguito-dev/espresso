import React, { useState, useEffect } from "react";
import { getPedidos, updatePedido } from "../../services/pedidosService";
import { useNavigate } from "react-router-dom";
import "../pedidos/PedidosLista.css";
import Filtro from "./../menu/Filtro";
import DetallePedido from '../caja/DetallePedido';
import Acordeon from "./Acordeon";


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
        "Ingrese nuevo estado (Pendiente, Listo, Finalizado, Cancelado):"
        );
        if (!nuevoEstado) return;

        try {
            await updatePedido(id, { estado: nuevoEstado });
            fetchPedidos(); // Vuelve a cargar los pedidos para ver el cambio
        } catch (error) {
            console.error("Error al actualizar el estado del pedido:", error);
        }
    };

    const pedidosFiltrados = estadoFiltro === "todos" ? pedidos : pedidos.filter((p) => p.estado === estadoFiltro);


//Funciones para cambios de estados fijos

    const cambiarEstadoListo = async (id) => {
        const nuevoEstado = "Listo";
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
    const idPedido = pedidoDetalle ? pedidoDetalle.id : 'No se encuentra el pedido';


//Detalle de acordeon
//    const [pedidoAcordeon, setPedidoAcordeon] = useState(null);

//    const cargarAcordeon = (pedido) => {
//        setPedidoAcordeon(pedido);
//    }

//    const idAcordeon = pedidoAcordeon ? pedidoAcordeon.id : 'No se encuentra el pedido';


    return (
        <div className="container">
        {/* Botón filtros */}
        <button className="toggle-filtros" onClick={toggleFiltros}>
            Filtros
        </button>
        {mostrarFiltros && (
            <div className="filtros">
            <input type="text" placeholder="Buscar por Mozo" />
            <input type="text" placeholder="Buscar por Mesa" />
            </div>
        )}

        <div className="filtros-estado">
            <div className="estados">
                <Filtro estadoActual={estadoFiltro} estadoValor="todos" nombreFiltro="Todos" onClick={filtrarEstado} />
                <Filtro estadoActual={estadoFiltro} estadoValor="Pendiente" nombreFiltro="Pendiente" onClick={filtrarEstado} />
                <Filtro estadoActual={estadoFiltro} estadoValor="Listo" nombreFiltro="Listo" onClick={filtrarEstado} />
                <Filtro estadoActual={estadoFiltro} estadoValor="Finalizado" nombreFiltro="Finalizado" onClick={filtrarEstado} />
                <Filtro estadoActual={estadoFiltro} estadoValor="Cancelado" nombreFiltro="Cancelado" onClick={filtrarEstado} />
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>N° Pedido</th>
                    <th>N° Mozo</th>
                    <th>N° Mesa</th>
                    <th></th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {pedidosFiltrados.map((pedido) => (
                    <tr key={pedido.id} data-estado={pedido.estado} className="fila-cocina">

                        <td>{pedido.id}</td>
                        <td></td>
                        <td>{pedido.mesa}</td>

                        <td> 
                            <Acordeon> 
                                <table className="tabla-acordeon">
                                    <thead>
                                        <tr className="fila">
                                            <th>ID</th>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Usar pedido.productos, NO pedidoAcordeon.productos */}
                                        {pedido.productos.map((producto, index) => (
                                            <tr key={index} className="fila">
                                                <td>{producto.id}</td>
                                                <td>{producto.nombre}</td>
                                                <td>{producto.cantidad}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Acordeon>
                        </td>

                        <td>
                            <span className={`estado ${pedido.estado.toLowerCase()}`}>
                                {pedido.estado}
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
                                className="modificar"
                                onClick={() => cambiarEstado(pedido.id)}
                            >
                                Cambiar Estado
                            </button>
                            <button
                                className="modificar"
                                onClick={() => cambiarEstadoListo(pedido.id)}
                            >
                                Marcar Listo
                            </button>

                            <DetallePedido funcionAbrir={estadoDetalle} funcionCerrar={cerrarDetalle}>
                                <h2>Detalle del Pedido #{idPedido}</h2>
                                {pedidoDetalle && (
                                    <>
                                        <strong>Numero de Mesa: {pedidoDetalle.mesa}</strong>
                                        <table>
                                            <thead>
                                                <th>id</th>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                            </thead>
                                            <tbody>
                                                {pedidoDetalle.productos.map((producto) => (
                                                    <tr>
                                                        {/* id muestra un nombre pero deberia mostrar el id del producto */}
                                                        <td>{producto.id}</td>
                                                        <td>{producto.nombre}</td>
                                                        <td>{producto.cantidad}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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
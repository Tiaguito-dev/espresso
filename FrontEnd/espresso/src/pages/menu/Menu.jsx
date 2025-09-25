import React, { useState, useEffect } from "react";
import { getPedidos, updatePedido } from "../../services/pedidosService"; // Importamos las funciones
import { useNavigate } from "react-router-dom"; // Esto es para navegar programáticamente, es decir, cuando hacemos click en "Agregar Pedido"
import "./Menu.css";

//useState, useEffect y useNavigate son hooks de React.
export default function Menu() {
    const [pedidos, setPedidos] = useState([]);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    const navigate = useNavigate();

    // Usamos useEffect para cargar los pedidos del back-end al inicio
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

    const pedidosFiltrados =
        estadoFiltro === "todos" ? pedidos : pedidos.filter((p) => p.estado === estadoFiltro);

    return (
        <div className="container">
            {/* Botón filtros */}
            <button className="toggle-filtros" onClick={toggleFiltros}>
                Filtros
            </button>
            {mostrarFiltros && (
                <div className="filtros">
                    <input type="text" placeholder="Buscar por código" />
                    <input type="text" placeholder="Buscar por nombre" />
                </div>
            )}

            {/* Estados + agregar pedido */}
            <div className="filtros-estado">
                <div className="estados">
                    <span onClick={() => filtrarEstado("todos")}>Todos</span>
                    <span onClick={() => filtrarEstado("Pendiente")}>Pendientes</span>
                    <span onClick={() => filtrarEstado("Listo")}>Listos</span>
                    <span onClick={() => filtrarEstado("Finalizado")}>Finalizados</span>
                    <span onClick={() => filtrarEstado("Cancelado")}>Cancelados</span>
                </div>
                <button className="btn-agregar" onClick={() => navigate("/pedidos/agregar")}>+ Agregar Pedido</button>
            </div>

            {/* Tabla */}
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Disponible</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidosFiltrados.map((pedido) => (
                        <tr key={pedido.id} data-estado={pedido.estado}>
                            <td>{pedido.id}</td>
                            <td>{pedido.productos.map(p => `${p.nombre} ($${p.precio})`).join(', ')}</td>
                            <td>${pedido.total}</td>
                            <td>
                                <span className={`estado ${pedido.estado.toLowerCase()}`}>
                                    {pedido.estado}
                                </span>
                            </td>
                            <td className="acciones">
                                <button className="info">ℹ️ Mostrar info</button>
                                <button
                                    className="modificar"
                                    onClick={() => cambiarEstado(pedido.id)}
                                >
                                    ✏️ Modificar
                                </button>
                                <button className="baja">🗑️ Baja</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
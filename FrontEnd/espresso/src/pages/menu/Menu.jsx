import React, { useState, useEffect } from "react";
import { getProductos, updateProducto } from "../../services/productosService";
import { useNavigate } from "react-router-dom";
import "../pedidos/PedidosLista.css";

export default function Menu() {
    const [productos, setProductos] = useState([]);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    const navigate = useNavigate();

    // Cargar productos del back-end al inicio
    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const data = await getProductos();
            setProductos(data);
        } catch (error) {
            console.error("Error al obtener los productos:", error);
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
            "¿El producto está disponible? (true/false):"
        );

        // Convertir string a boolean
        const disponible = nuevoEstado === "true";

        if (nuevoEstado === null) return; // Usuario canceló

        try {
            await updateProducto(id, { disponible });
            fetchProductos(); // Recargar productos
        } catch (error) {
            console.error("Error al actualizar el estado del producto:", error);
        }
    };

    // Filtrar productos según el estado seleccionado
    const productosFiltrados = (() => {
        switch (estadoFiltro) {
            case "disponibles":
                return productos.filter(p => p.disponible === true);
            case "no-disponibles":
                return productos.filter(p => p.disponible === false);
            default:
                return productos;
        }
    })();

    return (
        <div className="container">
            {/* Botón filtros */}
{/* TODO ESTE APARTADO DE FILTROS ES UN COMPONENTE AL QUE SE LE PASA POR PARAMETRO TEXTO Y FUNCION*/}
            <button className="toggle-filtros" onClick={toggleFiltros}>
                Filtros
            </button>
            {mostrarFiltros && (
                <div className="filtros">
                    <input type="text" placeholder="Buscar por código" />
                    <input type="text" placeholder="Buscar por nombre" />
                </div>
            )}

{/* LOS SPAN DEBERIAN SER UN MISMO COMPONENTE QUE RECIBA COMO PARAMETRO EL TEXTO, EL ESTADO Y LA FUNCION */}

            {/* Estados + agregar producto */}
            <div className="filtros-estado">
                <div className="estados">
                    <span
                        className={estadoFiltro === "todos" ? "activo" : ""}
                        onClick={() => filtrarEstado("todos")}
                    >
                        Todos
                    </span>
                    <span
                        className={estadoFiltro === "disponibles" ? "activo" : ""}
                        onClick={() => filtrarEstado("disponibles")}
                    >
                        Disponibles
                    </span>
                    <span
                        className={estadoFiltro === "no-disponibles" ? "activo" : ""}
                        onClick={() => filtrarEstado("no-disponibles")}
                    >
                        No disponibles
                    </span>
                </div>

{/* ESTE BUTTON DEBE SER EL MISMO COMPONENTE QUE EL LA SECCION DE PEDIDOS */}
                <button
                    className="btn-agregar"
                    onClick={() => navigate("/menu/productos/")}
                >
                    + Agregar Producto
                </button>
            </div>


{/* LA TABLA DEBE SER UN COMPONENTE COMPUESTO */}
            {/* Tabla */}
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Disponible</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productosFiltrados.map((producto) => (

/* TODO EL TR ES UN COMPONENTE */
                        <tr
                            key={producto.id}
                            data-estado={producto.disponible ? 'disponible' : 'no-disponible'}
                        >
                            <td>{producto.id}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.descripcion}</td>
                            <td>${producto.precio}</td>
                            <td>
                                <span className={`disponibilidad ${producto.disponible ? 'disponible' : 'no-disponible'}`}>
                                    {producto.disponible ? "Disponible" : "No disponible"}
                                </span>
                            </td>

{/* ESTE TD ES TODO UN COMPONENTE COMPLETO */}
                            <td className="acciones">
                                <button className="info" onClick={() => cambiarEstado(producto.id)}>ℹ️ Disponibilidad</button>
                                <button className="modificar" onClick={() => navigate(`/menu/productos/${producto.id}`)}> ✏️ Modificar </button>
                                <button className="baja">🗑️ Baja</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
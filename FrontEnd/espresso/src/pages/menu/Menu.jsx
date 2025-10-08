import React, { useState, useEffect } from "react";
import { getProductos, updateProducto } from "../../services/productosService";
import { useNavigate } from "react-router-dom";
import "../pedidos/PedidosLista.css";

import Filtro from "./Filtro";
import TablaProducto from "./TablaProducto";
import BotonAccion from "./BotonAccion";

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

    const navegarAModificar = (idProducto) => {
        navigate(`/menu/productos/${idProducto}`);
    };

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

            {/* Estados + agregar producto */}
            <div className="filtros-estado">
                <div className="estados">
                    <Filtro estadoActual={estadoFiltro} estadoValor="todos" nombreFiltro="Todos" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="disponible" nombreFiltro="Disponible" onClick={filtrarEstado} />
                    <Filtro estadoActual={estadoFiltro} estadoValor="no-disponible" nombreFiltro="No Disponible" onClick={filtrarEstado} />
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
            <TablaProducto 
                productos={productosFiltrados}
                arrayCampos={["Codigo", "Nombre", "Descripcion", "Precio", "Disponible", "Acciones"]}
                funcionCambiarEstado={cambiarEstado}
                funcionModificar={navegarAModificar}
            ></TablaProducto>
        </div>
        
    );
}
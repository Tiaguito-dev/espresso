import React, { useState, useEffect } from "react";
import { getProductos, updateProducto, deleteProducto, updateEstadoProducto } from "../../services/productosService";
import { useNavigate } from "react-router-dom";
import "../pedidos/PedidosLista.css";
import "../menu/ClienteMenu.css";

import Filtro from "./Filtro";
import TablaProducto from "./TablaProducto";

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

    {/*const cambiarEstado = async (id) => {
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
    }; */}

    const cambiarEstado = async (id) => {
    
        const productoActual = productos.find(p => p.id === id);

        if (!productoActual) {
            console.error("No se encontró el producto con id:", id);
            return;
        }

        const nuevoEstado = !productoActual.disponible;

        const confirmacion = window.confirm(
            `¿Desea cambiar el estado del producto a: ${nuevoEstado ? 'Disponible' : 'No disponible'}?`
        );

        if (!confirmacion) {
            return;
        }

        try {

            await updateEstadoProducto(id, { disponible: nuevoEstado });
            
            fetchProductos(); 
            
        } catch (error) {
            console.error("Error al actualizar el estado del producto:", error);
            alert("Hubo un error al actualizar el estado.");
        }
    };

    // Filtrar productos según el estado seleccionado
    const productosFiltrados = (() => {
        switch (estadoFiltro) {
            case "disponible":
                return productos.filter(p => p.disponible === true);
            case "no-disponible":
                return productos.filter(p => p.disponible === false);
            default:
                return productos;
        }
    })();

    //elimino un producto    
    const eliminarProducto = async (id) => {
        if (window.confirm("¿Seguro que desea eliminar el producto?")) {
            try {
                await deleteProducto(id);
                alert("Producto eliminado correctamente");
                setProductos(prevProductos =>
                    prevProductos.filter(p => String(p.id) !== String(id))
                );
            } catch (error) {
                console.error("Error al eliminar el producto");
                alert("No se pudo eliminar el producto");
            };

        };
    };

    const navegarAModificar = (idProducto) => {
        navigate(`/menu/productos/${idProducto}`);
    };


    return (
        <div className="container">
            {/* Botón filtros */}
            <button className="toggle-filtros" onClick={toggleFiltros}>
                Filtros
            </button>

            <button className="btn-ver-menu" onClick={() => navigate("/menu/menuEspresso/")}>
                Ver menú Espresso
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


                <button
                    className="btn-agregar"
                    onClick={() => navigate("/menu/productos/")}
                >
                    + Agregar Producto
                </button>
            </div>


            <TablaProducto
                productos={productosFiltrados}
                arrayCampos={["Codigo", "Nombre", "Categoria", "Descripcion", "Precio", "Disponible", "Acciones"]}
                funcionCambiarEstado={cambiarEstado}
                funcionModificar={navegarAModificar}
                funcionEliminar={eliminarProducto}
            ></TablaProducto>
        </div>

    );
}
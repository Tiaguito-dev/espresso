// src/pages/pedidos/FormPedido.jsx (CORREGIDO)

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPedido, updatePedido, buscarPedidoPorId } from "../../services/pedidosService"; 
import { getProductos } from "../../services/productosService"; 
import "./AgregarPedido.css"; 


// ===========================================
// ESTRUCTURA INICIAL
// ===========================================

/*
 * Estructura local de 'productos' (líneas de pedido):
 * { idLineaPedido: N (opcional), id: idProducto, nombre: 'nombre', precio: precio, cantidad: N }
 */
const PEDIDO_INICIAL = {
    mesa: "",
    mozo: "",
    productos: [], 
    total: 0,
};

// ===========================================
// FUNCIONES AUXILIARES
// ===========================================

/**
 * Calcula el total sumando (precio * cantidad) de cada producto.
 */
const calcularTotal = (productosArray) => {
    // Aseguramos que precio y cantidad sean tratados como números
    return productosArray.reduce((acc, p) => acc + (Number(p.precio) * Number(p.cantidad)), 0);
};

// ===========================================
// COMPONENTE PRINCIPAL
// ===========================================

function FormPedido() {
    const { id } = useParams();
    const [pedido, setPedido] = useState(PEDIDO_INICIAL);
    const [productosDisponibles, setProductosDisponibles] = useState([]); 
    const [productoSeleccionado, setProductoSeleccionado] = useState(""); 
    const [cantidad, setCantidad] = useState(1);
    const navigate = useNavigate();

    const existeId = Boolean(id);
    const titulo = existeId ? "Modificar Pedido" : "Agregar Pedido";
    
    // Función auxiliar para obtener datos base del producto a partir de su ID
    const getProductoData = (id) => {
        return productosDisponibles.find(p => String(p.id) === String(id));
    };

    // 1. Cargar la lista de productos disponibles
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductos();
                setProductosDisponibles(data);
                
                if (data.length > 0) {
                    setProductoSeleccionado(data[0].id);
                }
            } catch (error) {
                console.error("Error al obtener productos:", error);
                alert("Error al cargar la lista de productos del back-end.");
            }
        };
        fetchProductos();
    }, []); 

    // 2. Cargar datos del pedido si estamos en modo edición (CON CORRECCIÓN DE DATOS)
    useEffect(() => {
        // Solo cargar si estamos editando Y la lista de productos disponibles ya cargó
        if (existeId && productosDisponibles.length > 0) {
            buscarPedidoPorId(id)
                .then((data) => {
                    
                    const lineasDelBackend = data.lineasPedido || []; 
                    
                    const productosLocal = lineasDelBackend.map(linea => {
                        
                        // Determinar el ID del producto
                        const idProducto = linea.producto 
                            ? linea.producto.id 
                            : linea.idProducto || null; 
                            
                        const cantidad = Number(linea.cantidad || 0);

                        // 1. Intentamos obtener la info del producto de la lista maestra
                        const base = getProductoData(idProducto) || { 
                            nombre: "Producto Desconocido", 
                            precio: 0 
                        };
                        
                        // 2. Si no lo encontramos, usamos la info que viene en la línea (para mantener nombre/precio originales)
                        const nombreFinal = base.nombre !== "Producto Desconocido" 
                            ? base.nombre 
                            : (linea.nombreProducto || linea.producto?.nombre || "Producto Desconocido");
                            
                        const precioFinal = Number(base.precio) !== 0 
                            ? Number(base.precio) 
                            : Number(linea.precioUnitario || linea.producto?.precio || 0); 
                        
                        return {
                            idLineaPedido: linea.id, // ID de la línea de pedido de la BD
                            id: idProducto,
                            nombre: nombreFinal, 
                            precio: precioFinal, 
                            cantidad: cantidad
                        };
                    });

                    setPedido({
                        mesa: data.mesa ? data.mesa.nroMesa : "", 
                        mozo: data.mozo || data.mozoACargo || "", // Añadimos mozoACargo por si el campo varía
                        productos: productosLocal, 
                        total: calcularTotal(productosLocal), // 🛑 AHORA CALCULA EL TOTAL CORRECTAMENTE
                    });
                })
                .catch(error => {
                    console.error("Error al buscar el pedido:", error);
                    alert("No se pudo cargar el pedido para modificar.");
                });
        }
    }, [id, existeId, productosDisponibles]); 

    // Maneja cambios en Mesa y Mozo
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPedido({ ...pedido, [name]: value });
    };

    // 3. Lógica para AGREGAR/ACTUALIZAR productos en la lista
    const handleAgregarProducto = () => {
        const productoBase = getProductoData(productoSeleccionado);
        
        if (!productoBase || cantidad <= 0) return;

        const productoExistente = pedido.productos.find(p => p.id === productoSeleccionado);
        let nuevosProductos;

        if (productoExistente) {
            // Actualizar cantidad y mantener idLineaPedido
            nuevosProductos = pedido.productos.map(p => 
                p.id === productoSeleccionado 
                    ? { ...p, cantidad: p.cantidad + Number(cantidad) }
                    : p
            );
        } else {
            // Agregar nuevo producto (sin idLineaPedido al inicio)
            const nuevoItem = {
                id: productoBase.id,
                nombre: productoBase.nombre,
                precio: Number(productoBase.precio), // Aseguramos que sea número
                cantidad: Number(cantidad),
            };
            nuevosProductos = [...pedido.productos, nuevoItem];
        }

        const nuevoTotal = calcularTotal(nuevosProductos);
        
        setPedido({
        ...pedido,
        productos: nuevosProductos,
        total: nuevoTotal,
        });

        setCantidad(1); 
    };

    // 4. Lógica para ELIMINAR un producto de la lista
    const handleEliminarProducto = (idProducto) => {
        const productosFiltrados = pedido.productos.filter(p => p.id !== idProducto);
        const nuevoTotal = calcularTotal(productosFiltrados);
        
        setPedido({
            ...pedido,
            productos: productosFiltrados,
            total: nuevoTotal,
        });
    };


    // 5. Manejar el envío del formulario (Crear o Actualizar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mapear al formato esperado por el backend (idLineaPedido opcional, idProducto requerido)
        const lineasBackend = pedido.productos.map(p => ({
            idLineaPedido: p.idLineaPedido, // Se mantiene si existe (para modificar)
            idProducto: p.id, 
            cantidad: p.cantidad
        }));
        
        // 🛑 CORRECCIÓN CLAVE: NO ENVIAMOS EL 'TOTAL' si el backend lo calcula o lo usa mal.
        // Solo enviamos los campos que deben actualizarse.
        const pedidoData = {
            mesa: Number(pedido.mesa),
            mozo: pedido.mozo,
            lineas: lineasBackend, 
            // total: pedido.total, <--- ELIMINADO para evitar conflictos en el backend
        };

        if (isNaN(pedidoData.mesa) || pedidoData.mesa <= 0 || !pedidoData.mozo || pedidoData.lineas.length === 0) {
            alert("Completa la mesa (número), el mozo y agrega al menos un producto.");
            return;
        }

        try {
            if (existeId) {
                // Si el backend es sensible al estado, la modificación SOLO debe enviar los datos de modificación.
                await updatePedido(id, pedidoData); 
                alert('Pedido actualizado correctamente');
            } else {
                await createPedido(pedidoData);
                alert('Pedido creado correctamente');
            }
            
            // Navegar de vuelta a la lista
            navigate('/pedidos', { state: { refresh: true } }); 
            
        } catch (error) {
            console.error("Error al procesar el pedido:", error);
            alert(`Error al ${existeId ? "actualizar" : "crear"} el pedido. Revisa tu conexión y el back-end.`);
        }
    };

    // ===========================================
    // RENDERIZADO
    // ===========================================

    return (
        <div className="pedido-form-container"> 
            <h2 className="form-title">{titulo}</h2>
            
            {productosDisponibles.length === 0 && !existeId ? (
                <p>Cargando productos...</p>
            ) : (
                <form onSubmit={handleSubmit} className="form-pedido">
                    
                    {/* ID (Solo lectura en modo edición) */}
                    {existeId && (
                        <div className="form-group">
                            <label>ID del Pedido</label>
                            <input
                                type="text"
                                value={id}
                                readOnly
                                className="form-control read-only"
                            />
                        </div>
                    )}
                    
                    <div className="form-row">
                        {/* Campo Mesa */}
                        <div className="form-group">
                            <label htmlFor="mesa">Mesa</label>
                            <input
                                id="mesa"
                                type="number" 
                                name="mesa" 
                                value={pedido.mesa}
                                onChange={handleChange}
                                placeholder="Número de mesa"
                                required
                                min="1"
                                className="form-control"
                            />
                        </div>
                        
                        {/* Campo Mozo */}
                        <div className="form-group">
                            <label htmlFor="mozo">Mozo</label>
                            <input
                                id="mozo"
                                type="text"
                                name="mozo" 
                                value={pedido.mozo}
                                onChange={handleChange}
                                placeholder="Nombre del Mozo"
                                required
                                className="form-control"
                            />
                        </div>
                    </div> 
                    
                    {/* SECCIÓN DE PRODUCTOS (CARRITO) */} 
                    <div className="productos-card">
                        <h3>Detalle del Pedido</h3>
                        
                        {/* Selector para AGREGAR Productos */}
                        <div className="add-item-row">
                            <select 
                                value={productoSeleccionado} 
                                onChange={(e) => setProductoSeleccionado(e.target.value)}
                                className="form-control select-producto"
                                disabled={productosDisponibles.length === 0}
                            >
                                {productosDisponibles.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre} - ${Number(p.precio).toFixed(2)}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={cantidad}
                                onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                                min="1"
                                placeholder="Cant."
                                className="form-control input-qty"
                                disabled={productosDisponibles.length === 0}
                            />
                            <button 
                                type="button" 
                                onClick={handleAgregarProducto} 
                                className="btn-add"
                                disabled={productosDisponibles.length === 0 || !productoSeleccionado}
                            >
                                + Agregar
                            </button>
                        </div>

                        {/* Lista de Productos Agregados */}
                        {pedido.productos.length > 0 ? (
                            <ul className="product-list">
                                {pedido.productos.map(item => (
                                    <li key={item.id} className="product-item"> 
                                        <span>{item.cantidad} x {item.nombre}</span>
                                        <span className="item-price">
                                            {/* Aseguramos que el precio sea numérico antes de calcular */}
                                            ${(Number(item.precio) * item.cantidad).toFixed(2)}
                                        </span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleEliminarProducto(item.id)}
                                            className="btn-remove"
                                        >
                                            &times;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-items-msg">Aún no hay productos en el pedido.</p>
                        )}
                    </div>
                    
                    {/* Total (Campo de solo lectura) */}
                    <div className="total-summary">
                        <label>Total del Pedido</label>
                        <input
                            type="text"
                            value={`$${pedido.total.toFixed(2)}`}
                            readOnly
                            className="form-control read-only total-display"
                        />
                    </div>
                    
                    {/* Botón de Envío */}
                    <button className="btn-submit" type="submit"> 
                        {existeId ? "Guardar cambios" : "Crear Pedido"} 
                    </button>
                    
                </form>
            )}
        </div>
    );
}

export default FormPedido;
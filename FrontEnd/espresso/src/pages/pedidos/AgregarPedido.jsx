import React, { useState, useEffect } from "react";
import { createPedido } from "../../services/pedidosService"; 
// Usamos tu servicio existente para obtener el menú
import { getProductos } from "../../services/productosService"; 
// 🚨 Nota: Comentamos la importación de mozosService para evitar el error 404
// import { fetchMozos } from "../../services/mozosService"; 

import "../pedidos/AgregarPedido.css";

function AgregarPedido() {
    const [mesa, setMesa] = useState("");
    const [mozo, setMozo] = useState("");
    // Productos seleccionados: { id, nombre, precio, cantidad }
    const [productos, setProductos] = useState([]); 
    const [showModal, setShowModal] = useState(false);
    // Para guardar la cantidad en el modal antes de agregar
    const [modalCantidades, setModalCantidades] = useState({}); 

    // Solo necesitamos el menú por categoría y el estado de carga/error
    const [menuPorCategoria, setMenuPorCategoria] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ===============================================
    // 💡 LÓGICA DE CARGA DE DATOS (useEffect) - SOLO PRODUCTOS
    // ===============================================
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                // SOLO CARGAMOS PRODUCTOS
                const productosData = await getProductos(); 
                
                // Mapeamos los productos por categoría
                const menuMap = productosData.reduce((acc, prod) => {
                    // Usamos 'categoria' si existe, sino 'Otros'
                    const categoria = prod.categoria || "Otros"; 
                    if (!acc[categoria]) {
                        acc[categoria] = [];
                    }
                    // Asumo que el objeto producto tiene las propiedades: id, nombre, precio, categoria
                    acc[categoria].push(prod);
                    return acc;
                }, {});
                setMenuPorCategoria(menuMap);

            } catch (err) {
                console.error("Error al cargar menú:", err);
                setError("Error al cargar el menú de productos. Revisa tu productosService y el backend.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []); 
    // ===============================================


    const handleModalQtyChange = (id, value) => {
        // Asegura que sea un número entero positivo y por defecto 1
        const qty = Math.max(1, parseInt(value || 1, 10));
        setModalCantidades((prev) => ({ ...prev, [id]: qty }));
    };

    const agregarProductoDesdeModal = (prodBase) => {
        const qty = modalCantidades[prodBase.id] ? Number(modalCantidades[prodBase.id]) : 1;
        const existente = productos.find((p) => p.id === prodBase.id);
        
        if (existente) {
            // Si ya existe, solo incrementamos la cantidad
            setProductos((prev) =>
                prev.map((p) => (p.id === prodBase.id ? { ...p, cantidad: p.cantidad + qty } : p))
            );
        } else {
            // Si es nuevo, lo agregamos al listado
            setProductos((prev) => [...prev, { 
                id: prodBase.id, 
                nombre: prodBase.nombre, 
                precio: prodBase.precio, 
                cantidad: qty 
            }]);
        }
        
        setShowModal(false); 
        setModalCantidades({});
    };

    const eliminarProducto = (id) => {
        setProductos((prev) => prev.filter((p) => p.id !== id));
    };

    const cambiarCantidad = (id, nuevaCantidad) => {
        const qty = parseInt(nuevaCantidad, 10);
        if (isNaN(qty) || qty <= 0) {
            // Si la cantidad es inválida o cero, se elimina el producto
            eliminarProducto(id);
            return;
        }
        setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, cantidad: qty } : p)));
    };

    const calcularTotal = () =>
        productos.reduce((acc, p) => acc + (Number(p.precio) * Number(p.cantidad)), 0);

    const guardarPedido = async () => {
        const numMesa = Number(mesa); 

        if (isNaN(numMesa) || numMesa <= 0 || !mozo || productos.length === 0) {
            alert("Completa la Mesa (número), ingresa el Mozo y agrega al menos un producto.");
            return;
        }

        const pedido = {
            mesa: numMesa,
            mozo, // Se envía el valor del input de texto (código o nombre)
            // Mapeamos a la estructura de 'lineas' que espera el back-end
            lineas: productos.map(p => ({ idProducto: p.id, cantidad: p.cantidad })), 
        };

        try {
            await createPedido(pedido);
            alert("Pedido guardado con éxito!");
            // Limpiar formulario después de guardar
            setMesa("");
            setMozo("");
            setProductos([]);
            setModalCantidades({});
        } catch (error) {
            console.error("Error al guardar el pedido:", error);
            alert("Hubo un error al guardar el pedido. Revisa la consola.");
        }
    };

    // ===============================================
    // 💡 RENDERIZADO
    // ===============================================
    
    if (loading) {
        return <div className="pedido-form-container"><p>Cargando menú...</p></div>;
    }

    if (error) {
        return <div className="pedido-form-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="pedido-form-container"> 
            <h2 className="form-title">Agregar Pedido</h2>

            {/* Campos Mesa y Mozo */}
            <div className="form-row">
                <div className="form-group"> 
                    <label>Mesa</label>
                    <input
                        type="number"
                        className="form-control" 
                        value={mesa}
                        onChange={(e) => setMesa(e.target.value)}
                        placeholder="N° de mesa"
                        min="1"
                    />
                </div>

                <div className="form-group"> 
                    <label>Mozo</label>
                    {/* 🎯 CAMBIO A INPUT de texto para carga manual (evita el 404) */}
                    <input
                        type="text"
                        className="form-control" 
                        value={mozo}
                        onChange={(e) => setMozo(e.target.value)}
                        placeholder="Ingresa código o nombre del mozo"
                    />
                </div>
            </div>

            <div className="productos-card"> 
                {/* Botón para abrir el modal */}
                <button className="btn-add" onClick={() => setShowModal(true)}>
                    + Agregar productos
                </button>

                <h3>Productos seleccionados</h3>
                {productos.length === 0 ? (
                    <p className="empty">No hay productos agregados.</p>
                ) : (
                    <ul className="product-list"> 
                        {productos.map((p) => (
                            <li key={p.id} className="product-item"> 
                                <div className="producto-info">
                                    <strong>{p.nombre}</strong> (${p.precio})
                                </div>

                                <div className="producto-qty">
                                    <input
                                        type="number"
                                        min="1"
                                        value={p.cantidad}
                                        onChange={(e) => cambiarCantidad(p.id, e.target.value)}
                                        className="input-qty"
                                    />
                                </div>
                                <button className="btn-remove" onClick={() => eliminarProducto(p.id)}>
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="total-summary"> 
                    <label>Total:</label> 
                    <span className="total-display">${calcularTotal().toFixed(2)}</span>
                </div>

                <div className="actions">
                    <button className="btn-submit" onClick={guardarPedido}> 
                        Guardar Pedido
                    </button>
                </div>
            </div>


            {/* ==================================================================== */}
            {/* 🎯 MODAL DE SELECCIÓN DE PRODUCTOS (Corregido) */}
            {/* ==================================================================== */}
            {showModal && (
    <div className="modal-overlay" onClick={() => setShowModal(false)}> 
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            <h3>Seleccionar Productos</h3>
            
            {/* INICIO DE LA ITERACIÓN DE CATEGORÍAS */}
            {Object.entries(menuPorCategoria).map(([categoria, productos]) => (
                <div key={categoria} className="menu-categoria">
                    {/* Esta etiqueta muestra el nombre de la categoría (p. ej., "Dulces") */}
                    <h4>{categoria}</h4> 
                    
                    <ul className="product-modal-list">
                        {productos.map((prod) => (
                            // ... (resto de las lineas de producto)
                            <li key={prod.id} className="product-modal-item">
                                <div className="info">
                                    <strong>{prod.nombre}</strong> (${prod.precio})
                                </div>
                                <div className="actions">
                                    <input
                                        type="number"
                                        min="1"
                                        value={modalCantidades[prod.id] || 1} 
                                        onChange={(e) => handleModalQtyChange(prod.id, e.target.value)}
                                        className="input-qty"
                                    />
                                    <button 
                                        className="btn-add-to-cart"
                                        onClick={() => agregarProductoDesdeModal(prod)}
                                    >
                                        Agregar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
            {/* ==================================================================== */}
        </div>
    );
}

export default AgregarPedido;
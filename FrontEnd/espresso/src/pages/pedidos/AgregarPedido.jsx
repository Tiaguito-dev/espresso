// src/pages/pedidos/AgregarPedido.jsx
import React, { useState } from "react";
import { createPedido } from "../../services/pedidosService"; 
import "../pedidos/AgregarPedido.css";

// 🚨 CORRECCIÓN: Usamos la lista REAL de productos que proporcionaste
const PRODUCTOS_MENU = [
    { id: "001", nombre: "Medialuna", precio: 800, categoria: "Dulces" },
    { id: "002", nombre: "Café americano", precio: 1600, categoria: "Bebidas calientes" },
    { id: "003", nombre: "Submarino", precio: 4000, categoria: "Bebidas calientes" },
    // El "004" no está disponible, lo dejo fuera del menú de agregar por simplicidad
];

// Mapeamos los productos por categoría para el modal
const menuPorCategoria = PRODUCTOS_MENU.reduce((acc, prod) => {
    const categoria = prod.categoria || "Otros"; // Usa la categoría del producto real
    if (!acc[categoria]) {
        acc[categoria] = [];
    }
    acc[categoria].push(prod);
    return acc;
}, {});


function AgregarPedido() {
    const [mesa, setMesa] = useState("");
    const [mozo, setMozo] = useState("");
    // Productos seleccionados: { id, nombre, precio, cantidad }
    const [productos, setProductos] = useState([]); 
    const [showModal, setShowModal] = useState(false);
    // Para guardar la cantidad en el modal antes de agregar
    const [modalCantidades, setModalCantidades] = useState({}); 

    const handleModalQtyChange = (id, value) => {
        // Asegura que sea un número entero positivo y por defecto 1
        const qty = Math.max(1, parseInt(value || 1, 10));
        setModalCantidades((prev) => ({ ...prev, [id]: qty }));
    };

    const agregarProductoDesdeModal = (prodBase) => {
        const qty = modalCantidades[prodBase.id] ? Number(modalCantidades[prodBase.id]) : 1;
        const existente = productos.find((p) => p.id === prodBase.id);
        
        // 🚨 CORRECCIÓN: Si no existe, usamos los datos del producto base.
        if (existente) {
            setProductos((prev) =>
                prev.map((p) => (p.id === prodBase.id ? { ...p, cantidad: p.cantidad + qty } : p))
            );
        } else {
            setProductos((prev) => [...prev, { 
                id: prodBase.id, 
                nombre: prodBase.nombre, 
                precio: prodBase.precio, 
                cantidad: qty 
            }]);
        }
        
        // Cierra el modal y limpia las cantidades
        setShowModal(false); 
        setModalCantidades({});
    };

    const eliminarProducto = (id) => {
        setProductos((prev) => prev.filter((p) => p.id !== id));
    };

    const cambiarCantidad = (id, nuevaCantidad) => {
        const qty = parseInt(nuevaCantidad, 10);
        if (isNaN(qty) || qty <= 0) {
            eliminarProducto(id);
            return;
        }
        setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, cantidad: qty } : p)));
    };

    const calcularTotal = () =>
        productos.reduce((acc, p) => acc + (Number(p.precio) * Number(p.cantidad)), 0);

    const guardarPedido = async () => {
        // Aseguramos que la mesa sea un número
        const numMesa = Number(mesa); 

        if (isNaN(numMesa) || numMesa <= 0 || !mozo || productos.length === 0) {
            alert("Completa la Mesa (número), el Mozo y agrega al menos un producto.");
            return;
        }

        // 🚨 CORRECCIÓN: Usamos 'estadoPedido' y 'nroPedido' (aunque el back lo genera, 
        // lo incluimos por si el servicio lo necesita, pero lo quito porque el back lo debe asignar)
        const pedido = {
            mesa: numMesa,
            mozo,
            lineas: productos.map(p => ({ idProducto: p.id, cantidad: p.cantidad })), // Mapeamos a la estructura de 'lineas'
            estadoPedido: "pendiente", // Estado inicial
            // nota: El nroPedido, fecha y total se pueden asignar en el backend. 
            // Si el backend necesita el total, lo incluimos:
            total: calcularTotal(),
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
            alert("Hubo un error al guardar el pedido.");
        }
    };

    return (
        // 🚨 1. CORRECCIÓN: Clase principal para que tome el estilo de fondo/sombra
        <div className="pedido-form-container"> 
            {/* 🚨 2. CORRECCIÓN: Clase del título */}
            <h2 className="form-title">Agregar Pedido</h2>

            {/* Campos Mesa y Mozo */}
            <div className="form-row">
                {/* 🚨 3. CORRECCIÓN: Cambiamos form-field a form-group */}
                <div className="form-group"> 
                    <label>Mesa</label>
                    <input
                        type="number"
                        // 🚨 4. CORRECCIÓN: Clase para todos los inputs de formulario
                        className="form-control" 
                        value={mesa}
                        onChange={(e) => setMesa(e.target.value)}
                        placeholder="N° de mesa"
                        min="1"
                    />
                </div>

                {/* 🚨 5. CORRECCIÓN: Cambiamos form-field a form-group */}
                <div className="form-group"> 
                    <label>Mozo</label>
                    <input
                        type="text"
                        // 🚨 6. CORRECCIÓN: Clase para todos los inputs de formulario
                        className="form-control" 
                        value={mozo}
                        onChange={(e) => setMozo(e.target.value)}
                        placeholder="Nombre del mozo"
                    />
                </div>
            </div>


            {/* 🚨 7. CORRECCIÓN: Cambiamos productos-section a productos-card */}
            <div className="productos-card"> 
                {/* Botón para abrir el modal */}
                <button className="btn-add" onClick={() => setShowModal(true)}>
                    + Agregar productos
                </button>

                <h3>Productos seleccionados</h3>
                {productos.length === 0 ? (
                    <p className="empty">No hay productos agregados.</p>
                ) : (
                    // 🚨 8. CORRECCIÓN: Cambiamos lista-productos a product-list
                    <ul className="product-list"> 
                        {productos.map((p) => (
                            // 🚨 9. CORRECCIÓN: Usamos product-item
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
                                        className="input-qty" // Usar la clase del CSS
                                    />
                                    {/* <span>...</span> se puede estilizar con product-item spans */}
                                </div>

                                {/* 🚨 10. CORRECCIÓN: Usamos btn-remove */}
                                <button className="btn-remove" onClick={() => eliminarProducto(p.id)}>
                                    &times; {/* Símbolo de "cerrar" o "eliminar" */}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* 🚨 11. CORRECCIÓN: Usamos total-summary */}
                <div className="total-summary"> 
                    <label>Total:</label> 
                    <span className="total-display">${calcularTotal()}</span>
                </div>

                <div className="actions">
                    {/* 🚨 12. CORRECCIÓN: Cambiamos btn-guardar a btn-submit */}
                    <button className="btn-submit" onClick={guardarPedido}> 
                        Guardar Pedido
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AgregarPedido;
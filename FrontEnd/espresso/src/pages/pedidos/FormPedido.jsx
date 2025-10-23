// src/pages/pedidos/FormPedido.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPedido, updatePedido, buscarPedidoPorId } from "../../services/pedidosService"; 
import "./AgregarPedido.css"; // Usa el mismo CSS

// ===========================================
// MOCKS: Reemplaza esto con tu lista de productos real
// ===========================================
const PRODUCTOS_MOCK = [
    { id: "P001", nombre: "Café Espresso", precio: 250 },
    { id: "P002", nombre: "Torta de Chocolate", precio: 800 },
    { id: "P003", nombre: "Jugo de Naranja", precio: 350 },
];

const PEDIDO_INICIAL = {
    mesa: "",
    mozo: "",
    productos: [], // { id, nombre, precio, cantidad }
    total: 0,
};

// ===========================================
// FUNCIONES AUXILIARES
// ===========================================

/**
 * Calcula el total sumando (precio * cantidad) de cada producto.
 */
const calcularTotal = (productosArray) => {
    return productosArray.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
};

// ===========================================
// COMPONENTE PRINCIPAL
// ===========================================

function FormPedido() {
    const { id } = useParams();
    const [pedido, setPedido] = useState(PEDIDO_INICIAL);
    const [productoSeleccionado, setProductoSeleccionado] = useState(PRODUCTOS_MOCK[0] ? PRODUCTOS_MOCK[0].id : "");
    const [cantidad, setCantidad] = useState(1);
    const navigate = useNavigate();

    const existeId = Boolean(id);
    
    // 1. 📋 Cargar datos del pedido si estamos en modo edición
    useEffect(() => {
        if (existeId) {
            buscarPedidoPorId(id)
                .then((data) => {
                    // Cargar la información relevante. Asegúrate de que los productos tengan 'cantidad'.
                    setPedido({
                        mesa: data.mesa || "",
                        mozo: data.mozo || "",
                        productos: data.productos || [], 
                        total: data.total || 0,
                    });
                })
                .catch(error => {
                    // Esto maneja el error 404/500 que te sale al intentar buscar.
                    console.error("Error al buscar el pedido:", error);
                    alert("No se pudo cargar el pedido para modificar. Revisa la API y el ID.");
                });
        }
    }, [id, existeId]);

    // Maneja cambios en Mesa y Mozo
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPedido({ ...pedido, [name]: value });
    };

    // 2. Lógica para AGREGAR/ACTUALIZAR productos en la lista
    const handleAgregarProducto = () => {
        const productoBase = PRODUCTOS_MOCK.find(p => p.id === productoSeleccionado);
        
        if (!productoBase || cantidad <= 0) return;

        // Verificar si el producto ya está en el pedido
        const productoExistente = pedido.productos.find(p => p.id === productoSeleccionado);
        let nuevosProductos;

        if (productoExistente) {
            // Actualizar cantidad si ya existe
            nuevosProductos = pedido.productos.map(p => 
                p.id === productoSeleccionado 
                    ? { ...p, cantidad: p.cantidad + Number(cantidad) }
                    : p
            );
        } else {
            // Agregar nuevo producto
            const nuevoItem = {
                id: productoBase.id,
                nombre: productoBase.nombre,
                precio: productoBase.precio,
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

    // 🎯 CLAVE: Resetear la cantidad a 1 y el selector al primer ítem
    setCantidad(1); 
    setProductoSeleccionado(PRODUCTOS_MOCK[0] ? PRODUCTOS_MOCK[0].id : ""); 

    };

    // 3. Lógica para ELIMINAR un producto de la lista
    const handleEliminarProducto = (idProducto) => {
        const productosFiltrados = pedido.productos.filter(p => p.id !== idProducto);
        const nuevoTotal = calcularTotal(productosFiltrados);
        
        setPedido({
            ...pedido,
            productos: productosFiltrados,
            total: nuevoTotal,
        });
    };


    // 4. 📝 Manejar el envío del formulario (Crear o Actualizar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Crear el objeto de datos que se enviará al backend
        const pedidoData = {
            mesa: Number(pedido.mesa),
            mozo: pedido.mozo,
            productos: pedido.productos, 
            total: pedido.total, // El total es calculado en el frontend y se envía.
            // NOTA: Si necesitas enviar el 'estado' o 'fecha' del pedido, agrégalos aquí.
        };

        // Validaciones básicas antes de enviar
        if (!pedidoData.mesa || !pedidoData.mozo || pedidoData.productos.length === 0) {
            alert("Completa todos los campos obligatorios y agrega al menos un producto.");
            return;
        }

        try {
            if (existeId) {
                // Modo Edición
                await updatePedido(id, pedidoData); // 🎯 Llama a tu servicio de PUT
                alert('Pedido actualizado correctamente');
            } else {
                // Modo Creación
                await createPedido(pedidoData);
                alert('Pedido creado correctamente');
            }
            
            // Navegar de vuelta a la lista de pedidos
            navigate('/pedidos'); 
            
        } catch (error) {
            // Captura los errores de 404/500 del backend
            console.error("Error al procesar el pedido:", error);
            alert(`Error al ${existeId ? "actualizar" : "crear"} el pedido. Revisa tu conexión y el backend.`);
        }
    };

    return (
        <div className="agregar-pedido container"> {/* Usamos la clase container para centrar */}
            <h2>{existeId ? "Modificar Pedido" : "Agregar Pedido"}</h2>
            <form onSubmit={handleSubmit} className="form-pedido">
                
                {/* ID (Solo lectura en modo edición) */}
                {existeId && (
                    <div className="form-field">
                        <label>ID del Pedido</label>
                        <input
                            type="text"
                            value={id}
                            readOnly={true}
                            className="readonly-field"
                        />
                    </div>
                )}
                
                <div className="form-row">
                    {/* Campo Mesa */}
                    <div className="form-field">
                        <label>Mesa</label>
                        <input
                            type="number"
                            name="mesa" 
                            value={pedido.mesa}
                            onChange={handleChange}
                            placeholder="Número de mesa"
                            required
                            min="1"
                        />
                    </div>
                    
                    {/* Campo Mozo */}
                    <div className="form-field">
                        <label>Mozo</label>
                        <input
                            type="text"
                            name="mozo" 
                            value={pedido.mozo}
                            onChange={handleChange}
                            placeholder="Nombre del Mozo"
                            required
                        />
                    </div>
                </div>

                {/* ======================================= */}
                {/* SECCIÓN DE PRODUCTOS (CARRITO)          */}
                {/* ======================================= */}
                
                <div className="productos-section">
                    <h3>Detalle del Pedido</h3>
                    
                    {/* Selector para AGREGAR Productos */}
                    <div className="agregar-producto-row">
                        <select 
                            value={productoSeleccionado} 
                            onChange={(e) => setProductoSeleccionado(e.target.value)}
                        >
                            {PRODUCTOS_MOCK.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} - ${p.precio}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={cantidad}
                            onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                            min="1"
                            placeholder="Cant."
                            className="input-cantidad"
                        />
                        <button type="button" onClick={handleAgregarProducto} className="btn-agregar-item">
                            + Agregar
                        </button>
                    </div>

                    {/* Lista de Productos Agregados */}
                    {pedido.productos.length > 0 && (
                        <ul className="lista-productos-agregados">
                            {pedido.productos.map(item => (
                                <li key={item.id}>
                                    <span>{item.cantidad} x {item.nombre}</span>
                                    <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => handleEliminarProducto(item.id)}
                                        className="btn-eliminar-item"
                                    >
                                        X
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                <hr/>
                
                {/* Total (Campo de solo lectura) */}
                <div className="form-field total-field">
                    <label>Total del Pedido</label>
                    <input
                        type="text"
                        value={`$${pedido.total.toFixed(2)}`}
                        readOnly={true}
                        className="readonly-field input-total"
                    />
                </div>
                
                {/* Botón de Envío */}
                <button className="btn-guardar" type="submit"> 
                    {existeId ? "Guardar cambios" : "Crear Pedido"} 
                </button>
                
            </form>
        </div>
    );
}

export default FormPedido;
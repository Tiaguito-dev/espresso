// FormPedido.jsx (Componente para agregar/modificar)

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPedido, updatePedido, buscarPedidoPorId } from "../../services/pedidosService"; 
import "./AgregarPedido.css"; 

// 🚨 CORRECCIÓN: Usamos la lista REAL de productos
const PRODUCTOS_MOCK = [
    { id: "001", nombre: "Medialuna", precio: 800 },
    { id: "002", nombre: "Café americano", precio: 1600 },
    { id: "003", nombre: "Submarino", precio: 4000 },
];

const PEDIDO_INICIAL = {
    mesa: "",
    mozo: "",
    // { id: idProducto, nombre: 'nombre', precio: precio, cantidad: N }
    productos: [], 
    total: 0,
};

// ===========================================
// FUNCIONES AUXILIARES
// ===========================================

/**
 * Busca los datos completos de un producto a partir de su ID
 */
const getProductoData = (id) => {
    return PRODUCTOS_MOCK.find(p => p.id === id);
};

/**
 * Calcula el total sumando (precio * cantidad) de cada producto.
 */
const calcularTotal = (productosArray) => {
    return productosArray.reduce((acc, p) => acc + (Number(p.precio) * Number(p.cantidad)), 0);
};

// ===========================================
// COMPONENTE PRINCIPAL
// ===========================================

function FormPedido() {
    const { id } = useParams();
    const [pedido, setPedido] = useState(PEDIDO_INICIAL);
    // 🚨 CORRECCIÓN: Si no hay productos, inicializa a cadena vacía
    const [productoSeleccionado, setProductoSeleccionado] = useState(PRODUCTOS_MOCK[0] ? PRODUCTOS_MOCK[0].id : ""); 
    const [cantidad, setCantidad] = useState(1);
    const navigate = useNavigate();

    const existeId = Boolean(id);
    const titulo = existeId ? "Modificar Pedido" : "Agregar Pedido";
    
    // 1. Cargar datos del pedido si estamos en modo edición
    useEffect(() => {
        if (existeId) {
            buscarPedidoPorId(id)
                .then((data) => {
                    // 🚨 CORRECCIÓN: Mapear 'lineas' del backend a 'productos' para el estado local
                    const productosLocal = data.lineas.map(linea => {
                        const base = getProductoData(linea.idProducto) || { nombre: "Desconocido", precio: 0 };
                        return {
                            id: linea.idProducto,
                            nombre: base.nombre,
                            precio: base.precio,
                            cantidad: linea.cantidad
                        };
                    });

                    setPedido({
                        // 🚨 CORRECCIÓN: Usamos data.mesa/data.mozo (o los nombres reales del backend)
                        mesa: data.mesa || "", 
                        mozo: data.mozo || "", 
                        productos: productosLocal, 
                        total: calcularTotal(productosLocal), // Recalculamos el total
                    });
                })
                .catch(error => {
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
        const productoBase = getProductoData(productoSeleccionado);
        
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
            // Agregar nuevo producto (usando datos completos)
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

        // Resetear la cantidad a 1
        setCantidad(1); 
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
        
        // 🚨 CORRECCIÓN: Mapear 'productos' local a 'lineas' para el backend
        const lineasBackend = pedido.productos.map(p => ({
            idProducto: p.id,
            cantidad: p.cantidad
        }));
        
        // Crear el objeto de datos que se enviará al backend
        const pedidoData = {
            mesa: Number(pedido.mesa),
            mozo: pedido.mozo,
            lineas: lineasBackend, 
            total: pedido.total, 
            // 🚨 Importante: Al modificar, solo enviamos los campos que se pueden cambiar.
            // Si el estado se cambia en PedidosLista.jsx, no lo enviamos aquí, a menos que 
            // queramos que el usuario también pueda cambiarlo. Lo dejo fuera por ahora.
        };

        // Validaciones básicas antes de enviar
        if (isNaN(pedidoData.mesa) || pedidoData.mesa <= 0 || !pedidoData.mozo || pedidoData.lineas.length === 0) {
            alert("Completa la mesa (número), el mozo y agrega al menos un producto.");
            return;
        }

        try {
            if (existeId) {
                // Modo Edición
                // Usamos 'id' de useParams (nroPedido)
                await updatePedido(id, pedidoData); 
                alert('Pedido actualizado correctamente');
            } else {
                // Modo Creación (aunque este componente se usa principalmente para Modificar)
                await createPedido(pedidoData);
                alert('Pedido creado correctamente');
            }
            
            // Navegar de vuelta a la lista de pedidos
            navigate('/pedidos'); 
            
        } catch (error) {
            console.error("Error al procesar el pedido:", error);
            alert(`Error al ${existeId ? "actualizar" : "crear"} el pedido. Revisa tu conexión y el backend.`);
        }
    };

    return (
        <div className="pedido-form-container"> 
            <h2 className="form-title">{titulo}</h2>
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
                            type="number" // Cambiado a number
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
                        >
                            {PRODUCTOS_MOCK.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} - ${p.precio.toFixed(2)}
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
                        />
                        <button type="button" onClick={handleAgregarProducto} className="btn-add">
                            + Agregar
                        </button>
                    </div>

                    {/* Lista de Productos Agregados */}
                    {pedido.productos.length > 0 ? (
                        <ul className="product-list">
                            {pedido.productos.map(item => (
                                <li key={item.id} className="product-item">
                                    <span>{item.cantidad} x {item.nombre}</span>
                                    {/* 🚨 CORRECCIÓN: Asegurar que el precio sea numérico para toFixed */}
                                    <span className="item-price">${(Number(item.precio) * item.cantidad).toFixed(2)}</span>
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
        </div>
    );
}

export default FormPedido;
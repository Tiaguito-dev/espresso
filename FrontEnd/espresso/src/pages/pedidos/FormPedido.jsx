// src/pages/pedidos/FormPedido.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPedido, updatePedido, buscarPedidoPorId } from "../../services/pedidosService"; 
import { getProductos } from "../../services/productosService"; 
import "./AgregarPedido.css"; 


// ELIMINAMOS PRODUCTOS_MOCK, ahora se cargará dinámicamente
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
    // 🎯 NUEVO ESTADO: Para guardar los productos traídos del back-end
    const [productosDisponibles, setProductosDisponibles] = useState([]); 
    // Inicializa a cadena vacía, se establecerá después de cargar los productos
    const [productoSeleccionado, setProductoSeleccionado] = useState(""); 
    const [cantidad, setCantidad] = useState(1);
    const navigate = useNavigate();

    const existeId = Boolean(id);
    const titulo = existeId ? "Modificar Pedido" : "Agregar Pedido";
    
    // Función auxiliar reubicada para usar el estado
    const getProductoData = (id) => {
        // Busca en la lista cargada del back-end
        return productosDisponibles.find(p => String(p.id) === String(id));
    };

    // 1. 🔄 Cargar la lista de productos disponibles al inicio (Usando getProductos con fetch)
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductos();
                setProductosDisponibles(data);
                
                // Si la lista no está vacía, preseleccionar el primer producto
                if (data.length > 0) {
                    setProductoSeleccionado(data[0].id);
                }
            } catch (error) {
                console.error("Error al obtener productos:", error);
                alert("Error al cargar la lista de productos del back-end.");
            }
        };
        fetchProductos();
    }, []); // Se ejecuta solo al montar

    // 2. 📝 Cargar datos del pedido si estamos en modo edición (Depende de productosDisponibles)
    useEffect(() => {
        // Solo intentamos cargar si estamos editando Y ya cargamos los productos disponibles
        if (existeId && productosDisponibles.length > 0) {
            buscarPedidoPorId(id)
                .then((data) => {
                    // Mapear 'lineasPedido' del backend a 'productos' para el estado local
                    // 🚨 CORRECCIÓN CLAVE: Usamos 'data.lineasPedido' en lugar de 'data.lineas'
                    const lineasDelBackend = data.lineasPedido || []; 
                    
                    const productosLocal = lineasDelBackend.map(linea => {
                        
                        // 🧐 NOTA: El objeto 'linea' aquí es una instancia de LineaPedido (clase de backend)
                        // Por lo general, 'producto' está anidado dentro de 'linea'
                        const idProducto = linea.producto ? linea.producto.id : null;
                        const cantidad = linea.cantidad || 0;

                        // Buscamos los datos base (nombre y precio) del producto
                        const base = getProductoData(idProducto) || { nombre: "Producto Desconocido", precio: 0 };
                        
                        return {
                            id: idProducto,
                            nombre: base.nombre,
                            precio: base.precio,
                            cantidad: cantidad
                        };
                    });

                    setPedido({
                        // Usamos data.mesa/data.mozo (ajusta estos nombres si son diferentes en tu backend)
                        // 🚨 Ajustamos aquí para usar las propiedades de la clase Pedido
                        mesa: data.mesa.nroMesa || "", // Si 'data.mesa' es un objeto Mesa, usa 'nroMesa'
                        mozo: data.mozo || "", // Si no tienes Mozo en el modelo, déjalo vacío o usa un valor por defecto.
                        productos: productosLocal, 
                        total: calcularTotal(productosLocal), // Recalculamos el total
                    });
                })
                .catch(error => {
                    console.error("Error al buscar el pedido:", error);
                    alert("No se pudo cargar el pedido para modificar.");
                });
        }
    }, [id, existeId, productosDisponibles]); // Se ejecuta cuando 'productosDisponibles' esté lleno

    // Maneja cambios en Mesa y Mozo
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPedido({ ...pedido, [name]: value });
    };

    // 3. Lógica para AGREGAR/ACTUALIZAR productos en la lista
    const handleAgregarProducto = () => {
        const productoBase = getProductoData(productoSeleccionado);
        
        // Verifica que haya un producto seleccionado y una cantidad válida
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

        // Resetear la cantidad a 1
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


    // 5. 📝 Manejar el envío del formulario (Crear o Actualizar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mapear 'productos' local a 'lineas' para el backend
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
        };

        // Validaciones básicas antes de enviar
        if (isNaN(pedidoData.mesa) || pedidoData.mesa <= 0 || !pedidoData.mozo || pedidoData.lineas.length === 0) {
            alert("Completa la mesa (número), el mozo y agrega al menos un producto.");
            return;
        }

        try {
            if (existeId) {
                // Modo Edición
                await updatePedido(id, pedidoData); 
                alert('Pedido actualizado correctamente');
            } else {
                // Modo Creación
                await createPedido(pedidoData);
                alert('Pedido creado correctamente');
            }
            
            // 🎯 Navegar de vuelta pasando el estado { refresh: true }
            navigate('/pedidos', { state: { refresh: true } }); 
            
        } catch (error) {
            console.error("Error al procesar el pedido:", error);
            alert(`Error al ${existeId ? "actualizar" : "crear"} el pedido. Revisa tu conexión y el back-end.`);
        }
    };

    return (
        <div className="pedido-form-container"> 
            <h2 className="form-title">{titulo}</h2>
            {/* Si aún no hay productos disponibles, podrías mostrar un mensaje de carga */}
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
                                {/* 🎯 RECORRE la lista de productos traída del back-end */}
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
            )}
        </div>
    );
}

export default FormPedido;
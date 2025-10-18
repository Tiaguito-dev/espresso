// src/pages/pedidos/FormPedido.jsx (o la ruta que uses)

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// 🎯 Cambiar a tus funciones de servicio de pedidos
import { createPedido, updatePedido, buscarPedidoPorId } from "../../services/pedidosService"; 
import { useNavigate } from "react-router-dom";
// 🎯 Reutilizar el CSS
import "./AgregarPedido.css"; 

// Estructura de un pedido simple para el formulario inicial
const PEDIDO_INICIAL = {
    mesa: "",
    mozo: "",
    // NOTA: 'productos' y 'total' serán manejados por lógica más compleja
    productos: [],
    total: 0,
    // La fecha y el estado inicial se manejarán en la creación
};

function FormPedido() {
    const { id } = useParams();
    const [pedido, setPedido] = useState(PEDIDO_INICIAL);
    const navigate = useNavigate();

    const existeId = Boolean(id);
    
    // 1. 📋 Cargar datos del pedido si estamos en modo edición (existeId)
    useEffect(() => {
        if (existeId) {
            buscarPedidoPorId(id)
                .then((data) => {
                    // Cargar la información relevante del pedido (mesa, mozo, etc.)
                    setPedido({
                        mesa: data.mesa || "",
                        mozo: data.mozo || "",
                        // Otros campos si los tienes y son editables, como el total no debería serlo
                        productos: data.productos || [],
                        total: data.total || 0,
                    });
                })
                .catch(error => {
                    console.error("Error al buscar el pedido:", error);
                    alert("No se pudo cargar el pedido para modificar.");
                });
        }
    }, [id, existeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPedido({ ...pedido, [name]: value });
    };

    // 2. 📝 Manejar el envío del formulario (Crear o Actualizar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Crear el objeto de datos común
        const pedidoData = {
            mesa: Number(pedido.mesa), // Asumiendo que mesa es un número
            mozo: pedido.mozo,
            // En modo edición, probablemente enviamos la lista de productos ya modificada
            productos: pedido.productos, 
            total: pedido.total // En un sistema real, el total se calcularía en el backend
        };

        try {
            if (existeId) {
                // Modo Edición
                await updatePedido(id, pedidoData);
                alert('Pedido actualizado correctamente');
            } else {
                // Modo Creación: El backend debería asignar el ID, la fecha de creación y el estado inicial ("Pendiente")
                await createPedido(pedidoData);
                alert('Pedido creado correctamente');
            }
            
            // 3. ↩️ Navegar de vuelta a la lista de pedidos
            navigate('/pedidos'); 
            
        } catch (error) {
            console.error("Error al procesar el pedido:", error);
            alert(`Error al ${existeId ? "actualizar" : "crear"} el pedido.`);
        }
    };

    return (
        <div className="agregar-pedido">
            <h2>{existeId ? "Modificar Pedido" : "Agregar Pedido"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    
                    {/* ID - Solo mostrar en modo edición y como solo lectura */}
                    {existeId && (
                        <div className="form-field">
                            <label>ID</label>
                            <input
                                type="text"
                                value={id}
                                readOnly={true}
                            />
                        </div>
                    )}

                    {/* Campo Mesa */}
                    <div className="form-field">
                        <label>Mesa</label>
                        <input
                            type="number"
                            name="mesa" // 🎯 Usar el atributo 'name' para el handler
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
                            name="mozo" // 🎯 Usar el atributo 'name' para el handler
                            value={pedido.mozo}
                            onChange={handleChange}
                            placeholder="Nombre del Mozo"
                            required
                        />
                    </div>
                </div>

                {/* Área para Productos (¡Aquí va la complejidad!) */}
                <div className="productos-section">
                    <h3>Detalle del Pedido</h3>
                    {/* 💡 AQUÍ SE INTEGRARÍA LA LÓGICA DEL CARRITO/LISTA DE PRODUCTOS */}
                    <p>Funcionalidad de agregar/modificar productos pendiente.</p>
                    
                    {/* Campo Total (Solo lectura) */}
                    <div className="form-field total-field">
                        <label>Total</label>
                        <input
                            type="text"
                            value={`$${pedido.total.toFixed(2)}`} // Mostrar el total actual
                            readOnly={true}
                        />
                    </div>
                </div>
                

                <button className="btn-guardar" type="submit"> 
                    {existeId ? "Guardar cambios" : "Crear Pedido"} 
                </button>
            </form>
        </div>
    );
}

export default FormPedido;
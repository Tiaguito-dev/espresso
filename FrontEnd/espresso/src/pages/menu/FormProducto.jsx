import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createProducto, updateProducto, buscarPorId } from "../../services/productosService";
import { useNavigate } from "react-router-dom";
import "../pedidos/AgregarPedido.css";

function FormProducto() {
    const { id } = useParams();
    const [producto, setProducto] = useState({
        id: "",
        nombre: "",
        categoria: "",
        descripcion: "",
        precio: "",
        disponible: true
    });
        
    const navigate = useNavigate();

    const existeId = Boolean(id);

    useEffect(() => {
        if (existeId) {
            buscarPorId(id).then((data) => {
                setProducto({
                    id: data.id || "",
                    nombre: data.nombre || "",
                    categoria: data.categoria || "",
                    descripcion: data.descripcion || "",
                    precio: data.precio || "",
                    disponible: data.disponible || true
                });
            });
        }
    }, [id, existeId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (existeId) {
                // En edición: enviamos solo los campos editables + disponible
                const productoParaActualizar = {
                    nombre: producto.nombre,
                    categoria: producto.categoria,
                    descripcion: producto.descripcion,
                    precio: Number(producto.precio),
                    disponible: producto.disponible
                };
                await updateProducto(id, productoParaActualizar);
                console.log("Producto actualizado correctamente");
                alert('Producto actualizado correctamente');
                // Me lleva devuelta al menú
                navigate('/menu');

            } else {
                // En creación: enviamos todo excepto el ID (se asigna automáticamente)
                const productoParaCrear = {
                    nombre: producto.nombre,
                    categoria: producto.categoria,
                    descripcion: producto.descripcion,
                    precio: Number(producto.precio),
                    disponible: true // Por defecto disponible
                };
                await createProducto(productoParaCrear);
                console.log("Producto creado correctamente");
                alert('Producto guradado correctamente');
                // Me lleva devuelta al menú
                navigate('/menu');
            }
        } catch (error) {
            console.error("Error al procesar el producto:", error);
        }
    };

    return (
        <div className="agregar-pedido">
            <h2>{existeId ? "Modificar Producto" : "Agregar Producto"}</h2>
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

                    <div className="form-field">
                        <label>Nombre</label>
                        <input
                            type="text"
                            value={producto.nombre}
                            onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                            placeholder="Nombre del producto"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>Categoría</label>
                        <input
                            type="text"
                            value={producto.categoria} 
                            onChange={(e) => 
                                setProducto({ 
                                    ...producto, 
                                    categoria: e.target.value 
                                })
                            }
                            placeholder="Categoría del producto"
                        />   
                    </div>

                    <div className="form-field">
                        <label>Descripción</label>
                        <input
                            type="text"
                            value={producto.descripcion}
                            onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })}
                            placeholder="Descripción del producto"
                        />
                    </div>

                    <div className="form-field">
                        <label>Precio</label>
                        <input
                            type="number"
                            value={producto.precio}
                            onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
                            placeholder="Precio"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>
                <button className="btn-guardar" type="submit"> {existeId ? "Guardar cambios" : "Agregar"} </button>
            </form>
        </div>
    );
}


export default FormProducto;
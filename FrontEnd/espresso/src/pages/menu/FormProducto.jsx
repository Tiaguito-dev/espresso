import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createProducto, updateProducto, buscarPorId, obtenerCategorias } from "../../services/productosService";
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

    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [usarNuevaCategoria, setUsarNuevaCategoria] = useState(false);
    const navigate = useNavigate();
    const existeId = Boolean(id);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const data = await obtenerCategorias();
                console.log("categorias traidas del back", data);
                setCategorias(data || []);
            } catch (error) {
                console.error("Error al traer categorías:", error);
                setCategorias([]);
            }
        };
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (existeId) {
            buscarPorId(id).then((data) => {
                console.log("producto traido por id:", data)
                setProducto({
                    id: data.id || "",
                    nombre: data.nombre || "",
                    categoria: data.categoria.nombre || "",
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
            const categoriaFinal = usarNuevaCategoria ? nuevaCategoria : producto.categoria;
            if (existeId) {
                const productoParaActualizar = {
                    nombre: producto.nombre,
                    categoria: categoriaFinal,
                    descripcion: producto.descripcion,
                    precio: Number(producto.precio),
                    disponible: producto.disponible
                };

                console.log("Datos enviados a updateProducto:", productoParaActualizar);
                await updateProducto(id, productoParaActualizar);
                console.log("Producto actualizado correctamente");
                alert('Producto actualizado correctamente');
                // Me lleva devuelta al menú
                navigate('/menu');

            } else {
                // En creación: enviamos todo excepto el ID (se asigna automáticamente)
                const productoParaCrear = {
                    nombre: producto.nombre,
                    categoria: categoriaFinal,
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
                        {!usarNuevaCategoria ? (
                            <select
                                value={producto.categoria}
                                onChange={(e) => {
                                    if (e.target.value === "nueva") {
                                        setUsarNuevaCategoria(true);
                                        setProducto({ ...producto, categoria: "" });
                                    } else {
                                        setProducto({ ...producto, categoria: e.target.value });
                                    }
                                }}
                            >
                                <option value="">Seleccione categoría</option>
                                {categorias.map((categoriaItem) => (
                                    <option key={categoriaItem.id} value={categoriaItem.id}>{categoriaItem.nombre}</option>
                                ))}
                                <option value="nueva">Agregar nueva...</option>
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={nuevaCategoria}
                                onChange={(e) => setNuevaCategoria(e.target.value)}
                                placeholder="Nueva categoría"
                                required
                            />
                        )}
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
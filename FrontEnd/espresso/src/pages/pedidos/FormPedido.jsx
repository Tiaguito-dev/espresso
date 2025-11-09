import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPedido, updatePedido, buscarPedidoPorId } from "../../services/pedidosService"; 
import "./AgregarPedido.css";

const PRODUCTOS_MOCK = [
  { id: "1", nombre: "Café", precio: 100 },
  { id: "2", nombre: "Sandwich", precio: 250 },
  { id: "3", nombre: "Té", precio: 80 },
];

const PEDIDO_INICIAL = {
  mesa: "",
  mozo: "",
  productos: [],
  total: 0,
};

const calcularTotal = (productosArray) => {
  return productosArray.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
};

function FormPedido() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(PEDIDO_INICIAL);
  const [productoSeleccionado, setProductoSeleccionado] = useState(PRODUCTOS_MOCK[0]?.id || "");
  const [cantidad, setCantidad] = useState(1);

  const existeId = Boolean(id);

  // Cargar pedido si existe id
  useEffect(() => {
    if (existeId) {
      const cargarPedido = async () => {
        try {
          const data = await buscarPedidoPorId(id);
          setPedido({
            mesa: data.mesa || "",
            mozo: data.mozo || "",
            productos: data.productos || [],
            total: data.total || 0,
          });
        } catch (error) {
          console.error("Error al cargar el pedido:", error);
          alert("No se pudo cargar el pedido. Revisa la API y el ID.");
        }
      };
      cargarPedido();
    }
  }, [id, existeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido({ ...pedido, [name]: value });
  };

  const handleAgregarProducto = () => {
    const productoBase = PRODUCTOS_MOCK.find(p => p.id === productoSeleccionado);
    if (!productoBase || cantidad <= 0) return;

    const productoExistente = pedido.productos.find(p => p.id === productoSeleccionado);
    let nuevosProductos;

    if (productoExistente) {
      nuevosProductos = pedido.productos.map(p =>
        p.id === productoSeleccionado
          ? { ...p, cantidad: p.cantidad + Number(cantidad) }
          : p
      );
    } else {
      const nuevoItem = {
        id: productoBase.id,
        nombre: productoBase.nombre,
        precio: productoBase.precio,
        cantidad: Number(cantidad),
      };
      nuevosProductos = [...pedido.productos, nuevoItem];
    }

    setPedido({
      ...pedido,
      productos: nuevosProductos,
      total: calcularTotal(nuevosProductos),
    });

    setCantidad(1);
    setProductoSeleccionado(PRODUCTOS_MOCK[0]?.id || "");
  };

  const handleEliminarProducto = (idProducto) => {
    const productosFiltrados = pedido.productos.filter(p => p.id !== idProducto);
    setPedido({
      ...pedido,
      productos: productosFiltrados,
      total: calcularTotal(productosFiltrados),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pedidoData = {
      mesa: Number(pedido.mesa),
      mozo: pedido.mozo,
      productos: pedido.productos,
      total: pedido.total,
    };

    if (!pedidoData.mesa || !pedidoData.mozo || pedidoData.productos.length === 0) {
      alert("Completa todos los campos y agrega al menos un producto.");
      return;
    }

    try {
      if (existeId) {
        await updatePedido(id, pedidoData);
        alert("Pedido actualizado correctamente");
      } else {
        await createPedido(pedidoData);
        alert("Pedido creado correctamente");
      }

      navigate("/pedidos");
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert(`Error al ${existeId ? "actualizar" : "crear"} el pedido.`);
    }
  };

  return (
    <div className="agregar-pedido container">
      <h2>{existeId ? "Modificar Pedido" : "Agregar Pedido"}</h2>
      <form onSubmit={handleSubmit} className="form-pedido">

        {existeId && (
          <div className="form-field">
            <label>ID del Pedido</label>
            <input type="text" value={id} readOnly className="readonly-field" />
          </div>
        )}

        <div className="form-row">
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

        <div className="productos-section">
          <h3>Detalle del Pedido</h3>
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

          {pedido.productos.length > 0 && (
            <ul className="lista-productos-agregados">
              {pedido.productos.map(item => (
                <li key={item.id}>
                  <span>{item.cantidad} x {item.nombre}</span>
                  <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                  <button type="button" onClick={() => handleEliminarProducto(item.id)} className="btn-eliminar-item">
                    X
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <hr />

        <div className="form-field total-field">
          <label>Total del Pedido</label>
          <input type="text" value={`$${pedido.total.toFixed(2)}`} readOnly className="readonly-field input-total" />
        </div>

        <button className="btn-guardar" type="submit">
          {existeId ? "Guardar cambios" : "Crear Pedido"}
        </button>

      </form>
    </div>
  );
}

export default FormPedido;

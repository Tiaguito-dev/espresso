// src/pages/pedidos/AgregarPedido.jsx
import React, { use, useEffect, useMemo, useState } from "react";
import { createPedido } from "../../services/pedidosService"; 
import { getProductos } from "../../services/productosService";
import "./AgregarPedido.css";
import Popup from "../../components/VentanaPopUp";
import SelectorProductos from "./SelectorProductos";

import { fetchMozos } from "../../services/mozosService"; 

function AgregarPedido() {
  const [mesa, setMesa] = useState("");
  const [mozo, setMozo] = useState("");
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalCantidades, setModalCantidades] = useState({});
  
  const [popUpAbierto, setPopUpAbierto] = useState(false);
  const [menuCompleto, setMenuCompleto] = useState([]);
  const [seleccionados, setSeleccionados] = useState({});

  /*
    const [productos, setProductos] = useState([]);
    es lo mismo que hacer esto:

    let productos = [];
    function setProductos(nuevosProductos) {
      productos = nuevosProductos;
      // React se encarga de re-renderizar el componente
    }
  */

  // Definición del "menú" (idealmente esto también vendría del back-end)
  
  {/*const menu = {
    Bebidas: [{ id: "cafe", nombre: "Café", precio: 200 }],
    Comida: [{ id: "medialuna", nombre: "Medialuna", precio: 300 }],
  };*/}

  useEffect(() => {
    const fetchMenu = async() => {
      try {
        const data = await getProductos();
        setMenuCompleto(data);
      } catch (error) {
        console.error("Error al obtener el menu:", error);
      }
    };
    fetchMenu();
  }, []);

  const handleCheckChange = (id) => {
    setSeleccionados((estadoAnterior) => ({
      ...estadoAnterior,
      [id]: !estadoAnterior[id]
    }));
  };

  // el useMemo guarda en un array el menu completo la primera vez que el componente se renderiza, entonces en el caso de que la pagina sea recargada y el menu no se modificó, utiliza el array que ya tiene guardado (esto funciona mas que nada cuando el menu es muy grande y tiene muchos elementos para cargar [por el momento no es nuetsro caso, pero bueno en algun momento vamos a tener que cargar bastantes productos])
  const menuDisponible = useMemo(() => {
    return menuCompleto.filter(producto => producto.disponible);
  }, [menuCompleto]);

  const agregarItemsAlPedido = () => {
    const itemsParaAgregar = menuDisponible.filter(
      (producto) => seleccionados[producto.id]
    );

    if (itemsParaAgregar.length === 0) {
      alert("No seleccionaste ningun producto");
      return;
    }

    setProductos((prevProductos) => {
      const productosActualizados = [...prevProductos];

      itemsParaAgregar.forEach((item) => {
        const existente = productosActualizados.find((producto) => producto.id === item.id);

        if (existente) {
          existente.cantidad += 1;
        } else {
          productosActualizados.push({...item, cantidad: 1});
        }
      });
      return productosActualizados;
    });
    setSeleccionados({});
    setPopUpAbierto(false);
  }

  const handleCerrarPopUp = () => {
    setSeleccionados({});
    setPopUpAbierto(false);
  };

  const handleModalQtyChange = (id, value) => {
    setModalCantidades((prev) => ({ ...prev, [id]: Math.max(1, parseInt(value || 1)) }));
  };

  const agregarProductoDesdeModal = (prod) => {
    const qty = modalCantidades[prod.id] ? Number(modalCantidades[prod.id]) : 1;
    const existente = productos.find((p) => p.id === prod.id);
    if (existente) {
      setProductos((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, cantidad: p.cantidad + qty } : p))
      );
    } else {
      setProductos((prev) => [...prev, { ...prod, cantidad: qty }]);
    }
  };

  const eliminarProducto = (id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    const qty = parseInt(nuevaCantidad, 10);
    if (!qty || qty <= 0) {
      eliminarProducto(id);
      return;
    }
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, cantidad: qty } : p)));
  };

  const calcularTotal = () =>
    productos.reduce((acc, p) => acc + p.precio * Number(p.cantidad), 0);

  const guardarPedido = async () => {
    if (!mesa || !mozo || productos.length === 0) {
      alert("Completá todos los campos.");
      return;
    }

    const pedido = {
      mesa,
      mozo,
      productos,
      total: calcularTotal(),
      estado: "Pendiente",
      historial: "Pendiente",
    };

    try {
      await createPedido(pedido);
      alert("Pedido guardado con éxito!");
      // Limpiar formulario después de guardar
      setMesa("");
      setMozo("");
      setProductos([]);
      setModalCantidades({});
      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      alert("Hubo un error al guardar el pedido.");
    }
  };

  return (
    <div className="agregar-pedido">
      <h2>Agregar Pedido</h2>

      <div className="form-row">
        <div className="form-field">
          <label>Mesa</label>
          <input
            type="text"
            value={mesa}
            onChange={(e) => setMesa(e.target.value)}
            placeholder="N° de mesa"
          />
        </div>

        <div className="form-field">
          <label>Mozo</label>
          <input
            type="text"
            value={mozo}
            onChange={(e) => setMozo(e.target.value)}
            placeholder="Nombre del mozo"
          />
        </div>
      </div>

      <div className="productos-section">
        <button className="btn-agregar" onClick={() => setPopUpAbierto(true)}>
          + Agregar productos
        </button>
        <h3>Productos seleccionados</h3>
        {productos.length === 0 ? (
          <p className="empty">No hay productos agregados.</p>
        ) : (
          <ul className="lista-productosPedido">
            {productos.map((p) => (
              <li key={p.id} className="producto-line">
                <div className="producto-info">
                  <strong>{p.nombre}</strong> (${p.precio})
                </div>

                <div className="producto-qty">
                  <input
                    type="number"
                    min="1"
                    value={p.cantidad}
                    onChange={(e) => cambiarCantidad(p.id, e.target.value)}
                  />
                  <span className="subtotal">= ${p.precio * p.cantidad}</span>
                </div>

                <button className="btn-eliminar-item" onClick={() => eliminarProducto(p.id)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="total-row">
          <strong>Total:</strong> <span>${calcularTotal()}</span>
        </div>

        <div className="actions">
          <button className="btn-guardar" onClick={guardarPedido}>
            Guardar Pedido
          </button>
        </div>

        <Popup isOpen={popUpAbierto} onClose={handleCerrarPopUp}>
        <SelectorProductos
          menu={menuDisponible}
          seleccionados={seleccionados}
          onCheckChange={handleCheckChange}
          onClose={handleCerrarPopUp}
        />
        
        <div className="popup-actions">
          <button className="btn-cerrar" onClick={handleCerrarPopUp}>
            Cancelar
          </button>
          <button className="btn-agregar" onClick={agregarItemsAlPedido}>
            Agregar Seleccionados
          </button>
        </div>
      </Popup>
      </div>
      {/* Modal del menú 
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Menú</h3>

            {Object.keys(menu).map((cat) => (
              <div key={cat} className="categoria">
                <h4>{cat}</h4>
                {menu[cat].map((prod) => (
                  <div key={prod.id} className="menu-item">
                    <div className="menu-item-info">
                      <span className="nombre">{prod.nombre}</span>
                      <span className="precio">${prod.precio}</span>
                    </div>

                    <div className="menu-item-actions">
                      <input
                        type="number"
                        min="1"
                        value={modalCantidades[prod.id] || 1}
                        onChange={(e) => handleModalQtyChange(prod.id, e.target.value)}
                        className="qty-input"
                      />
                      <button
                        className="btn-agregar"
                        onClick={() => agregarProductoDesdeModal(prod)}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div className="modal-close">
              <button className="btn-cerrar" onClick={() => setShowModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default AgregarPedido;
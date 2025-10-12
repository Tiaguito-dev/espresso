// src/pages/pedidos/PedidosLista.jsx
import React, { useState, useEffect } from "react";
import { getPedidos, updatePedido } from "../../services/pedidosService"; // Importamos las funciones
import { useNavigate } from "react-router-dom"; // Esto es para navegar programáticamente, es decir, cuando hacemos click en "Agregar Pedido"
import "./PedidosLista.css";

import Filtro from "./../menu/Filtro";

/*
  FLUJO COMPLETO:

  1. Componente carga:
    pedidos = [] → Tabla vacía 

  2. fetchPedidos() ejecuta:
    Backend responde con datos 📡

  3. setPedidos(data) ejecuta:
    pedidos = [datos] → React re-renderiza

  4. Tabla se actualiza:
    map() recorre los datos → Filas aparecen
*/

export default function PedidosLista() {
  const [pedidos, setPedidos] = useState([]);

  /*
    ¿Por qué es confuso lo de setPedidos?
    Porque no ves la definición explícita de setPedidos, pero React la crea automáticamente cuando usas useState.
          
    Versión manual (sin React):
    let pedidos = [];
  
    function setPedidos(nuevoValor) {
    pedidos = nuevoValor;
    // Re-renderizar componente manualmente
    }
  
    Versión React (automática):
    const [pedidos, setPedidos] = useState([]); // ← React hace todo por ti
  */

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const navigate = useNavigate();

  // Usamos useEffect para cargar los pedidos del back-end al inicio
  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const data = await getPedidos();
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  };

  const toggleFiltros = () => {
    setMostrarFiltros(!mostrarFiltros);
  };

  const filtrarEstado = (estado) => {
    setEstadoFiltro(estado);
  };

  const cambiarEstado = async (id) => {
    const nuevoEstado = prompt(
      "Ingrese nuevo estado (Pendiente, Listo, Finalizado, Cancelado):"
    );
    if (!nuevoEstado) return;

    try {
      await updatePedido(id, { estado: nuevoEstado });
      fetchPedidos(); // Vuelve a cargar los pedidos para ver el cambio
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

  // REFERENCIA N°1: HAY UNA VARIABLE DE ESTADO PARA estadoFiltro así que cuando cambie se actualiza automáticamente pedidosFiltrados
  const pedidosFiltrados =
    estadoFiltro === "todos" ? pedidos : pedidos.filter((p) => p.estado === estadoFiltro);

  /* 
    Alternativa sin usar operador ternario (if else):
    let pedidosFiltrados;
    if (estadoFiltro === "todos") {
      pedidosFiltrados = pedidos;
    } else {
      pedidosFiltrados = pedidos.filter((p) => p.estado === estadoFiltro);
    }
  */

  return (
    <div className="container">
      {/* Botón filtros */}
      <button className="toggle-filtros" onClick={toggleFiltros}>
        Filtros
      </button>
      {mostrarFiltros && (
        <div className="filtros">
          <input type="text" placeholder="Buscar por Mozo" />
          <input type="text" placeholder="Buscar por Mesa" />
        </div>
      )}

      {/* Estados + agregar pedido */}
      <div className="filtros-estado">
        <div className="estados">
          <Filtro estadoActual={estadoFiltro} estadoValor="todos" nombreFiltro="Todos" onClick={filtrarEstado} />
          <Filtro estadoActual={estadoFiltro} estadoValor="Pendiente" nombreFiltro="Pendiente" onClick={filtrarEstado} />
          <Filtro estadoActual={estadoFiltro} estadoValor="Listo" nombreFiltro="Listo" onClick={filtrarEstado} />
          <Filtro estadoActual={estadoFiltro} estadoValor="Finalizado" nombreFiltro="Finalizado" onClick={filtrarEstado} />
          <Filtro estadoActual={estadoFiltro} estadoValor="Cancelado" nombreFiltro="Cancelado" onClick={filtrarEstado} />
        </div>

        <button className="btn-agregar" onClick={() => navigate("/pedidos/agregar")}>+ Agregar Pedido</button>
      </div>

      {/* Tabla */}
      <table>
        <thead>
          <tr>
            <th>N° Pedido</th>
            <th>Mesa</th>
            <th>Productos</th>
            <th>Precio Total</th>
            <th>Estado</th>
            <th>Cambio de Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Para entender por qué usa pedidosFiltrados mirar la REFERENCIA N°1 */}
          {pedidosFiltrados.map((pedido) => (
            <tr key={pedido.id} data-estado={pedido.estado}>
              <td>{pedido.id}</td>
              <td>{pedido.mesa}</td>
              <td>{pedido.productos.map(p => `${p.nombre} ($${p.precio})`).join(', ')}</td>
              <td>${pedido.total}</td>
              <td>
                <span className={`estado ${pedido.estado.toLowerCase()}`}>
                  {pedido.estado}
                </span>
              </td>
              <td>
                <span className={`historial ${pedido.estado.toLowerCase()}`}>
                  {pedido.historial}
                </span>
              </td>
              <td className="acciones">
                <button className="info">ℹ️ Mostrar info</button>
                <button
                  className="modificar"
                  onClick={() => cambiarEstado(pedido.id)}
                >
                  ✏️ Modificar
                </button>
                <button className="baja">🗑️ Baja</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
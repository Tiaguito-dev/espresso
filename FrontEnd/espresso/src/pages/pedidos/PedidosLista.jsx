// src/pages/pedidos/PedidosLista.jsx
import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { getPedidos, updatePedido } from "../../services/pedidosService"; // Importamos las funciones
import { useNavigate } from "react-router-dom"; // Esto es para navegar programáticamente, es decir, cuando hacemos click en "Agregar Pedido"
import "./PedidosLista.css";

import Filtro from "./../menu/Filtro";

/*
  🔄 FLUJO COMPLETO:

  1. Componente carga:
    pedidos = [] → Tabla vacía 📋

  2. fetchPedidos() ejecuta:
    Backend responde con datos 📡

  3. setPedidos(data) ejecuta:
    pedidos = [datos] → React re-renderiza 🔄

  4. Tabla se actualiza:
    map() recorre los datos → Filas aparecen ✅
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
=======
// Asegúrate de que updatePedido esté importado desde el path correcto
import { getPedidos, updatePedido } from "../../services/pedidosService"; 
import { useNavigate } from "react-router-dom";
import "./PedidosLista.css";
import BotonBaja from "../../components/BotonBaja"; 

export default function PedidosLista() {
  const [pedidos, setPedidos] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

>>>>>>> 5d4ba000b058c793dc0599fd40f4714cc4af4cfa
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

<<<<<<< HEAD
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
=======
  /**
   * Actualiza el estado de un pedido.
   * @param {string} id - ID del pedido.
   * @param {string | null} [nuevoEstadoFijo=null] - Estado específico a asignar ('Cancelado', etc.). 
   * Si es null, usa la lógica de avance (Pendiente -> Listo -> Finalizado).
   */
  const cambiarEstado = async (id, nuevoEstadoFijo = null) => {
    try {
      const pedidoActual = pedidos.find((p) => p.id === id);
      if (!pedidoActual) return;

      let estadoAEnviar = nuevoEstadoFijo;
      let bodyData = {};

      // Si se especificó un estado fijo (ej: 'Cancelado')
      if (nuevoEstadoFijo) {
        bodyData = { nuevoEstado: estadoAEnviar };
      } 
      // Si se requiere avance automático (sin estado fijo)
      else {
        let siguienteEstado;
        if (pedidoActual.estado === "Pendiente") {
          siguienteEstado = "Listo";
        } else if (pedidoActual.estado === "Listo") {
          siguienteEstado = "Finalizado";
        } else {
          alert(`El pedido ${id} ya está ${pedidoActual.estado} y no se puede avanzar.`);
          return;
        }
        estadoAEnviar = siguienteEstado;
        bodyData = { nuevoEstado: estadoAEnviar }; 
        
        
      }
      
      // Bloqueo en el frontend para estados finales (aunque el backend también lo bloquea)
      if ((pedidoActual.estado === "Finalizado" || pedidoActual.estado === "Cancelado") && nuevoEstadoFijo !== pedidoActual.estado) {
         alert(`El pedido ${id} ya está ${pedidoActual.estado} y no se puede modificar.`);
         return;
      }


      // **LLAMADA CLAVE:** Enviamos el cuerpo con la propiedad 'nuevoEstado'
      await updatePedido(id, bodyData);

      // Actualizar el estado local con el estado que se acaba de enviar
      setPedidos((prevPedidos) =>
        prevPedidos.map((p) =>
          p.id === id ? { ...p, estado: estadoAEnviar } : p
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      alert("Error al actualizar el pedido. Revisa la consola y el servidor.");
    }
  };

  const pedidosFiltrados =
    estadoFiltro === "todos"
      ? pedidos
      : pedidos.filter((p) => p.estado === estadoFiltro);

  return (
    <div className="container">
>>>>>>> 5d4ba000b058c793dc0599fd40f4714cc4af4cfa
      <button className="toggle-filtros" onClick={toggleFiltros}>
        Filtros
      </button>
      {mostrarFiltros && (
        <div className="filtros">
          <input type="text" placeholder="Buscar por Mozo" />
          <input type="text" placeholder="Buscar por Mesa" />
        </div>
      )}

<<<<<<< HEAD
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
=======
      <div className="filtros-estado">
        <div className="estados">
          <span onClick={() => filtrarEstado("todos")}>Todos</span>
          <span onClick={() => filtrarEstado("Pendiente")}>Pendientes</span>
          <span onClick={() => filtrarEstado("Listo")}>Listos</span>
          <span onClick={() => filtrarEstado("Finalizado")}>Finalizados</span>
          <span onClick={() => filtrarEstado("Cancelado")}>Cancelados</span>
        </div>
        <button
          className="btn-agregar"
          onClick={() => navigate("/pedidos/agregar")}
        >
          + Agregar Pedido
        </button>
      </div>

>>>>>>> 5d4ba000b058c793dc0599fd40f4714cc4af4cfa
      <table>
        <thead>
          <tr>
            <th>N° Pedido</th>
            <th>Mesa</th>
            <th>Productos</th>
            <th>Precio Total</th>
            <th>Estado</th>
<<<<<<< HEAD
            <th>Cambio de Estado</th>
=======
>>>>>>> 5d4ba000b058c793dc0599fd40f4714cc4af4cfa
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
<<<<<<< HEAD
          {/* Para entender por qué usa pedidosFiltrados mirar la REFERENCIA N°1 */}
=======
>>>>>>> 5d4ba000b058c793dc0599fd40f4714cc4af4cfa
          {pedidosFiltrados.map((pedido) => (
            <tr key={pedido.id} data-estado={pedido.estado}>
              <td>{pedido.id}</td>
              <td>{pedido.mesa}</td>
<<<<<<< HEAD
              <td>{pedido.productos.map(p => `${p.nombre} ($${p.precio})`).join(', ')}</td>
=======
              <td>
                {pedido.productos
                  .map((p) => `${p.nombre} ($${p.precio})`)
                  .join(", ")}
              </td>
>>>>>>> 5d4ba000b058c793dc0599fd40f4714cc4af4cfa
              <td>${pedido.total}</td>
              <td>
                <span className={`estado ${pedido.estado.toLowerCase()}`}>
                  {pedido.estado}
                </span>
              </td>
<<<<<<< HEAD
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
=======
              <td className="acciones">
                <button className="info">Mostrar info</button>
                
                {}
                <button
                  className="modificar"
                  onClick={() => cambiarEstado(pedido.id)}
                  disabled={pedido.estado === "Finalizado" || pedido.estado === "Cancelado"}
                >
                  {pedido.estado === "Pendiente"
                    ? "Pasar a Listo"
                    : pedido.estado === "Listo"
                    ? "Pasar a Finalizado"
                    : "Finalizado"}
                </button> 
                {/* ¡Reemplazamos el botón original por el nuevo componente! */}
              {/* Le pasamos el ID del pedido y la función 'cambiarEstado' */}
              <BotonBaja
                pedidoId={pedido.id}
                onCancelar={cambiarEstado}
              />
>>>>>>> 5d4ba000b058c793dc0599fd40f4714cc4af4cfa
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
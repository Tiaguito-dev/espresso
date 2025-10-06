// src/pages/pedidos/PedidosLista.jsx
import React, { useState, useEffect } from "react";
// Asegúrate de que updatePedido esté importado desde el path correcto
import { getPedidos, updatePedido } from "../../services/pedidosService"; 
import { useNavigate } from "react-router-dom";
import "./PedidosLista.css";
import BotonBaja from "../../components/BotonBaja"; 

export default function PedidosLista() {
  const [pedidos, setPedidos] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

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
      <button className="toggle-filtros" onClick={toggleFiltros}>
        Filtros
      </button>
      {mostrarFiltros && (
        <div className="filtros">
          <input type="text" placeholder="Buscar por Mozo" />
          <input type="text" placeholder="Buscar por Mesa" />
        </div>
      )}

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

      <table>
        <thead>
          <tr>
            <th>N° Pedido</th>
            <th>Mesa</th>
            <th>Productos</th>
            <th>Precio Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.map((pedido) => (
            <tr key={pedido.id} data-estado={pedido.estado}>
              <td>{pedido.id}</td>
              <td>{pedido.mesa}</td>
              <td>
                {pedido.productos
                  .map((p) => `${p.nombre} ($${p.precio})`)
                  .join(", ")}
              </td>
              <td>${pedido.total}</td>
              <td>
                <span className={`estado ${pedido.estado.toLowerCase()}`}>
                  {pedido.estado}
                </span>
              </td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
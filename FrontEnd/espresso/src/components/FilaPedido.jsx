import React from "react";
import { useNavigate } from "react-router-dom";

function FilaPedido({ pedido, funcionCambiarEstado, funcionEliminar }) {
  const navigate = useNavigate();

  // Texto y estado del botón
  let textoBotonEstado = "";
  let deshabilitarBotonEstado = false;

  if (pedido.estadoPedido === "Pendiente") {
    textoBotonEstado = "Pasar a Listo";
  } else if (pedido.estadoPedido === "Listo") {
    textoBotonEstado = "Pasar a Finalizado";
  } else {
    textoBotonEstado = "Proceso Completo";
    deshabilitarBotonEstado = true;
  }

  const claseEstado = `estado-label estado-${pedido.estadoPedido}`;
  const isFinishedOrCanceled = pedido.estadoPedido === "Finalizado" || pedido.estadoPedido === "Cancelado";

  // Función para modificar
  const funcionModificar = () => {
    navigate(`/pedidos/modificar/${pedido.nroPedido}`);
  };

  return (
    <tr>
      <td>{pedido.nroPedido}</td>
      <td>{pedido.mesa.nroMesa}</td>
      <td>4</td>
      <td>{pedido.fecha || "-"}</td>
      <td><span className={claseEstado}>{pedido.estadoPedido}</span></td>
      <td>${pedido.total}</td>
      <td>
        <div className="acciones-container">
          <button
            onClick={() => funcionCambiarEstado(pedido.nroPedido)}
            className="btn-fila-accion btn-cambio-estado"
            disabled={deshabilitarBotonEstado}
            style={{
              opacity: deshabilitarBotonEstado ? 0.6 : 1,
              cursor: deshabilitarBotonEstado ? "not-allowed" : "pointer",
            }}
          >
            {textoBotonEstado}
          </button>

          <button
            onClick={funcionModificar}
            className="btn-fila-accion btn-modificar-fila"
            disabled={isFinishedOrCanceled}
            style={{
              opacity: isFinishedOrCanceled ? 0.6 : 1,
              cursor: isFinishedOrCanceled ? "not-allowed" : "pointer",
            }}
          >
            Modificar
          </button>

          <button
            onClick={() => funcionEliminar(pedido.nroPedido)}
            className="btn-fila-accion btn-cancelar-fila"
            disabled={isFinishedOrCanceled}
            style={{
              opacity: isFinishedOrCanceled ? 0.6 : 1,
              cursor: isFinishedOrCanceled ? "not-allowed" : "pointer",
            }}
          >
            Dar de Baja
          </button>
        </div>
      </td>
    </tr>
  );
}

export default FilaPedido;

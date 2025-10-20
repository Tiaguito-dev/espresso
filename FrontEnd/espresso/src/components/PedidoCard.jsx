// src/components/PedidoCard.jsx

import React from 'react';

const PedidoCard = ({ pedido }) => {
  const getEstadoClassName = (estado) => {
    return `estado ${estado.toLowerCase()}`;
  };

  return (
    <tr data-estado={pedido.estado}>
      <td>{pedido.id}</td>
      <td>{pedido.mesa}</td>
      <td>{pedido.productos}</td>
      <td>${pedido.precioTotal}</td>
      <td><span className={getEstadoClassName(pedido.estado)}>{pedido.estado}</span></td>
      <td><span className="historial pendiente">Pendiente</span></td> {/* Esto debería ser dinámico */}
      <td className="acciones">
        <button className="info">ℹ️ Mostrar info</button>
        <button className="modificar">✏️ Modificar</button>
        <button className="baja">🗑️ Baja</button>
      </td>
    </tr>
  );
};

export default PedidoCard;
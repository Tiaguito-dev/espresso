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
<<<<<<< HEAD
      <td><span className="historial pendiente">Pendiente</span></td> {/* Esto debería ser dinámico */}
      <td className="acciones">
=======
      <td><span className="historial pendiente">Pendiente</span></td> {/* Esto debería ser dinámico si tu backend maneja historial */}
      <td className="acciones">
        {/* Aquí puedes agregar botones y su lógica */}
>>>>>>> 5d4ba000b058c793dc0599fd40f4714cc4af4cfa
        <button className="info">ℹ️ Mostrar info</button>
        <button className="modificar">✏️ Modificar</button>
        <button className="baja">🗑️ Baja</button>
      </td>
    </tr>
  );
};

export default PedidoCard;
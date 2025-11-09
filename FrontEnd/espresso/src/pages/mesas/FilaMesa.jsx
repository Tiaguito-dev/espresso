import React from 'react';

export default function FilaMesa({ mesa, funcionCambiarEstado, funcionEliminar }) {
  // Clase para badge según estado
  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'disponible':
        return 'estado-badge estado-disponible';
      case 'ocupada':
        return 'estado-badge estado-ocupada';
      case 'fuera de servicio':
        return 'estado-badge estado-default';
      default:
        return 'estado-badge estado-default';
    }
  };

  return (
    <tr>
      <td>{mesa.nroMesa}</td>
      <td>
        <span className={getEstadoClass(mesa.estadoMesa)}>
          {mesa.estadoMesa}
        </span>
      </td>
      <td>
        <button
          className="btn btn-estado"
          onClick={() => funcionCambiarEstado(mesa.nroMesa)}
        >
          Cambiar Estado
        </button>
        <button
          className="btn btn-Dar de baja"
          onClick={() => funcionEliminar(mesa.nroMesa)}
        >
          Dar de baja
        </button>
      </td>
    </tr>
  );
}

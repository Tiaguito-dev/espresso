import React from 'react';
import FilaMesa from './FilaMesa';

export default function TablaMesas({ mesas, arrayCampos, funcionCambiarEstado, funcionEliminar }) {
  return (
    <div className="tabla-contenedor">
      {mesas.length === 0 ? (
        <p className="mensaje-vacio">No hay mesas para mostrar.</p>
      ) : (
        <table className="tabla-mesas">
          <thead>
            <tr>
              {arrayCampos.map((campo, i) => (
                <th key={i}>{campo}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mesas.map((mesa) => (
              <FilaMesa
                key={mesa.nroMesa} // Usamos nroMesa como key
                mesa={mesa}
                funcionCambiarEstado={funcionCambiarEstado}
                funcionEliminar={funcionEliminar}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

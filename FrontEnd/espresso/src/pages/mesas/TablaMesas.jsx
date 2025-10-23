// src/pages/mesas/TablaMesas.jsx

import React from 'react';
import FilaMesa from './FilaMesa'; // Importamos el componente de fila

export default function TablaMesas({ mesas, arrayCampos, funcionCambiarEstado, funcionModificar, funcionEliminar }) {
    return (
        <div className="tabla-contenedor">
            {mesas.length === 0 ? (
                <p className="mensaje-vacio">No hay mesas para mostrar.</p>
            ) : (
                <table className="tabla-mesas">
                    {/* Encabezados */}
                    <thead>
                        <tr>
                            {arrayCampos.map((campo, index) => (
                                <th key={index}>{campo}</th>
                            ))}
                        </tr>
                    </thead>
                    {/* Cuerpo de la tabla */}
                    <tbody>
                        {mesas.map((mesa) => (
                            <FilaMesa
                                key={mesa.id}
                                mesa={mesa}
                                funcionCambiarEstado={funcionCambiarEstado}
                                funcionModificar={funcionModificar}
                                funcionEliminar={funcionEliminar}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
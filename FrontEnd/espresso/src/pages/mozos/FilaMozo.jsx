// src/pages/mozos/FilaMozo.jsx

import React from 'react';

export default function FilaMozo({ mozo, funcionAsignarMesa }) {
    const mozoNombre = mozo.nombre;

    return (
        <tr>
            <td>{mozo.id}</td>
            <td>{mozoNombre}</td>
            <td>
                {/* Muestra los números de mesa asignados, separados por coma */}
                {mozo.mesasAsignadas.length > 0 
                    ? mozo.mesasAsignadas.join(', ')
                    : 'Ninguna'
                }
            </td>
            <td>
                {/* Aquí podrías añadir un botón para 'Tomar Pedido' 
                  o una lista desplegable para asignar una mesa.
                  Por ahora, simularemos un botón de acción.
                */}
                <button 
                    className="btn-accion btn-modificar" 
                    // Simulamos la acción de tomar un pedido para la MESA 2 (solo para ejemplo)
                    onClick={() => funcionAsignarMesa(mozo.id, 2, mozoNombre)}
                >
                    Asignar Mesa 2 (Ej.)
                </button>
            </td>
        </tr>
    );
}
// src/pages/mesas/TablaMesas.jsx

import React from 'react';
import FilaMesa from './FilaMesa';
import './Mesas.css'; // Asegúrate de que los estilos de tabla se importen aquí o en MesasLista

export default function TablaMesas({ 
    mesas, 
    arrayCampos, 
    funcionCambiarEstado, 
    funcionModificar, 
    funcionLiberar,             // 🚨 NUEVA FUNCIÓN
    funcionPonerNoDisponible    // 🚨 NUEVA FUNCIÓN
}) {
    return (
        <div className="table-container">
            {mesas.length === 0 ? (
                <p className="no-data-message">No se encontraron mesas que coincidan con los filtros.</p>
            ) : (
                <table className="mesas-table">
                    <thead>
                        <tr>
                            {/* Mapeo de los encabezados de la tabla */}
                            {arrayCampos.map((campo, index) => (
                                <th key={index}>{campo}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Mapeo de cada mesa a su respectiva fila */}
                        {mesas.map((mesa) => (
                            <FilaMesa
                                key={mesa.id}
                                mesa={mesa}
                                funcionCambiarEstado={funcionCambiarEstado}
                                funcionModificar={funcionModificar}
                                // 🚨 Pasamos las nuevas funciones de Liberar y No Disponible
                                funcionLiberar={funcionLiberar}
                                funcionPonerNoDisponible={funcionPonerNoDisponible}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
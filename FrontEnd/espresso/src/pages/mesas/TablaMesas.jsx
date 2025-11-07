// src/pages/mesas/TablaMesas.jsx (SIN CAMBIOS FUNCIONALES CRÍTICOS)

import React from 'react';
import FilaMesa from './FilaMesa';
import './Mesas.css'; 

export default function TablaMesas({ 
    mesas, 
    arrayCampos, 
    funcionCambiarEstado, 
    funcionModificar, 
    funcionLiberar,            
    funcionPonerNoDisponible    
}) {
    return (
        <div className="table-container">
            {mesas.length === 0 ? (
                <p className="no-data-message">No se encontraron mesas que coincidan con los filtros.</p>
            ) : (
                <table className="mesas-table">
                    <thead>
                        <tr>
                            {arrayCampos.map((campo, index) => (
                                <th key={index}>{campo}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mesas.map((mesa) => (
                               <FilaMesa
                                    key={mesa.nroMesa} // Usa nroMesa como key
                                    mesa={mesa}
                                    funcionCambiarEstado={funcionCambiarEstado}
                                    funcionModificar={funcionModificar}
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
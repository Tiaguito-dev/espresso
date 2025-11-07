// src/pages/mozos/TablaMozos.jsx (CORREGIDO)

import React from 'react';
import FilaMozo from './FilaMozo';

export default function TablaMozos({ mozos, arrayCampos, funcionAsignarMesa }) {
    return (
        <div className="tabla-contenedor">
            {mozos.length === 0 ? (
                <p className="mensaje-vacio">No hay mozos para mostrar.</p>
            ) : (
                // 🎯 CORRECCIÓN: Asegúrate de que no haya espacios/saltos de línea aquí.
                <table className="tabla-mesas">
                    <thead>
                        <tr>
                            {arrayCampos.map((campo, index) => (
                                <th key={index}>{campo}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mozos.map((mozo) => (
                            <FilaMozo
                                key={mozo.id}
                                mozo={mozo}
                                funcionAsignarMesa={funcionAsignarMesa}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
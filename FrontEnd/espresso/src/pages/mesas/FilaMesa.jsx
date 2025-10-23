// src/pages/mesas/FilaMesa.jsx

import React from 'react';

export default function FilaMesa({ mesa, funcionCambiarEstado, funcionModificar, funcionEliminar }) {
    
    // Función para determinar la clase de color del estado
    const getColorClase = (estado) => {
        switch (estado) {
            case "Disponible":
                return "estado-disponible";
            case "Ocupada":
                return "estado-ocupada";
            case "Lista para ordenar":
                return "estado-ordenar";
            case "Lista para pagar":
                return "estado-pagar";
            default:
                return "estado-default";
        }
    };

    // Función para obtener el texto del botón de cambio de estado
    const getBotonTexto = (estado) => {
        switch (estado) {
            case "Disponible":
                return "Ocupar";
            case "Ocupada":
                return "Tomar Orden";
            case "Lista para ordenar":
                return "Cobrar";
            case "Lista para pagar":
                return "Liberar";
            default:
                return "Cambiar";
        }
    };
    
    return (
        <tr>
            <td>{mesa.id}</td>
            <td>{mesa.numero}</td>
            <td>{mesa.mozoACargo || '-'}</td>
            <td>
                <span className={`estado-badge ${getColorClase(mesa.estado)}`}>
                    {mesa.estado}
                </span>
            </td>
            <td className="acciones">
                <button 
                    className="btn btn-estado" 
                    onClick={() => funcionCambiarEstado(mesa.id)}
                >
                    {getBotonTexto(mesa.estado)}
                </button>
                <button 
                    className="btn btn-modificar" 
                    onClick={() => funcionModificar(mesa.id)}
                >
                    Modificar
                </button>
                <button 
                    className="btn btn-eliminar" 
                    onClick={() => funcionEliminar(mesa.id)}
                >
                    Dar de Baja
                </button>
            </td>
        </tr>
    );
}
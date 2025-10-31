// src/pages/mesas/FilaMesa.jsx

import React from 'react';

// Estilos de estado para la celda (Incluye No Disponible)
const getEstadoClass = (estado) => {
    switch (estado) {
        case "Disponible":
            return "estado-disponible";
        case "Ocupada":
            return "estado-ocupada";
        case "No Disponible":
            return "estado-no-disponible"; 
        default:
            return "estado-desconocido";
    }
};

// 🚨 La prop 'funcionEliminar' del código anterior se divide en 'funcionLiberar' y 'funcionPonerNoDisponible'
export default function FilaMesa({ mesa, funcionCambiarEstado, funcionModificar, funcionLiberar, funcionPonerNoDisponible }) {
    
    const mesaId = mesa.id; 

    // DETERMINAR QUÉ BOTONES MOSTRAR
    const estaNoDisponible = mesa.estado === "No Disponible";

    return (
        <tr>
            <td>{mesa.id}</td>
            <td>{mesa.numero}</td>
            <td>{mesa.mozoACargo || '-'}</td>
            <td>
                <span className={`${getEstadoClass(mesa.estado)} estado-badge`}> 
                    {mesa.estado}
                </span>
            </td>
            <td>
                {/* 1. Botón de Ciclo de Estado (Solo visible si NO está No Disponible) */}
                {!estaNoDisponible && (
                    <button 
                        className="btn-accion btn-cambiar-estado" 
                        onClick={() => funcionCambiarEstado(mesaId)}
                    >
                        {/* Muestra el texto opuesto al estado actual */}
                        {mesa.estado === "Ocupada" ? "Poner Disponible" : "Poner Ocupada"} 
                    </button>
                )}

                {/* 2. Botón Modificar (siempre visible) */}
                <button 
                    className="btn-accion btn-modificar" 
                    onClick={() => funcionModificar(mesaId)}
                >
                    Modificar
                </button>
                
                {/* 3. Botón para liberar (activar) o poner fuera de servicio (eliminar suave) */}
                {!estaNoDisponible ? (
                    // Si está Disponible u Ocupada, mostramos Poner No Disponible (Eliminación suave)
                    <button 
                        className="btn-accion btn-eliminar-suave" 
                        onClick={() => funcionPonerNoDisponible(mesaId)} 
                    >
                        Poner No Disponible
                    </button>
                ) : (
                    // Si está No Disponible, mostramos el botón para activarla/liberarla
                    <button 
                        className="btn-accion btn-liberar" 
                        onClick={() => funcionLiberar(mesaId)} 
                    >
                        Poner Disponible
                    </button>
                )}
            </td>
        </tr>
    );
}
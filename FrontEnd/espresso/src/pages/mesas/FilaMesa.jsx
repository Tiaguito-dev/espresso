// src/pages/mesas/FilaMesa.jsx

import React from 'react';

// 🔄 Función de mapeo y normalización de estado
const normalizarEstado = (estadoBD) => {
    if (!estadoBD) return 'Desconocido';
    
    const estadoLower = estadoBD.toLowerCase();

    switch (estadoLower) {
        case "disponible":
            return "Disponible";
        case "ocupada":
            return "Ocupada";
        case "fuera de servicio": // 🚨 El valor que el Backend almacena
            return "No Disponible"; // 🚨 El valor que el Frontend espera mostrar
        default:
            // Capitalizar el resto si lo hay, aunque sea desconocido
            return estadoBD.charAt(0).toUpperCase() + estadoBD.slice(1).toLowerCase();
    }
}

// Estilos de estado para la celda (AHORA USA EL ESTADO NORMALIZADO)
const getEstadoClass = (estadoNormalizado) => {
    switch (estadoNormalizado) {
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

export default function FilaMesa({ mesa, funcionCambiarEstado, funcionModificar, funcionLiberar, funcionPonerNoDisponible }) {
    
    const mesaId = mesa.nroMesa; 
    
    // 🚨 CLAVE: Normalizamos el estado de la DB para todas las comparaciones y la visualización
    const estadoNormalizado = normalizarEstado(mesa.estadoMesa);

    const estaNoDisponible = estadoNormalizado === "No Disponible"; 
    const estaOcupada = estadoNormalizado === "Ocupada";

    return (
        <tr>
            {/* 1. Columnas ID/Número */}
            <td>{mesa.nroMesa}</td> 
            <td>{mesa.nroMesa}</td>
            
            {/* 2. Columna Mozo a cargo */}
            <td>{mesa.mozoACargo || '-'}</td>
            
            {/* 3. Columna Estado */}
            <td> 
                <span className={`${getEstadoClass(estadoNormalizado)} estado-badge`}>
                    {estadoNormalizado} {/* 🚨 Usa el estado normalizado para mostrar */}
                </span>
            </td>
            
            {/* 4. Columna Acciones */}
            <td> 
                {/* Botón Ciclo de Estado (Visible si NO está No Disponible) */}
                {!estaNoDisponible && (
                    <button 
                        className="btn-accion btn-cambiar-estado" 
                        onClick={() => funcionCambiarEstado(mesaId)}
                    >
                        {estaOcupada ? "Poner Disponible" : "Poner Ocupada"} {/* 🚨 Usa la variable normalizada */}
                    </button>
                )}

                {/* Botón Modificar (siempre visible) */}
                <button 
                    className="btn-accion btn-modificar" 
                    onClick={() => funcionModificar(mesaId)}
                >
                    Modificar
                </button>
                
                {/* Botón para liberar (activar) o poner fuera de servicio */}
                {!estaNoDisponible ? (
                    // Si está Disponible u Ocupada -> Poner No Disponible
                    <button 
                        className="btn-accion btn-eliminar-suave" 
                        onClick={() => funcionPonerNoDisponible(mesaId)} 
                    >
                        Poner No Disponible
                    </button>
                ) : (
                    // Si está No Disponible -> Poner Disponible (usa funcionLiberar)
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
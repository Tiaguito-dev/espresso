// src/pages/pedidos/FilaPedido.jsx

import React from "react";

// No necesitamos BotonAccion si estamos creando los botones directamente aquí

function FilaPedido({ pedido, funcionCambiarEstado, funcionModificar, funcionEliminar }) {
    
    // 1. Lógica para el texto del botón de estado
    let textoBotonEstado = '';
    let deshabilitarBotonEstado = false;

    if (pedido.estado === "Pendiente") {
        textoBotonEstado = "Pasar a Listo";
    } else if (pedido.estado === "Listo") {
        textoBotonEstado = "Pasar a Finalizado";
    } else {
        // Si el estado es "Finalizado" o "Cancelado", no se puede avanzar.
        textoBotonEstado = "Proceso Completo";
        deshabilitarBotonEstado = true;
    }
    
    // 2. Clase dinámica para el estado de la celda
    // Usamos 'estado-label' como base y 'estado-EstadoActual' como específico.
    const claseEstado = `estado-label estado-${pedido.estado}`;
    
    // 3. Chequeo para deshabilitar los botones de acción si está Finalizado o Cancelado
    const isFinishedOrCanceled = pedido.estado === "Finalizado" || pedido.estado === "Cancelado";

    return (
        <tr>
            <td>{pedido.id_pedido}</td>
            <td>{pedido.id_mesa}</td>
            <td>{pedido.id_mozo}</td>
            {/* Si fecha no viene, puedes mostrar un guión '-' */}
            <td>{pedido.fecha_registro ? pedido.fecha_registro : '-'}</td> 
            
            {/* Celda del Estado con Color */}
            <td><span className={claseEstado}>{pedido.estado}</span></td>
            
            <td>${pedido.monto}</td>
            
            {/* Columna de Acciones */}
            <td>
                <div className="acciones-container">
                    
                    {/* Botón de CAMBIO DE ESTADO */}
                    <button 
                        onClick={() => funcionCambiarEstado(pedido.id_pedido)}
                        className="btn-fila-accion btn-cambio-estado"
                        // Deshabilitar si ya terminó o se canceló
                        disabled={deshabilitarBotonEstado} 
                        style={{ opacity: deshabilitarBotonEstado ? 0.6 : 1, 
                                 cursor: deshabilitarBotonEstado ? 'not-allowed' : 'pointer' }}
                    >
                        {textoBotonEstado}
                    </button>

                    {/* Botón MODIFICAR */}
                    <button 
                        onClick={() => funcionModificar(pedido.id_pedido)}
                        className="btn-fila-accion btn-modificar-fila" 
                        disabled={isFinishedOrCanceled}
                        style={{ opacity: isFinishedOrCanceled ? 0.6 : 1, 
                                 cursor: isFinishedOrCanceled ? 'not-allowed' : 'pointer' }}
                    >
                        Modificar
                    </button>

                    {/* Botón CANCELAR / BAJA (Solo si no está ya cancelado/finalizado) */}
                    <button 
                        onClick={() => funcionEliminar(pedido.id_pedido)} // Llama a cancelarPedido
                        className="btn-fila-accion btn-cancelar-fila" 
                        disabled={isFinishedOrCanceled}
                        style={{ opacity: isFinishedOrCanceled ? 0.6 : 1, 
                                 cursor: isFinishedOrCanceled ? 'not-allowed' : 'pointer' }}
                    >
                        Dar de Baja
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default FilaPedido;
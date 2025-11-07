// src/pages/pedidos/FilaPedido.jsx (CORREGIDO)

import React from "react";

function FilaPedido({ pedido, funcionCambiarEstado, funcionModificar, funcionEliminar }) {
    
    // Función auxiliar para normalizar el estado a 'Primera Mayúscula, Resto Minúscula'
    const normalizeEstado = (estado) => {
        if (!estado) return 'N/A';
        const lower = String(estado).toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    };

    const estadoNormalizado = normalizeEstado(pedido.estadoPedido);

    // 1. Lógica para el texto del botón de estado
    let textoBotonEstado = '';
    const isFinishedOrCanceled = estadoNormalizado === "Finalizado" || estadoNormalizado === "Cancelado";
    let isPendingOrReady = false; 

    if (estadoNormalizado === "Pendiente") {
        textoBotonEstado = "Pasar a Listo";
        isPendingOrReady = true;
    } else if (estadoNormalizado === "Listo") {
        textoBotonEstado = "Pasar a Finalizado";
        isPendingOrReady = true;
    } 
    
    // 2. Clase dinámica para el estado de la celda
    const claseEstado = `estado-label estado-${estadoNormalizado}`;
    
    // 3. Lógica para calcular el total
    const calcularTotalPedido = () => {
        const lineas = pedido.lineasPedido || []; 
        
        return lineas.reduce((acumulado, linea) => {
            const cantidad = Number(linea.cantidad) || 0;
            const precio = Number(linea.precioUnitario) || 0;
            return acumulado + (cantidad * precio);
        }, 0);
    };

    const totalPedido = calcularTotalPedido();
    
    // Asumimos que el mozoACargo viene en el objeto 'mesa' si no está a nivel de pedido
    const mozo = pedido.mesa?.mozoACargo || 'N/A';


    return (
        // 🛑 CORRECCIÓN DE WHITESPACE: Eliminamos los saltos de línea entre las etiquetas </td> y <td>
        <tr>
            <td>{pedido.nroPedido}</td>
            
            <td>{pedido.mesa ? pedido.mesa.nroMesa : ('N/A')}</td>
        
            <td>{mozo}</td> 
            
            <td>{pedido.fecha.substring(0, 10)}</td>
            
            {/* Celda del Estado con Color */}
            <td><span className={claseEstado}>{pedido.estadoPedido}</span></td>

            {/* Total calculado */}
            <td>$ {totalPedido.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
            
            {/* Columna de Acciones */}
            <td>
                <div className="acciones-container">
                    
                    {/* Botón de CAMBIO DE ESTADO o Etiqueta de Completo */}
                    {isPendingOrReady ? (
                         <button 
                            onClick={() => funcionCambiarEstado(pedido.nroPedido)}
                            className="btn-fila-accion btn-cambio-estado"
                        >
                            {textoBotonEstado}
                        </button>
                    ) : (
                        <span className="proceso-completo-label">
                            {estadoNormalizado === "Cancelado" ? "Cancelado" : "Completo"}
                        </span>
                    )}

                    {/* Botón MODIFICAR */}
                    <button 
                        onClick={() => funcionModificar(pedido.nroPedido)}
                        className="btn-fila-accion btn-modificar-fila" 
                        disabled={isFinishedOrCanceled}
                        style={{ opacity: isFinishedOrCanceled ? 0.6 : 1, 
                                cursor: isFinishedOrCanceled ? 'not-allowed' : 'pointer' }}
                    >
                        Modificar
                    </button>

                    {/* Botón CANCELAR / BAJA */}
                    <button 
                        onClick={() => funcionEliminar(pedido.nroPedido)}
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
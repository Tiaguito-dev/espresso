import React from "react";
import IconoEliminar from "./IconoEliminar";
import IconoModificar from "./IconoModificar";

function FilaPedido({ pedido, funcionCambiarEstado, funcionModificar, funcionEliminar }) {
    

    let textoBotonEstado = '';
    let deshabilitarBotonEstado = false;

    if (pedido.estadoPedido === "pendiente") {
        textoBotonEstado = "Pasar a Listo";
    } else if (pedido.estadoPedido === "listo") {
        textoBotonEstado = "Pasar a Finalizado";
    } else {
        textoBotonEstado = "Proceso Completo";
        deshabilitarBotonEstado = true;
    }
    
    const claseEstado = `estado-label estado-${pedido.estadoPedido}`;
    
    const isFinishedOrCanceled = pedido.estadoPedido === "finalizado" || pedido.estadoPedido === "cancelado";

    return (
        <tr>
            <td>{pedido.nroPedido}</td>
            <td>{pedido.mesa.nroMesa}</td>
            <td>{pedido.mozo}</td>
    
            <td>{pedido.fecha ? pedido.fecha : '-'}</td> 
            
            <td><span className={claseEstado}>{pedido.estadoPedido}</span></td>
            
            <td>${pedido.total}</td>
            
            <td>
                <div className="acciones-container">
                    
                    <button 
                        onClick={() => funcionCambiarEstado(pedido.nroPedido)}
                        className="boton-fila-accion boton-cambio-estado"
                        disabled={deshabilitarBotonEstado} 
                        style={{ opacity: deshabilitarBotonEstado ? 0.6 : 1, 
                                 cursor: deshabilitarBotonEstado ? 'not-allowed' : 'pointer' }}
                    >
                        {textoBotonEstado}
                    </button>

                    <div className="boton-modificar-eliminar">
                        <button 
                        onClick={() => funcionModificar(pedido.nroPedido)}
                        className="boton-fila-accion boton-modificar-fila" 
                        disabled={isFinishedOrCanceled}
                        style={{ opacity: isFinishedOrCanceled ? 0.6 : 1, 
                                 cursor: isFinishedOrCanceled ? 'not-allowed' : 'pointer' }}
                        >
                        <IconoModificar size={18}></IconoModificar>
                        </button>
                        <button 
                        onClick={() => funcionEliminar(pedido.nroPedido)} 
                        className="boton-fila-accion boton-cancelar-fila" 
                        disabled={isFinishedOrCanceled}
                        style={{ opacity: isFinishedOrCanceled ? 0.6 : 1, 
                                 cursor: isFinishedOrCanceled ? 'not-allowed' : 'pointer' }}
                        >
                        <IconoEliminar size={18} className="icono-rojo"></IconoEliminar>
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
}

export default FilaPedido;

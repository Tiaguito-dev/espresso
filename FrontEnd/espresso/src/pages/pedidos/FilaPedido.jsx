// src/pages/pedidos/FilaPedido.jsx

import React from "react";
// Importamos BotonAccion desde su ubicación original (debe ser la correcta en tu proyecto)
import BotonAccion from "../menu/BotonAccion"; 

function FilaPedido({ pedido, funcionCambiarEstado, funcionModificar, funcionEliminar }) {
    
    // Asumimos que los campos del objeto 'pedido' son: id, mesa, mozo, fecha, estado, total

    return (
        <tr key={pedido.id}>
            <td>{pedido.id}</td>
            <td>{pedido.mesa}</td>
            <td>{pedido.mozo}</td>
            <td>{pedido.fecha}</td>
            <td>{pedido.estado}</td>
            <td>${pedido.total}</td>
            
            {/* Componente de Acciones */}
            <BotonAccion
                productoId={pedido.id} // Lo usamos como ID genérico
                funcionCambiarEstado={funcionCambiarEstado}
                funcionModificar={funcionModificar}
                funcionEliminar={funcionEliminar} // Llama a 'cancelarPedido' desde PedidosLista
            />
        </tr>
    );
}

export default FilaPedido;
// pages/pedidos/TablaPedidos.jsx

import React from "react";
// Asegúrate de que esta ruta sea correcta
import BotonAccion from "../menu/BotonAccion"; 

export default function TablaPedidos({ 
    pedidos, 
    funcionCambiarEstado, 
    funcionModificar, 
    funcionEliminar 
}) {
    // Definimos los encabezados de la tabla (opcional, pero ayuda a la claridad)
    const arrayCampos = ["ID", "Mesa", "Fecha", "Estado", "Total", "Acciones"];

    return (
        <table className="tabla">
            <thead>
                <tr>
                    {arrayCampos.map((campo, index) => (
                        <th key={index}>{campo}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {pedidos.length > 0 ? (
                    pedidos.map((pedido) => (
                        <tr key={pedido.id}>
                            <td>{pedido.id}</td>
                            <td>{pedido.mesaNumero}</td>
                            <td>{pedido.fecha}</td>
                            <td>{pedido.estado}</td>
                            <td>${pedido.total}</td>
                            {/* Reutilizamos BotonAccion y le pasamos las props */}
                            <BotonAccion
                                productoId={pedido.id}
                                funcionCambiarEstado={funcionCambiarEstado}
                                funcionModificar={funcionModificar}
                                funcionEliminar={funcionEliminar}
                            />
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={arrayCampos.length}>No hay pedidos registrados.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
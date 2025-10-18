// src/pages/pedidos/TablaPedidos.jsx

import { Fragment } from "react";

// Importamos los nuevos componentes específicos de la tabla
import CabeceraTablaPedidos from "./CabeceraTablaPedidos.jsx"; 
import FilaPedido from "../pages/pedidos/FilaPedido.jsx";

function TablaPedidos({ pedidos, arrayCampos, funcionCambiarEstado, funcionModificar, funcionEliminar}) {

    return (
        // Usamos la clase 'tabla' que ya tienes definida en tus estilos
        <table className="tabla">
            <thead>
                {/* CabeceraTablaPedidos SOLO necesita los encabezados */}
                <CabeceraTablaPedidos arrayCampos={arrayCampos} />
            </thead>
            <tbody>
                {pedidos.length > 0 ? (
                    pedidos.map((pedido) => (
                        // FilaPedido recibe el objeto 'pedido' completo y las funciones
                        <FilaPedido 
                            key={pedido.id} 
                            pedido={pedido} 
                            funcionCambiarEstado={funcionCambiarEstado} 
                            funcionModificar={funcionModificar} 
                            funcionEliminar={funcionEliminar}
                        />
                    ))
                ) : (
                    <tr>
                        {/* El número de columnas debe ser dinámico o fijo (7 en este caso: ID, Mesa, Mozo, Fecha, Estado, Total, Acciones) */}
                        <td colSpan={7}>No hay pedidos registrados.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default TablaPedidos;
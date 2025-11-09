import CabeceraTablaPedidos from "./CabeceraTablaPedidos"; 
import FilaPedido from "./FilaPedido";

function TablaPedidos({ pedidos, arrayCampos, funcionCambiarEstado, funcionModificar, funcionEliminar}) {

    return (
        <table className="tabla">
            <thead>
                <CabeceraTablaPedidos arrayCampos={arrayCampos} />
            </thead>
            <tbody>
                {pedidos.length > 0 ? (
                    pedidos.map((pedido) => (
                        <FilaPedido 
                            key={pedido.nroPedido} 
                            pedido={pedido} 
                            funcionCambiarEstado={funcionCambiarEstado} 
                            funcionModificar={funcionModificar} 
                            funcionEliminar={funcionEliminar}
                        />
                    ))
                ) : (
                    <tr>
                        <td colSpan={7}>No hay pedidos registrados.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default TablaPedidos;
import { Fragment } from "react";

import CabeceraTabla from "../pedidos/CabeceraTabla";
import FilaProducto from "./FilaProducto";

function TablaProducto({ productos, arrayCampos, funcionCambiarEstado, funcionModificar, funcionEliminar}) {

    return (
        <Fragment>
            <table>
                <thead>
                    <CabeceraTabla arrayCampos={arrayCampos}></CabeceraTabla>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <FilaProducto key={producto.id} producto={producto} funcionCambiarEstado={funcionCambiarEstado} funcionModificar={funcionModificar} funcionEliminar={funcionEliminar}></FilaProducto>
                    ))}
                </tbody>
            </table>
        </Fragment>
    );
}

export default TablaProducto;
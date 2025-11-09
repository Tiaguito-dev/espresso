import { Fragment } from "react";
import CabeceraTablaPedidos from "../../components/CabeceraTablaPedidos.jsx";
import FilaProducto from "./FilaProducto";

function TablaProducto({ productos, arrayCampos, funcionCambiarEstado, funcionModificar, funcionEliminar }) {

    return (
        <Fragment>
            <table className="tabla">
                <thead>
                    <CabeceraTablaPedidos arrayCampos={arrayCampos}></CabeceraTablaPedidos>
                </thead>
                <tbody>
                    {console.log("ESTOY EN TABLA PRODUCTO:", productos)}
                    {productos.map((producto) => (
                        <FilaProducto key={producto.id} producto={producto} funcionCambiarEstado={funcionCambiarEstado} funcionModificar={funcionModificar} funcionEliminar={funcionEliminar}></FilaProducto>
                    ))}
                </tbody>
            </table>
        </Fragment>
    );
}

export default TablaProducto;
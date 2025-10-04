import { Fragment } from "react";

import CabeceraTabla from "./CabeceraTabla";
import FilaProducto from "./FilaProducto";

function TablaProducto({ productos, arrayCampos}) {

    return (
        <Fragment>
            <table>
                <thead>
                    <CabeceraTabla arrayCampos={arrayCampos}></CabeceraTabla>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <FilaProducto producto={producto} arrayBotonesAccion={[
                            /*<BotonAccion className={"info"} onClick={cambiarEstado(producto.id)} texto={"ℹ️ Disponibilidad"}></BotonAccion>,
                            <BotonAccion className={"modificar"} onClick={navigate(`/menu/productos/${producto.id}`)} texto={"✏️ Modificar"}></BotonAccion>,
                            <BotonAccion className={"baja"} onClick={onclick()} texto={"🗑️ Baja"}></BotonAccion>*/
                        ]}></FilaProducto>
                    ))}
                </tbody>
            </table>
        </Fragment>
    );
}

export default TablaProducto;
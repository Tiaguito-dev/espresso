import BotonAccion from "./BotonAccion";

function FilaProducto({ producto, funcionCambiarEstado, funcionModificar, funcionEliminar}) {

    return (
        <tr
            key={producto.id}
            data-estado={producto.disponible ? 'disponible' :'no-disponible'}
        >
            <td>{producto.id}</td>
            <td>{producto.nombre}</td>
            <td>{producto.categoria?.nombre || "Sin categoría"}</td>
            <td>{producto.descripcion}</td>
            <td>${producto.precio}</td>
            <td>
                <span className={`disponibilidad ${producto.disponible ? 'disponible' : 'no-disponible'}`}>
                    {producto.disponible ? "Disponible" : "No disponible"}
                </span>
            </td>
            <td>
                <BotonAccion productoId={producto.id} funcionCambiarEstado={funcionCambiarEstado} funcionModificar={funcionModificar} funcionEliminar={funcionEliminar}></BotonAccion>
            </td>    

        </tr>
    );
}

export default FilaProducto;
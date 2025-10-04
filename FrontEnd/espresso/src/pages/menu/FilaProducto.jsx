function FilaProducto({ producto, arrayBotonesAccion }) {


    return (
        <tr
            key={producto.id}
            data-estado={producto.disponible ? 'disponible' :'no-disponible'}
        >
            <td>{producto.id}</td>
            <td>{producto.nombre}</td>
            <td>{producto.descripcion}</td>
            <td>${producto.precio}</td>
            <td>
                <span className={`disponibilidad ${producto.disponible ? 'disponible' : 'no-disponible'}`}>
                    {producto.disponible ? "Disponible" : "No disponible"}
                </span>
            </td>
                
            <td className="acciones">
                {arrayBotonesAccion.map((botonAccion) => (
                    {botonAccion}
                ))}
            </td>
        </tr>
    );
}

export default FilaProducto;
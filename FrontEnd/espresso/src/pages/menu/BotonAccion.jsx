function BotonAccion({productoId, funcionCambiarEstado, funcionModificar, funcionEliminar}) {

    return (
        <td className="acciones">
            <button 
                className="info" 
                onClick={() => funcionCambiarEstado(productoId)}
            >
                ℹ️ Disponibilidad
            </button>
            <button 
                className="modificar" 
                onClick={() => funcionModificar(productoId)}
            >
                ✏️ Modificar
            </button>

            <button
                className="baja"
                onClick={() => funcionEliminar(productoId)}
            >
                🗑️ Baja
            </button>
        </td>
    );
}

export default BotonAccion;
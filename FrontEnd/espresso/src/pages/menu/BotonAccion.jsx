function BotonAccion({productoId, funcionCambiarEstado, funcionModificar}) {

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
                onClick={() => funcionModificar(productoId)} // O usar navigate, dependiendo de dónde se inyecte
            >
                ✏️ Modificar
            </button>
            {/* El botón de baja se deja sin funcionalidad por simplicidad */}
            <button className="baja">🗑️ Baja</button>
        </td>
    );
}

export default BotonAccion;
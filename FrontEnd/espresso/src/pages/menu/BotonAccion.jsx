import IconoEliminar from "../../components/IconoEliminar";
import IconoModificar from "../../components/IconoModificar";

function BotonAccion({productoId, funcionCambiarEstado, funcionModificar, funcionEliminar}) {


    return (
        <td className="acciones">
            <button 
            className="info" 
            onClick={() => funcionCambiarEstado(productoId)}
            >
                Disponibilidad
            </button>

            <div className="acciones-modificar-eliminar">
                <button 
                className="modificar" 
                onClick={() => funcionModificar(productoId)}
                >
                    <IconoModificar size={18}></IconoModificar>
                </button>

                <button
                className="baja"
                onClick={() => funcionEliminar(productoId)}
                >
                    <IconoEliminar size={18}></IconoEliminar>
                </button>    
            </div>
            
        </td>
    );
}

export default BotonAccion;
import './DetallePedido.css';

const DetallePedido = ({ funcionAbrir, funcionCerrar, children }) => {

    if (!funcionAbrir) {
        return null;
    }

    // Función para cerrar al hacer clic en el fondo
    const clickFuera = (click) => {
        // Cierra solo si el clic fue directamente en el div con clase detalle
        if (click.target.className === 'detalle') {
            funcionCerrar();
        }
    };

    return (
        <div className="detalle" onClick={clickFuera}>
            
            <div className="detalle-contenido">
                
                <span className="cerrarBtn" onClick={funcionCerrar}>
                    &times;
                </span>
                
                {children} 

            </div>
        </div>
    );
};

export default DetallePedido;
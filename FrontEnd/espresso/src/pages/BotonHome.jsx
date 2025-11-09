import { Link } from "react-router-dom";
{/*import "./BotonHome.css";*/}
import "../UnicoCSS.css"

function BotonHome({ ruta, texto }) {
    return (
        <Link
            className="boton-home"
            to={ruta}
        >
            <strong>
                {texto}
            </strong>
        </Link>
    );
}

export default BotonHome;
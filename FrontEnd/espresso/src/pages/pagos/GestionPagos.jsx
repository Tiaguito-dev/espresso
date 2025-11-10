import React from "react";
import { getPagos} from "../../services/pagosService";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../UnicoCSS.css";
import IconoEliminar from "../../components/IconoEliminar";
import IconoModificar from "../../components/IconoModificar";


function GestionPagos() {

    const [pagos, setPagos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPagos();
    }, []);
    
    const fetchPagos = async () => {
        try {
            const data = await getPagos();
            setPagos(data);
        } catch (error) {
            console.error("Error al obtener los pagos:", error);
        }
    };

    return (
        <div className="tabla-container">
            <div className="div-espacio-navbar"></div>
            <h1 className="titulo-tabla">Gestion pagos</h1>
            <div className="div-botones">
                <button
                className="boton-agregar"
                onClick={() => navigate("/pagos/agregar")}
                >
                    + Agregar Pago
                </button>
            </div>
            
            <table className="tabla">
                <thead>
                    <tr>
                        <th>Nro. Pedido</th>
                        <th>Fecha</th>
                        <th>Monto</th>
                        <th>Método</th>
                    </tr>
                </thead>
                <tbody>
                    {pagos.length > 0 ? (
                        pagos.map((pago) => (
                            <tr key={pago.nroPago}>
                                <td>{pago.nroPedido}</td>
                                <td>{pago.fecha}</td>
                                <td>{pago.monto}</td>
                                <td>{pago.metodo}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">
                                No hay pagos registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>    
    )
} export default GestionPagos;

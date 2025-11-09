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
                        <th>Acciones</th>
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
                                <td>
                                    <div className="acciones-container">
                                        <div className="boton-modificar-eliminar">
                                            <button className="boton-fila-accion boton-modificar-fila">
                                                <IconoModificar size={18}></IconoModificar>
                                            </button>
                                            <button className="boton-fila-accion boton-cancelar-fila">
                                                <IconoEliminar size={18}></IconoEliminar>
                                            </button>
                                        </div>
                                    </div>
                                </td>
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

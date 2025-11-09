import React from "react";
import { getPagos} from "../../services/pagosService";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


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
        <>
            <h1>Gestion pagos</h1>
            <button
                className="btn-agregar"
                onClick={() => navigate("/pagos/agregar")}
            >
                + Agregar Pago
            </button>

            <div>
                {pagos.length > 0 ? (
                pagos.map((pago) => (
                    <div key={pago.nroPago}>
                        <p>{pago.nroPedido}</p>
                        <p>{pago.fecha}</p>
                        <p>{pago.monto}</p>
                        <p>{pago.metodo}</p>
                    </div>
                ))
            ) : (
                <p>No hay pedidos registrados.</p>
            )}
            </div>
        </>
        
        
    )
} export default GestionPagos;

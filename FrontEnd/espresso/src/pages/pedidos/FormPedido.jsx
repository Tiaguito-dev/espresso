import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updatePedido, buscarPedidoPorId } from "../../services/pedidosService"; 
import "./AgregarPedido.css";

const FormPedido = () => {

    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    const navigate = useNavigate();
    const { id } = useParams();
    const [pedido, setPedido] = useState({
        id: id,
        fecha: "",
        estadoPedido: "",
        mesa: {
            nroMesa:"",
            estadoMesa:""
        },
        lineasPedido: [
            {
                idProducto: "",
                cantidad: "",
                nombreProducto: "",
                precioUnitario: ""
            }
        ]
        
    });

    useEffect(() => {
        fetchPedido();
    }, []);

    const fetchPedido = async () => {
        try {
            const data = await buscarPedidoPorId(id);
            setPedido(data);
            console.log(data);
        } catch (error) {
            console.error("Error no se pudo obtener el pedido:", error);
        }
    };

    return (
        <div>
            prueba
        </div>
    )
}

export default FormPedido;

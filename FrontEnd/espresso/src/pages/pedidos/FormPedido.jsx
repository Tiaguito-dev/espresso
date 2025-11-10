import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    updatePedido, 
    buscarPedidoPorId, 
    eliminarLineaAPedido, 
    agregarLineaAPedido
} from "../../services/pedidosService"; 
import { getProductos } from "../../services/productosService";
import CabeceraTablaPedidos from "../../components/CabeceraTablaPedidos";


const FormPedido = () => {

    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    const navigate = useNavigate();
    const { id } = useParams();
    const [pedido, setPedido] = useState({
        nroPedido: id,
        fecha: "",
        estadoPedido: "",
        observacion: "", // NUEVO: Añadido campo observación al estado inicial
        mesa: {
            nroMesa:"",
            estadoMesa:""
        },
        lineasPedido: [] // Inicializar como array vacío
    });

    // NUEVO: Estados para manejar el dropdown de productos y la nueva línea
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState("");
    const [cantidadNueva, setCantidadNueva] = useState(1);

    // Carga inicial del pedido y de la lista de productos
    useEffect(() => {
        fetchPedido();
        fetchProductos(); // NUEVO: Cargar productos para el desplegable
    }, []);

    const fetchPedido = async () => {
        try {
            const data = await buscarPedidoPorId(id);
            // Asegurarse de que observación no sea null para evitar error en input
            setPedido({ ...data, observacion: data.observacion || "" });
        } catch (error) {
            console.error("Error no se pudo obtener el pedido:", error);
        }
    };

    // NUEVO: Función para cargar los productos del desplegable
    const fetchProductos = async () => {
        try {
            // Asumo que tienes un servicio `getProductos` que devuelve un array
            const data = await getProductos(); 
            setProductos(data);
        } catch (error) {
            console.error("Error no se pudo obtener los productos:", error);
        }
    };


    //Definicion de las columnas de la tabla lineas de pedido
    const camposLineaPedido = ["ID Producto", "Nombre Producto", "Precio Unitario", "Cantidad"];

    // NUEVO: Handler genérico para campos del pedido (estado y observación)
    const handlePedidoChange = (e) => {
        const { name, value } = e.target;
        setPedido(prevPedido => ({
            ...prevPedido,
            [name]: value
        }));
    };

    // NUEVO: Handler para el botón de eliminar línea
    const handleEliminarLinea = async (idLinea) => {
        try {
            await eliminarLineaAPedido(pedido.nroPedido, idLinea);
            fetchPedido(); // Recargar el pedido para mostrar los cambios
        } catch (error) {
            console.error("Error al eliminar la línea:", error);
        }
    };

    // NUEVO: Handler para el botón de agregar nueva línea
    const handleAgregarLinea = async () => {
        if (!productoSeleccionado) {
            alert("Por favor, seleccione un producto.");
            return;
        }
        try {
            const datosNuevaLinea = {
                idProducto: productoSeleccionado,
                cantidad: cantidadNueva
            };
            await agregarLineaAPedido(pedido.nroPedido, datosNuevaLinea);
            fetchPedido(); // Recargar el pedido
            // Resetear campos
            setProductoSeleccionado("");
            setCantidadNueva(1);
        } catch (error) {
            console.error("Error al agregar la línea:", error);
        }
    };

    // NUEVO: Handler para guardar todos los cambios del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Creamos un objeto solo con los datos que se pueden modificar
            const datosActualizados = {
                estadoPedido: pedido.estadoPedido,
                observacion: pedido.observacion,
                // Enviamos solo el ID de línea y la cantidad actualizada
                lineasPedido: pedido.lineasPedido.map(linea => ({
                    idLinea: linea.idLinea,
                    cantidad: linea.cantidad
                }))
            };
            
            await updatePedido(pedido.nroPedido, datosActualizados);
            alert("Pedido actualizado con éxito");
            navigate("/pedidos"); // Volver a la lista de pedidos (o donde prefieras)
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
        }
    };

    return (
        <div>
        <div className="div-espacio-navbar"></div>
        <div className="agregar-item">
            <h2 className="titulo-accion">Datos del Pedido</h2>
            <form className="formulario" onSubmit={handleSubmit}>

                <div>
                    <label>Nro. Pedido</label>
                    <input type="text" value={pedido.nroPedido} readOnly />
                </div>

                <div>
                    <label>Fecha</label>
                    <input type="text" value={pedido.fecha} readOnly />
                </div>

                <div>
                    <label>Estado</label>
                    <select 
                        name="estadoPedido" 
                        value={pedido.estadoPedido} 
                        onChange={handlePedidoChange}
                    >
                        <option value="pendiente">Pendiente</option>
                        <option value="listo">Listo</option>
                        <option value="terminado">Terminado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>

                <div>
                    <label>Mesa</label>
                    <input type="text" value={pedido.mesa.nroMesa} readOnly />
                </div>

                <div className="campo-observacion">
                    <label htmlFor="observacion">Observaciones:</label>
                    <textarea 
                        id="observacion"
                        name="observacion"
                        value={pedido.observacion}
                        onChange={handlePedidoChange}
                        rows="3"
                    />
                </div>
        
                <h3 className="titulo-accion">Líneas del Pedido</h3>

                <div className="tabla-productos">
                    <table>
                        <CabeceraTablaPedidos arrayCampos={camposLineaPedido} />
                        <tbody>
                            {pedido.lineasPedido.map((linea) => (
                                <tr key={linea.idLinea}>
                                    <td>{linea.idProducto}</td>
                                    <td>{linea.nombreProducto}</td>
                                    <td>{linea.precioUnitario}</td>
                                    <td>{linea.cantidad}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button type="submit">Guardar Cambios</button>
            </form>
        </div>    
        </div>
    )
}

export default FormPedido;
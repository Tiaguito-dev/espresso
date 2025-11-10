import React, { use, useEffect, useMemo, useState } from "react";
import { createPedido } from "../../services/pedidosService"; 
import { getProductos } from "../../services/productosService";
import { getMesas } from "../../services/mesasService";
import "../../UnicoCSS.css";



function AgregarPedido() {

	const [pedidoInfo, setPedidoInfo] = useState(
		{
			observacion: "",
			mesa: ""
		}
	);
	const [productosDisponibles, setProductosDisponibles] = useState([]);
	const [mesasDisponibles, setMesasDisponibles] = useState([]);
	const [productosPedido, setProductosPedido] = useState([]);
	const [productoSeleccionadoId, setProductoSeleccionadoId] = useState("");
	const [cargando, setCargando] = useState(false);
	const [error, setError] = useState(false);
	const [mensajeExito, setMensajeExito] = useState(null);


	const cargarMesas = async () => {
		try {
			const dataMesas = await getMesas();
			const mesasLibres = dataMesas.filter(
				(mesa) => mesa.estadoMesa == "disponible"
			);
			setMesasDisponibles(mesasLibres);

			if (mesasLibres.length == 0) {
				setPedidoInfo(
					prev => ({ ...prev, mesa: ""})
				);
				setError(
					prevError => (prevError ? prevError + " | No hay mesas disponibles." : "No hay mesas disponibles.")
				);
			}
		} catch (error) {
			setError(
				prevError => (prevError ? prevError + " | Error al cargar mesas." : "Error al cargar mesas.")
			);
		}
	}

	const cargarProductos = async () => {
		try {
			const dataProductos = await getProductos();
			setProductosDisponibles(dataProductos);
			if (dataProductos.length > 0) {
				setProductoSeleccionadoId(dataProductos[0].id);
			}
		} catch (error) {
			setError(prevError => (prevError ? prevError + " | Error al cargar productos." : "Error al cargar productos."));
		}
	}

	useEffect(() => {
		const cargarDatosIniciales = async() => {
			setCargando(true);
			setError(null);
			await Promise.all([
				cargarProductos(),
				cargarMesas()
			]);
			setCargando(false);
		}
		cargarDatosIniciales();
	}, []);


//funcion que recupera todos los cambios en el formulario
	const actualizarVistaPedido = (evento) => {
		//guarda el nombre del campo y valor que envio el evento
		const { name, value } = evento.target;
		setPedidoInfo(
			//setea en el state del pedido el campo con su valor
			prevInfo => ({ ...prevInfo, [name]: value})
		);
	}


	const actualizarLineasProducto = () => {
		if (!productoSeleccionadoId) return;
		const existeProducto = productosPedido.find(producto => producto.id == productoSeleccionadoId);
		
		if (existeProducto) {
			alert("El producto ya esta en el pedido. Debe modificar la cantidad.");
			return
		}
		const productoParaAgregar = productosDisponibles.find(producto => producto.id == productoSeleccionadoId);
		if (productoParaAgregar) {
			setProductosPedido(prevProductos => [...prevProductos, { ...productoParaAgregar, cantidad: 1}]);
		}
	}

	const actualizarCantidadProducto = (idProducto, nuevaCantidad) => {
		const cantidad = Math.max(1, parseInt(nuevaCantidad, 10) || 1);
		setProductosPedido(prevProductos =>
			prevProductos.map(producto => (producto.id === idProducto ? { ...producto, cantidad: cantidad } : producto))
		);
	}

	const eliminarProductoLista = (idProducto) => {
        setProductosPedido(prevProductos => prevProductos.filter(producto => producto.id !== idProducto));
    };

	const totalPedido = useMemo(() => {
		return productosPedido.reduce((total, producto) => {
			const precio = parseFloat(producto.precio) || 0;
			const cantidad = parseInt(producto.cantidad, 10) || 0;
			return total + (precio * cantidad);
		}, 0);
	}, [productosPedido]);

	const enviarFormulario = async (evento) => {
		evento.preventDefault();
		setError(null);
		setMensajeExito(null);

		if (!pedidoInfo.mesa) {
			setError("Por favor, seleccione una mesa disponible.");
			return;
		}
		if (!productosPedido.lenght == 0) {
			setError("El pedido esta vacio. Agregue al menos un producto.");
			return;
		}

		const pedidoData = {
			...pedidoInfo,
			mesa: parseInt(pedidoInfo.mesa, 10),
			observacion: pedidoInfo.observacion,
            lineas: productosPedido.map(producto => ({
                idProducto: producto.id,
                cantidad: producto.cantidad,
            }))
		}

		try {
			setCargando(true);
			const respuesta = await createPedido(pedidoData);
			setMensajeExito("Pedido creado con exito.");
			
			setPedidoInfo({
				observacion: "",
				mesa: ""
			});
			setProductosPedido([]);

			if (productosDisponibles.length > 0){
				setProductoSeleccionadoId(productosDisponibles[0].id);
			}

			await cargarMesas();
		} catch (error) {
			setError("Error al enviar el pedido: " + error.message);
		} finally {
			setCargando(false);
		}
	} 


	return (
		<div className="agregar-item">
            <h2 className="titulo-accion">Agregar Pedido</h2>

            {/* Mensajes de estado */}
            {cargando && <p>Cargando...</p>}
            {error && <p className="error-message">{error}</p>}
            {mensajeExito && <p className="success-message">{mensajeExito}</p>}

            <form onSubmit={enviarFormulario} className="formulario">
                
                <div className="campo-mesa">
                    <label htmlFor="mesa">Numero de Mesa</label>
                    <select 
                        name="mesa" 
                        id="mesa"
                        value={pedidoInfo.mesa} // <-- Enlazado al estado (inicialmente "")
                        onChange={actualizarVistaPedido}
                        required // <-- Evita envío si el valor es ""
                        disabled={cargando || mesasDisponibles.length === 0}
                    >
                        <option value="">-- Seleccione una mesa --</option>

                        {mesasDisponibles.map(mesa => (
                            <option key={mesa.nroMesa} value={mesa.nroMesa}>
                                Mesa {mesa.nroMesa}
                            </option>
                        ))}
                    </select>
                </div>
                
<<<<<<< HEAD
                <div className="form-group">
=======
                <div className="campo-mozo">
                    <label htmlFor="mozo">Numero de Mozo</label>
                    <input 
                        type="text" 
                        name="mozo" 
                        id="mozo"
                        value={pedidoInfo.mozo}
                        onChange={actualizarVistaPedido}
                        required
                        disabled={cargando}
                    />
                </div>
                
                <div className="campo-observacion">
>>>>>>> avi-rama
                    <label htmlFor="observacion">Observaciones del Pedido</label>
                    <input 
                        type="text" 
                        name="observacion" 
                        id="observacion"
                        value={pedidoInfo.observacion}
                        onChange={actualizarVistaPedido}
                        disabled={cargando}
                    />
                </div>

                {/* --- Sección Agregar Productos --- */}
                <div className="formulario-agregar-producto">
                    <select 
                        value={productoSeleccionadoId}
                        onChange={(evento) => setProductoSeleccionadoId(evento.target.value)}
                        disabled={cargando || productosDisponibles.length === 0}
                    >
                        {productosDisponibles.length === 0 && <option>Cargando...</option>}
                        {productosDisponibles.map(producto => (
                            <option key={producto.id} value={producto.id}>
                                {producto.nombre} - ${producto.precio}
                            </option>
                        ))}
                    </select>
                    <input 
                        type="button" 
                        value="Agregar Producto" 
                        onClick={actualizarLineasProducto} 
                        disabled={cargando}
                    />
                </div>

                {/* --- Tabla de Productos Agregados --- */}
                <div className="tabla-productos">
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unit.</th>
                                <th>Subtotal</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosPedido.length === 0 ? (
                                <tr>
                                    <td colSpan="5">No hay productos en el pedido.</td>
                                </tr>
                            ) : (
                                productosPedido.map(producto => (
                                    <tr key={producto.id}>
                                        <td>{producto.nombre}</td>
                                        <td>
                                            <input 
                                                type="number" 
                                                value={producto.cantidad}
                                                onChange={(evento) => actualizarCantidadProducto(producto.id, evento.target.value)}
                                                min="1"
                                                className="input-cantidad"
                                                disabled={cargando}
                                            />
                                        </td>
                                        <td>${parseFloat(producto.precio).toFixed(2)}</td>
                                        <td>${(parseFloat(producto.precio) * parseInt(producto.cantidad, 10)).toFixed(2)}</td>
                                        <td>
                                            <button 
                                                type="button" 
                                                onClick={() => eliminarProductoLista(producto.id)}
                                                className="btn-quitar"
                                                disabled={cargando}
                                            >
                                                Quitar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- Total y Envío --- */}
                <div className="seccion-total">
                    <p>
                        <strong>Total: ${totalPedido.toFixed(2)}</strong>
                    </p>
                </div>

                <button type="submit" disabled={cargando || productosPedido.length === 0}>
                    {cargando ? "Procesando..." : "Agregar Pedido"}
                </button>
            </form>
        </div>
	)
}

export default AgregarPedido;
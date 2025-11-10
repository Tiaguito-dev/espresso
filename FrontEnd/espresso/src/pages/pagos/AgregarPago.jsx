import React, { useState, useEffect, useMemo } from 'react';

import { getPedidos } from '../../services/pedidosService';
import { crearPago } from '../../services/pagosService';
import "../../UnicoCSS.css"
import { useNavigate } from "react-router-dom";


/**
 * Componente principal AgregarPago
 * Permite seleccionar un pedido finalizado, aplicar un descuento y registrar un pago.
 */
export default function AgregarPago() {
    const [pedidos, setPedidos] = useState([]);
    const [selectedPedidoId, setSelectedPedidoId] = useState('');
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [descuento, setDescuento] = useState(0);
    const [medioDePago, setMedioDePago] = useState('efectivo');
    const [mensaje, setMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);
    const navigate = useNavigate();

    const mediosDePagoOptions = [
        "efectivo",
        "transferencia bancaria",
        "tarjeta de débito",
        "tarjeta de crédito"
    ];

    useEffect(() => {
        const cargarPedidos = async () => {
            try {
                const data = await getPedidos(); 

                setPedidos(data.filter(p => p.estadoPedido === 'listo'));
            } catch (error) {
                setMensaje(`Error al cargar pedidos: ${error.message}`);
            }
        };

        cargarPedidos();
    }, []); 

    useEffect(() => {
        if (!selectedPedidoId) {
            setSelectedPedido(null);
            return;
        }

        const pedidoEncontrado = pedidos.find(p => p.nroPedido.toString() === selectedPedidoId);

        if (pedidoEncontrado) {
            setSelectedPedido(pedidoEncontrado);
        } else {
            setSelectedPedido(null);
            setMensaje("Error: Pedido no encontrado en la lista.");
        }
        
    }, [selectedPedidoId, pedidos]); 

    const montoPedido = useMemo(() => {
        if (!selectedPedido || !selectedPedido.lineasPedido) {
            return 0;
        }

        return selectedPedido.lineasPedido.reduce((total, item) => {
            const precio = parseFloat(item.precioUnitario) || 0;
            const cantidad = parseInt(item.cantidad) || 0;
            return total + (precio * cantidad);
        }, 0);
    }, [selectedPedido]);

    const montoFinal = useMemo(() => {
        const final = montoPedido - descuento;
        return final < 0 ? 0 : final; 
    }, [montoPedido, descuento]);


    // Maneja el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault(); // Evita que la página se recargue
        
        // Validaciones
        if (!selectedPedidoId || !selectedPedido) {
            setMensaje('Error: Debe seleccionar un pedido válido.');
            return;
        }
        if (montoFinal <= 0 && montoPedido > 0) {
            setMensaje('Error: El monto final a pagar debe ser mayor a cero.');
            return;
        }
        if (!medioDePago) {
            setMensaje('Error: Debe seleccionar un medio de pago.');
            return;
        }

        setEnviando(true);
        setMensaje('Registrando pago...');

        // Construir el objeto de pago según el JSON de la captura
        const pagoData = {
            nroPedido: parseInt(selectedPedidoId),
            monto: montoFinal,
            metodo: medioDePago
        };

        try {
            // Llama a la función (ahora simulada)
            const nuevoPago = await crearPago(pagoData);
            
            setMensaje(`Pago registrado exitosamente (ID: ${nuevoPago.nroPago || 'N/A'})`);
            
            // Limpiar formulario
            setSelectedPedidoId('');
            setSelectedPedido(null);
            setDescuento(0);
            setMedioDePago('efectivo');
            navigate("/pagos");

        } catch (error) {
            setMensaje(`Error al registrar el pago: ${error.message}`);
        } finally {
            setEnviando(false);
        }
    };

    // --- RENDERIZADO DEL COMPONENTE ---

    return (
        <div>
        <div className="div-espacio-navbar"></div>
        <div className='agregar-item'>
            
            <h2 className='titulo-accion'>Registrar Nuevo Pago</h2>
            
            <form className='formulario' onSubmit={handleSubmit} >
                <div>
                    <label htmlFor="campo-pedido">Número de Pedido:</label>
                    <select 
                        id="pedido-select" 
                        value={selectedPedidoId}
                        onChange={(e) => setSelectedPedidoId(e.target.value)}
                        required
                        disabled={enviando}
                    >
                        <option value="">-- Seleccione un pedido --</option>
                        {pedidos.map(pedido => (
                            <option key={pedido.nroPedido} value={pedido.nroPedido}>
                                Pedido #{pedido.nroPedido}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 2. Monto del Pedido (informativo) */}
                <div>
                    <label>Monto del Pedido:</label>
                    <input 
                        type="text" 
                        value={`$${montoPedido.toFixed(2)}`}
                        readOnly
                        disabled
                    />
                </div>

                {/* 3. Descuento */}
                <div>
                    <label htmlFor="descuento-input">Descuento:</label>
                    <input 
                        type="number" 
                        id="descuento-input"
                        value={descuento}
                        onChange={(e) => setDescuento(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        disabled={enviando || !selectedPedido}
                    />
                </div>

                {/* 4. Monto Final (informativo) */}
                <div>
                    <label>Monto Final a Pagar:</label>
                    <input 
                        type="text" 
                        value={`$${montoFinal.toFixed(2)}`}
                        readOnly
                        disabled
                    />
                </div>

                {/* 5. Medio de Pago */}
                <div>
                    <label htmlFor="medio-pago-select">Medio de Pago:</label>
                    <select 
                        id="medio-pago-select" 
                        value={medioDePago}
                        onChange={(e) => setMedioDePago(e.target.value)}
                        required
                        disabled={enviando || !selectedPedido}
                    >
                        {mediosDePagoOptions.map(metodo => (
                            <option key={metodo} value={metodo}>
                                {metodo.charAt(0).toUpperCase() + metodo.slice(1)} {/* Capitaliza la opción */}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 6. Botón de Envío */}
                <button 
                    type="submit" 
                    disabled={enviando || !selectedPedido}
                >
                    {enviando ? 'Registrando...' : 'Registrar Pago'}
                </button>
            </form>

            {/* 7. Mensaje de Estado */}
            {mensaje && (
                <div>
                    {mensaje}
                </div>
            )}
        </div>
        </div>
        
    );
}
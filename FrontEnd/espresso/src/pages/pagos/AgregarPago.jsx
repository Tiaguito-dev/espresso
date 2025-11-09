import React, { useState, useEffect, useMemo } from 'react';

// --- IMPORTAR SERVICIOS ---
// Las importaciones a servicios externos fallarán en este entorno de vista previa.
// Han sido comentadas y reemplazadas por funciones simuladas (mocks) a continuación.
//
import { getPedidos } from '../../services/pedidosService';
import { crearPago } from '../../services/pagosService';
//
// -------------------------

// --- SIMULACRO DE SERVICIOS (PARA PREVISUALIZACIÓN) ---
// (Reemplaza esto con tus imports reales en tu proyecto)




/**
 * Componente principal AgregarPago
 * Permite seleccionar un pedido finalizado, aplicar un descuento y registrar un pago.
 */
export default function AgregarPago() {
    // --- ESTADOS DEL COMPONENTE ---
    
    // Almacena la lista de pedidos finalizados (con detalles completos)
    const [pedidos, setPedidos] = useState([]);
    
    // Almacena el ID del pedido seleccionado en el dropdown
    const [selectedPedidoId, setSelectedPedidoId] = useState('');
    
    // Almacena el objeto completo del pedido seleccionado
    const [selectedPedido, setSelectedPedido] = useState(null);
    
    // Almacena el monto del descuento
    const [descuento, setDescuento] = useState(0);
    
    // Almacena el método de pago seleccionado
    const [medioDePago, setMedioDePago] = useState('efectivo'); // Valor por defecto
    
    // Estado para mensajes de éxito o error
    const [mensaje, setMensaje] = useState('');
    
    // Estado para deshabilitar el botón mientras se envía
    const [enviando, setEnviando] = useState(false);

    // Opciones para el medio de pago
    const mediosDePagoOptions = [
        "efectivo",
        "transferencia bancaria",
        "tarjeta de débito",
        "tarjeta de crédito"
    ];

    // --- EFECTOS (HOOKS) ---

    // useEffect para cargar los pedidos al montar el componente
    useEffect(() => {
        const cargarPedidos = async () => {
            try {
                // Llama a la función (ahora simulada)
                const data = await getPedidos(); 

                // Filtramos por pedidos "Finalizado"
                // Asumimos que 'data' es un array de pedidos con 'lineasPedido' incluidas
                setPedidos(data.filter(p => p.estadoPedido === 'Listo'));
            } catch (error) {
                setMensaje(`Error al cargar pedidos: ${error.message}`);
            }
        };

        cargarPedidos();
    }, []); // El array vacío [] significa que se ejecuta solo una vez al montar

    // useEffect para ACTUALIZAR el pedido seleccionado cuando cambia el ID
    useEffect(() => {
        if (!selectedPedidoId) {
            setSelectedPedido(null);
            return;
        }

        // No hacemos fetch. Buscamos en el estado 'pedidos' que ya cargamos.
        // Convertimos 'selectedPedidoId' a número si 'nroPedido' es numérico.
        // Si 'nroPedido' es string, usa: p.nroPedido === selectedPedidoId
        const pedidoEncontrado = pedidos.find(p => p.nroPedido.toString() === selectedPedidoId);

        if (pedidoEncontrado) {
            setSelectedPedido(pedidoEncontrado);
        } else {
            // Esto es un seguro, no debería pasar si el dropdown se llena desde 'pedidos'
            setSelectedPedido(null);
            setMensaje("Error: Pedido no encontrado en la lista.");
        }
        
    }, [selectedPedidoId, pedidos]); // Se ejecuta si cambia el ID o la lista de pedidos

    // --- CÁLCULOS DERIVADOS (useMemo) ---

    // Calcula el monto total del pedido seleccionado
    const montoPedido = useMemo(() => {
        if (!selectedPedido || !selectedPedido.lineasPedido) {
            return 0;
        }

        // Suma el precio de todas las líneas de pedido
        return selectedPedido.lineasPedido.reduce((total, item) => {
            const precio = parseFloat(item.precioUnitario) || 0;
            const cantidad = parseInt(item.cantidad) || 0;
            return total + (precio * cantidad);
        }, 0);
    }, [selectedPedido]);

    // Calcula el monto final a pagar (Total - Descuento)
    const montoFinal = useMemo(() => {
        const final = montoPedido - descuento;
        return final < 0 ? 0 : final; // Evita montos negativos
    }, [montoPedido, descuento]);

    // --- MANEJADORES DE EVENTOS ---

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

        } catch (error) {
            setMensaje(`Error al registrar el pago: ${error.message}`);
        } finally {
            setEnviando(false);
        }
    };

    // --- RENDERIZADO DEL COMPONENTE ---

    return (
        <div>
            
            <h2>Registrar Nuevo Pago</h2>
            
            <form onSubmit={handleSubmit}>
                {/* 1. Selección de Pedido */}
                <div>
                    <label htmlFor="pedido-select">Número de Pedido:</label>
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
    );
}
// src/components/ModalPedido.jsx

import React, { useState } from 'react';
import { addPedido } from '../services/pedidosService';
import './ModalPedido.css';

const ModalPedido = ({ onClose, onPedidoAgregado }) => {
  const [mesa, setMesa] = useState('');
  const [productos, setProductos] = useState('');
  const [precioTotal, setPrecioTotal] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Validaciones básicas
      if (!mesa || !productos || !precioTotal) {
        setError('Todos los campos son obligatorios.');
        setLoading(false);
        return;
      }

      // Estructura del objeto a enviar al backend
      const nuevoPedido = {
        mesa: parseInt(mesa, 10),
        productos: productos, // Considera si esto debe ser un array de objetos
        precioTotal: parseFloat(precioTotal),
        estado: 'pendiente', // Estado inicial
      };

      await addPedido(nuevoPedido);
      onPedidoAgregado(); // Notifica al componente padre para que recargue la lista
    } catch (err) {
      setError('No se pudo agregar el pedido. Intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Agregar Nuevo Pedido</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mesa:</label>
            <input type="number" value={mesa} onChange={(e) => setMesa(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Productos:</label>
            <textarea value={productos} onChange={(e) => setProductos(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Precio Total:</label>
            <input type="number" step="0.01" value={precioTotal} onChange={(e) => setPrecioTotal(e.target.value)} required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar Pedido'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPedido;
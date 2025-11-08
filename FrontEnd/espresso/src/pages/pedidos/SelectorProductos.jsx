import React from 'react';
import './SelectorProductos.css'; 


function SelectorProductos({ menu, seleccionados, onCheckChange, onClose }) {
  
  
  const categorias = [...new Set(menu.map(p=> p.categoria.nombre))];

  return (
    <div className="selector-productos">
        <div className='selector-header'>
            <h3>Seleccionar Productos</h3>
            <button className="modal-close-btn" onClick={onClose}> &times; </button>
        </div>
      
      {categorias.map(categoria => (
        <div key={categoria} className="categoria-simple">
          <h4>{categoria}</h4>
          
          {menu
            .filter(p => p.categoria.nombre === categoria) 
            .map(prod => (
              
              <div key={prod.id} className="selector-item">
                <input
                  type="checkbox"
                  id={`check-${prod.id}`} 
                  checked={seleccionados[prod.id] || false}

                  onChange={() => onCheckChange(prod.id)}
                />
                <label htmlFor={`check-${prod.id}`}>
                  {prod.nombre} <span>(${prod.precio})</span>
                </label>
              </div>
          ))}
        </div>
      ))}
      
      {menu.length === 0 && <p>No hay productos disponibles.</p>}
    </div>
  );
}

export default SelectorProductos;
import React from 'react';
import './VentanaPopUp.css'; 


function Popup({ isOpen, onClose, children }) {
  
  if (!isOpen) {
    return null;
  }

  return (
    
    <div className="modal-fondo" onClick={onClose}>
      
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>

        {children}

      </div>
    </div>
  );
}

export default Popup;
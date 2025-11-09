// Acordeon.jsx (Corregido)

import "./Acordeon.css"
import React, { useState } from 'react';

const Acordeon = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAcordeon = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="acordeon-item">
            <button 
                className={`acordeon-header ${isOpen ? 'active' : ''}`}
                onClick={toggleAcordeon}
            >
                Ver Detalle
            </button>

            <div className={`acordeon-content ${isOpen ? 'open' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default Acordeon;
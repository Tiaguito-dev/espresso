// src/pages/mesas/FormMesas.jsx

import React, { useState, useEffect } from "react";
// Importamos lo necesario para la navegación y obtener el ID
import { useParams, useNavigate } from "react-router-dom"; 
// Importamos los servicios (Mock o Real)
import { getMesaById, createMesa, updateMesa } from "../../services/mesasService"; 
import "./FormMesas.css";

// Definición del estado inicial de una mesa nueva
const MESA_INICIAL = {
    numero: "",
    mozoACargo: "",
    estado: "Disponible",
};

// 🚨 Ya no recibe props 'onGuardar' ni 'onCancelar' 🚨
export default function FormMesas() { 
    const { id } = useParams(); // Obtiene el ID si estamos en /mesas/modificar/:id
    const navigate = useNavigate();
    
    // El componente gestiona su propio estado y carga inicial
    const [mesa, setMesa] = useState(MESA_INICIAL); 
    const [loading, setLoading] = useState(!!id);
    const [error, setError] = useState(null);

    const esModificar = !!id;

    // 🔄 Efecto para cargar datos si estamos en modo Modificar
    useEffect(() => {
        if (esModificar) {
            const fetchMesa = async () => {
                try {
                    const data = await getMesaById(id);
                    setMesa(data); // Carga la data de la mesa existente
                    setLoading(false);
                } catch (err) {
                    console.error("Error al cargar la mesa:", err);
                    setError("No se pudo cargar la mesa para modificar.");
                    setLoading(false);
                }
            };
            fetchMesa();
        }
    }, [id, esModificar]);

    const handleChange = (e) => {
        const value = e.target.name === 'numero' ? Number(e.target.value) : e.target.value;
        setMesa({ ...mesa, [e.target.name]: value });
    };

    // 💾 Función de guardado local (reemplaza a onGuardar)
    const handleGuardar = async (e) => {
        e.preventDefault();
        setError(null);

        if (!mesa.numero || !mesa.mozoACargo) {
            setError("El número de mesa y el mozo son obligatorios.");
            return;
        }

        try {
            if (esModificar) {
                // Modo Modificar
                await updateMesa(id, mesa);
                alert(`Mesa ${id} modificada con éxito.`);
            } else {
                // Modo Agregar
                await createMesa(mesa);
                alert("Mesa agregada con éxito.");
            }
            
            // Redirigir a la lista después de guardar
            navigate("/mesas"); 
        } catch (err) {
            console.error("Error al guardar la mesa:", err);
            setError(`Error al guardar la mesa: ${err.message || 'Verifique los datos.'}`);
        }
    };

    // ❌ Función de cancelar local (reemplaza a onCancelar)
    const handleCancelar = () => {
        navigate("/mesas");
    };

    if (loading) {
        return <div className="container">Cargando mesa...</div>;
    }

    // Mostrar el error si existe
    if (error && esModificar) {
        return <div className="container error-message">Error: {error}</div>;
    }

    return (
        <div className="form-mesa-container">
            {/* Título dinámico */}
            <h2>{esModificar ? `Modificar Mesa N° ${mesa.numero || '...'}` : "Registrar Nueva Mesa"}</h2>
            {error && <p className="error-message">{error}</p>}
            
            {/* 🎯 CAMBIO CLAVE: form usa onSubmit y llama a handleGuardar */}
            <form className="form-mesa" onSubmit={handleGuardar}> 
                <div>
                    <label>Número de Mesa</label>
                    <input
                        type="number"
                        name="numero"
                        value={mesa.numero}
                        onChange={handleChange}
                        required
                        disabled={esModificar} 
                    />
                </div>

                <div>
                    <label>Mozo a Cargo</label>
                    <input
                        type="text"
                        name="mozoACargo"
                        value={mesa.mozoACargo}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Estado</label>
                    <select name="estado" value={mesa.estado} onChange={handleChange}>
                        <option value="Disponible">Disponible</option>
                        <option value="Ocupada">Ocupada</option>
                    </select>
                </div>

                <div className="form-mesa-buttons">
                    <button
                        type="submit" // 🎯 CAMBIO: Tipo submit para que el formulario lo maneje
                        className="btn-guardar"
                    >
                        {esModificar ? "Guardar Cambios" : "Agregar Mesa"}
                    </button>
                    <button 
                        type="button" 
                        className="btn-cancelar" 
                        // 🎯 CAMBIO: Llama a la función local handleCancelar
                        onClick={handleCancelar} 
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
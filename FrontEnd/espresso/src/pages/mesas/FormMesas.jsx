import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMesaById, createMesa, updateMesa } from "../../services/mesasService";
import "../../UnicoCSS.css"

const MESA_INICIAL = {
    nroMesa: "",
    mozoACargo: "",
    estado: "disponible",
};

export default function FormMesas() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mesa, setMesa] = useState(MESA_INICIAL);
    const [loading, setLoading] = useState(!!id);
    const [error, setError] = useState(null);

    const esModificar = !!id;

    useEffect(() => {
        if (esModificar) {
            const fetchMesa = async () => {
                try {
                    const data = await getMesaById(id);
                    setMesa({
                        nroMesa: data.nroMesa,
                        mozoACargo: data.mozoACargo || "",
                        estado: data.estadoMesa.toLowerCase(),
                    });
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
        const value = e.target.name === 'nroMesa' ? Number(e.target.value) : e.target.value;
        setMesa({ ...mesa, [e.target.name]: value });
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        setError(null);

        if (!mesa.nroMesa || mesa.nroMesa <= 0) {
            setError("El número de mesa (positivo) ");
            return;
        }

        try {
            if (esModificar) {
                await updateMesa(id, mesa);
                alert(`Mesa ${mesa.nroMesa} modificada con éxito.`);
            } else {
                await createMesa(mesa);
                alert(`Mesa ${mesa.nroMesa} agregada con éxito.`);
            }
            navigate("/mesas");
        } catch (err) {
            console.error("Error al guardar la mesa:", err);
            setError(`Error al guardar la mesa: ${err.message || 'Verifique los datos.'}`);
        }
    };

    const handleCancelar = () => {
        navigate("/mesas");
    };

    if (loading) return <div className="container">Cargando mesa...</div>;
    if (error && esModificar) return <div className="container error-message">Error: {error}</div>;

    return (
        <div className="agregar-item">
            <h2 className="titulo-accion">{esModificar ? `Modificar Mesa N° ${mesa.nroMesa || '...'}` : "Registrar Nueva Mesa"}</h2>
            {error && <p className="error-message">{error}</p>}
            <form className="formulario" onSubmit={handleGuardar}>
                <div>
                    <label>Número de Mesa</label>
                    <input
                        type="number"
                        name="nroMesa"
                        value={mesa.nroMesa}
                        onChange={handleChange}
                        required
                        min={1}
                        disabled={esModificar} 
                    />
                </div>
                
                <div>
                    <label>Estado</label>
                    <select name="estado" value={mesa.estado} onChange={handleChange}>
                        <option value="disponible">Disponible</option>
                        <option value="ocupada">Ocupada</option>
                        <option value="fuera de servicio">Fuera de Servicio</option>
                    </select>
                </div>
                <div className="form-buttons">
                    <button type="submit" className="btn-guardar">
                        {esModificar ? "Guardar Cambios" : "Agregar Mesa"}
                    </button>
                    <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

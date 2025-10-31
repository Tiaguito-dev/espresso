// src/pages/mozos/MozosLista.jsx

import React, { useState, useEffect } from "react";
import { getMozos, asignarMesaAMozo } from "../../services/mozosService";
import { updateMesa } from "../../services/mesasService"; // Necesitamos actualizar la mesa
import TablaMozos from "./TablaMozos"; 
import "../../pages/mesas/Mesas.css"; // Reutilizamos los estilos de Mesas

export default function MozosLista() {
    const [mozos, setMozos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMozos();
    }, []);

    const fetchMozos = async () => {
        try {
            const data = await getMozos();
            setMozos(data);
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener los mozos:", error);
            setLoading(false);
        }
    };

    // 🎯 FUNCIÓN CLAVE: Asigna la mesa al mozo Y cambia el estado de la mesa
    const handleAsignarMesa = async (mozoId, mesaNumero, mozoNombre) => {
        if (!window.confirm(`¿Asignar la Mesa ${mesaNumero} a ${mozoNombre} y ponerla en estado OCUPADA?`)) {
            return;
        }

        try {
            // 1. Asignar la mesa al mozo en el servicio de mozos (Mock)
            await asignarMesaAMozo(mozoId, mesaNumero);

            // 2. Actualizar el estado y el mozo en el servicio de mesas (Mock)
            // Asumimos que el ID de la mesa es igual al número para simplificar el mock.
            const mesaId = mesaNumero; 
            await updateMesa(mesaId, { 
                estado: "Ocupada", 
                mozoACargo: mozoNombre 
            });

            // 3. Refrescar ambas listas para ver los cambios
            fetchMozos();
            // 💡 Nota: La lista de MesasLista también debería refrescarse si está visible.

        } catch (error) {
            console.error("Error al asignar mesa y cambiar estado:", error);
            alert("Error al completar la asignación. Verifique la consola.");
        }
    };

    const arrayCampos = ["ID", "Nombre", "Mesas Asignadas", "Acciones"];

    if (loading) return <div className="container">Cargando mozos...</div>;

    return (
        <div className="container">
            <h2>Gestión de Mozos y Asignaciones</h2>

            <TablaMozos
                mozos={mozos}
                arrayCampos={arrayCampos}
                funcionAsignarMesa={handleAsignarMesa}
            />
        </div>
    );
}
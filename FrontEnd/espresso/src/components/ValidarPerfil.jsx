import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UsuarioContext } from "../contexts/UsuarioContext.jsx";

export default function ValidarPerfil({ perfilesPermitidos }) {
    const { perfil } = useContext(UsuarioContext);

    // Si el perfil no está permitido, redirigir a home
    if (!perfilesPermitidos.includes(perfil)) {
        console.log("NO POSEE EL PERFIL ADECUADO");
        console.log("Perfiles permitidos: ", perfilesPermitidos);
        return <Navigate to="/" />;
    }

    // Renderiza las rutas hijas
    return <Outlet />;
}
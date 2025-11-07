import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UsuarioContext } from "../contexts/UsuarioContext";

export default function ValidarSesion() {
    const { autenticado } = useContext(UsuarioContext);

    if (!autenticado) return <Navigate to="/login" />;

    // IMPORTANTE: Outlet renderiza las rutas hijas
    return <Outlet />;
}
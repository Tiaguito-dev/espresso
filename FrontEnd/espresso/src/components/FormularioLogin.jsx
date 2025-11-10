import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../contexts/UsuarioContext";
import { iniciarSesion } from "../services/usuariosService";
import "../UnicoCSS.css";

import imagenLogoEspresso from "../images/logoEspressoVerde.png";
import imagenLogin from "../images/imagen login.png"

const FormularioLogin = () => {
    const { setNombreUsuario, setPerfil, setAutenticado, setCodigoUsuario } = useContext(UsuarioContext);

    const [correo, setCorreo] = useState("");
    const [contrasenia, setContrasenia] = useState("");

    const navigate = useNavigate();

    const autenticarUsuario = (dataUser) => {
        const { nombreUsuario, perfil, codigoUsuario } = dataUser;
        setCodigoUsuario(codigoUsuario);
        setNombreUsuario(nombreUsuario);
        setPerfil(perfil);
        setAutenticado(true);
    };

    const desautenticarUsuario = () => {
        setCodigoUsuario("");
        setNombreUsuario("");
        setPerfil("");
        setAutenticado(false);
    };

    const enviarFormulario = async (event) => {
        event.preventDefault();

        const data = { correo, contraseña: contrasenia };

        try {
            const response = await iniciarSesion(data);
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            autenticarUsuario(response);
            console.log("Inicio de sesión exitoso:", response);
            if (response) {
                navigate("/");
            }
        } catch (error) {
            desautenticarUsuario();
            console.error("Error al iniciar sesión:", error);
        }
    };

    return (
        <div className="login-contenedor">

            <div className="login-contenido">
                <div className="imagen-espresso">
                    <img src={imagenLogoEspresso} alt="Imagen espresso"/>
                </div>

                <h3>¡Bienvenido de vuelta!</h3>

                <form onSubmit={enviarFormulario} className="formulario-login">
                    <div className="grupos">
                        <label htmlFor="correo" className="formulario-label">
                            Correo Electrónico
                        </label>
                        <input
                            id="correo"
                            type="email"
                            className="formulario-control"
                            value={correo}
                            onChange={(event) => setCorreo(event.target.value)}
                            placeholder="ejemplo@correo.com"
                            required
                        />
                    </div>

                    <div className="campos">
                        <label htmlFor="contrasenia" className="formulario-label">
                            Contraseña
                        </label>
                        <input
                            id="contrasenia"
                            type="password"
                            className="formulario-control"
                            value={contrasenia}
                            onChange={(event) => setContrasenia(event.target.value)}
                            placeholder="********"
                            required
                        />
                    </div>

                    <button type="submit" className="boton-login">
                        Iniciar Sesión
                    </button>

                </form>

            </div>

            <div className="imagen-login">
                <img src={imagenLogin} alt="Imagen Login" />
            </div>

        </div>
    );
};

export default FormularioLogin;
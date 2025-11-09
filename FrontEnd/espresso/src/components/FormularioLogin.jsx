import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../contexts/UsuarioContext";
import { iniciarSesion } from "../services/usuariosService";
import styles from "./FormularioLogin.module.css";

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
        <div className={styles.container}>
            <h3>Iniciar Sesión</h3>

            {/*<div className="imagen- espresso">
                <img src={imagenLogoEspresso} alt="Imagen espresso"/>
            </div>

            <div className="imagen-login">
                <img src={imagenLogin} alt="Imagen Login" />
            </div>*/}

            <form onSubmit={enviarFormulario} className={styles.form}>
                <div className={styles.fieldGroup}>
                    <label htmlFor="correo" className="form-label">
                        Correo Electrónico
                    </label>
                    <input
                        id="correo"
                        type="email"
                        className="form-control"
                        value={correo}
                        onChange={(event) => setCorreo(event.target.value)}
                        placeholder="ejemplo@correo.com"
                        required
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label htmlFor="contrasenia" className="form-label">
                        Contraseña
                    </label>
                    <input
                        id="contrasenia"
                        type="password"
                        className="form-control"
                        value={contrasenia}
                        onChange={(event) => setContrasenia(event.target.value)}
                        placeholder="********"
                        required
                    />
                </div>

                <button type="submit" className="btn">
                    Ingresar
                </button>
            </form>
        </div>
    );
};

export default FormularioLogin;
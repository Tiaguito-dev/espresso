import { useState, useContext } from "react";
import { UsuarioContext } from "../contexts/UsuarioContext";
import { iniciarSesion } from "../services/usuariosService";

const FormularioLogin = () => {
    // ESTAS SON LAS VARIABLES GLOBALES
    const { setNombreUsuario, setPerfil, setAutenticado, setCodigo } = useContext(UsuarioContext);

    // ESTO ES LO DEL FORMULARIO
    const [usuario, setUsuario] = useState('');
    const [contrasenia, setContrasenia] = useState('');

    const autenticarUsuario = (dataUser) => {
        const { nombreUsuario, perfil, codigoUsuario } = dataUser;
        setCodigo(codigoUsuario);
        setNombreUsuario(nombreUsuario);
        setPerfil(perfil);
        setAutenticado(true);
    };

    const desautenticarUsuario = () => {
        setCodigo('');
        setNombreUsuario('');
        setPerfil('');
        setAutenticado(false);
    };

    const enviarFormulario = async (event) => {
        event.preventDefault(); // evita que se recargue la página

        const data = {
            // PUEDE QUE LAS VARIABLES NO SE LLAMEN ASÍ
            nombre: usuario,
            password: contrasenia,
        };

        try {
            const data = await iniciarSesion(data);
            // Response me tiene que devolver un nombre de usuario, un perfil y un codigo. El token lo guardo directamente en iniciarSesion
            autenticarUsuario(data);
            console.log("Inicio de sesión exitoso:", response); // TODO: QUÉ VA A DEVOLVER EL BACK EN RESPONSE???
        } catch (error) {
            // Lo unico que hago es borrar los datos de las variables globales
            desautenticarUsuario();
            console.error("Error al iniciar sesión:", error);
        }
    };

    return (
        <form onSubmit={enviarFormulario}>
            <h3>Iniciar Sesión</h3>

            <label htmlFor="usuario">Usuario</label>
            <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(event) => setUsuario(event.target.value)}
            />

            <label htmlFor="contrasenia">Contraseña</label>
            <input
                id="contrasenia"
                type="password"
                value={contrasenia}
                onChange={(event) => setContrasenia(event.target.value)}
            />

            <button type="submit">Ingresar</button>
        </form>
    );
};

export default FormularioLogin;
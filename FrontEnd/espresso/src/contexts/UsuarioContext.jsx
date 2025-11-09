import { createContext, useState } from 'react';

export const UsuarioContext = createContext();

export function UsuarioProvider({ children }) {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [codigoUsuario, setCodigoUsuario] = useState('');
    // Esto lo estoy hardcodeando pero tienen que configurarse en FormularioLogin.jsx a partir de la respuesta que le da iniciarSesion() de usuarioService.js
    const [perfil, setPerfil] = useState('cocinero'); // Harcoding - Hay que ponerlo en:useState('');
    const [autenticado, setAutenticado] = useState(false); // Harcoding - Hay que ponerlo en:useState(false);
    // const [token, setToken] = useState(); LO VOY A GUARDAR EN EL LOCAL STORAGE
    // localStorage.setItem('token', data.token); PERO LO HAGO EN usuariosService.js

    return (
        <UsuarioContext.Provider value={{
            nombreUsuario, setNombreUsuario, perfil, setPerfil, autenticado, setAutenticado, codigoUsuario, setCodigoUsuario
        }}>
            {children}
        </UsuarioContext.Provider>
    );
}
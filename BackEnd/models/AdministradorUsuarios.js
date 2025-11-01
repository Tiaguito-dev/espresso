const Usuario = require('./Usuario.js');
const administradorPerfiles = require('./AdministradorPerfiles.js');
const UsuariosBD = require('../repositories/UsuariosBD');


class AdministradorUsuarios {
    async convertirUsuarioBD(usuariosBD){
        if(!usuariosBD || usuariosBD.legth === 0){
            return[];
        }

        const perfiles = await administradorPerfiles.obtenerPerfiles();
        const perfilesMap = new Map();
        perfiles.forEach(perfil => { perfilesMap.set(perfil.id, perfil);            
        });

        return usuariosBD.map(usuario => {
            const perfil = perfilesMap.get(usuario.codigoPerfil);
            if (!perfil){
                console.error(`Error: El usuario tiene un codigo de perfil invalido`);
                return null;
            }
            return new Usuario({ 
                id: usuario.codigo, 
                nombre: usuario.nombre, 
                email: usuario.email, 
                contraseñaHash: usuario.contraseñaHash, 
                perfil: perfil
            })
        })
        }

    async registrarUsuario(data) {
        const { nombre, email, contraseña, nombrePerfil } = data;

        const usuarioExistente = await this.buscarUsuarioPorEmail(email);
        if (usuarioExistente) {
            throw new Error('El email ya está registrado');
        }

        const perfilUsuario = await administradorPerfiles.buscarPorNombre(nombrePerfil);
        if (!perfilUsuario) {
            throw new Error('El perfil especificado no existe');
        }

        const contraseñaHash = await Usuario.hashContraseña(contraseña);

        const ultimoId = await UsuarioBD.obtenerUltimoCodigo();
        const nuevoId = ultimoId + 1;

        const datosBD = {
            codigo: nuevoId,
            nombre: nombre,
            email: email,
            contraseñaHash: contraseñaHash,
            codigoPerfil: perfilUsuario.codigo
        }
        await UsuariosBD.crearUsuario(datosBD);

        const nuevoUsuario = new Usuario({
            id: nuevoId, 
            nombre: nombre, 
            email: email, 
            contraseñaHash: contraseñaHash, 
            perfi: perfilUsuario});
        return nuevoUsuario;
    }

    async buscarPorEmail(email) {
        const datosUsuario = await UsuariosBD.obtenerUsuarioPorEmail(email)
        if (!datosUsuario){
            return undefined;
        }
        const [usuario] = await this.convertirUsuarioBD([datosUsuario]);
        return usuario;
    }

    async buscarPorId(id) {
        const datosUsuario = await UsuariosBD.obtenerUsuarioPorId(id);
        if (!datosUsuario){
            return undefined;
        }
        const [usuario] = await this.convertirUsuarioBD([datosUsuario]);
        return usuario;
    }

}

module.exports = new AdministradorUsuarios();
const Usuario = require('./Usuario.js');
const administradorPerfiles = require('./AdministradorPerfiles.js');
const UsuarioBD = require('../repositories/UsuarioBD');


class AdministradorUsuarios {
    async convertirUsuarioBD(usuariosBD) {
        if (!usuariosBD || usuariosBD.length === 0) {
            return [];
        }

        const perfiles = await administradorPerfiles.obtenerPerfiles();
        const perfilesMap = new Map();
        perfiles.forEach(perfil => {
            perfilesMap.set(perfil.codigo, perfil);
        });

        return usuariosBD.map(usuario => {
            const perfil = perfilesMap.get(usuario.codigoPerfil);
            if (!perfil) {
                console.error(`Error: El usuario tiene un codigo de perfil invalido`);
                return null;
            }
            return new Usuario({
                id: usuario.codigo,
                nombre: usuario.nombre,
                correo: usuario.correo,
                contraseñaHash: usuario.contraseñaHash,
                perfil: perfil
            })
        }).filter(u => u !== null); // FILTRA LOS QUE SON NULL
    }

    async registrarUsuario(data) {
        const { nombre, correo, contraseña, perfil } = data;

        const usuarioExistente = await this.buscarUsuarioPorCorreo(correo);
        if (usuarioExistente) {
            throw new Error('El email ya está registrado');
        }

        const perfilUsuario = await administradorPerfiles.buscarPorNombre(perfil);
        if (!perfilUsuario) {
            throw new Error('El perfil especificado no existe');
        }

        const contraseñaHash = await Usuario.hashContraseña(contraseña);

        const ultimoId = await UsuarioBD.obtenerUltimoCodigo();
        const nuevoId = ultimoId + 1;

        const datosBD = {
            codigo: nuevoId,
            nombre: nombre,
            correo: correo,
            contraseñaHash: contraseñaHash,
            codigoPerfil: perfilUsuario.codigo
        }
        await UsuarioBD.crearUsuario(datosBD);

        const nuevoUsuario = new Usuario({
            codigo: nuevoId,
            nombre: nombre,
            correo: correo,
            contraseñaHash: contraseñaHash,
            perfil: perfilUsuario
        });
        return nuevoUsuario;
    }

    async buscarPorCorreo(correo) {
        const datosUsuario = await UsuarioBD.obtenerUsuarioPorCorreo(correo)
        if (!datosUsuario) {
            return undefined;
        }
        const [usuario] = await this.convertirUsuarioBD([datosUsuario]);
        return usuario;
    }

    async buscarPorCodigo(codigo) {
        const datosUsuario = await UsuarioBD.obtenerUsuarioPorCodigo(codigo);
        if (!datosUsuario) {
            return undefined;
        }
        const [usuario] = await this.convertirUsuarioBD([datosUsuario]);
        return usuario;
    }

}

module.exports = new AdministradorUsuarios();
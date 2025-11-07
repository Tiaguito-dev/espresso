const Usuario = require('./Usuario.js');
const administradorPerfiles = require('./AdministradorPerfiles.js');
const UsuarioBD = require('../repositories/UsuarioBD');


class AdministradorUsuarios {
    // SIMPLIFICADO: Ya no necesita obtener todos los perfiles
    async convertirUsuarioBD(usuariosBD) {
        if (!usuariosBD || usuariosBD.length === 0) {
            return [];
        }

        return usuariosBD.map(usuario => {
            // El perfil ya viene del JOIN
            if (!usuario.perfil_codigo || !usuario.perfil_nombre) {
                console.error(`Error: El usuario ${usuario.codigo} no tiene perfil válido`);
                return null;
            }

            // Crear objeto Perfil desde los datos del JOIN
            const perfil = new Perfil({
                codigo: usuario.perfil_codigo,
                nombre: usuario.perfil_nombre
            });
            return new Usuario({
                codigo: usuario.codigo,
                nombre: usuario.nombre,
                correo: usuario.correo,
                contraseñaHash: usuario.contraseñaHash,
                perfil: perfil
            })
        }).filter(u => u !== null); // FILTRA LOS QUE SON NULL
    }

    async registrarUsuario(data) {
        const { nombre, correo, contraseña, perfil } = data;

        const usuarioExistente = await this.buscarPorCorreo(correo);
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
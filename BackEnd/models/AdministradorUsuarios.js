const Usuario = require('./Usuario.js');
const administradorPerfiles = require('./AdministradorPerfiles.js');
const UsuarioBD = require('../repositories/UsuarioBD');
const Perfil = require('./Perfil.js');

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
                nombre: usuario.perfil_nombre.trim()
            });
            return new Usuario({
                codigo: usuario.codigo,
                nombre: usuario.nombre,
                correo: usuario.correo,
                contraseñaHash: usuario.contraseñahash,
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

    async obtenerTodosConPerfil() {
        const usuariosBD = await UsuarioBD.obtenerUsuarios();
        const usuarios = await this.convertirUsuarioBD(usuariosBD);

        return usuarios;
    }

    async actualizarUsuario(codigo, datosNuevos) {
          const { nombre, correo, contraseña, perfil } = datosNuevos;
            
          console.log("📦 Datos recibidos en actualizarUsuario:", datosNuevos);
            
          const usuarioActual = await UsuarioBD.obtenerUsuarioPorCodigo(codigo);
          if (!usuarioActual) {
            throw new Error('Usuario no encontrado');
          }
      
          // Validar correo duplicado
          if (correo && correo !== usuarioActual.correo) {
            const correoExistente = await UsuarioBD.existeCorreo(correo);
            if (correoExistente) {
              throw new Error('El correo ya está registrado por otro usuario');
            }
          }
      
          // Buscar perfil
          let codigoPerfil;
          if (perfil) {
            const perfilUsuario = await administradorPerfiles.buscarPorNombre(perfil);
            if (!perfilUsuario) {
              throw new Error('El perfil especificado no existe');
            }
            codigoPerfil = perfilUsuario.codigo;
          } else {
            codigoPerfil = usuarioActual.perfil_codigo;
          }
      
          // Manejar contraseña
          let contraseñaHash;
          if (contraseña) {
            contraseñaHash = await Usuario.hashContraseña(contraseña);
          } else {
            // FIX: corregido el nombre del campo
            contraseñaHash = usuarioActual.contraseñaHash || usuarioActual.contraseñahash;
          }
      
          // Armar datos para la BD
          const datosBD = {
            nombre: nombre || usuarioActual.nombre,
            correo: correo || usuarioActual.correo,
            contraseñaHash,
            codigoPerfil
          };
      
          console.log("🧩 Datos que se mandan a modificarUsuario:", datosBD);
      
          await UsuarioBD.modificarUsuario(codigo, datosBD);
      
          const datosActualizados = await this.buscarPorCodigo(codigo);
          return datosActualizados;
        }
}

module.exports = AdministradorUsuarios;
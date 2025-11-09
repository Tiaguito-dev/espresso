const Perfil = require('./Perfil.js');
const PerfilBD = require('../repositories/PerfilBD');


class AdministradorPerfiles {
    convertirPerfilBD(perfilBD) {
        if (!perfilBD) return null;
        return new Perfil({
            codigo: perfilBD.codigo,
            nombre: perfilBD.nombre.trim()
            /* NO VAMOS A TARBAJAR CON LISTA DE PERMISOS AHORA*/
            // permisos: perfilBD.permisos // es un array de strings
        });
    }

    // NOSOTROS NO VAMOS A CREAR PERFILES
    async crearPerfil(data) {
        const { nombre } = data;
        /* NO VAMOS A TARBAJAR CON LISTA DE PERMISOS AHORA*/
        const { permisos } = data;

        const nuevoId = await PerfilBD.obtenerUltimoCodigo() + 1;

        const datosBD = {
            codigo: nuevoId,
            nombre: nombre
            /* NO VAMOS A TARBAJAR CON LISTA DE PERMISOS AHORA*/
            // permisos: permisos
        }
        await PerfilBD.crearPerfil(datosBD);

        const nuevoPerfil = new Perfil({ codigo: nuevoId, nombre });

        return nuevoPerfil;
    }
    async buscarPorNombre(nombre) {
        if (typeof nombre !== 'string') {
            return null;
        }
        const nombreLimpio = nombre.trim().toLowerCase();
        const perfilBD = await PerfilBD.obtenerPerfilPorNombre(nombreLimpio);
        return this.convertirPerfilBD(perfilBD);
    }

    async obtenerPerfiles() {
        const perfilesBD = await PerfilBD.obtenerPerfiles();
        if (!perfilesBD || perfilesBD.length === 0) {
            return [];
        }
        return perfilesBD.map(perfil => this.convertirPerfilBD(perfil));
    }
}

module.exports = new AdministradorPerfiles();
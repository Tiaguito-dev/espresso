const Perfil = require('./Perfil.js');
const PerfilesBD = require('../repositories/PerfilesBD');


class AdministradorPerfiles {
    convertirPerfilBD(perfilBD) {
        if (!perfilBD) return null;
        return new Perfil({
            id: perfilBD.codigo,
            nombre: perfilBD.nombre
            /* NO VAMOS A TARBAJAR CON LISTA DE PERMISOS AHORA*/
            // permisos: perfilBD.permisos // es un array de strings
        });
    }

    // NOSOTROS NO VAMOS A CREAR PERFILES
    async crearPerfil(data) {
        const { nombre } = data;
        /* NO VAMOS A TARBAJAR CON LISTA DE PERMISOS AHORA*/
        const { permisos } = data;

        const nuevoId = await PerfilesBD.obtenerUltimoCodigo() + 1;

        const datosBD = {
            codigo: nuevoId,
            nombre: nombre
            /* NO VAMOS A TARBAJAR CON LISTA DE PERMISOS AHORA*/
            // permisos: permisos
        }
        await PerfilesBD.crearPerfil(datosBD);

        const nuevoPerfil = new Perfil({ id: nuevoId, nombre, permisos });

        return nuevoPerfil;
    }
    async buscarPorNombre(nombre) {
        const perfilBD = await PerfilesBD.obtenerPerfilPorNombre(nombre);
        return this.convertirPerfilBD(perfilBD);
    }

    async obtenerPerfiles() {
        const perfilesBD = await PerfilesBD.obtenerPerfiles();
        if (!perfilesBD || perfilesBD.length === 0) {
            return [];
        }
        return perfilesBD.map(perfil => this.convertirPerfilBD(perfil));
    }
}

module.exports = new AdministradorPerfiles();
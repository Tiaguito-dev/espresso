const Perfil = require('./Perfil.js');
const PerfilesBD = require('../repositories/PerfilesBD');


class AdministradorPerfiles {
    convertirPerfilBD(perfilBD){
        if (!perfilBD) return null;
        return new Perfil({
            id: perfilBD.codigo,
            nombre: perfilBD.nombre,
            permisos: perfilBD.permisos // es un array de strings
        });
    }

    async crearPerfil(data) {
        const { nombre, permisos } = data; 
        const nuevoId = await PerfilesBD.obtenerUltimoCodigo + 1;

        const datosBD = {
            codigo: nuevoId,
            nombre: nombre,
            permisos: permisos // es un array de string
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
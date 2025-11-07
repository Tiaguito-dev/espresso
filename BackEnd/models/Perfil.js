class Perfil {
    constructor(data) {
        this.id = data.id;
        this.nombre = data.nombre;
        this.permisos = data.permisos;
    }

    tienePermiso(permiso) {
        return this.permisos.includes(permiso);
    }
}

module.exports = Perfil;
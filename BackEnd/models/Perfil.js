class Perfil {
    constructor(data) {
        this.codigo = data.codigo;
        this.nombre = data.nombre;
        /* NO VAMOS A TARBAJAR CON LISTA DE PERMISOS AHORA
        this.permisos = data.permisos;
        */
    }

    /* NO VAMOS A TARBAJAR CON LISTA DE PERMISOS AHORA 
    tienePermiso(permiso) {
        return this.permisos.includes(permiso);
    }
    */
}

module.exports = Perfil;
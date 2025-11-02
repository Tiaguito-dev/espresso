const bcrypt = require('bcrypt');

class Usuario {
    constructor(data) {
        this.codigo = data.codigo;
        this.nombre = data.nombre;
        this.correo = data.correo;
        this.contraseñaHash = data.contraseñaHash;
        this.perfil = data.perfil;
    }

    async compararContaseña(contraseña) {
        return await bcrypt.compare(contraseña, this.contraseñaHash);
    }

    static async hashContraseña(contraseña) {
        const saltRounds = 10;
        // Falta instalar el hash creo
        return await bcrypt.hash(contraseña, saltRounds);
    }
    /* NO VAMOS A TARBAJAR CON LISTA DE PERMISSOS POR AHORA
    
    tienePermiso(permiso) {
        if (this.perfil) {
            return this.perfil.tienePermiso(permiso);
        }
        return false;
    }
    */

    toJSON() {
        return {
            codigo: this.codigo,
            nombre: this.nombre,
            correo: this.correo,
            perfil: this.perfil
        };
    }
}

module.exports = Usuario;
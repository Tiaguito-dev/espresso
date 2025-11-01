const bcrypt = require('bcrypt');

class Usuario {
    constructor(data) {
        this.id = data.id;
        this.nombre = data.nombre;
        this.email = data.email;
        this.contraseñaHash = data.contraseñaHash; 
        this.perfil = data.perfil; 
    }

    async compararContaseña(contraseña) {
        return await bcrypt.compare(contraseña, this.contraseñaHash);
    }

    static async hashContraseña(contraseña) {
        const saltRounds = 10;
        return await bcrypt.hash(contraseña, saltRounds);
    }

    tienePermiso(permiso) {
        if (this.perfil) {
            return this.perfil.tienePermiso(permiso);
        }  
        return false;
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,
            perfil: this.perfil
        };
    }
}

module.exports = Usuario;
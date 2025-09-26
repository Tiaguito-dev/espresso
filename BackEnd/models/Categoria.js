class Categoria {
    constructor (data) {
        if (!data || typeof data !== 'object' || !data.nombre) {
            throw new Error('Se requieren los datos de la categoría con un nombre válido');
        }

        this.nombre = data.nombre;
    }
}
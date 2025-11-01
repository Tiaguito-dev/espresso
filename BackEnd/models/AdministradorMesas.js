const Mesa = require('./Mesa');
const MesaBD = require('../repositories/MesaBD');

class AdministradorMesas {
    constructor() {}

    convertirMesaBD(data){ // 💡 Usamos 'data' como nombre de la variable de entrada
        if (!data) return null;
        
        if (Array.isArray(data)){
            return data.map(m => new Mesa({
                nroMesa: m.nro_mesa,
                estadoMesa: m.estado_mesa 
            }));
        }

        // Caso 2: Objeto único (viene de buscarMesaPorNumero)
        return new Mesa({
            // ✅ Usa la variable de entrada 'data'
            nroMesa: data.nro_mesa, 
            estadoMesa: data.estado_mesa 
        });
    }
/*    cargarMesas(mesasData) {
        try {
                mesasData.forEach(dataMesa => {
                    const nuevaMesa = new Mesa(dataMesa);
                    this.agregarMesa(nuevaMesa);
                });
            } catch (error) {
                console.error('Error cargando mesas iniciales:', error.message);
            }
        }

    agregarMesa(mesa) {
        if (mesa instanceof Mesa) {
            this.mesas.push(mesa);
        }
    }
*/
    async getMesas() {
        const mesas = await MesaBD.obtenerMesas();
        return this.convertirMesaBD(mesas);
    }

    async buscarMesaPorNumero(nroMesa) {
        // Renombramos la variable a 'dataBD'
        const dataBD = await MesaBD.obtenerMesaPorNumero(nroMesa);
        
        // Si no se encuentra, devuelve null, lo cual pasa la validación.
        if (!dataBD){ 
            return null;
        }
        // Llama a convertirMesaBD con el objeto único de la BD
        return this.convertirMesaBD(dataBD); 
    }

    async crearMesa(dataMesa){
        const { nroMesa, estadoMesa } = dataMesa;
        const mesaExistente = await this.buscarMesaPorNumero(nroMesa);
        if (mesaExistente){
            throw new Error (`Mesa con número ${nroMesa} ya existence.`)
        }

        const nuevaMesa = new Mesa({ nroMesa, estadoMesa });
        
        const mesaBD = {
            mesa: nuevaMesa.nroMesa,
            estado: nuevaMesa.estadoMesa
        };

        await MesaBD.crearMesa(mesaBD);
        return nuevaMesa;
    }

    async eliminarMesaPorNumero(nroMesa){
        const mesa = await this.buscarMesaPorNumero(nroMesa);
        if(!mesa){
            throw new Error(`No fue posible eliminar la mesa ${nroMesa} porque no existe.`);
        }
        await MesaBD.eliminarMesaPorNumero(nroMesa);
        return true;
    }

    async cambiarEstadoMesa(nroMesa, nuevoEstado){
        const mesaAModificar = await this.buscarMesaPorNumero(nroMesa);
        if(!mesaAModificar){
            throw new Error(`Mesa para modificar no encontrada`);
        }
        
        const estadosValidos = ['disponible', 'ocupada', 'fuera de servicio'];

        if (!estadosValidos.includes(nuevoEstado)) {
            throw new Error(`El estado '${nuevoEstado}' no es válido.`);
        }
        
        // 🛑 CORRECCIÓN: Pasar los parámetros separados al repositorio
        await MesaBD.modificarEstadoMesa(nroMesa, nuevoEstado);
        mesaAModificar.cambiarEstadoMesa(nuevoEstado);
        return mesaAModificar;        
    }

}

module.exports = AdministradorMesas;
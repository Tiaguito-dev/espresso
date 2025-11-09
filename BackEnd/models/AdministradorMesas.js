const Mesa = require('./Mesa');
const MesaBD = require('../repositories/MesaBD');

class AdministradorMesas {
    constructor() {}

    convertirMesaBD(mesas){
        if (!mesas) return null;
        if (Array.isArray(mesas)){
            return mesas.map(m => new Mesa({
                id: m.id_mesa,
                nroMesa: m.nro_mesa,
                estadoMesa: m.estado_mesa
            }));
        }

        return new Mesa({
            id: mesas.id_mesa,
            nroMesa: mesas.nro_mesa,
            estadoMesa: mesas.estado_mesa
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
        const mesas = await MesaBD.obtenerMesaPorNumero(nroMesa);
        if (!mesas){
            return null;
        }
        return this.convertirMesaBD(mesas);
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

        await MesaBD.crearMesa(mesaBD.mesa);
        return nuevaMesa;
    }

    async eliminarMesaPorNumero(nroMesa){
        const mesa = await this.buscarMesaPorNumero(nroMesa);
        if(!mesa){
            throw new Error(`No fue posible eliminar la mesa ${nroMesa} porque no existe.`);
        }
        await MesaBD.eliminarMesa(nroMesa);
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
        await MesaBD.modificarEstadoMesa({ nroMesa: nroMesa, estadoMesa: nuevoEstado });
        mesaAModificar.cambiarEstadoMesa(nuevoEstado);
        return mesaAModificar;        
    }
}

module.exports = AdministradorMesas;
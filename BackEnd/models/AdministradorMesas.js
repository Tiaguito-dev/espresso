// AdministradorMesas.js

const Mesa = require('./Mesa');
const MesaBD = require('../repositories/MesaBD');

class AdministradorMesas {
    constructor() {}

    /**
     * Mapeo limpio sin mozoACargo.
     * Se asume que la BD devuelve 'nro_mesa' y 'estado_mesa'.
     */
    convertirMesaBD(mesas){
        if (!mesas) return null;
        
        if (Array.isArray(mesas)){
            return mesas.map(m => new Mesa({
                nroMesa: m.nro_mesa,
                estadoMesa: m.estado_mesa
            }));
        }
        
        // Caso de objeto único
        return new Mesa({
            nroMesa: mesas.nro_mesa, 
            estadoMesa: mesas.estado_mesa
        });
    }

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
            throw new Error (`Mesa con número ${nroMesa} ya existe.`);
        }

        const nuevaMesa = new Mesa({ nroMesa, estadoMesa });
        
        // 🚨 MODIFICACIÓN: Creamos el objeto para la BD con 'snake_case' y pasamos el objeto.
        const mesaBD = {
            nro_mesa: nuevaMesa.nroMesa,
            estado_mesa: nuevaMesa.estadoMesa 
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
        
        // Se sincronizan los estados con Mesa.js y la validación
        const estadosValidos = ['disponible', 'ocupada', 'fuera de servicio']; 

        if (!estadosValidos.includes(nuevoEstado)) {
            throw new Error(`El estado '${nuevoEstado}' no es válido.`);
        }
        
        // 🚨 MODIFICACIÓN CLAVE: Pasamos el objeto requerido por MesaBD.modificarEstadoMesa
        await MesaBD.modificarEstadoMesa({ nroMesa, estadoMesa: nuevoEstado });
        
        mesaAModificar.cambiarEstadoMesa(nuevoEstado);
        return mesaAModificar;     
    }
}

module.exports = AdministradorMesas;
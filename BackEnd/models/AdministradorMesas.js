const Mesa = require('./Mesa');
const MesaBD = require('../repositories/MesaBD');

class AdministradorMesas {
    constructor() {}

    convertirMesaBD(dataBD){
        if (!dataBD) return null;
        
        // Si la data es un array (viene de getMesas)
        if (Array.isArray(dataBD)){
            return dataBD.map(m => new Mesa({
                // 🛑 CORRECCIÓN: Mapear correctamente los campos de BD a la clase Mesa
                nroMesa: m.nro_mesa,
                estadoMesa: m.estado_mesa, // Usar 'estado_mesa' de la BD
                // Si la BD tiene id_mesa, también lo deberías mapear: id: m.id_mesa
            }));
        }

        // Si la data es un solo objeto (viene de buscarMesaPorNumero)
        return new Mesa({
            // 🛑 CORRECCIÓN: Mapear correctamente los campos de BD a la clase Mesa
            nroMesa: dataBD.nro_mesa,
            estadoMesa: dataBD.estado_mesa // Usar 'estado_mesa' de la BD
            // Si la BD tiene id_mesa, también lo deberías mapear: id: dataBD.id_mesa
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
            nro_mesa: nuevaMesa.nroMesa,
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
        
        mesaAModificar.estadoMesa = nuevoEstado;
        return mesaAModificar;         
    }

}

module.exports = AdministradorMesas;
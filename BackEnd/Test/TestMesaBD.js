const MesaBD = require('../repositories/MesaBD');

exports.runTests = async () => {

    try {
        const mesas = await MesaBD.obtenerMesas();
        console.log('Mesas actuales:', mesas);
    } catch (error) {
        console.error('Error al obtener mesas:', error);
    }

    try {
        const mesa1 = await MesaBD.obtenerMesaPorNumero(1);
        console.log('Mesa nro 1:', mesa1);
    } catch (error) {
        console.error('Error al obtener mesa nro 1:', error);
    }

    try {
        const ultimaMesa = await MesaBD.obtenerUltimoNumeroMesa();
        console.log('Último número de mesa:', ultimaMesa);
    } catch (error) {
        console.error('Error al obtener último número de mesa:', error);
    }

    try {
        const resultado = await MesaBD.crearMesa(99);
        console.log(resultado.message);
    } catch (error) {
        console.error('Error al crear una mesa:', error);
    }

    try {
        const existe = await MesaBD.existeNumeroMesa(99);
        console.log(`¿Existe la mesa 99?:`, existe);
    } catch (error) {
        console.error('Error al verificar si existe la mesa:', error);
    }

    try {
        const resultado = await MesaBD.modificarEstadoMesa({ nroMesa: 99, estadoMesa: 'ocupada' });
        console.log(resultado.message);
    } catch (error) {
        console.error('Error al modificar mesa:', error);
    }

    try {
        const resultado = await MesaBD.eliminarMesa(99);
        console.log(resultado.message);
    } catch (error) {
        console.error('Error al eliminar mesa:', error);
    }

}
const cron = require('node-cron');
const Tarea = require('../models/Tarea');
const { enviarEmailRecordatorio } = require('./emailService');

const iniciarTareaProgramada = () => {
    cron.schedule('0 * * * *', async () => {
        console.log('Ejecutando tarea programada: buscando tareas próximas a vencer...');
        
        const ahora = new Date();
        const proximas24Horas = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

        try {
            const tareas = await Tarea.find({
                estado: { $ne: 'Completada' },
                fechaVencimiento: { $gte: ahora, $lte: proximas24Horas }
            }).populate('propietario', 'nombre email');

            if (tareas.length === 0) {
                console.log('No se encontraron tareas próximas a vencer.');
                return;
            }

            console.log(`Se encontraron ${tareas.length} tareas. Enviando correos...`);

            for (const tarea of tareas) {
                if (tarea.propietario && tarea.propietario.email) {
                    await enviarEmailRecordatorio(
                        tarea.propietario.email,
                        tarea.propietario.nombre,
                        tarea.descripcion
                    );
                }
            }
        } catch (error) {
            console.error('Error en la tarea programada:', error);
        }
    });
};

module.exports = { iniciarTareaProgramada };
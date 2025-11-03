const Tarea = require('../models/Tarea');

exports.crearTarea = async (req, res) => {
    try {
        const tarea = new Tarea(req.body);
        tarea.propietario = req.usuario.id;
        await tarea.save();
        res.status(201).json(tarea);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor' });
    }
};

exports.obtenerTareas = async (req, res) => {
    try {
        const tareas = await Tarea.find({ propietario: req.usuario.id }).sort({ createdAt: -1 });
        res.json({ tareas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor' });
    }
};

exports.actualizarTarea = async (req, res) => {
    try {
        const { descripcion, estado, fechaVencimiento } = req.body;
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            return res.status(404).json({ msg: 'Tarea no encontrada.' });
        }

        if (tarea.propietario.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado.' });
        }

        const datosActualizados = {};
        if (descripcion !== undefined) datosActualizados.descripcion = descripcion;
        if (estado !== undefined) datosActualizados.estado = estado;
        if (fechaVencimiento !== undefined) datosActualizados.fechaVencimiento = fechaVencimiento;
        
        tarea = await Tarea.findByIdAndUpdate(req.params.id, { $set: datosActualizados }, { new: true });

        res.json({ tarea });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor' });
    }
};

exports.eliminarTarea = async (req, res) => {
    try {
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            return res.status(404).json({ msg: 'Tarea no encontrada.' });
        }

        if (tarea.propietario.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado.' });
        }

        await Tarea.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Tarea eliminada correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor' });
    }
};
const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: String,
        required: true,
        enum: ['Pendiente', 'En Progreso', 'Completada'],
        default: 'Pendiente'
    },
    fechaVencimiento: {
        type: Date,
        required: true
    },
    propietario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, {
    timestamps: true
});

const Tarea = mongoose.model('Tarea', tareaSchema);

module.exports = Tarea;
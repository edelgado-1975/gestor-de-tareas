require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
const { iniciarTareaProgramada } = require('./services/cronService');

const app = express();
conectarDB();

app.use(cors()); 
app.use(express.json({ extended: true }));

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.json({ msg: 'API del Gestor de Tareas funcionando' });
});

iniciarTareaProgramada(); 

app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/tareas', require('./routes/tareaRoutes'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
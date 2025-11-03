const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario, perfilUsuario } = require('../controllers/usuarioController');
const auth = require('../middleware/auth');

router.post('/', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/perfil', auth, perfilUsuario);

module.exports = router;
const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
    const { email, password } = req.body;
    try {
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: 'El correo electrónico ya está registrado.' });
        }

        usuario = new Usuario(req.body);
        
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);
        
        await usuario.save();
        res.status(201).json({ msg: 'Usuario creado correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor.' });
    }
};

const loginUsuario = async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe.' });
        }

        const passwordCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passwordCorrecto) {
            return res.status(400).json({ msg: 'La contraseña es incorrecta.' });
        }

        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        console.log('SECRETO AL FIRMAR:', process.env.JWT_SECRET);
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;
            res.json({ token });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor.' });
    }
};

const perfilUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password -__v -createdAt -updatedAt');
        
        res.json({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor.' });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario,
    perfilUsuario
};
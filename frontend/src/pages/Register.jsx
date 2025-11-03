import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../config/axios';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repetirPassword, setRepetirPassword] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();

        if ([nombre, email, password, repetirPassword].includes('')) {
            toast.error('Todos los campos son obligatorios');
            return;
        }
        if (password !== repetirPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }
        if (password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            await axiosClient.post('/usuarios', { nombre, email, password });
            
            toast.success('¡Cuenta creada correctamente! Ya puedes iniciar sesión.');

            setNombre('');
            setEmail('');
            setPassword('');
            setRepetirPassword('');

        } catch (error) {
            toast.error(error.response.data.msg);
        }
    };

    return (
        <div className="auth-form">
            <h1>Crea tu Cuenta</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        id="nombre"
                        type="text"
                        placeholder="Tu Nombre"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Tu Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Tu Contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="repetir-password">Repetir Contraseña</label>
                    <input
                        id="repetir-password"
                        type="password"
                        placeholder="Repite tu Contraseña"
                        value={repetirPassword}
                        onChange={e => setRepetirPassword(e.target.value)}
                    />
                </div>

                <input type="submit" value="Crear Cuenta" />
            </form>

            <nav className="auth-nav">
                <Link to="/">¿Ya tienes una cuenta? Inicia Sesión</Link>
            </nav>
        </div>
    );
};

export default Register;
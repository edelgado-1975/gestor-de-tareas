import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../config/axios';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setAuth, setCargando } = useContext(AuthContext); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([email, password].includes('')) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        try {
            setCargando(true); 

            const { data } = await axiosClient.post('/usuarios/login', { email, password });
            localStorage.setItem('token', data.token);

            const config = { headers: { "x-auth-token": data.token } };
            const { data: perfilUsuario } = await axiosClient.get('/usuarios/perfil', config);

            setAuth(perfilUsuario);
            
            toast.success(`Bienvenido de vuelta, ${perfilUsuario.nombre}`, {
                position: "top-center"
            });
            
            navigate('/tasks');

        } catch (error) {
            toast.error(error.response.data.msg);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="auth-form">
            <h1>Inicia Sesión</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Tu Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Tu Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <input type="submit" value="Iniciar Sesión" />
            </form>
            <nav className="auth-nav">
                <Link to="/register">¿No tienes una cuenta? Regístrate</Link>
            </nav>
        </div>
    );
};

export default Login;
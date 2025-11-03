import { useState, useEffect, createContext } from 'react';
import axiosClient from '../config/axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setCargando(false);
                return;
            }
            const config = { headers: { "Content-Type": "application/json", "x-auth-token": token } };
            try {
                const { data } = await axiosClient.get('/usuarios/perfil', config);
                setAuth(data);
            } catch (error) {
                console.log(error.response ? error.response.data.msg : 'Error de autenticación');
                setAuth({});
            } finally {
                setCargando(false);
            }
        };
        autenticarUsuario();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                setCargando
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };
export default AuthContext;
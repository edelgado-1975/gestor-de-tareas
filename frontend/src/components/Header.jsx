import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem('token');

        setAuth({});

        navigate('/');
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <p>Bienvenido de vuelta  <span>{auth.nombre}</span></p>
                <button
                    className={styles.logoutBtn}
                    onClick={handleLogout}
                >
                    Cerrar Sesión
                </button>
            </div>
        </header>
    );
};

export default Header;
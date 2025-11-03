import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = () => {
    const { auth, cargando } = useContext(AuthContext);

    if (cargando) {
        return <Spinner />;
    }

    if (!auth.id) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
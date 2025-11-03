import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

const AuthLayout = () => {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Outlet /> {}
      </div>
    </div>
  );
};

export default AuthLayout;
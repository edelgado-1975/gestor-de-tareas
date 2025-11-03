
import { Outlet } from 'react-router-dom';
import Header from './Header';

const ProtectedLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet /> {}
      </main>
    </div>
  );
};

export default ProtectedLayout;
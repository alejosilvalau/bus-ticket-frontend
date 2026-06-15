import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from './components/layouts/PublicLayout';
import AdminLayout from './components/layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import TripExplorer from './pages/TripExplorer';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import DriverAdmin from './pages/admin/DriverAdmin';
import TripAdmin from './pages/admin/TripAdmin';
import LocationAdmin from './pages/admin/LocationAdmin';
import BusAdmin from './pages/admin/BusAdmin';
import SeatAdmin from './pages/admin/SeatAdmin';
import SeatTypeAdmin from './pages/admin/SeatTypeAdmin';
import TicketAdmin from './pages/admin/TicketAdmin';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'viajes', element: <TripExplorer /> },
      {
        path: 'checkout/:tripId',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      { path: 'login', element: <Login /> },
      { path: 'registrar', element: <Register /> },
      { path: 'recuperar-contrasena', element: <ForgotPassword /> },
      {
        path: 'perfil',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'choferes', element: <DriverAdmin /> },
      { path: 'viajes', element: <TripAdmin /> },
      { path: 'ubicaciones', element: <LocationAdmin /> },
      { path: 'autobuses', element: <BusAdmin /> },
      { path: 'asientos', element: <SeatAdmin /> },
      { path: 'tipos-asiento', element: <SeatTypeAdmin /> },
      { path: 'tickets', element: <TicketAdmin /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default router;

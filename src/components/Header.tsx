import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Menu, X, LogOut, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-gray-100">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Bus className="h-8 w-8 text-[#c60001]" />
          <span className="text-xl font-bold text-gray-900">BusTicket</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-gray-700 hover:text-[#c60001] transition-colors">
            Inicio
          </Link>
          <Link to="/viajes" className="text-sm font-medium text-gray-700 hover:text-[#c60001] transition-colors">
            Viajes
          </Link>
          {isAuthenticated && (
            <Link to="/perfil" className="text-sm font-medium text-gray-700 hover:text-[#c60001] transition-colors">
              Mi Cuenta
            </Link>
          )}
          {isAdmin && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#c60001] transition-colors"
              >
                <Shield className="h-4 w-4" />
                Admin
                <ChevronDown className="h-3 w-3" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <Link to="/admin/choferes" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Choferes</Link>
                  <Link to="/admin/viajes" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Viajes</Link>
                  <Link to="/admin/ubicaciones" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Ubicaciones</Link>
                  <Link to="/admin/autobuses" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Autobuses</Link>
                  <Link to="/admin/asientos" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Asientos</Link>
                  <Link to="/admin/tipos-asiento" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Tipos de Asiento</Link>
                  <Link to="/admin/tickets" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Tickets</Link>
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.firstName}</span>
              <button onClick={handleLogout} className="flex items-center gap-1 rounded-lg bg-[#c60001] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#a50001] transition-colors">
                <LogOut className="h-4 w-4" />
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                Iniciar Sesión
              </Link>
              <Link to="/registrar" className="rounded-lg bg-[#c60001] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#a50001] transition-colors">
                Registrarse
              </Link>
            </div>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600 hover:bg-gray-200 rounded-lg">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Inicio</Link>
            <Link to="/viajes" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Viajes</Link>
            {isAuthenticated && (
              <Link to="/perfil" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Mi Cuenta</Link>
            )}
            {isAdmin && (
              <>
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-gray-400 uppercase"><Shield className="h-3 w-3" /> Admin</span>
                </div>
                <Link to="/admin/choferes" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Choferes</Link>
                <Link to="/admin/viajes" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Viajes</Link>
                <Link to="/admin/ubicaciones" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Ubicaciones</Link>
                <Link to="/admin/autobuses" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Autobuses</Link>
                <Link to="/admin/asientos" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Asientos</Link>
                <Link to="/admin/tipos-asiento" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Tipos de Asiento</Link>
                <Link to="/admin/tickets" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Tickets</Link>
              </>
            )}
          </nav>
          <div className="mt-3 border-t border-gray-100 pt-3">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{user?.firstName}</span>
                <button onClick={handleLogout} className="flex items-center gap-1 rounded-lg bg-[#c60001] px-3 py-1.5 text-sm font-medium text-white">
                  <LogOut className="h-4 w-4" /> Salir
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium text-gray-700 border border-gray-300">Iniciar Sesión</Link>
                <Link to="/registrar" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg bg-[#c60001] px-3 py-2 text-center text-sm font-medium text-white">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

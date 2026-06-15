import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Bus, MapPin, Route, Users, Armchair, Tag, Ticket, Menu, LayoutDashboard } from 'lucide-react';

const navItems = [
  { to: '/admin/choferes', label: 'Choferes', icon: Users },
  { to: '/admin/viajes', label: 'Viajes', icon: Route },
  { to: '/admin/ubicaciones', label: 'Ubicaciones', icon: MapPin },
  { to: '/admin/autobuses', label: 'Autobuses', icon: Bus },
  { to: '/admin/asientos', label: 'Asientos', icon: Armchair },
  { to: '/admin/tipos-asiento', label: 'Tipos de Asiento', icon: Tag },
  { to: '/admin/tickets', label: 'Tickets', icon: Ticket },
];

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-gray-200 bg-white transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
          <LayoutDashboard className="h-6 w-6 text-[#c60001]" />
          <span className="text-lg font-bold text-gray-900">Admin</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#c60001] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Link to="/" className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            ← Volver al sitio
          </Link>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {navItems.find((n) => location.pathname === n.to)?.label || 'Panel de Administración'}
          </h1>
        </header>
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}

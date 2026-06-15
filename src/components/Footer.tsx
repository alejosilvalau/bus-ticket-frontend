import { Bus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-200 border-t border-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bus className="h-6 w-6 text-[#c60001]" />
              <span className="text-lg font-bold text-gray-900">BusTicket</span>
            </div>
            <p className="text-sm text-gray-600">
              Reserva tus viajes en autobús de forma rápida y segura. Compara precios y horarios.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Enlaces</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-[#c60001] transition-colors">Inicio</Link></li>
              <li><Link to="/viajes" className="hover:text-[#c60001] transition-colors">Buscar Viajes</Link></li>
              <li><Link to="/perfil" className="hover:text-[#c60001] transition-colors">Mi Cuenta</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>soporte@busticket.com</li>
              <li>+54 11 1234-5678</li>
              <li>Buenos Aires, Argentina</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-300 pt-4 text-center text-xs text-gray-500">
          © 2026 BusTicket. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

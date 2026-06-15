import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-6xl font-bold text-gray-300">404</h1>
      <p className="mb-6 text-lg text-gray-600">Página no encontrada</p>
      <Link
        to="/"
        className="flex items-center gap-2 rounded-lg bg-[#c60001] px-4 py-2 text-sm font-medium text-white hover:bg-[#a50001] transition-colors"
      >
        <Home className="h-4 w-4" />
        Volver al inicio
      </Link>
    </div>
  );
}

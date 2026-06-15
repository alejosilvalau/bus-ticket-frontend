import { Link } from 'react-router-dom';
import { Bus, Mail } from 'lucide-react';

export default function ForgotPassword() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Bus className="mx-auto h-12 w-12 text-[#c60001]" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Recuperar Contraseña</h1>
          <p className="mt-1 text-sm text-gray-600">
            Ingresá tu email y te contactaremos para ayudarte
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-[#c60001] focus:outline-none focus:ring-1 focus:ring-[#c60001]"
                />
              </div>
            </div>
            <button className="w-full rounded-lg bg-[#c60001] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#a50001] transition-colors">
              Enviar Instrucciones
            </button>
          </div>

          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              <strong>Nota:</strong> El sistema no cuenta con recuperación automática de contraseña.
              Si olvidaste tu contraseña, contactá al soporte en{' '}
              <span className="font-medium text-[#c60001]">soporte@busticket.com</span>
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link to="/login" className="font-medium text-[#c60001] hover:underline">
            ← Volver al login
          </Link>
        </p>
      </div>
    </div>
  );
}

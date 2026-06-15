import SearchBox from '@/components/SearchBox';
import { Bus, DollarSign, Shield, Star } from 'lucide-react';

const benefits = [
  { icon: Bus, title: 'Amplia Red', desc: 'Conectamos las principales ciudades con rutas directas y convenientes.' },
  { icon: DollarSign, title: 'Mejores Precios', desc: 'Compara opciones y reserva con tarifas transparentes y promociones exclusivas.' },
  { icon: Shield, title: 'Viaja Seguro', desc: 'Disfruta de viajes seguros con servicios confiables y asistencia dedicada.' },
  { icon: Star, title: 'Opiniones', desc: 'Miles de viajeros satisfechos nos recomiendan por comodidad y precio.' },
];

export default function Home() {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-[#667eea] to-[#764ba2] px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm">
            Reservá tu próximo viaje
          </span>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Reserva tu viaje en autobús en segundos
          </h1>
          <p className="mb-8 text-lg text-white/80">
            Elegí tu ruta, compará horarios y conseguí tus boletos con los mejores precios.
          </p>
          <div className="rounded-2xl bg-white p-4 shadow-2xl">
            <SearchBox />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">¿Por qué elegirnos?</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#c60001]/10">
                <Icon className="h-6 w-6 text-[#c60001]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-100 px-4 py-16 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">¿Listo para viajar?</h2>
        <p className="mb-6 text-gray-600">
          Reservá ahora y empezá a planificar tu próxima aventura por carretera con BusTicket.
        </p>
      </section>
    </div>
  );
}

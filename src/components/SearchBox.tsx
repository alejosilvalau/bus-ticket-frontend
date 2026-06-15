import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useLocations } from '@/hooks/queries/useLocations';
import { useState } from 'react';

export default function SearchBox() {
  const navigate = useNavigate();
  const { data } = useLocations();
  const locations = data?.data?.data?.content || [];

  const [originId, setOriginId] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (originId) params.set('origin', originId);
    if (destinationId) params.set('destination', destinationId);
    if (date) params.set('date', date);
    navigate(`/viajes?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <select
          value={originId}
          onChange={(e) => setOriginId(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-[#c60001] focus:outline-none focus:ring-1 focus:ring-[#c60001]"
        >
          <option value="">Origen</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>{loc.cityName}, {loc.state}</option>
          ))}
        </select>
      </div>
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <select
          value={destinationId}
          onChange={(e) => setDestinationId(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-[#c60001] focus:outline-none focus:ring-1 focus:ring-[#c60001]"
        >
          <option value="">Destino</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>{loc.cityName}, {loc.state}</option>
          ))}
        </select>
      </div>
      <div className="relative flex-1">
        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-[#c60001] focus:outline-none focus:ring-1 focus:ring-[#c60001]"
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-lg bg-[#c60001] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#a50001] transition-colors sm:w-auto"
      >
        Buscar
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

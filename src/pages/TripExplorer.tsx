import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowRight, Clock } from 'lucide-react';
import { useAvailableTripSearch } from '@/hooks/queries/useTrips';
import { useLocations } from '@/hooks/queries/useLocations';
import { useSeatTypes } from '@/hooks/queries/useSeatTypes';
import type { SearchTrip } from '@/types/trip';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';

const timeSlots = [
  { label: 'Mañana', value: 'morning', icon: '🌅' },
  { label: 'Tarde', value: 'afternoon', icon: '☀️' },
  { label: 'Noche', value: 'night', icon: '🌙' },
];

function parseDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function parseTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function formatDuration(dep: string, arr: string) {
  try {
    const diff = new Date(arr).getTime() - new Date(dep).getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m`;
  } catch {
    return '';
  }
}

export default function TripExplorer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(0);

  const [filters, setFilters] = useState<SearchTrip>({
    locationOriginId: searchParams.get('origin') ? Number(searchParams.get('origin')) : undefined,
    locationDestinationId: searchParams.get('destination') ? Number(searchParams.get('destination')) : undefined,
    departureDate: searchParams.get('date') || undefined,
    startBasePrice: undefined,
    endBasePrice: undefined,
    seatTypeId: undefined,
  });

  const [timeFilter, setTimeFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'departure'>('departure');

  const { data: locationsData } = useLocations();
  const locations = locationsData?.data?.data?.content || [];

  const { data: seatTypesData } = useSeatTypes();
  const seatTypes = seatTypesData?.data?.data?.content || [];

  const searchFilters = useMemo<SearchTrip>(() => {
    const f: SearchTrip = { ...filters };
    if (timeFilter === 'morning') {
      f.departureDate = filters.departureDate
        ? `${filters.departureDate}T06:00:00Z`
        : '2020-01-01T06:00:00Z';
    } else if (timeFilter === 'afternoon') {
      f.departureDate = filters.departureDate
        ? `${filters.departureDate}T12:00:00Z`
        : '2020-01-01T12:00:00Z';
    } else if (timeFilter === 'night') {
      f.departureDate = filters.departureDate
        ? `${filters.departureDate}T18:00:00Z`
        : '2020-01-01T18:00:00Z';
    }
    return f;
  }, [filters, timeFilter]);

  const { data, isLoading } = useAvailableTripSearch(searchFilters, page, 10);

  const trips = useMemo(() => {
    const content = data?.data?.data?.content || [];
    const sorted = [...content];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.basePrice - b.basePrice);
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.basePrice - a.basePrice);
    else sorted.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
    return sorted;
  }, [data, sortBy]);

  const totalPages = data?.data?.data?.totalPages || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <SlidersHorizontal className="h-4 w-4" /> Filtros
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Origen</label>
                <select
                  value={filters.locationOriginId || ''}
                  onChange={(e) => setFilters({ ...filters, locationOriginId: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#c60001] focus:outline-none"
                >
                  <option value="">Todos</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.cityName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Destino</label>
                <select
                  value={filters.locationDestinationId || ''}
                  onChange={(e) => setFilters({ ...filters, locationDestinationId: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#c60001] focus:outline-none"
                >
                  <option value="">Todos</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.cityName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Fecha</label>
                <input
                  type="date"
                  value={filters.departureDate || ''}
                  onChange={(e) => setFilters({ ...filters, departureDate: e.target.value || undefined })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#c60001] focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Precio mín</label>
                  <input
                    type="number"
                    value={filters.startBasePrice || ''}
                    onChange={(e) => setFilters({ ...filters, startBasePrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#c60001] focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Precio máx</label>
                  <input
                    type="number"
                    value={filters.endBasePrice || ''}
                    onChange={(e) => setFilters({ ...filters, endBasePrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="∞"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#c60001] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Tipo de asiento</label>
                <select
                  value={filters.seatTypeId || ''}
                  onChange={(e) => setFilters({ ...filters, seatTypeId: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#c60001] focus:outline-none"
                >
                  <option value="">Todos</option>
                  {seatTypes.map((st) => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Hora de salida</label>
                <div className="flex gap-1">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.value}
                      onClick={() => setTimeFilter(timeFilter === slot.value ? '' : slot.value)}
                      className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                        timeFilter === slot.value
                          ? 'bg-[#c60001] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {slot.icon} {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {data?.data?.data?.totalElements ?? 0} viajes encontrados
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-[#c60001] focus:outline-none"
            >
              <option value="departure">Hora de salida</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>

          {isLoading ? (
            <Spinner />
          ) : trips.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-500">No se encontraron viajes con esos filtros.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trips.map((trip) => (
                <div key={trip.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-900">
                          {trip.locationOrigin.cityName}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <span className="text-lg font-bold text-gray-900">
                          {trip.locationDestination.cityName}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {parseTime(trip.departureDate)} → {parseTime(trip.arrivalDate)}
                        </span>
                        <span>{formatDuration(trip.departureDate, trip.arrivalDate)}</span>
                        <span>{parseDate(trip.departureDate)}</span>
                        <span className="text-xs text-gray-400">Bus {trip.bus.plateNumber}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#c60001]">
                          ${trip.basePrice.toLocaleString('es-AR')}
                        </p>
                        <p className="text-xs text-gray-500">precio base</p>
                      </div>
                      <button
                        onClick={() => navigate(`/checkout/${trip.id}`)}
                        className="rounded-lg bg-[#c60001] px-4 py-2 text-sm font-medium text-white hover:bg-[#a50001] transition-colors"
                      >
                        Seleccionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

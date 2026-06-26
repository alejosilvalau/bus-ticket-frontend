import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowRight, Clock } from 'lucide-react';
import { useAvailableTrips, useAvailableTripSearch } from '@/hooks/queries/useTrips';
import { useLocations } from '@/hooks/queries/useLocations';
import { useSeatTypes } from '@/hooks/queries/useSeatTypes';
import { useBuses } from '@/hooks/queries/useBuses';
import type { SearchTrip } from '@/types/trip';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';

const timeSlots = [
  { label: 'Mañana', value: 'morning', icon: '🌅' },
  { label: 'Tarde', value: 'afternoon', icon: '☀️' },
  { label: 'Noche', value: 'night', icon: '🌙' },
];

const BS_AS_TIMEZONE = 'America/Argentina/Buenos_Aires';

function getBuenosAiresDateString(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BS_AS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function buildBsAsDateTime(baseDate: string, hour: string, minute = '00', second = '00') {
  const [year, month, day] = baseDate.split('-').map(Number);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}-03:00`;
}

function parseDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('es-AR', {
      timeZone: BS_AS_TIMEZONE,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

function parseTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('es-AR', {
      timeZone: BS_AS_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
  } catch {
    return '';
  }
}

function parseUtcTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }).format(d);
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

function getTimeSlotForTrip(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const hour = new Intl.DateTimeFormat('en-GB', {
      timeZone: BS_AS_TIMEZONE,
      hour: 'numeric',
      hour12: false,
    }).format(d);
    const hourNumber = Number(hour);
    if (hourNumber >= 0 && hourNumber < 12) return 'morning';
    if (hourNumber >= 12 && hourNumber < 18) return 'afternoon';
    return 'night';
  } catch {
    return '';
  }
}

export default function TripExplorer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(0);

  const [departureDate, setDepartureDate] = useState<string>(searchParams.get('date') || '');
  const [filters, setFilters] = useState<SearchTrip>({
    locationOriginId: searchParams.get('origin') ? Number(searchParams.get('origin')) : undefined,
    locationDestinationId: searchParams.get('destination') ? Number(searchParams.get('destination')) : undefined,
    startBasePrice: undefined,
    endBasePrice: undefined,
    busId: undefined,
    seatTypeId: undefined,
  });

  const [timeFilter, setTimeFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'departure'>('departure');

  const { data: locationsData } = useLocations();
  const locations = locationsData?.data?.data?.content || [];

  const { data: seatTypesData } = useSeatTypes();
  const seatTypes = seatTypesData?.data?.data?.content || [];

  const { data: busesData } = useBuses();
  const buses = busesData?.data?.data?.content || [];

  const searchFilters = useMemo<SearchTrip>(() => {
    const f: SearchTrip = { ...filters };
    const effectiveDate = departureDate || getBuenosAiresDateString();

    if (timeFilter) {
      if (timeFilter === 'morning') {
        f.startDepartureDate = buildBsAsDateTime(effectiveDate, '00');
        f.endDepartureDate = buildBsAsDateTime(effectiveDate, '11', '59', '59');
      } else if (timeFilter === 'afternoon') {
        f.startDepartureDate = buildBsAsDateTime(effectiveDate, '12');
        f.endDepartureDate = buildBsAsDateTime(effectiveDate, '17', '59', '59');
      } else if (timeFilter === 'night') {
        f.startDepartureDate = buildBsAsDateTime(effectiveDate, '18');
        f.endDepartureDate = buildBsAsDateTime(effectiveDate, '23', '59', '59');
      }
    } else if (departureDate) {
      f.startDepartureDate = buildBsAsDateTime(effectiveDate, '00');
      f.endDepartureDate = buildBsAsDateTime(effectiveDate, '23', '59', '59');
    }

    return f;
  }, [filters, departureDate, timeFilter]);

  const hasActiveFilters = useMemo(() => {
    return (
      departureDate !== '' ||
      timeFilter !== '' ||
      filters.startBasePrice !== undefined ||
      filters.endBasePrice !== undefined ||
      filters.busId !== undefined ||
      filters.locationOriginId !== undefined ||
      filters.locationDestinationId !== undefined ||
      filters.seatTypeId !== undefined
    );
  }, [departureDate, timeFilter, filters]);

  const defaultTripsQuery = useAvailableTrips(page, 10);
  const searchTripsQuery = useAvailableTripSearch(searchFilters, page, 10);

  const query = timeFilter && !departureDate ? defaultTripsQuery : hasActiveFilters ? searchTripsQuery : defaultTripsQuery;
  const { data, isLoading, isError, error } = query;
  const errorMessage = isError ? (error as { message?: string })?.message || 'Error al cargar viajes' : undefined;

  const trips = useMemo(() => {
    const content = data?.data?.data?.content || [];
    const filtered = timeFilter && !departureDate
      ? content.filter((trip) => getTimeSlotForTrip(trip.departureDate) === timeFilter)
      : content;
    const sorted = [...filtered];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.basePrice - b.basePrice);
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.basePrice - a.basePrice);
    else sorted.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
    return sorted;
  }, [data, sortBy, departureDate, timeFilter]);

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
                <label className="mb-1 block text-xs font-medium text-gray-600">Bus</label>
                <select
                  value={filters.busId || ''}
                  onChange={(e) => setFilters({ ...filters, busId: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#c60001] focus:outline-none"
                >
                  <option value="">Todos</option>
                  {buses.map((bus) => (
                    <option key={bus.id} value={bus.id}>{bus.plateNumber}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Fecha</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
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
                        <span className="text-xs text-gray-500">
                          UTC {parseUtcTime(trip.departureDate)} → {parseUtcTime(trip.arrivalDate)}
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

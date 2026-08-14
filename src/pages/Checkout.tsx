import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTrip, useTripSeats } from '@/hooks/queries/useTrips';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ticketService } from '@/services/ticket.service';
import SeatMap from '@/components/SeatMap';
import { getApiError } from '@/utils/apiErrors';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ArrowRight, CreditCard, MapPin, Clock, Bus, AlertCircle } from 'lucide-react';
import type { SeatAvailability } from '@/types/seat';

function parseDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function formatCvv(value: string) {
  return value.replace(/\D/g, '').slice(0, 4);
}

function validateCardNumber(value: string) {
  if (!value.trim()) return 'Campo obligatorio';
  if (!/^\d{16}$/.test(value.replace(/\D/g, ''))) return 'Número de tarjeta inválido (16 dígitos)';
  return undefined;
}

function validateExpiry(value: string) {
  if (!value.trim()) return 'Campo obligatorio';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return 'Formato MM/AA inválido';
  const [month, year] = value.split('/').map(Number);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = Number(String(now.getFullYear()).slice(-2));
  if (year < currentYear || (year === currentYear && month < currentMonth)) return 'La tarjeta está vencida';
  return undefined;
}

function validateCvv(value: string) {
  if (!value.trim()) return 'Campo obligatorio';
  if (!/^\d{3,4}$/.test(value)) return 'El CVV debe tener 3 o 4 dígitos';
  return undefined;
}

export default function Checkout() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { showToast } = useToast();

  const { data: tripData, isLoading: tripLoading } = useTrip(Number(tripId));
  const { data: seatsData, isLoading: seatsLoading } = useTripSeats(Number(tripId));

  const [selectedSeats, setSelectedSeats] = useState<SeatAvailability[]>([]);
  const [booking, setBooking] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<{ cardNumber?: string; expiry?: string; cvv?: string }>({});
  const [paymentErrorShown, setPaymentErrorShown] = useState(false);
  const paymentRef = useRef<HTMLDivElement>(null);
  const cardNumberInputRef = useRef<HTMLInputElement>(null);
  const expiryInputRef = useRef<HTMLInputElement>(null);
  const cvvInputRef = useRef<HTMLInputElement>(null);

  const trip = tripData?.data?.data;
  const seats = seatsData?.data?.data || [];

  const finalPrice = trip
    ? trip.basePrice * selectedSeats.length + selectedSeats.reduce((sum, seat) => sum + seat.seatTypeUpcharge, 0)
    : 0;

  const toggleSeat = (seat: SeatAvailability) => {
    setSelectedSeats((prev) =>
      prev.some((s) => s.id === seat.id) ? prev.filter((s) => s.id !== seat.id) : [...prev, seat]
    );
  };

  const handleBook = async () => {
    if (!trip || selectedSeats.length === 0 || !user) return;

    const newErrors: { cardNumber?: string; expiry?: string; cvv?: string } = {};
    const cardNumberError = validateCardNumber(cardNumber);
    const expiryError = validateExpiry(expiry);
    const cvvError = validateCvv(cvv);
    if (cardNumberError) newErrors.cardNumber = cardNumberError;
    if (expiryError) newErrors.expiry = expiryError;
    if (cvvError) newErrors.cvv = cvvError;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setPaymentErrorShown(true);
      paymentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        if (newErrors.cardNumber) cardNumberInputRef.current?.focus();
        else if (newErrors.expiry) expiryInputRef.current?.focus();
        else if (newErrors.cvv) cvvInputRef.current?.focus();
      }, 200);
      return;
    }

    setBooking(true);
    try {
      const results = await Promise.allSettled(
        selectedSeats.map((seat) =>
          ticketService.create({ userId: user.id, tripId: trip.id, seatId: seat.id })
        )
      );

      const fulfilled = results
        .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof ticketService.create>>> => r.status === 'fulfilled')
        .map((r) => r.value.data.data);
      const failed = results.filter((r) => r.status === 'rejected');

      if (fulfilled.length > 0) {
        queryClient.setQueriesData(
          { queryKey: ['tickets'] },
          (oldData: unknown) => {
            if (!oldData || typeof oldData !== 'object') return oldData;

            const responseData = oldData as {
              data?: {
                data?: {
                  content?: Array<{ id: number }>;
                  totalElements?: number;
                };
              };
            };

            const pageData = responseData.data?.data;
            if (!pageData?.content) return oldData;

            const existingIds = new Set(pageData.content.map((ticket) => ticket.id));
            const newTickets = fulfilled.filter((ticket) => !existingIds.has(ticket.id));

            if (newTickets.length === 0) return oldData;

            return {
              ...responseData,
              data: {
                ...responseData.data,
                data: {
                  ...pageData,
                  content: [...newTickets, ...pageData.content],
                  totalElements: (pageData.totalElements ?? pageData.content.length) + newTickets.length,
                },
              },
            };
          },
        );
      }

      queryClient.invalidateQueries({ queryKey: ['trip', trip.id, 'seats'] });

      if (failed.length === 0) {
        showToast('¡Ticket comprado con éxito!', 'success');
        navigate('/perfil', { state: { activeTab: 'tickets' } });
      } else {
        showToast(`${fulfilled.length} asiento(s) comprados, ${failed.length} fallaron. Verificá disponibilidad.`, 'error');
      }
    } catch (err: unknown) {
      const msg = getApiError(err, 'Error al comprar ticket');
      showToast(msg, 'error');
      queryClient.invalidateQueries({ queryKey: ['trip', trip?.id, 'seats'] });
    } finally {
      setBooking(false);
    }
  };

  if (tripLoading || seatsLoading) return <Spinner />;

  if (!trip) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p>Viaje no encontrado.</p>
        <Button variant="ghost" onClick={() => navigate('/viajes')} className="mt-4">Volver a buscar</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Comprar Ticket</h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Seleccioná tus asientos</h2>
            <SeatMap
              seats={seats}
              selectedSeatIds={selectedSeats.map((seat) => seat.id)}
              onSelectSeat={toggleSeat}
            />
          </Card>

          {selectedSeats.length > 0 && (
            <Card className="mt-4 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <CreditCard className="h-5 w-5" /> Pago Simulado
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                Este es un proyecto universitario. El pago es simulado.
              </p>
              {paymentErrorShown && (errors.cardNumber || errors.expiry || errors.cvv) && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  Completá los campos de pago
                </div>
              )}
              <div className="space-y-3" ref={paymentRef}>
                <div>
                  <label className="text-sm font-medium text-gray-700">Número de Tarjeta</label>
                  <input
                    type="text"
                    value={cardNumber}
                    ref={cardNumberInputRef}
                    onChange={(e) => {
                      setCardNumber(formatCardNumber(e.target.value));
                      if (errors.cardNumber) setErrors({ ...errors, cardNumber: undefined });
                      setPaymentErrorShown(false);
                    }}
                    placeholder="4242 4242 4242 4242"
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
                      errors.cardNumber
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-gray-300 focus:border-[#c60001] focus:ring-1 focus:ring-[#c60001]'
                    }`}
                    maxLength={19}
                    required
                  />
                  {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Vencimiento</label>
                    <input
                      type="text"
                    value={expiry}
                    ref={expiryInputRef}
                    onChange={(e) => {
                      setExpiry(formatExpiry(e.target.value));
                      if (errors.expiry) setErrors({ ...errors, expiry: undefined });
                      setPaymentErrorShown(false);
                    }}
                      placeholder="MM/AA"
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
                        errors.expiry
                          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-gray-300 focus:border-[#c60001] focus:ring-1 focus:ring-[#c60001]'
                      }`}
                      maxLength={5}
                      required
                    />
                    {errors.expiry && <p className="mt-1 text-xs text-red-500">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                    value={cvv}
                    ref={cvvInputRef}
                    onChange={(e) => {
                      setCvv(formatCvv(e.target.value));
                      if (errors.cvv) setErrors({ ...errors, cvv: undefined });
                      setPaymentErrorShown(false);
                    }}
                      placeholder="123"
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
                        errors.cvv
                          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-gray-300 focus:border-[#c60001] focus:ring-1 focus:ring-[#c60001]'
                      }`}
                      maxLength={4}
                      required
                    />
                    {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="w-full shrink-0 lg:w-80">
          <Card className="sticky top-24 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Resumen del Viaje</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-4 w-4 text-[#c60001]" />
                <span className="font-medium">{trip.locationOrigin.cityName}</span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
                <span className="font-medium">{trip.locationDestination.cityName}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                {parseDate(trip.departureDate)}
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Bus className="h-4 w-4" />
                Bus {trip.bus.plateNumber}
              </div>

              {selectedSeats.length > 0 && (
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Asientos seleccionados ({selectedSeats.length})</p>
                  <div className="mt-1 space-y-1">
                    {selectedSeats.map((seat) => (
                      <div key={seat.id} className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {seat.letter}{seat.number} — {seat.seatTypeName}
                        </span>
                        <span className="text-xs text-gray-600">
                          +${seat.seatTypeUpcharge.toLocaleString('es-AR')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Precio base × {Math.max(selectedSeats.length, 1)}</span>
                <span>${(trip.basePrice * Math.max(selectedSeats.length, 1)).toLocaleString('es-AR')}</span>
              </div>
              {selectedSeats.length > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Recargos</span>
                  <span>+${selectedSeats.reduce((sum, seat) => sum + seat.seatTypeUpcharge, 0).toLocaleString('es-AR')}</span>
                </div>
              )}
              <div className="mt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[#c60001]">${finalPrice.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <Button
              onClick={handleBook}
              loading={booking}
              disabled={selectedSeats.length === 0}
              className="mt-4 w-full"
            >
              Confirmar y Pagar
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

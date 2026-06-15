import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrip, useTripSeats } from '@/hooks/queries/useTrips';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ticketService } from '@/services/ticket.service';
import SeatMap from '@/components/SeatMap';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ArrowRight, CreditCard, MapPin, Clock, Bus } from 'lucide-react';
import type { SeatAvailability } from '@/types/seat';

function parseDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

export default function Checkout() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const { data: tripData, isLoading: tripLoading } = useTrip(Number(tripId));
  const { data: seatsData, isLoading: seatsLoading } = useTripSeats(Number(tripId));

  const [selectedSeat, setSelectedSeat] = useState<SeatAvailability | null>(null);
  const [booking, setBooking] = useState(false);

  const trip = tripData?.data?.data;
  const seats = seatsData?.data?.data || [];

  const finalPrice = trip && selectedSeat
    ? trip.basePrice + selectedSeat.seatTypeUpcharge
    : trip?.basePrice || 0;

  const handleBook = async () => {
    if (!trip || !selectedSeat || !user) return;
    setBooking(true);
    try {
      await ticketService.create({
        userId: user.id,
        tripId: trip.id,
        seatId: selectedSeat.id,
      });
      showToast('¡Ticket comprado con éxito!', 'success');
      navigate('/perfil');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al comprar ticket';
      showToast(msg, 'error');
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
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Seleccioná tu asiento</h2>
            <SeatMap
              seats={seats}
              selectedSeatId={selectedSeat?.id ?? null}
              onSelectSeat={setSelectedSeat}
            />
          </Card>

          {selectedSeat && (
            <Card className="mt-4 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <CreditCard className="h-5 w-5" /> Pago Simulado
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                Este es un proyecto universitario. El pago es simulado.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Número de Tarjeta</label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#c60001] focus:outline-none"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Vencimiento</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#c60001] focus:outline-none"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#c60001] focus:outline-none"
                      maxLength={4}
                    />
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

              {selectedSeat && (
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Asiento seleccionado</p>
                  <p className="font-medium text-gray-900">
                    {selectedSeat.letter}{selectedSeat.number} — {selectedSeat.seatTypeName}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Precio base</span>
                <span>${trip.basePrice.toLocaleString('es-AR')}</span>
              </div>
              {selectedSeat && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Recargo ({selectedSeat.seatTypeName})</span>
                  <span>${selectedSeat.seatTypeUpcharge.toLocaleString('es-AR')}</span>
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
              disabled={!selectedSeat}
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

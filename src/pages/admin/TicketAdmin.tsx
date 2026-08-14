import { useState, type ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, Ban } from 'lucide-react';
import { ticketService } from '@/services/ticket.service';
import { useTickets } from '@/hooks/queries/useTickets';
import { getApiError } from '@/utils/apiErrors';
import { useTrips, useTripSeats } from '@/hooks/queries/useTrips';
import { useToast } from '@/context/ToastContext';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';
import type { TicketFull } from '@/types/ticket';

const DEPARTURE_BUFFER_MS = 24 * 60 * 60 * 1000;
const DEPARTURE_DEADLINE = Date.now() + DEPARTURE_BUFFER_MS;

function fmt(dateStr: string) {
  try { return new Date(dateStr).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch { return dateStr; }
}

const schema = z.object({
  tripId: z.number().min(1, 'Requerido'),
  seatId: z.number().min(1, 'Requerido'),
});

type FormData = z.infer<typeof schema>;

export default function TicketAdmin() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<TicketFull | null>(null);
  const [deleting, setDeleting] = useState<TicketFull | null>(null);
  const [cancelling, setCancelling] = useState<TicketFull | null>(null);

  const { data, isLoading } = useTickets(page);
  const tickets = data?.data?.data?.content || [];
  const totalPages = data?.data?.data?.totalPages || 0;

  const { data: tripsData } = useTrips(0, 100);
  const trips = tripsData?.data?.data?.content || [];

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedTripId = useWatch({ control, name: 'tripId' });
  const tripField = register('tripId', { valueAsNumber: true });
  const { data: tripSeatsData } = useTripSeats(selectedTripId);
  const tripSeats = tripSeatsData?.data?.data || [];

  const openEdit = (t: TicketFull) => {
    setEditing(t);
    reset({ tripId: t.trip.id, seatId: t.seat.id });
  };

  const onTripChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue('tripId', Number(e.target.value));
    setValue('seatId', 0);
  };

  const onSubmit = async (data: FormData) => {
    if (!editing) return;
    try {
      await ticketService.update({ id: editing.id, tripId: data.tripId, seatId: data.seatId });
      showToast('Ticket actualizado', 'success');
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    } catch (err: unknown) {
      const msg = getApiError(err, 'Error');
      showToast(msg, 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await ticketService.remove(deleting.id);
      showToast('Ticket eliminado', 'success');
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    } catch (err: unknown) {
      const msg = getApiError(err, 'Error');
      showToast(msg, 'error');
    }
  };

  const handleCancel = async () => {
    if (!cancelling) return;
    try {
      await ticketService.cancel(cancelling.id);
      showToast('Ticket cancelado', 'success');
      setCancelling(null);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    } catch (err: unknown) {
      const msg = getApiError(err, 'Error');
      showToast(msg, 'error');
    }
  };

  const futureTrips = trips.filter((t) => new Date(t.departureDate).getTime() > DEPARTURE_DEADLINE);
  const currentSeatId = editing?.seat.id;
  const seatOptions = tripSeats
    .filter((s) => s.isAvailable || s.id === currentSeatId)
    .map((s) => ({ value: s.id, label: `${s.letter}${s.number} (${s.seatTypeName})` }));

  const columns: Column<TicketFull>[] = [
    { header: 'ID', accessor: (r) => r.id },
    { header: 'Usuario', accessor: (r) => r.user?.email || '-' },
    { header: 'Ruta', accessor: (r) => `${r.trip?.id || '-'}` },
    { header: 'Asiento', accessor: (r) => r.seat ? `${r.seat.letter}${r.seat.number}` : '-' },
    { header: 'Precio Final', accessor: (r) => `$${r.finalPrice.toLocaleString('es-AR')}` },
    { header: 'Estado', accessor: (r) => <Badge variant={r.isCancelled ? 'danger' : 'success'}>{r.isCancelled ? 'Cancelado' : 'Activo'}</Badge> },
    { header: 'Fecha', accessor: (r) => fmt(r.bookingTime) },
  ];

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={tickets} loading={isLoading} emptyMessage="No hay tickets"
        actions={(row) => (
          <div className="flex gap-1 justify-end">
            {!row.isCancelled && (
              <>
                <Button variant="ghost" size="sm" onClick={() => openEdit(row)} title="Editar">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setCancelling(row)} title="Cancelar">
                  <Ban className="h-4 w-4 text-yellow-600" />
                </Button>
              </>
            )}
            <Button variant="danger" size="sm" onClick={() => setDeleting(row)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={`Editar Ticket #${editing?.id ?? ''}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-sm text-gray-600">Usuario: <span className="font-medium">{editing?.user?.email || '-'}</span></p>
          <Select label="Viaje" options={futureTrips.map((t) => ({ value: t.id, label: `${t.locationOrigin.cityName} → ${t.locationDestination.cityName} (${fmt(t.departureDate)})` }))} placeholder="Seleccionar" error={errors.tripId?.message} {...tripField} value={selectedTripId || ''} onChange={onTripChange} />
          <Select label="Asiento" options={seatOptions} placeholder="Seleccionar" error={errors.seatId?.message} {...register('seatId', { valueAsNumber: true })} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!cancelling} onClose={() => setCancelling(null)} title="Cancelar Ticket">
        <p className="text-sm text-gray-600">¿Cancelar ticket #{cancelling?.id}?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setCancelling(null)}>Volver</Button>
          <Button variant="danger" onClick={handleCancel}>Cancelar Ticket</Button>
        </div>
      </Modal>

      <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Eliminar Ticket">
        <p className="text-sm text-gray-600">¿Eliminar ticket #{deleting?.id}?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}

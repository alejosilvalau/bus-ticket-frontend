import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { tripService } from '@/services/trip.service';
import { useTrips } from '@/hooks/queries/useTrips';
import { useBuses } from '@/hooks/queries/useBuses';
import { useDrivers } from '@/hooks/queries/useDrivers';
import { useLocations } from '@/hooks/queries/useLocations';
import { useToast } from '@/context/ToastContext';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import type { TripFull } from '@/types/trip';

function fmt(dateStr: string) {
  try { return new Date(dateStr).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch { return dateStr; }
}

const schema = z.object({
  departureDate: z.string().min(1, 'Requerido'),
  arrivalDate: z.string().min(1, 'Requerido'),
  basePrice: z.number().min(0, 'Mínimo 0'),
  busId: z.number().min(1, 'Requerido'),
  driverId: z.number().min(1, 'Requerido'),
  locationOriginId: z.number().min(1, 'Requerido'),
  locationDestinationId: z.number().min(1, 'Requerido'),
});

type FormData = z.infer<typeof schema>;

export default function TripAdmin() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TripFull | null>(null);
  const [deleting, setDeleting] = useState<TripFull | null>(null);

  const { data, isLoading } = useTrips(page);
  const trips = data?.data?.data?.content || [];
  const totalPages = data?.data?.data?.totalPages || 0;

  const { data: busesData } = useBuses(0, 100);
  const buses = busesData?.data?.data?.content || [];
  const { data: driversData } = useDrivers(0, 100);
  const drivers = driversData?.data?.data?.content || [];
  const { data: locsData } = useLocations(0, 100);
  const locations = locsData?.data?.data?.content || [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const toLocalDatetime = (z: string) => {
    try { return new Date(z).toISOString().slice(0, 16); } catch { return ''; }
  };

  const openCreate = () => {
    setEditing(null);
    reset({ departureDate: '', arrivalDate: '', basePrice: 0, busId: 0, driverId: 0, locationOriginId: 0, locationDestinationId: 0 });
    setModalOpen(true);
  };
  const openEdit = (t: TripFull) => {
    setEditing(t);
    reset({
      departureDate: toLocalDatetime(t.departureDate),
      arrivalDate: toLocalDatetime(t.arrivalDate),
      basePrice: t.basePrice,
      busId: t.bus.id,
      driverId: t.driver.id,
      locationOriginId: t.locationOrigin.id,
      locationDestinationId: t.locationDestination.id,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        departureDate: new Date(data.departureDate).toISOString(),
        arrivalDate: new Date(data.arrivalDate).toISOString(),
      };
      if (editing) {
        await tripService.update({ id: editing.id, ...payload });
        showToast('Viaje actualizado', 'success');
      } else {
        await tripService.create(payload);
        showToast('Viaje creado', 'success');
      }
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error';
      showToast(msg, 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await tripService.remove(deleting.id);
      showToast('Viaje eliminado', 'success');
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error';
      showToast(msg, 'error');
    }
  };

  const columns: Column<TripFull>[] = [
    { header: 'ID', accessor: (r) => r.id },
    { header: 'Ruta', accessor: (r) => `${r.locationOrigin.cityName} → ${r.locationDestination.cityName}` },
    { header: 'Salida', accessor: (r) => fmt(r.departureDate) },
    { header: 'Llegada', accessor: (r) => fmt(r.arrivalDate) },
    { header: 'Precio', accessor: (r) => `$${r.basePrice.toLocaleString('es-AR')}` },
    { header: 'Bus', accessor: (r) => r.bus.plateNumber },
    { header: 'Chofer', accessor: (r) => `${r.driver.firstName} ${r.driver.lastName}` },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Crear Viaje</Button>
      </div>

      <DataTable columns={columns} data={trips} loading={isLoading} emptyMessage="No hay viajes"
        actions={(row) => (
          <div className="flex gap-1 justify-end">
            <Button variant="ghost" size="sm" onClick={() => openEdit(row)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="danger" size="sm" onClick={() => setDeleting(row)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        )}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Viaje' : 'Crear Viaje'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Fecha Salida" type="datetime-local" error={errors.departureDate?.message} {...register('departureDate')} />
            <Input label="Fecha Llegada" type="datetime-local" error={errors.arrivalDate?.message} {...register('arrivalDate')} />
          </div>
          <Input label="Precio Base" type="number" error={errors.basePrice?.message} {...register('basePrice', { valueAsNumber: true })} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Bus" options={buses.map((b) => ({ value: b.id, label: b.plateNumber }))} placeholder="Seleccionar" error={errors.busId?.message} {...register('busId', { valueAsNumber: true })} />
            <Select label="Chofer" options={drivers.map((d) => ({ value: d.id, label: `${d.firstName} ${d.lastName}` }))} placeholder="Seleccionar" error={errors.driverId?.message} {...register('driverId', { valueAsNumber: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Origen" options={locations.map((l) => ({ value: l.id, label: `${l.cityName}, ${l.state}` }))} placeholder="Seleccionar" error={errors.locationOriginId?.message} {...register('locationOriginId', { valueAsNumber: true })} />
            <Select label="Destino" options={locations.map((l) => ({ value: l.id, label: `${l.cityName}, ${l.state}` }))} placeholder="Seleccionar" error={errors.locationDestinationId?.message} {...register('locationDestinationId', { valueAsNumber: true })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Eliminar Viaje">
        <p className="text-sm text-gray-600">¿Eliminar viaje #{deleting?.id}?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}

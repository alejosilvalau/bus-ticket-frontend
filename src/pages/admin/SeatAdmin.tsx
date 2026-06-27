import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { seatService } from '@/services/seat.service';
import { useSeats } from '@/hooks/queries/useSeats';
import { useBuses } from '@/hooks/queries/useBuses';
import { useSeatTypes } from '@/hooks/queries/useSeatTypes';
import { useToast } from '@/context/ToastContext';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import type { SeatFull } from '@/types/seat';

const schema = z.object({
  letter: z.string().min(1, 'Requerido').max(1),
  number: z.number().min(1, 'Mínimo 1'),
  busId: z.number().min(1, 'Requerido'),
  seatTypeId: z.number().min(1, 'Requerido'),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function SeatAdmin() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SeatFull | null>(null);
  const [deleting, setDeleting] = useState<SeatFull | null>(null);

  const { data, isLoading } = useSeats(page);
  const seats = data?.data?.data?.content || [];
  const totalPages = data?.data?.data?.totalPages || 0;

  const { data: busesData } = useBuses(0, 100);
  const buses = busesData?.data?.data?.content || [];
  const { data: seatTypesData } = useSeatTypes(0, 100);
  const seatTypes = seatTypesData?.data?.data?.content || [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => { setEditing(null); reset({ letter: '', number: 1, busId: 0, seatTypeId: 0, isActive: true }); setModalOpen(true); };
  const openEdit = (s: SeatFull) => { setEditing(s); reset({ letter: s.letter, number: s.number, busId: s.bus.id, seatTypeId: s.seatType.id, isActive: s.isActive }); setModalOpen(true); };

  const onSubmit = async (data: FormData) => {
    try {
      if (editing) {
        await seatService.update({ id: editing.id, ...data });
        showToast('Asiento actualizado', 'success');
      } else {
        await seatService.create(data);
        showToast('Asiento creado', 'success');
      }
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['seats'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error';
      showToast(msg, 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await seatService.remove(deleting.id);
      showToast('Asiento eliminado', 'success');
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: ['seats'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error';
      showToast(msg, 'error');
    }
  };

  const columns: Column<SeatFull>[] = [
    { header: 'ID', accessor: (r) => r.id },
    { header: 'Asiento', accessor: (r) => `${r.letter}${r.number}` },
    { header: 'Bus', accessor: (r) => r.bus.plateNumber },
    { header: 'Tipo', accessor: (r) => r.seatType.name },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Crear Asiento</Button>
      </div>

      <DataTable columns={columns} data={seats} loading={isLoading} emptyMessage="No hay asientos"
        actions={(row) => (
          <div className="flex gap-1 justify-end">
            <Button variant="ghost" size="sm" onClick={() => openEdit(row)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="danger" size="sm" onClick={() => setDeleting(row)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        )}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Asiento' : 'Crear Asiento'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Letra" error={errors.letter?.message} {...register('letter')} maxLength={1} />
            <Input label="Número" type="number" error={errors.number?.message} {...register('number', { valueAsNumber: true })} />
          </div>
          <Select
            label="Bus"
            options={buses.map((b) => ({ value: b.id, label: `${b.plateNumber} (cap: ${b.totalCapacity})` }))}
            placeholder="Seleccionar bus"
            error={errors.busId?.message}
            {...register('busId', { valueAsNumber: true })}
          />
          <Select
            label="Tipo de Asiento"
            options={seatTypes.map((st) => ({ value: st.id, label: `${st.name} (+$${st.upcharge})` }))}
            placeholder="Seleccionar tipo"
            error={errors.seatTypeId?.message}
            {...register('seatTypeId', { valueAsNumber: true })}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Eliminar Asiento">
        <p className="text-sm text-gray-600">¿Eliminar asiento {deleting?.letter}{deleting?.number}?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}

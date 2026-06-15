import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { busService } from '@/services/bus.service';
import { useBuses } from '@/hooks/queries/useBuses';
import { useToast } from '@/context/ToastContext';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';
import type { Bus } from '@/types/bus';

const schema = z.object({
  plateNumber: z.string().min(1, 'Requerido').max(20),
  totalCapacity: z.number().min(1, 'Mínimo 1'),
  isActive: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function BusAdmin() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Bus | null>(null);
  const [deleting, setDeleting] = useState<Bus | null>(null);

  const { data, isLoading } = useBuses(page);
  const buses = data?.data?.data?.content || [];
  const totalPages = data?.data?.data?.totalPages || 0;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => { setEditing(null); reset({ plateNumber: '', totalCapacity: 40 }); setModalOpen(true); };
  const openEdit = (b: Bus) => { setEditing(b); reset({ plateNumber: b.plateNumber, totalCapacity: b.totalCapacity, isActive: b.isActive }); setModalOpen(true); };

  const onSubmit = async (data: FormData) => {
    try {
      if (editing) {
        await busService.update({ id: editing.id, ...data });
        showToast('Autobús actualizado', 'success');
      } else {
        await busService.create(data);
        showToast('Autobús creado', 'success');
      }
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['buses'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error';
      showToast(msg, 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await busService.remove(deleting.id);
      showToast('Autobús eliminado', 'success');
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: ['buses'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error';
      showToast(msg, 'error');
    }
  };

  const columns: Column<Bus>[] = [
    { header: 'ID', accessor: (r) => r.id },
    { header: 'Patente', accessor: (r) => r.plateNumber },
    { header: 'Capacidad', accessor: (r) => r.totalCapacity },
    { header: 'Estado', accessor: (r) => <Badge variant={r.isActive ? 'success' : 'danger'}>{r.isActive ? 'Activo' : 'Inactivo'}</Badge> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Crear Autobús</Button>
      </div>

      <DataTable columns={columns} data={buses} loading={isLoading} emptyMessage="No hay autobuses"
        actions={(row) => (
          <div className="flex gap-1 justify-end">
            <Button variant="ghost" size="sm" onClick={() => openEdit(row)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="danger" size="sm" onClick={() => setDeleting(row)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        )}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Autobús' : 'Crear Autobús'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Patente" error={errors.plateNumber?.message} {...register('plateNumber')} />
          <Input label="Capacidad Total" type="number" error={errors.totalCapacity?.message} {...register('totalCapacity', { valueAsNumber: true })} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Eliminar Autobús">
        <p className="text-sm text-gray-600">¿Eliminar autobús {deleting?.plateNumber}?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { locationService } from '@/services/location.service';
import { useLocations } from '@/hooks/queries/useLocations';
import { useToast } from '@/context/ToastContext';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import type { Location } from '@/types/location';

const schema = z.object({
  cityName: z.string().min(1, 'Requerido').max(100),
  state: z.string().min(1, 'Requerido').max(100),
  postalCode: z.string().min(1, 'Requerido').max(20),
});

type FormData = z.infer<typeof schema>;

export default function LocationAdmin() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [deleting, setDeleting] = useState<Location | null>(null);

  const { data, isLoading } = useLocations(page);
  const locations = data?.data?.data?.content || [];
  const totalPages = data?.data?.data?.totalPages || 0;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => { setEditing(null); reset({ cityName: '', state: '', postalCode: '' }); setModalOpen(true); };
  const openEdit = (l: Location) => { setEditing(l); reset({ cityName: l.cityName, state: l.state, postalCode: l.postalCode }); setModalOpen(true); };

  const onSubmit = async (data: FormData) => {
    try {
      if (editing) {
        await locationService.update({ id: editing.id, ...data });
        showToast('Ubicación actualizada', 'success');
      } else {
        await locationService.create(data);
        showToast('Ubicación creada', 'success');
      }
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error';
      showToast(msg, 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await locationService.remove(deleting.id);
      showToast('Ubicación eliminada', 'success');
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error';
      showToast(msg, 'error');
    }
  };

  const columns: Column<Location>[] = [
    { header: 'ID', accessor: (r) => r.id },
    { header: 'Ciudad', accessor: (r) => r.cityName },
    { header: 'Estado', accessor: (r) => r.state },
    { header: 'Código Postal', accessor: (r) => r.postalCode },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Crear Ubicación</Button>
      </div>

      <DataTable columns={columns} data={locations} loading={isLoading} emptyMessage="No hay ubicaciones"
        actions={(row) => (
          <div className="flex gap-1 justify-end">
            <Button variant="ghost" size="sm" onClick={() => openEdit(row)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="danger" size="sm" onClick={() => setDeleting(row)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        )}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Ubicación' : 'Crear Ubicación'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Ciudad" error={errors.cityName?.message} {...register('cityName')} />
          <Input label="Estado" error={errors.state?.message} {...register('state')} />
          <Input label="Código Postal" error={errors.postalCode?.message} {...register('postalCode')} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Eliminar Ubicación">
        <p className="text-sm text-gray-600">¿Eliminar {deleting?.cityName}, {deleting?.state}?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}

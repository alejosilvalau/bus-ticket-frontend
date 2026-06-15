import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { seatTypeService } from '@/services/seat-type.service';
import { useSeatTypes } from '@/hooks/queries/useSeatTypes';
import { useToast } from '@/context/ToastContext';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import type { SeatType } from '@/types/seat-type';

const schema = z.object({
  name: z.string().min(1, 'Requerido').max(50),
  upcharge: z.number().min(0, 'Mínimo 0'),
});

type FormData = z.infer<typeof schema>;

export default function SeatTypeAdmin() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SeatType | null>(null);
  const [deleting, setDeleting] = useState<SeatType | null>(null);

  const { data, isLoading } = useSeatTypes(page);
  const seatTypes = data?.data?.data?.content || [];
  const totalPages = data?.data?.data?.totalPages || 0;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => { setEditing(null); reset({ name: '', upcharge: 0 }); setModalOpen(true); };
  const openEdit = (st: SeatType) => { setEditing(st); reset({ name: st.name, upcharge: st.upcharge }); setModalOpen(true); };

  const onSubmit = async (data: FormData) => {
    try {
      if (editing) {
        await seatTypeService.update({ id: editing.id, ...data });
        showToast('Tipo de asiento actualizado', 'success');
      } else {
        await seatTypeService.create(data);
        showToast('Tipo de asiento creado', 'success');
      }
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['seatTypes'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error';
      showToast(msg, 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await seatTypeService.remove(deleting.id);
      showToast('Tipo de asiento eliminado', 'success');
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: ['seatTypes'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error';
      showToast(msg, 'error');
    }
  };

  const columns: Column<SeatType>[] = [
    { header: 'ID', accessor: (r) => r.id },
    { header: 'Nombre', accessor: (r) => r.name },
    { header: 'Recargo', accessor: (r) => `$${r.upcharge.toLocaleString('es-AR')}` },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Crear Tipo</Button>
      </div>

      <DataTable columns={columns} data={seatTypes} loading={isLoading} emptyMessage="No hay tipos de asiento"
        actions={(row) => (
          <div className="flex gap-1 justify-end">
            <Button variant="ghost" size="sm" onClick={() => openEdit(row)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="danger" size="sm" onClick={() => setDeleting(row)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        )}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Tipo' : 'Crear Tipo'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nombre" error={errors.name?.message} {...register('name')} />
          <Input label="Recargo" type="number" error={errors.upcharge?.message} {...register('upcharge', { valueAsNumber: true })} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Eliminar Tipo">
        <p className="text-sm text-gray-600">¿Eliminar tipo "{deleting?.name}"?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}

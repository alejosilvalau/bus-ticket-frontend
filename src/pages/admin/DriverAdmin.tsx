import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { driverService } from '@/services/driver.service';
import { useDrivers } from '@/hooks/queries/useDrivers';
import { useToast } from '@/context/ToastContext';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';
import type { Driver } from '@/types/driver';

const schema = z.object({
  firstName: z.string().min(1, 'Requerido').max(100),
  lastName: z.string().min(1, 'Requerido').max(100),
  licenseNumber: z.string().min(1, 'Requerido').max(50),
  phoneNumber: z.string().min(1, 'Requerido').regex(/^\+?[0-9\s-]{7,20}$/, 'Teléfono inválido'),
  isActive: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function DriverAdmin() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Driver | null>(null);
  const [deleting, setDeleting] = useState<Driver | null>(null);

  const { data, isLoading } = useDrivers(page);
  const drivers = data?.data?.data?.content || [];
  const totalPages = data?.data?.data?.totalPages || 0;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => { setEditing(null); reset({ firstName: '', lastName: '', licenseNumber: '', phoneNumber: '' }); setModalOpen(true); };
  const openEdit = (d: Driver) => { setEditing(d); reset({ firstName: d.firstName, lastName: d.lastName, licenseNumber: d.licenseNumber, phoneNumber: d.phoneNumber, isActive: d.isActive }); setModalOpen(true); };

  const onSubmit = async (data: FormData) => {
    try {
      if (editing) {
        await driverService.update({ id: editing.id, ...data });
        showToast('Chofer actualizado', 'success');
      } else {
        await driverService.create(data);
        showToast('Chofer creado', 'success');
      }
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error';
      showToast(msg, 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await driverService.remove(deleting.id);
      showToast('Chofer eliminado', 'success');
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error';
      showToast(msg, 'error');
    }
  };

  const columns: Column<Driver>[] = [
    { header: 'ID', accessor: (r) => r.id },
    { header: 'Nombre', accessor: (r) => `${r.firstName} ${r.lastName}` },
    { header: 'Licencia', accessor: (r) => r.licenseNumber },
    { header: 'Teléfono', accessor: (r) => r.phoneNumber },
    { header: 'Estado', accessor: (r) => <Badge variant={r.isActive ? 'success' : 'danger'}>{r.isActive ? 'Activo' : 'Inactivo'}</Badge> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Crear Chofer</Button>
      </div>

      <DataTable
        columns={columns}
        data={drivers}
        loading={isLoading}
        emptyMessage="No hay choferes"
        actions={(row) => (
          <div className="flex gap-1 justify-end">
            <Button variant="ghost" size="sm" onClick={() => openEdit(row)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="danger" size="sm" onClick={() => setDeleting(row)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        )}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Chofer' : 'Crear Chofer'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Apellido" error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <Input label="Licencia" error={errors.licenseNumber?.message} {...register('licenseNumber')} />
          <Input label="Teléfono" error={errors.phoneNumber?.message} {...register('phoneNumber')} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Eliminar Chofer">
        <p className="text-sm text-gray-600">¿Estás seguro de eliminar a {deleting?.firstName} {deleting?.lastName}?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2, Ban } from 'lucide-react';
import { ticketService } from '@/services/ticket.service';
import { useTickets } from '@/hooks/queries/useTickets';
import { useToast } from '@/context/ToastContext';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';
import type { TicketFull } from '@/types/ticket';

function fmt(dateStr: string) {
  try { return new Date(dateStr).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch { return dateStr; }
}

export default function TicketAdmin() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [deleting, setDeleting] = useState<TicketFull | null>(null);
  const [cancelling, setCancelling] = useState<TicketFull | null>(null);

  const { data, isLoading } = useTickets(page);
  const tickets = data?.data?.data?.content || [];
  const totalPages = data?.data?.data?.totalPages || 0;

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await ticketService.remove(deleting.id);
      showToast('Ticket eliminado', 'success');
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error';
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
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error';
      showToast(msg, 'error');
    }
  };

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
              <Button variant="ghost" size="sm" onClick={() => setCancelling(row)} title="Cancelar">
                <Ban className="h-4 w-4 text-yellow-600" />
              </Button>
            )}
            <Button variant="danger" size="sm" onClick={() => setDeleting(row)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

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

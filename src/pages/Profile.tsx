import { useState } from 'react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import QRCode from 'react-qr-code';
import { useLocation } from 'react-router-dom';
import * as QRCodeGenerator from 'qrcode';
import { jsPDF } from 'jspdf';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { profileService } from '@/services/profile.service';
import { authService } from '@/services/auth.service';
import { useTicketSearch } from '@/hooks/queries/useTickets';
import { ticketService } from '@/services/ticket.service';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import { User, Lock, Ticket, QrCode } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import type { TicketFull } from '@/types/ticket';

const profileSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido').max(100),
  lastName: z.string().min(1, 'El apellido es requerido').max(100),
  email: z.email('Email inválido'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/(?=.*[a-z])/, 'Debe contener al menos una minúscula')
    .regex(/(?=.*[A-Z])/, 'Debe contener al menos una mayúscula')
    .regex(/(?=.*\d)/, 'Debe contener al menos un número')
    .regex(/(?=.*[@$!%*?&])/, 'Debe contener al menos un carácter especial'),
});

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

function parseDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

const TicketQRCode = QRCode as unknown as FC<{ value: string; size: number }>;

function addTicketText(doc: jsPDF, label: string, value: string, x: number, y: number) {
  doc.setFont('helvetica', 'bold');
  doc.text(label, x, y);
  doc.setFont('helvetica', 'normal');
  doc.text(value, x + 36, y);
}

function TicketCard({ ticket, onCancel }: { ticket: TicketFull; onCancel: (ticket: TicketFull) => void }) {
  const [showQr, setShowQr] = useState(false);
  const tokenQuery = useQuery({
    queryKey: ['ticket-token', ticket.id],
    queryFn: () => ticketService.getToken(ticket.id),
  });

  const token = tokenQuery.data?.data?.data;
  const qrValue = token ? JSON.stringify(token) : `ticket:${ticket.id}`;
  const routeLabel = token ? `${token.originCityName} → ${token.destinationCityName}` : `Viaje #${ticket.trip.id}`;
  const pdfRouteLabel = token ? `${token.originCityName} - ${token.destinationCityName}` : `Viaje #${ticket.trip.id}`;
  const seatLabel = token ? `${token.seatLetter}${token.seatNumber} · ${token.seatTypeName}` : `${ticket.seat.letter}${ticket.seat.number}`;
  const departureLabel = token ? parseDate(token.tripDepartureDate) : parseDate(ticket.trip.departureDate);

  const handleDownload = async () => {
    const resolvedToken = token ?? (await tokenQuery.refetch()).data?.data?.data;
    const qrSource = resolvedToken ? JSON.stringify(resolvedToken) : qrValue;
    const qrDataUrl = await QRCodeGenerator.toDataURL(qrSource, {
      width: 512,
      margin: 1,
      errorCorrectionLevel: 'M',
    });

    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(246, 247, 251);
    doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(12, 12, pageWidth - 24, 273, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(17, 24, 39);
    doc.text(`Ticket #${ticket.id}`, 20, 28);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(pdfRouteLabel, 20, 36);

    const badgeLabel = ticket.isCancelled ? 'Cancelado' : 'Activo';
    const badgeFill = ticket.isCancelled ? [254, 226, 226] : [220, 252, 231];
    const badgeText = ticket.isCancelled ? [185, 28, 28] : [22, 101, 52];
    doc.setFillColor(badgeFill[0], badgeFill[1], badgeFill[2]);
    doc.roundedRect(pageWidth - 52, 20, 32, 10, 5, 5, 'F');
    doc.setFontSize(9);
    doc.setTextColor(badgeText[0], badgeText[1], badgeText[2]);
    doc.text(badgeLabel, pageWidth - 36, 26, { align: 'center' });

    doc.setDrawColor(229, 231, 235);
    doc.line(20, 46, pageWidth - 20, 46);

    addTicketText(doc, 'Salida:', departureLabel, 20, 190);
    addTicketText(doc, 'Asiento:', seatLabel, 20, 202);
    addTicketText(doc, 'Reserva:', parseDate(ticket.bookingTime), 20, 214);
    addTicketText(doc, 'Precio:', `$${ticket.finalPrice.toLocaleString('es-AR')}`, 20, 226);

    doc.setDrawColor(229, 231, 235);
    doc.line(20, 176, pageWidth - 20, 176);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(55, 58, 100, 100, 4, 4, 'FD');
    doc.addImage(qrDataUrl, 'PNG', 60, 63, 90, 90);

    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('Presentá este código al abordar', 105, 166, { align: 'center' });

    doc.save(`ticket-${ticket.id}.pdf`);
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-gray-900">Ticket #{ticket.id}</p>
            {ticket.isCancelled ? <Badge variant="danger">Cancelado</Badge> : <Badge variant="success">Activo</Badge>}
          </div>

          <p className="text-sm text-gray-700">
            {routeLabel}
          </p>
          <p className="text-sm text-gray-600">
            Salida: {departureLabel}
          </p>
          <p className="text-sm text-gray-600">
            Asiento: {seatLabel}
          </p>
          <p className="text-sm text-gray-600">
            Reserva: {parseDate(ticket.bookingTime)}
          </p>
          <p className="text-sm font-medium text-[#c60001]">
            ${ticket.finalPrice.toLocaleString('es-AR')}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div
            onClick={() => token && setShowQr(true)}
            role="button"
            aria-label="Ampliar QR del ticket"
            className={`rounded-xl border border-gray-200 bg-white p-3 transition-all ${
              token ? 'cursor-pointer hover:ring-2 hover:ring-[#c60001] hover:shadow-md' : 'cursor-default'
            }`}
          >
            {token ? (
              <TicketQRCode value={qrValue} size={128} />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center text-xs text-gray-400">
                Cargando QR...
              </div>
            )}
          </div>

          <div className="text-center text-xs text-gray-500">
            <QrCode className="mx-auto mb-1 h-4 w-4" />
            QR del ticket
          </div>
        </div>
      </div>

      {!ticket.isCancelled && (
        <div className="mt-4 flex w-full flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-stretch">
          <Button variant="danger" size="sm" className="w-full sm:flex-1" onClick={() => onCancel(ticket)}>
            Cancelar ticket
          </Button>
          <Button variant="secondary" size="sm" className="w-full sm:flex-1" onClick={handleDownload}>
            Descargar ticket
          </Button>
        </div>
      )}

      <Modal isOpen={showQr} onClose={() => setShowQr(false)} title="Código QR" maxWidth="max-w-md" backdropClassName="bg-black/60">
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <TicketQRCode value={qrValue} size={288} />
          </div>
          <p className="text-sm text-gray-600">Presentá este código al abordar</p>
        </div>
      </Modal>
    </Card>
  );
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(() => (location.state as { activeTab?: string } | null)?.activeTab || 'profile');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [ticketsPage, setTicketsPage] = useState(0);
  const [cancelTicket, setCancelTicket] = useState<TicketFull | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const { data: ticketsData, isLoading: ticketsLoading } = useTicketSearch(
    { userId: user?.id },
    ticketsPage,
    5,
    !!user && activeTab === 'tickets',
  );
  const tickets = ticketsData?.data?.data?.content || [];
  const ticketsTotalPages = ticketsData?.data?.data?.totalPages || 0;

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileData) => {
    if (!user) return;
    setProfileLoading(true);
    try {
      const res = await profileService.update({ id: user.id, ...data });
      updateUser(res.data.data);
      showToast('Perfil actualizado', 'success');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al actualizar';
      showToast(msg, 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordData) => {
    if (!user) return;
    setPasswordLoading(true);
    try {
      await authService.changePassword({
        email: user.email,
        password: data.currentPassword,
        newPassword: data.newPassword,
      });
      showToast('Contraseña cambiada', 'success');
      passwordForm.reset();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al cambiar contraseña';
      showToast(msg, 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelTicket) return;

    setCancelLoading(true);
    try {
      await ticketService.cancel(cancelTicket.id);
      showToast('Ticket cancelado', 'success');
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['trip', cancelTicket.trip.id, 'seats'] });
      setCancelTicket(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al cancelar';
      showToast(msg, 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  const tabs = [
    { label: 'Perfil', value: 'profile' },
    { label: 'Contraseña', value: 'password' },
    { label: 'Mis Tickets', value: 'tickets' },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Mi Cuenta</h1>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'profile' && (
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <User className="h-5 w-5" /> Información Personal
            </h2>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Nombre" error={profileForm.formState.errors.firstName?.message} {...profileForm.register('firstName')} />
                <Input label="Apellido" error={profileForm.formState.errors.lastName?.message} {...profileForm.register('lastName')} />
              </div>
              <Input label="Email" type="email" error={profileForm.formState.errors.email?.message} {...profileForm.register('email')} />
              <Button type="submit" loading={profileLoading}>Guardar Cambios</Button>
            </form>
          </Card>
        )}

        {activeTab === 'password' && (
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Lock className="h-5 w-5" /> Cambiar Contraseña
            </h2>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <Input label="Contraseña Actual" type="password" error={passwordForm.formState.errors.currentPassword?.message} {...passwordForm.register('currentPassword')} />
              <Input label="Nueva Contraseña" type="password" error={passwordForm.formState.errors.newPassword?.message} {...passwordForm.register('newPassword')} />
              <Button type="submit" loading={passwordLoading}>Cambiar Contraseña</Button>
            </form>
          </Card>
        )}

        {activeTab === 'tickets' && (
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Ticket className="h-5 w-5" /> Mis Tickets
            </h2>
            {ticketsLoading ? (
              <Spinner />
            ) : tickets.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">No tenés tickets todavía.</p>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} onCancel={setCancelTicket} />
                ))}
              </div>
            )}
            {ticketsTotalPages > 1 && (
              <div className="mt-4">
                <Pagination currentPage={ticketsPage} totalPages={ticketsTotalPages} onPageChange={setTicketsPage} />
              </div>
            )}
          </Card>
        )}
      </div>

      <Modal
        isOpen={!!cancelTicket}
        onClose={() => !cancelLoading && setCancelTicket(null)}
        title="Cancelar ticket"
        maxWidth="max-w-sm"
        backdropClassName="bg-black/60"
      >
        {cancelTicket && (
          <div className="py-2">
            <p className="text-sm text-gray-700">
              ¿Querés cancelar el ticket #{cancelTicket.id}?
            </p>
            <p className="mt-1 text-xs text-gray-500">Esta acción no se puede deshacer.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setCancelTicket(null)} disabled={cancelLoading}>
                Volver
              </Button>
              <Button variant="danger" onClick={handleConfirmCancel} loading={cancelLoading}>
                Sí, cancelar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

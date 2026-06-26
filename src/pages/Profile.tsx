import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import QRCode from 'react-qr-code';
import { useLocation } from 'react-router-dom';
import * as QRCodeGenerator from 'qrcode';
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

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function TicketCard({ ticket, onCancel }: { ticket: TicketFull; onCancel: (ticket: TicketFull) => Promise<void> }) {
  const tokenQuery = useQuery({
    queryKey: ['ticket-token', ticket.id],
    queryFn: () => ticketService.getToken(ticket.id),
  });

  const token = tokenQuery.data?.data?.data;
  const qrValue = token ? JSON.stringify(token) : `ticket:${ticket.id}`;
  const routeLabel = token ? `${token.originCityName} → ${token.destinationCityName}` : `Viaje #${ticket.trip.id}`;
  const seatLabel = token ? `${token.seatLetter}${token.seatNumber} · ${token.seatTypeName}` : `${ticket.seat.letter}${ticket.seat.number}`;
  const departureLabel = token ? parseDate(token.tripDepartureDate) : parseDate(ticket.trip.departureDate);

  const handleDownload = async () => {
    const resolvedToken = token ?? (await tokenQuery.refetch()).data?.data?.data;
    const qrSource = resolvedToken ? JSON.stringify(resolvedToken) : qrValue;
    const qrDataUrl = await QRCodeGenerator.toDataURL(qrSource, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'M',
    });

    const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ticket ${ticket.id}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 24px; background: #f6f7fb; color: #111827; }
    .card { max-width: 720px; margin: 0 auto; background: white; border: 1px solid #e5e7eb; border-radius: 20px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,.08); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
    .title { margin: 0; font-size: 24px; font-weight: 700; }
    .badge { display: inline-block; padding: 6px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; background: ${ticket.isCancelled ? '#fee2e2' : '#dcfce7'}; color: ${ticket.isCancelled ? '#b91c1c' : '#166534'}; }
    .grid { display: grid; grid-template-columns: 1.4fr .9fr; gap: 24px; align-items: center; }
    .meta { display: grid; gap: 10px; font-size: 14px; }
    .meta strong { display: inline-block; min-width: 110px; }
    .qr { text-align: center; }
    .qr img { width: 240px; height: 240px; border: 1px solid #e5e7eb; border-radius: 16px; padding: 12px; background: white; }
    .muted { color: #6b7280; font-size: 12px; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <h1 class="title">Ticket #${ticket.id}</h1>
        <div class="muted">${escapeHtml(routeLabel)}</div>
      </div>
      <div class="badge">${ticket.isCancelled ? 'Cancelado' : 'Activo'}</div>
    </div>
    <div class="grid">
      <div class="meta">
        <div><strong>Salida:</strong> ${escapeHtml(departureLabel)}</div>
        <div><strong>Asiento:</strong> ${escapeHtml(seatLabel)}</div>
        <div><strong>Reserva:</strong> ${escapeHtml(parseDate(ticket.bookingTime))}</div>
        <div><strong>Precio:</strong> $${ticket.finalPrice.toLocaleString('es-AR')}</div>
      </div>
      <div class="qr">
        <img src="${qrDataUrl}" alt="QR del ticket" />
        <div class="muted">Presentá este código al abordar</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${ticket.id}.html`;
    link.click();
    URL.revokeObjectURL(url);
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
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            {token ? (
              <QRCode value={qrValue} size={128} />
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

          <div className="flex flex-col gap-2">
            {!ticket.isCancelled && (
              <>
                <Button variant="danger" size="sm" onClick={() => onCancel(ticket)}>
                  Cancelar ticket
                </Button>
                <Button variant="secondary" size="sm" onClick={handleDownload}>
                  Descargar ticket
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
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

  const handleCancelTicket = async (ticket: TicketFull) => {
    const confirmed = window.confirm(`¿Querés cancelar el ticket #${ticket.id}?`);
    if (!confirmed) return;

    try {
      await ticketService.cancel(ticket.id);
      showToast('Ticket cancelado', 'success');
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['trip', ticket.trip.id, 'seats'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al cancelar';
      showToast(msg, 'error');
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
                  <TicketCard key={ticket.id} ticket={ticket} onCancel={handleCancelTicket} />
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
    </div>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { profileService } from '@/services/profile.service';
import { authService } from '@/services/auth.service';
import { useTickets } from '@/hooks/queries/useTickets';
import { ticketService } from '@/services/ticket.service';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { User, Lock, Ticket } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

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

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [ticketsPage, setTicketsPage] = useState(0);
  const { data: ticketsData, isLoading: ticketsLoading } = useTickets(ticketsPage, 5);
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

  const handleCancelTicket = async (ticketId: number) => {
    try {
      await ticketService.cancel(ticketId);
      showToast('Ticket cancelado', 'success');
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
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
                  <div key={ticket.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        Ticket #{ticket.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${ticket.finalPrice.toLocaleString('es-AR')} · {parseDate(ticket.bookingTime)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {ticket.isCancelled ? (
                        <Badge variant="danger">Cancelado</Badge>
                      ) : (
                        <>
                          <Badge variant="success">Activo</Badge>
                          <Button variant="danger" size="sm" onClick={() => handleCancelTicket(ticket.id)}>
                            Cancelar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
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

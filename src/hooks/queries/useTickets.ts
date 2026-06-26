import { useQuery } from '@tanstack/react-query';
import { ticketService } from '@/services/ticket.service';
import type { SearchTicket } from '@/types/ticket';

export function useTickets(page = 0, size = 20) {
  return useQuery({
    queryKey: ['tickets', page, size],
    queryFn: () => ticketService.list(page, size),
  });
}

export function useTicketSearch(filters: SearchTicket, page = 0, size = 20, enabled = true) {
  return useQuery({
    queryKey: ['tickets', 'search', filters, page, size],
    queryFn: () => ticketService.search(filters, page, size),
    enabled,
  });
}

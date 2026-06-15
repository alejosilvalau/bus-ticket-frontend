import { useQuery } from '@tanstack/react-query';
import { seatService } from '@/services/seat.service';

export function useSeats(page = 0, size = 20) {
  return useQuery({
    queryKey: ['seats', page, size],
    queryFn: () => seatService.list(page, size),
  });
}

export function useSeatSearch(filters: Record<string, unknown>, page = 0, size = 20) {
  return useQuery({
    queryKey: ['seats', 'search', filters, page, size],
    queryFn: () => seatService.search(filters, page, size),
  });
}

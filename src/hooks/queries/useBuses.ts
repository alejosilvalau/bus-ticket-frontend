import { useQuery } from '@tanstack/react-query';
import { busService } from '@/services/bus.service';

export function useBuses(page = 0, size = 20) {
  return useQuery({
    queryKey: ['buses', page, size],
    queryFn: () => busService.list(page, size),
  });
}

export function useBusSearch(filters: Record<string, unknown>, page = 0, size = 20) {
  return useQuery({
    queryKey: ['buses', 'search', filters, page, size],
    queryFn: () => busService.search(filters, page, size),
  });
}

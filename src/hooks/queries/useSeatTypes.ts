import { useQuery } from '@tanstack/react-query';
import { seatTypeService } from '@/services/seat-type.service';

export function useSeatTypes(page = 0, size = 20) {
  return useQuery({
    queryKey: ['seatTypes', page, size],
    queryFn: () => seatTypeService.list(page, size),
  });
}

export function useSeatTypeSearch(filters: Record<string, unknown>, page = 0, size = 20) {
  return useQuery({
    queryKey: ['seatTypes', 'search', filters, page, size],
    queryFn: () => seatTypeService.search(filters, page, size),
  });
}

import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/services/location.service';

export function useLocations(page = 0, size = 100) {
  return useQuery({
    queryKey: ['locations', page, size],
    queryFn: () => locationService.list(page, size),
  });
}

export function useLocationSearch(filters: { cityName?: string; state?: string }, page = 0, size = 100) {
  return useQuery({
    queryKey: ['locations', 'search', filters, page, size],
    queryFn: () => locationService.search(filters, page, size),
  });
}

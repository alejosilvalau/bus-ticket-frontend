import { useQuery } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';

export function useDrivers(page = 0, size = 20) {
  return useQuery({
    queryKey: ['drivers', page, size],
    queryFn: () => driverService.list(page, size),
  });
}

export function useDriverSearch(filters: Record<string, unknown>, page = 0, size = 20) {
  return useQuery({
    queryKey: ['drivers', 'search', filters, page, size],
    queryFn: () => driverService.search(filters, page, size),
  });
}

import { useQuery } from '@tanstack/react-query';
import { tripService } from '@/services/trip.service';
import type { SearchTrip } from '@/types/trip';

export function useTrips(page = 0, size = 20) {
  return useQuery({
    queryKey: ['trips', page, size],
    queryFn: () => tripService.list(page, size),
  });
}

export function useAvailableTrips(page = 0, size = 20) {
  return useQuery({
    queryKey: ['trips', 'available', page, size],
    queryFn: () => tripService.listAvailable(page, size),
  });
}

export function useTripSearch(filters: SearchTrip, page = 0, size = 20) {
  return useQuery({
    queryKey: ['trips', 'search', filters, page, size],
    queryFn: () => tripService.search(filters, page, size),
  });
}

export function useAvailableTripSearch(filters: SearchTrip, page = 0, size = 20) {
  return useQuery({
    queryKey: ['trips', 'available', 'search', filters, page, size],
    queryFn: () => tripService.searchAvailable(filters, page, size),
  });
}

export function useTrip(id: number) {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripService.getById(id),
    enabled: !!id,
  });
}

export function useTripSeats(id: number) {
  return useQuery({
    queryKey: ['trip', id, 'seats'],
    queryFn: () => tripService.getSeats(id),
    enabled: !!id,
  });
}

import api from './api';
import type { ApiResponse, PageResponse } from '@/types/api';
import type { TicketFull, CreateTicket, UpdateTicket, SearchTicket, FinalPriceRequest, TicketToken } from '@/types/ticket';

export const ticketService = {
  list(page = 0, size = 20) {
    return api.get<ApiResponse<PageResponse<TicketFull>>>('/booking/status/tickets', { params: { page, size } });
  },

  search(filters: SearchTicket, page = 0, size = 20) {
    return api.post<ApiResponse<PageResponse<TicketFull>>>('/booking/status/tickets/search', filters, { params: { page, size } });
  },

  getById(id: number) {
    return api.get<ApiResponse<TicketFull>>(`/booking/status/tickets/${id}`);
  },

  getToken(id: number) {
    return api.get<ApiResponse<TicketToken>>(`/booking/status/tickets/${id}/token`);
  },

  create(data: CreateTicket) {
    return api.post<ApiResponse<TicketFull>>('/booking/processor/tickets', data);
  },

  update(data: UpdateTicket) {
    return api.patch<ApiResponse<TicketFull>>('/booking/processor/tickets', data);
  },

  remove(id: number) {
    return api.delete<ApiResponse<TicketFull>>(`/booking/processor/tickets/${id}`);
  },

  cancel(id: number) {
    return api.patch<ApiResponse<TicketFull>>(`/booking/processor/tickets/${id}/cancel`);
  },

  getFinalPrice(data: FinalPriceRequest) {
    return api.post<ApiResponse<number>>('/booking/processor/tickets/final-price', data);
  },
};

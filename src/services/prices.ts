import { apiClient } from './api';
import type { ApiResponse, PriceEntry, PricePoint } from '../types';

export const pricesApi = {
  getByProductId: async (
    productId: string
  ): Promise<ApiResponse<PriceEntry[]>> => {
    return apiClient.get<ApiResponse<PriceEntry[]>>(
      `/products/${productId}/prices`
    );
  },

  getHistory: async (
    productId: string,
    source?: string
  ): Promise<ApiResponse<PricePoint[]>> => {
    const params: Record<string, string> = {};
    if (source) params.source = source;
    return apiClient.get<ApiResponse<PricePoint[]>>(
      `/products/${productId}/history`,
      params
    );
  },
};
import { apiClient } from './api';
import type {
  ApiResponse,
  ProductSummary,
  ProductDetail,
  SearchParams,
  ProductCategory,
} from '../types';

export const productsApi = {
  search: async (
    params: SearchParams
  ): Promise<ApiResponse<ProductSummary[]>> => {
    const queryParams: Record<string, string> = {};
    if (params.q) queryParams.q = params.q;
    if (params.category) queryParams.category = params.category;
    if (params.page) queryParams.page = String(params.page);
    if (params.limit) queryParams.limit = String(params.limit);
    return apiClient.get<ApiResponse<ProductSummary[]>>('/products', queryParams);
  },

  getById: async (id: string): Promise<ApiResponse<ProductDetail>> => {
    return apiClient.get<ApiResponse<ProductDetail>>(`/products/${id}`);
  },

  getByCategory: async (
    category: ProductCategory,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<ProductSummary[]>> => {
    return apiClient.get<ApiResponse<ProductSummary[]>>('/products', {
      category,
      page: String(page),
      limit: String(limit),
    });
  },

  getPopular: async (
    limit: number = 10
  ): Promise<ApiResponse<ProductSummary[]>> => {
    return apiClient.get<ApiResponse<ProductSummary[]>>('/products/popular', {
      limit: String(limit),
    });
  },
};
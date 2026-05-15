import { apiClient } from './api';
import type { ApiResponse, ProductCategory } from '../types';

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  icon: string;
  productCount: number;
}

export const categoriesApi = {
  getAll: async (): Promise<ApiResponse<CategoryInfo[]>> => {
    return apiClient.get<ApiResponse<CategoryInfo[]>>('/categories');
  },
};
import { create } from 'zustand';
import type { ProductSummary, ProductCategory } from '../types';

interface ProductState {
  products: ProductSummary[];
  isLoading: boolean;
  error: string | null;
  category: ProductCategory | null;

  setProducts: (products: ProductSummary[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCategory: (category: ProductCategory | null) => void;
  reset: () => void;
}

const initialState = {
  products: [],
  isLoading: false,
  error: null,
  category: null as ProductCategory | null,
};

export const useProductStore = create<ProductState>((set) => ({
  ...initialState,

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setCategory: (category) => set({ category }),
  reset: () => set(initialState),
}));

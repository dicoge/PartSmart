import { create } from 'zustand';
import type { Product, ProductSummary, ProductDetail, ProductCategory } from '../types';

interface ProductState {
  products: ProductSummary[];
  currentProduct: ProductDetail | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  category: ProductCategory | null;

  setProducts: (products: ProductSummary[]) => void;
  appendProducts: (products: ProductSummary[]) => void;
  setCurrentProduct: (product: ProductDetail | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setCategory: (category: ProductCategory | null) => void;
  reset: () => void;
}

const initialState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,
  category: null as ProductCategory | null,
};

export const useProductStore = create<ProductState>((set) => ({
  ...initialState,

  setProducts: (products) => set({ products }),
  appendProducts: (products) =>
    set((state) => ({ products: [...state.products, ...products] })),
  setCurrentProduct: (product) => set({ currentProduct: product }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setPage: (page) => set({ page }),
  setHasMore: (hasMore) => set({ hasMore }),
  setCategory: (category) => set({ category }),
  reset: () => set(initialState),
}));
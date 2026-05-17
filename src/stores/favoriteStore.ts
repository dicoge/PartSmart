import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ProductSummary } from '../types';

const FAVORITES_KEY = '@partsmart/favorites';

interface FavoriteState {
  favorites: ProductSummary[];
  isLoading: boolean;
  error: string | null;

  loadFavorites: () => Promise<void>;
  addFavorite: (product: ProductSummary) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  isFavorite: (productId: string) => {
    return get().favorites.some((f) => f.id === productId);
  },

  loadFavorites: async () => {
    try {
      set({ isLoading: true });
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      const favorites: ProductSummary[] = data ? JSON.parse(data) : [];
      set({ favorites, isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: e instanceof Error ? e.message : 'Failed to load favorites' });
    }
  },

  addFavorite: async (product) => {
    try {
      const { favorites } = get();
      if (favorites.some((f) => f.id === product.id)) return;
      const updated = [product, ...favorites];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      set({ favorites: updated });
    } catch (e) {
      console.error('Failed to add favorite:', e);
    }
  },

  removeFavorite: async (productId) => {
    try {
      const { favorites } = get();
      const updated = favorites.filter((f) => f.id !== productId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      set({ favorites: updated });
    } catch (e) {
      console.error('Failed to remove favorite:', e);
    }
  },
}));
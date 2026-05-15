import { create } from 'zustand';
import type { SearchFilters } from '../types';
import { MAX_RECENT_SEARCHES } from '../utils/constants';

interface SearchState {
  query: string;
  filters: SearchFilters;
  recentSearches: string[];
  isSearching: boolean;

  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setIsSearching: (isSearching: boolean) => void;
  reset: () => void;
}

const defaultFilters: SearchFilters = {
  sortBy: 'popular',
};

const initialState = {
  query: '',
  filters: defaultFilters,
  recentSearches: [],
  isSearching: false,
};

export const useSearchStore = create<SearchState>((set) => ({
  ...initialState,

  setQuery: (query) => set({ query }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () => set({ filters: defaultFilters }),

  addRecentSearch: (query) =>
    set((state) => {
      const filtered = state.recentSearches.filter((s) => s !== query);
      return {
        recentSearches: [query, ...filtered].slice(0, MAX_RECENT_SEARCHES),
      };
    }),

  clearRecentSearches: () => set({ recentSearches: [] }),

  setIsSearching: (isSearching) => set({ isSearching }),

  reset: () => set(initialState),
}));
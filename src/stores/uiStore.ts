import { create } from 'zustand';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface UIState {
  theme: ThemeMode;
  isDark: boolean;
  isOnline: boolean;
  activeTab: string;

  setTheme: (theme: ThemeMode) => void;
  setIsOnline: (online: boolean) => void;
  setActiveTab: (tab: string) => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

const systemColorScheme = Appearance.getColorScheme() ?? 'light';

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'system',
  isDark: systemColorScheme === 'dark',
  isOnline: true,
  activeTab: 'index',

  setTheme: (theme) => {
    const isDark =
      theme === 'system'
        ? (Appearance.getColorScheme() ?? 'light') === 'dark'
        : theme === 'dark';
    set({ theme, isDark });
  },

  setIsOnline: (online) => set({ isOnline: online }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  getEffectiveTheme: () => {
    const { theme } = get();
    if (theme === 'system') {
      return Appearance.getColorScheme() ?? 'light';
    }
    return theme;
  },
}));
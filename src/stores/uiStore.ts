import { create } from 'zustand';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface UIState {
  theme: ThemeMode;
  isDark: boolean;

  setTheme: (theme: ThemeMode) => void;
}

const systemColorScheme = Appearance.getColorScheme() ?? 'light';

export const useUIStore = create<UIState>((set) => ({
  theme: 'system',
  isDark: systemColorScheme === 'dark',

  setTheme: (theme) => {
    const isDark =
      theme === 'system'
        ? (Appearance.getColorScheme() ?? 'light') === 'dark'
        : theme === 'dark';
    set({ theme, isDark });
  },
}));

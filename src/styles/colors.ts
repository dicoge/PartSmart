export const Colors = {
  primary: '#2563EB',       // Blue-600
  primaryLight: '#3B82F6',  // Blue-500
  primaryDark: '#1D4ED8',   // Blue-700
  secondary: '#059669',     // Emerald-600
  accent: '#F59E0B',        // Amber-500
  danger: '#DC2626',        // Red-600
  warning: '#D97706',       // Amber-600

  bg: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    card: '#FFFFFF',
    modal: '#FFFFFF',
  },

  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
    link: '#2563EB',
  },

  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    focus: '#2563EB',
  },

  status: {
    inStock: '#059669',
    outOfStock: '#DC2626',
    unknown: '#9CA3AF',
  },

  skeleton: {
    base: '#E5E7EB',
    highlight: '#F3F4F6',
  },

  tabBar: {
    active: '#2563EB',
    inactive: '#9CA3AF',
    bg: '#FFFFFF',
    border: '#E5E7EB',
  },
} as const;
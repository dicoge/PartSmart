import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

export function getResponsiveColumnCount(width: number): number {
  if (width < 768) return 1;
  if (width < 1024) return 2;
  return 3;
}

export function useResponsive(width: number) {
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    columns: getResponsiveColumnCount(width),
  };
}
export const APP_NAME = 'PartSmart';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://partsmart.vercel.app';
export const SEARCH_DEBOUNCE_MS = 300;
export const PRICE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
export const MAX_RECENT_SEARCHES = 20;
export const PAGE_SIZE = 20;

export const CATEGORY_LABELS: Record<string, string> = {
  cpu: 'CPU 處理器',
  gpu: '顯示卡',
  motherboard: '主機板',
  ram: '記憶體',
  ssd: 'SSD',
  hdd: 'HDD',
  psu: '電源供應器',
  case: '機殼',
  cooler: '散熱器',
  monitor: '螢幕',
  other: '其他',
};

export const SORT_OPTIONS = [
  { value: 'price_asc', label: '價格低到高' },
  { value: 'price_desc', label: '價格高到低' },
  { value: 'newest', label: '最新' },
  { value: 'popular', label: '熱門' },
] as const;

export const SOURCE_NAMES: Record<string, string> = {
  coolpc: '原價屋',
  sinya: '欣亞電子',
  pcpartpicker: 'PCPartPicker',
  ptt: 'PTT HardwareSale',
};
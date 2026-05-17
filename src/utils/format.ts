import { StockStatus } from '../types/price';

export function formatPrice(price: number, currency: 'TWD' | 'USD' = 'TWD'): string {
  if (currency === 'TWD') {
    return `NT$${price.toLocaleString()}`;
  }
  return `$${price.toLocaleString('en-US')} USD`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return '剛剛';
  if (diffMins < 60) return `${diffMins} 分鐘前`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} 小時前`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} 天前`;

  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatStockStatus(status: StockStatus): string {
  switch (status) {
    case 'in_stock': return '有庫存';
    case 'out_of_stock': return '缺貨';
    default: return '未知';
  }
}

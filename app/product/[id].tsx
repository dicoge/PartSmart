import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../src/styles';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { PriceTag } from '../../src/components/ui/PriceTag';
import { PriceTable } from '../../src/components/product/PriceTable';
import { SpecList } from '../../src/components/product/SpecList';
import { Loading } from '../../src/components/ui/Loading';
import { EmptyState } from '../../src/components/common/EmptyState';
import { useFavoriteStore } from '../../src/stores/favoriteStore';
import { formatDate } from '../../src/utils';
import type { ProductDetail, PriceEntry, PricePoint } from '../../src/types';

// Mock detail data for demonstration
function getMockProductDetail(id: string): ProductDetail {
  return {
    id,
    name: 'Intel Core i7-14700K',
    brand: 'Intel',
    category: 'cpu',
    subcategory: 'desktop',
    imageUrl: undefined,
    specs: {
      '核心/執行緒': '20C/28T',
      '基礎時脈': '3.4 GHz',
      '最大超頻': '5.6 GHz',
      'L3 快取': '33 MB',
      'TDP': '125W',
      '製程': 'Intel 7',
      '腳位': 'LGA1700',
      '記憶體支援': 'DDR5-5600 / DDR4-3200',
    },
    createdAt: '2024-10-17T00:00:00Z',
    updatedAt: new Date().toISOString(),
    prices: [
      {
        source: {
          id: 'coolpc', name: '原價屋', type: 'retail',
          domain: 'coolpc.com.tw', country: 'TW',
        },
        price: 13800,
        currency: 'TWD',
        stockStatus: 'in_stock',
        productUrl: 'https://coolpc.com.tw',
        capturedAt: new Date().toISOString(),
      },
      {
        source: {
          id: 'sinya', name: '欣亞電子', type: 'retail',
          domain: 'sinya.com.tw', country: 'TW',
        },
        price: 13990,
        currency: 'TWD',
        stockStatus: 'in_stock',
        productUrl: 'https://sinya.com.tw',
        capturedAt: new Date().toISOString(),
      },
      {
        source: {
          id: 'pcpartpicker', name: 'PCPartPicker', type: 'marketplace',
          domain: 'pcpartpicker.com', country: 'US',
        },
        price: 389.99,
        currency: 'USD',
        stockStatus: 'in_stock',
        productUrl: 'https://pcpartpicker.com',
        capturedAt: new Date().toISOString(),
      },
      {
        source: {
          id: 'ptt', name: 'PTT HardwareSale', type: 'forum',
          domain: 'ptt.cc', country: 'TW',
        },
        price: 12500,
        currency: 'TWD',
        stockStatus: 'out_of_stock',
        productUrl: 'https://ptt.cc',
        capturedAt: new Date().toISOString(),
        note: '二手近全新',
      },
    ],
    priceHistory: [
      { date: '2024-12-01', price: 14200, source: '原價屋' },
      { date: '2024-12-15', price: 14000, source: '原價屋' },
      { date: '2025-01-01', price: 13800, source: '原價屋' },
    ],
  };
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { favorites, addFavorite, removeFavorite, isFavorite } =
    useFavoriteStore();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const favorited = id ? isFavorite(id) : false;

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      // In production: const res = await productsApi.getById(id);
      await new Promise((r) => setTimeout(r, 600));
      setProduct(getMockProductDetail(id));
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = useCallback(() => {
    if (!product) return;
    if (favorited) {
      removeFavorite(product.id);
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        imageUrl: product.imageUrl,
        lowestPrice: product.prices[0]?.price ?? 0,
        lowestSource: product.prices[0]?.source.name ?? '',
        priceCount: product.prices.length,
      });
    }
  }, [product, favorited, addFavorite, removeFavorite]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loading fullScreen message="載入產品資訊..." />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="⚠️"
          title="載入失敗"
          message={error || '找不到此產品'}
          actionLabel="返回"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const lowestPrice = product.prices.reduce(
    (min, p) => (p.price < min.price ? p : min),
    product.prices[0]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Image */}
      <View style={styles.imageContainer}>
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderIcon}>📦</Text>
            <Text style={styles.placeholderText}>{product.brand}</Text>
          </View>
        )}

        {/* Favorite button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Text style={styles.favoriteIcon}>{favorited ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* Product Info */}
      <View style={styles.infoSection}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>

        <View style={styles.metaRow}>
          <Badge label={product.category.toUpperCase()} variant="primary" size="small" />
          <Text style={styles.updated}>
            更新於 {formatDate(product.updatedAt)}
          </Text>
        </View>

        {/* Lowest price highlight */}
        <View style={styles.priceHighlight}>
          <Text style={styles.priceLabel}>最低價格</Text>
          <PriceTag
            price={lowestPrice.price}
            currency={lowestPrice.currency}
            source={lowestPrice.source.name}
            size="large"
          />
        </View>
      </View>

      {/* Price Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>各通路價格</Text>
        <PriceTable prices={product.prices} />
      </View>

      {/* Specs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>規格</Text>
        <SpecList specs={product.specs} />
      </View>

      {/* Price History */}
      {product.priceHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>價格歷史</Text>
          <Card>
            {product.priceHistory.map((point, index) => (
              <View
                key={point.date}
                style={[
                  styles.historyRow,
                  index < product.priceHistory.length - 1 && styles.historyBorder,
                ]}
              >
                <Text style={styles.historyDate}>{point.date}</Text>
                <Text style={styles.historyPrice}>
                  NT${point.price.toLocaleString()}
                </Text>
                <Text style={styles.historySource}>{point.source}</Text>
              </View>
            ))}
          </Card>
        </View>
      )}

      {/* Notes */}
      {product.prices.some((p) => p.note) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>備註</Text>
          <Card>
            {product.prices
              .filter((p) => p.note)
              .map((p, i) => (
                <View key={i} style={styles.noteRow}>
                  <Text style={styles.noteSource}>{p.source.name}:</Text>
                  <Text style={styles.noteText}>{p.note}</Text>
                </View>
              ))}
          </Card>
        </View>
      )}

      {/* Bottom spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.secondary,
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  imageContainer: {
    height: 280,
    backgroundColor: Colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  placeholderIcon: {
    fontSize: 72,
  },
  placeholderText: {
    ...Typography.h3,
    color: Colors.text.tertiary,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  favoriteIcon: {
    fontSize: 22,
  },
  infoSection: {
    backgroundColor: Colors.bg.primary,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  brand: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  updated: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  priceHighlight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.primary + '08',
    borderRadius: BorderRadius.md,
  },
  priceLabel: {
    ...Typography.label,
    color: Colors.text.secondary,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  historyBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.light,
  },
  historyDate: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    flex: 1,
  },
  historyPrice: {
    ...Typography.priceSmall,
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  historySource: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary,
    flex: 1,
    textAlign: 'right',
  },
  noteRow: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  noteSource: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  noteText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    flex: 1,
  },
  bottomSpacer: {
    height: Spacing.huge,
  },
});
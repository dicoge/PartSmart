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
import { formatDate, formatStockStatus, CATEGORY_LABELS, SOURCE_NAMES } from '../../src/utils';
import { getProductDetailById } from '../../src/data/mockProducts';
import type { ProductDetail, PriceEntry, PricePoint } from '../../src/types';

const CATEGORY_ICONS: Record<string, string> = {
  cpu: '⚡', gpu: '🎮', motherboard: '🔌', ram: '🧠',
  ssd: '💾', hdd: '💿', psu: '🔋', case: '🖥️',
  cooler: '❄️', monitor: '🖵', other: '🔧',
};

const CATEGORY_COLORS: Record<string, string> = {
  cpu: '#2563EB', gpu: '#059669', motherboard: '#7C3AED', ram: '#D97706',
  ssd: '#DC2626', hdd: '#0891B2', psu: '#DB2777', case: '#6B7280',
  cooler: '#0284C7', monitor: '#65A30D', other: '#8B5CF6',
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();

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
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 400));
      const detail = getProductDetailById(id);
      if (!detail) {
        setError('找不到此產品');
      } else {
        setProduct(detail);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = useCallback(() => {
    if (!product || product.prices.length === 0) return;
    if (favorited) {
      removeFavorite(product.id);
    } else {
      const lowest = product.prices.reduce(
        (min, p) => (p.price < min.price ? p : min),
        product.prices[0]
      );
      addFavorite({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        imageUrl: product.imageUrl,
        lowestPrice: lowest.price,
        lowestSource: lowest.source.id,
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

  const lowestPrice = product.prices.length > 0
    ? product.prices.reduce((min, p) => (p.price < min.price ? p : min))
    : null;

  // Compute overall stock status
  const p = product;
  function getOverallStock() {
    if (p.prices.length === 0) return 'out_of_stock';
    if (p.prices.some((entry) => entry.stockStatus === 'in_stock')) return 'in_stock';
    if (p.prices.every((entry) => entry.stockStatus === 'out_of_stock')) return 'out_of_stock';
    return 'unknown';
  }

  const overallStock = getOverallStock();

  const categoryIcon = CATEGORY_ICONS[product.category] || '📦';
  const categoryColor = CATEGORY_COLORS[product.category] || Colors.primary;
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Image / Hero */}
      <View style={[styles.imageContainer, { backgroundColor: categoryColor + '12' }]}>
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderIcon}>{categoryIcon}</Text>
            <Text style={[styles.placeholderText, { color: categoryColor }]}>
              {product.brand}
            </Text>
          </View>
        )}

        {/* Favorite button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Text style={styles.favoriteIcon}>{favorited ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        {/* Category badge overlay */}
        <View style={styles.categoryBadgeOverlay}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryBadgeText}>
              {categoryIcon} {categoryLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.infoSection}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>

        <View style={styles.metaRow}>
          <Badge label={product.subcategory || product.category} variant="primary" size="small" />
          <Badge
            label={formatStockStatus(overallStock)}
            variant={overallStock === 'in_stock' ? 'success' : overallStock === 'out_of_stock' ? 'danger' : 'neutral'}
            size="small"
          />
          <Text style={styles.updated}>
            更新於 {formatDate(product.updatedAt)}
          </Text>
        </View>

        {/* Lowest price highlight */}
        {lowestPrice && (
          <View style={styles.priceHighlight}>
            <View>
              <Text style={styles.priceLabel}>最低價格</Text>
              <Text style={styles.priceSource}>
                來自 {SOURCE_NAMES[lowestPrice.source.id] || lowestPrice.source.name}
              </Text>
            </View>
            <PriceTag
              price={lowestPrice.price}
              currency={lowestPrice.currency}
              source={lowestPrice.source.name}
              size="large"
            />
          </View>
        )}
      </View>

      {/* Multi-Store Price Comparison Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>各通路價格</Text>
        <PriceTable prices={product.prices} />
      </View>

      {/* Specs */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>規格</Text>
          <SpecList specs={product.specs} />
        </View>
      )}

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
  categoryBadgeOverlay: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
  },
  categoryBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  categoryBadgeText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
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
    alignItems: 'center',
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
  priceSource: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: Spacing.xxs,
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
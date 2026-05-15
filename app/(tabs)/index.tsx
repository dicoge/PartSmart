import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../src/styles';
import { CATEGORY_LABELS } from '../../src/utils';
import { CategoryGrid } from '../../src/components/layout/CategoryGrid';
import { Card } from '../../src/components/ui/Card';
import { Loading } from '../../src/components/ui/Loading';
import { useProductStore } from '../../src/stores/productStore';
import { useSearchStore } from '../../src/stores/searchStore';
import type { ProductCategory, ProductSummary } from '../../src/types';

const CATEGORY_ICONS: Record<string, string> = {
  cpu: '⚡', gpu: '🎮', motherboard: '🔌', ram: '🧠',
  ssd: '💾', hdd: '💿', psu: '🔋', case: '🖥️',
  cooler: '❄️', monitor: '🖵', other: '🔧',
};

export default function HomeScreen() {
  const router = useRouter();
  const { recentSearches } = useSearchStore();
  const { products, isLoading, setCategory } = useProductStore();
  const [popularProducts, setPopularProducts] = useState<ProductSummary[]>([]);

  useEffect(() => {
    // Load popular products (mock data for now)
    const mockPopular: ProductSummary[] = [
      {
        id: '1', name: 'Intel Core i7-14700K', brand: 'Intel',
        category: 'cpu', lowestPrice: 13800, lowestSource: 'coolpc', priceCount: 5,
      },
      {
        id: '2', name: 'NVIDIA RTX 4070 Super', brand: 'NVIDIA',
        category: 'gpu', lowestPrice: 21990, lowestSource: 'sinya', priceCount: 4,
      },
      {
        id: '3', name: 'Samsung 990 Pro 2TB', brand: 'Samsung',
        category: 'ssd', lowestPrice: 5888, lowestSource: 'coolpc', priceCount: 3,
      },
    ];
    setPopularProducts(mockPopular);
  }, []);

  const handleCategoryPress = (category: ProductCategory) => {
    setCategory(category);
    router.push('/(tabs)/search');
  };

  const handleProductPress = (product: ProductSummary) => {
    router.push(`/product/${product.id}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>PartSmart</Text>
        <Text style={styles.subtitle}>比價找零件，聰明組電腦</Text>
      </View>

      {/* Category Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>分類瀏覽</Text>
        <CategoryGrid onSelectCategory={handleCategoryPress} />
      </View>

      {/* Popular Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>熱門產品</Text>
        {isLoading ? (
          <Loading message="載入中..." />
        ) : (
          <View style={styles.popularList}>
            {popularProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.popularItem}
                onPress={() => handleProductPress(product)}
                activeOpacity={0.7}
              >
                <View style={styles.popularIcon}>
                  <Text style={styles.popularEmoji}>
                    {CATEGORY_ICONS[product.category] || '📦'}
                  </Text>
                </View>
                <View style={styles.popularInfo}>
                  <Text style={styles.popularName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={styles.popularPrice}>
                    NT${product.lowestPrice.toLocaleString()} 起
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>最近搜尋</Text>
          <View style={styles.recentList}>
            {recentSearches.slice(0, 5).map((query) => (
              <TouchableOpacity
                key={query}
                style={styles.recentItem}
                onPress={() => {
                  useSearchStore.getState().setQuery(query);
                  router.push('/(tabs)/search');
                }}
              >
                <Text style={styles.recentText}>🕐 {query}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.bg.primary,
  },
  greeting: {
    ...Typography.h1,
    color: Colors.text.primary,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  popularList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadow.sm,
  },
  popularIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.bg.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  popularEmoji: {
    fontSize: 22,
  },
  popularInfo: {
    flex: 1,
  },
  popularName: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  popularPrice: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xxs,
  },
  recentList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  recentItem: {
    backgroundColor: Colors.bg.card,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  recentText: {
    ...Typography.body,
    color: Colors.text.primary,
  },
});
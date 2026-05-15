import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../src/styles';
import { SearchBar } from '../../src/components/ui/SearchBar';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { ProductCard } from '../../src/components/product/ProductCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { Loading } from '../../src/components/ui/Loading';
import { useSearchStore } from '../../src/stores/searchStore';
import { useProductStore } from '../../src/stores/productStore';
import { SORT_OPTIONS, SEARCH_DEBOUNCE_MS } from '../../src/utils';
import type { ProductSummary } from '../../src/types';

export default function SearchScreen() {
  const router = useRouter();
  const {
    query, setQuery, filters, setFilters, resetFilters,
    recentSearches, addRecentSearch, isSearching, setIsSearching,
  } = useSearchStore();
  const {
    products, isLoading, error, setProducts,
    setLoading, setError, category,
  } = useProductStore();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setProducts([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Simulated search — in production, call productsApi.search
        const mockResults = [
          {
            id: '1', name: `Intel Core ${searchQuery}`, brand: 'Intel',
            category: 'cpu', lowestPrice: 12800, lowestSource: 'coolpc', priceCount: 5,
          },
          {
            id: '2', name: `AMD Ryzen ${searchQuery}`, brand: 'AMD',
            category: 'cpu', lowestPrice: 9800, lowestSource: 'sinya', priceCount: 3,
          },
          ].filter(() => Math.random() > 0.3) as ProductSummary[];

        // Simulate delay
        await new Promise((r) => setTimeout(r, 500));
        setProducts(mockResults);
        addRecentSearch(searchQuery);
      } catch (err) {
        setError(err instanceof Error ? err.message : '搜尋失敗');
      } finally {
        setLoading(false);
      }
    },
    [setProducts, setLoading, setError, addRecentSearch]
  );

  const handleChangeText = useCallback(
    (text: string) => {
      setQuery(text);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        performSearch(text);
      }, SEARCH_DEBOUNCE_MS);
    },
    [setQuery, performSearch]
  );

  const handleSubmit = useCallback(
    (text: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      performSearch(text);
    },
    [performSearch]
  );

  const handleProductPress = useCallback(
    (product: ProductSummary) => {
      router.push(`/product/${product.id}`);
    },
    [router]
  );

  useEffect(() => {
    if (category) {
      setFilters({ category });
    }
  }, [category]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const hasActiveFilters =
    filters.category || filters.brand || filters.minPrice != null;

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <SearchBar
          value={query}
          onChangeText={handleChangeText}
          onSubmit={handleSubmit}
          placeholder="搜尋零件..."
          autoFocus={false}
        />

        {/* Filter chips */}
        <View style={styles.filterRow}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.filterChip,
                filters.sortBy === opt.value && styles.filterChipActive,
              ]}
              onPress={() =>
                setFilters({ sortBy: opt.value as typeof filters.sortBy })
              }
            >
              <Text
                style={[
                  styles.filterChipText,
                  filters.sortBy === opt.value && styles.filterChipTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
          {hasActiveFilters && (
            <TouchableOpacity style={styles.clearFilter} onPress={resetFilters}>
              <Text style={styles.clearFilterText}>清除</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      {isLoading ? (
        <Loading message="搜尋中..." />
      ) : error ? (
        <EmptyState
          icon="⚠️"
          title="搜尋失敗"
          message={error}
          actionLabel="重試"
          onAction={() => performSearch(query)}
        />
      ) : products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <ProductCard product={item} onPress={handleProductPress} />
            </View>
          )}
          contentContainerStyle={styles.resultsList}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      ) : query ? (
        <EmptyState
          icon="🔍"
          title="沒有找到產品"
          message={`「${query}」的搜尋結果為空`}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>搜尋零件</Text>
          <Text style={styles.emptyMessage}>
            輸入關鍵字或點擊分類開始搜尋
          </Text>

          {recentSearches.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.recentTitle}>最近搜尋</Text>
              {recentSearches.map((q) => (
                <TouchableOpacity
                  key={q}
                  style={styles.recentItem}
                  onPress={() => {
                    setQuery(q);
                    performSearch(q);
                  }}
                >
                  <Text style={styles.recentText}>🕐 {q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.secondary,
  },
  header: {
    backgroundColor: Colors.bg.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  filterChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.bg.tertiary,
  },
  filterChipActive: {
    backgroundColor: Colors.primary + '1A',
  },
  filterChipText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  filterChipTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  clearFilter: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  clearFilterText: {
    ...Typography.caption,
    color: Colors.danger,
  },
  resultsList: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  productItem: {
    flex: 1,
  },
  columnWrapper: {
    gap: Spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  recentSection: {
    width: '100%',
    marginTop: Spacing.xxl,
  },
  recentTitle: {
    ...Typography.label,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  recentItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.light,
  },
  recentText: {
    ...Typography.body,
    color: Colors.text.primary,
  },
});
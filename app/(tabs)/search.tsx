import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/styles';
import { SearchBar } from '../../src/components/ui/SearchBar';
import { Badge } from '../../src/components/ui/Badge';
import { ProductCard } from '../../src/components/product/ProductCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { Loading } from '../../src/components/ui/Loading';
import { useSearchStore } from '../../src/stores/searchStore';
import { useProductStore } from '../../src/stores/productStore';
import { SORT_OPTIONS, SEARCH_DEBOUNCE_MS, CATEGORY_LABELS } from '../../src/utils';
import { searchProducts } from '../../src/data/mockProducts';
import type { ProductSummary } from '../../src/types';

export default function SearchScreen() {
  const router = useRouter();
  const {
    query, setQuery, filters, setFilters, resetFilters,
    recentSearches, addRecentSearch,
  } = useSearchStore();
  const {
    products, isLoading, error, setProducts,
    setLoading, setError, category, setCategory,
  } = useProductStore();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      setLoading(true);
      setError(null);
      try {
        await new Promise((r) => setTimeout(r, 300));
        const activeCategory = filters.category || category || undefined;
        const sortBy = filters.sortBy || undefined;
        const results = searchProducts(searchQuery, activeCategory, sortBy);
        if (searchQuery.trim()) {
          addRecentSearch(searchQuery);
        }
        setProducts(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : '搜尋失敗');
      } finally {
        setLoading(false);
      }
    },
    [setProducts, setLoading, setError, addRecentSearch, filters.category, filters.sortBy, category]
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

  // Handle category from store (set by homepage CategoryGrid)
  useEffect(() => {
    if (category && !initialLoadDone) {
      setInitialLoadDone(true);
      // Set the filter from the store's category
      if (!filters.category) {
        setFilters({ category });
      }
      // Load products for this category
      setLoading(true);
      const timer = setTimeout(() => {
        const results = searchProducts('', category);
        setProducts(results);
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [category]);

  // When filters.category changes (e.g. cleared via chip), reload
  useEffect(() => {
    if (initialLoadDone && !query.trim()) {
      if (filters.category) {
        setLoading(true);
        const timer = setTimeout(() => {
          const results = searchProducts('', filters.category);
          setProducts(results);
          setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
      } else {
        setProducts([]);
      }
    }
  }, [filters.category]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const hasActiveFilters = !!(filters.category || filters.brand || filters.minPrice != null);

  const handleClearCategory = () => {
    setFilters({ category: undefined });
    setCategory(null);
    setProducts([]);
    setInitialLoadDone(false);
  };

  const activeCategoryLabel = filters.category
    ? CATEGORY_LABELS[filters.category] || filters.category
    : null;

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

        {/* Active category chip */}
        {activeCategoryLabel && (
          <View style={styles.categoryChipRow}>
            <TouchableOpacity
              style={styles.categoryChip}
              onPress={handleClearCategory}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryChipText}>{activeCategoryLabel}</Text>
              <Text style={styles.categoryChipClear}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sort filter chips */}
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
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCountText}>
              共 {products.length} 項產品
            </Text>
            {activeCategoryLabel && (
              <Badge
                label={activeCategoryLabel}
                variant="primary"
                size="small"
              />
            )}
          </View>
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
        </View>
      ) : query ? (
        <EmptyState
          icon="🔍"
          title="沒有找到產品"
          message={`「${query}」的搜尋結果為空`}
        />
      ) : activeCategoryLabel ? (
        <EmptyState
          icon="📂"
          title="此分類暫無產品"
          message={`「${activeCategoryLabel}」分類目前沒有資料`}
          actionLabel="清除篩選"
          onAction={handleClearCategory}
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
  categoryChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '1A',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  categoryChipText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  categoryChipClear: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
    marginLeft: 2,
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
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  resultsCountText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  resultsList: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.xs,
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
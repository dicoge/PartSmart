import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/styles';
import { ProductCard } from '../../src/components/product/ProductCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { Loading } from '../../src/components/ui/Loading';
import { useFavoriteStore } from '../../src/stores/favoriteStore';
import type { ProductSummary } from '../../src/types';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, isLoading, loadFavorites, removeFavorite } =
    useFavoriteStore();

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleProductPress = useCallback(
    (product: ProductSummary) => {
      router.push(`/product/${product.id}`);
    },
    [router]
  );

  const handleRemoveFavorite = useCallback(
    (product: ProductSummary) => {
      Alert.alert('移除收藏', `確定要移除「${product.name}」嗎？`, [
        { text: '取消', style: 'cancel' },
        {
          text: '移除',
          style: 'destructive',
          onPress: () => removeFavorite(product.id),
        },
      ]);
    },
    [removeFavorite]
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>我的收藏</Text>
        </View>
        <Loading message="載入收藏..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>我的收藏</Text>
        {favorites.length > 0 && (
          <Text style={styles.count}>{favorites.length} 件商品</Text>
        )}
      </View>

      {favorites.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="尚無收藏"
          message="瀏覽產品時點擊愛心圖示即可加入收藏"
          actionLabel="去逛逛"
          onAction={() => router.push('/(tabs)/search')}
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onLongPress={() => handleRemoveFavorite(item)}
              delayLongPress={500}
            >
              <View style={styles.productItem}>
                <ProductCard product={item} onPress={handleProductPress} />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
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
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.bg.primary,
  },
  title: {
    ...Typography.h1,
    color: Colors.text.primary,
  },
  count: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
  list: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  productItem: {
    flex: 1,
  },
  columnWrapper: {
    gap: Spacing.md,
  },
});
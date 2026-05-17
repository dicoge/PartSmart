import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../styles';
import { PriceTag } from '../ui/PriceTag';
import { Badge } from '../ui/Badge';
import { CATEGORY_ICONS, CATEGORY_COLORS, SOURCE_NAMES } from '../../utils';
import type { ProductSummary } from '../../types';

interface ProductCardProps {
  product: ProductSummary;
  onPress: (product: ProductSummary) => void;
}

const BRAND_COLORS: Record<string, string> = {
  Intel: '#0071C5', AMD: '#ED1C24', NVIDIA: '#76B900',
  ASUS: '#00A0E9', 技嘉: '#003366', 微星: '#FF0000',
  Samsung: '#1428A0', WD: '#00A98F', Crucial: '#00A3E0',
  Kingston: '#FF8200', Corsair: '#FF6900', Seagate: '#6EB02A',
  Logitech: '#00B8FC', Razer: '#44D62C', Sony: '#000000',
  海韻: '#003D7A', 振華: '#C41E3A', 酷碼: '#E3000F',
  聯力: '#0077B5', Fractal: '#000000', 貓頭鷹: '#FF6600',
  利民: '#333333', 海盜船: '#FF6900', 華碩: '#00A0E9',
  三星: '#1428A0', Dell: '#007DB8',
};

function getSourceLabel(sourceKey: string): string {
  return SOURCE_NAMES[sourceKey] || sourceKey;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const catColor = CATEGORY_COLORS[product.category] || Colors.primary;
  const brandColor = BRAND_COLORS[product.brand] || Colors.text.primary;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <View style={[styles.imageContainer, { backgroundColor: catColor + '10' }]}>
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>
              {CATEGORY_ICONS[product.category] || '📦'}
            </Text>
          </View>
        )}
        {/* Source badge on image */}
        <View style={styles.sourceBadge}>
          <Badge
            label={getSourceLabel(product.lowestSource)}
            variant="success"
            size="small"
          />
        </View>
      </View>

      <View style={styles.info}>
        <Text style={[styles.brand, { color: brandColor }]} numberOfLines={1}>
          {product.brand}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.footer}>
          <PriceTag
            price={product.lowestPrice}
            source={getSourceLabel(product.lowestSource)}
            size="small"
          />
          <Badge
            label={`${product.priceCount} 個報價`}
            variant="neutral"
            size="small"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  imageContainer: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
  },
  sourceBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  info: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  brand: {
    ...Typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
});
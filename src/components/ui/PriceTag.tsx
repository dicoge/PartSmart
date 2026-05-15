import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles';
import { formatPrice } from '../../utils';

interface PriceTagProps {
  price: number;
  currency?: string;
  source?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export function PriceTag({
  price,
  currency = 'TWD',
  source,
  size = 'medium',
  style,
}: PriceTagProps) {
  const formatted = formatPrice(price, currency);

  const priceStyle =
    size === 'large' ? styles.priceLarge
    : size === 'small' ? styles.priceSmall
    : styles.priceMedium;

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.price, priceStyle]}>{formatted}</Text>
      {source && <Text style={styles.source}>{source}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  price: {
    color: Colors.primary,
    fontFamily: Typography.price.fontFamily,
  },
  priceSmall: {
    ...Typography.priceSmall,
  },
  priceMedium: {
    ...Typography.price,
  },
  priceLarge: {
    ...Typography.price,
    fontSize: 26,
    lineHeight: 34,
  },
  source: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
});
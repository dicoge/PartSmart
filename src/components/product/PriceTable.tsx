import React from 'react';
import { View, Text, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../styles';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatPrice, formatStockStatus } from '../../utils';
import type { PriceEntry } from '../../types';

interface PriceTableProps {
  prices: PriceEntry[];
}

function getStockVariant(
  status: string
): 'success' | 'danger' | 'neutral' {
  switch (status) {
    case 'in_stock':
      return 'success';
    case 'out_of_stock':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function PriceTable({ prices }: PriceTableProps) {
  if (prices.length === 0) {
    return (
      <Card padded>
        <Text style={styles.emptyText}>目前暫無價格資料</Text>
      </Card>
    );
  }

  const sorted = [...prices].sort((a, b) => a.price - b.price);

  return (
    <View style={styles.container}>
      {sorted.map((entry, index) => (
        <TouchableOpacity
          key={`${entry.source.id}-${index}`}
          style={[styles.row, index === 0 && styles.bestRow]}
          onPress={() => {
            if (entry.productUrl) {
              Linking.openURL(entry.productUrl);
            }
          }}
          activeOpacity={0.7}
        >
          <View style={styles.sourceInfo}>
            <Text style={styles.sourceName}>{entry.source.name}</Text>
            {index === 0 && (
              <Badge label="最低價" variant="success" size="small" />
            )}
          </View>

          <View style={styles.priceInfo}>
            <Text style={[styles.price, index === 0 && styles.bestPrice]}>
              {formatPrice(entry.price, entry.currency)}
            </Text>
            <Badge
              label={formatStockStatus(entry.stockStatus)}
              variant={getStockVariant(entry.stockStatus)}
              size="small"
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bg.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  bestRow: {
    backgroundColor: Colors.primary + '08',
    borderColor: Colors.primary + '30',
  },
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  sourceName: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  priceInfo: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  price: {
    ...Typography.priceSmall,
    color: Colors.text.primary,
  },
  bestPrice: {
    color: Colors.secondary,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
});
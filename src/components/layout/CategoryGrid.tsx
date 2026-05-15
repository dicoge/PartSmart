import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../styles';
import { CATEGORY_LABELS } from '../../utils';
import type { ProductCategory } from '../../types';

const CATEGORY_ICONS: Record<string, string> = {
  cpu: '⚡',
  gpu: '🎮',
  motherboard: '🔌',
  ram: '🧠',
  ssd: '💾',
  hdd: '💿',
  psu: '🔋',
  case: '🖥️',
  cooler: '❄️',
  monitor: '🖵',
  other: '🔧',
};

interface CategoryGridProps {
  onSelectCategory: (category: ProductCategory) => void;
  selectedCategory?: ProductCategory | null;
}

export function CategoryGrid({
  onSelectCategory,
  selectedCategory,
}: CategoryGridProps) {
  const categories = Object.entries(CATEGORY_LABELS) as [ProductCategory, string][];

  return (
    <View style={styles.grid}>
      {categories.map(([key, label]) => {
        const isSelected = selectedCategory === key;
        return (
          <TouchableOpacity
            key={key}
            style={[styles.item, isSelected && styles.itemSelected]}
            onPress={() => onSelectCategory(key)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{CATEGORY_ICONS[key] || '📦'}</Text>
            <Text
              style={[styles.label, isSelected && styles.labelSelected]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const { width } = Dimensions.get('window');
const itemWidth = (width - Spacing.lg * 2 - Spacing.md * 4) / 5;
const itemCountPerRow = 5;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  item: {
    width: itemWidth,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.md,
    ...Shadow.sm,
  },
  itemSelected: {
    backgroundColor: Colors.primary + '12',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  icon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  labelSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
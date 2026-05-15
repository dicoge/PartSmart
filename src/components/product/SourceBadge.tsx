import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles';
import { Badge } from '../ui/Badge';
import type { PriceSource, SourceType } from '../../types';
import { SOURCE_NAMES } from '../../utils';

interface SourceBadgeProps {
  source: PriceSource;
  size?: 'small' | 'medium';
}

const sourceTypeColors: Record<SourceType, 'primary' | 'success' | 'warning'> = {
  retail: 'primary',
  marketplace: 'success',
  forum: 'warning',
};

function getSourceName(source: PriceSource): string {
  return SOURCE_NAMES[source.id] || source.name;
}

export function SourceBadge({ source, size = 'medium' }: SourceBadgeProps) {
  const variant = sourceTypeColors[source.type] || 'neutral';

  return (
    <View style={styles.container}>
      <Badge label={getSourceName(source)} variant={variant} size={size} />
      <Text style={styles.domain}>{source.domain}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  domain: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
});
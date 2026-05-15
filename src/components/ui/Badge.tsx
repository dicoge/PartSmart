import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  primary: { bg: Colors.primary + '1A', text: Colors.primary },
  success: { bg: Colors.status.inStock + '1A', text: Colors.status.inStock },
  warning: { bg: Colors.warning + '1A', text: Colors.warning },
  danger: { bg: Colors.status.outOfStock + '1A', text: Colors.status.outOfStock },
  neutral: { bg: Colors.bg.tertiary, text: Colors.text.secondary },
};

export function Badge({
  label,
  variant = 'primary',
  size = 'medium',
  style,
}: BadgeProps) {
  const colors = variantStyles[variant];
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          paddingHorizontal: isSmall ? Spacing.sm : Spacing.md,
          paddingVertical: isSmall ? Spacing.xxs : Spacing.xs,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: colors.text },
          isSmall && styles.labelSmall,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 14,
  },
});
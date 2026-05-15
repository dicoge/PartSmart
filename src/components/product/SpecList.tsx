import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles';
import { Card } from '../ui/Card';

interface SpecListProps {
  specs: Record<string, string>;
}

export function SpecList({ specs }: SpecListProps) {
  const entries = Object.entries(specs);

  if (entries.length === 0) {
    return (
      <Card padded>
        <Text style={styles.emptyText}>無規格資訊</Text>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {entries.map(([key, value], index) => (
        <View
          key={key}
          style={[
            styles.row,
            index < entries.length - 1 && styles.border,
          ]}
        >
          <Text style={styles.label}>{key}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.light,
  },
  label: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    flex: 1,
  },
  value: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1.5,
    textAlign: 'right',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
});
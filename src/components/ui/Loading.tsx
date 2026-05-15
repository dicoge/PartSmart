import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing } from '../../styles';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
  style?: ViewStyle;
}

export function Loading({
  message = '載入中...',
  fullScreen = false,
  size = 'large',
  style,
}: LoadingProps) {
  const content = (
    <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
      <ActivityIndicator
        size={size}
        color={Colors.primary}
        style={styles.spinner}
      />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  fullScreen: {
    flex: 1,
  },
  spinner: {
    marginBottom: Spacing.md,
  },
  message: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
});
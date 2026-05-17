import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/styles';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { useUIStore } from '../../src/stores/uiStore';
import { APP_NAME } from '../../src/utils';

export default function SettingsScreen() {
  const { theme, setTheme } = useUIStore();

  const themeOptions = [
    { value: 'light' as const, label: '淺色', icon: '☀️' },
    { value: 'dark' as const, label: '深色', icon: '🌙' },
    { value: 'system' as const, label: '跟隨系統', icon: '📱' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>設定</Text>
      </View>

      {/* Theme Settings */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>主題設定</Text>
        <View style={styles.themeOptions}>
          {themeOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.themeOption,
                theme === opt.value && styles.themeOptionActive,
              ]}
              onPress={() => setTheme(opt.value)}
            >
              <Text style={styles.themeIcon}>{opt.icon}</Text>
              <Text
                style={[
                  styles.themeLabel,
                  theme === opt.value && styles.themeLabelActive,
                ]}
              >
                {opt.label}
              </Text>
              {theme === opt.value && (
                <Badge label="✓" variant="primary" size="small" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* About */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>關於</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>應用程式</Text>
          <Text style={styles.infoValue}>{APP_NAME}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>版本</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>技術</Text>
          <Text style={styles.infoValue}>Expo + React Native</Text>
        </View>
      </Card>

      {/* Links */}
      <Card style={styles.section}>
        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => Linking.openURL('mailto:support@partsmart.app')}
        >
          <Text style={styles.linkText}>📧 聯絡我們</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => Linking.openURL('https://github.com/partsmart')}
        >
          <Text style={styles.linkText}>💻 GitHub</Text>
        </TouchableOpacity>
      </Card>

      {/* Data Source */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>資料來源</Text>
        <Text style={styles.sourceText}>
          價格資料來自各大零售通路及論壇，包括：原價屋、欣亞電子、PCPartPicker、PTT HardwareSale 等。
        </Text>
        <Text style={styles.sourceText}>
          價格可能非即時更新，請以各通路官網為準。
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.secondary,
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.bg.primary,
  },
  title: {
    ...Typography.h1,
    color: Colors.text.primary,
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  themeOptions: {
    gap: Spacing.sm,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  themeOptionActive: {
    backgroundColor: Colors.primary + '0A',
  },
  themeIcon: {
    fontSize: 20,
  },
  themeLabel: {
    ...Typography.body,
    color: Colors.text.primary,
    flex: 1,
  },
  themeLabelActive: {
    fontWeight: '600',
    color: Colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.light,
  },
  infoLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  infoValue: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  linkItem: {
    paddingVertical: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.light,
  },
  linkText: {
    ...Typography.body,
    color: Colors.primary,
  },
  sourceText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
});
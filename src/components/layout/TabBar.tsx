import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../styles';

interface TabBarItem {
  key: string;
  label: string;
  icon: string;
  route: string;
}

interface TabBarProps {
  tabs: TabBarItem[];
  activeTab: string;
  onTabPress: (route: string) => void;
}

export function TabBar({ tabs, activeTab, onTabPress }: TabBarProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.route)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, isActive && styles.activeIcon]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBar.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.tabBar.border,
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
  },
  icon: {
    fontSize: 22,
    marginBottom: Spacing.xxs,
    opacity: 0.5,
  },
  activeIcon: {
    opacity: 1,
  },
  label: {
    ...Typography.caption,
    color: Colors.tabBar.inactive,
    fontSize: 11,
  },
  activeLabel: {
    color: Colors.tabBar.active,
    fontWeight: '600',
  },
});
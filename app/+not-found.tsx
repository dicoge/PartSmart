import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Typography, Spacing, BorderRadius } from '../src/styles';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '頁面不存在' }} />
      <View style={styles.container}>
        <Text style={styles.title}>這個頁面不存在。</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>回到首頁</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.bg.primary,
  },
  title: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  link: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  linkText: {
    ...Typography.bodySmall,
    color: Colors.text.link,
  },
});

import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Colors, Typography, Spacing } from '../src/styles';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>關於 PartSmart</Text>
      <View style={styles.separator} />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg.modal,
  },
  title: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  separator: {
    marginVertical: Spacing.xxxl,
    height: 1,
    width: '80%',
    backgroundColor: Colors.border.light,
  },
});
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode;
  headerBackgroundColor: { dark: string; light: string };
};

export default function MyViewContainer({ children, headerBackgroundColor }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const headerBg = headerBackgroundColor[colorScheme];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { backgroundColor: headerBg }]} />
      <ThemedView style={styles.content}>{children}</ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
     // adjust as needed
    width: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

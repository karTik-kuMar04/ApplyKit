import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { spacing, typography } from '@/lib/theme/tokens';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  const colors = useColors();

  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['3xl'],
    gap: spacing.lg,
  },
  message: {
    ...typography.body,
  },
});

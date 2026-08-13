import { StyleSheet, Text, View } from 'react-native';
import { ErrorIcon } from '@/components/ui/icons';
import { useColors } from '@/lib/theme';
import { spacing, typography } from '@/lib/theme/tokens';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  const colors = useColors();

  return (
    <View style={styles.container} accessibilityRole="alert">
      <ErrorIcon size={32} color={colors.error} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
      {onRetry && <Button title="Try again" onPress={onRetry} variant="secondary" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['3xl'],
    gap: spacing.md,
  },
  title: {
    ...typography.subheading,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    textAlign: 'center',
    maxWidth: 280,
  },
});

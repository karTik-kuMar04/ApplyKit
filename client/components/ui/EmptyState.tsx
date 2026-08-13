import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { spacing, typography } from '@/lib/theme/tokens';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  const colors = useColors();

  return (
    <View style={styles.container} accessibilityRole="text">
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="primary" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
    paddingHorizontal: spacing['2xl'],
    gap: spacing.md,
  },
  icon: {
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.subheading,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    maxWidth: 280,
  },
});

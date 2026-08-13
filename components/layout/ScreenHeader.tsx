import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { spacing, typography } from '@/lib/theme/tokens';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, rightAction }: ScreenHeaderProps) {
  const colors = useColors();

  return (
    <View style={styles.header}>
      <View style={styles.textContainer}>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
        )}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      {rightAction}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  textContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
  },
  title: {
    ...typography.heading,
  },
});

import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { spacing, typography } from '@/lib/theme/tokens';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
        )}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  textContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.subheading,
  },
  subtitle: {
    ...typography.caption,
  },
});

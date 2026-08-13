import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { radius, spacing, typography } from '@/lib/theme/tokens';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'accent';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const colors = useColors();

  const variantColors = {
    default: { bg: colors.borderSubtle, text: colors.textSecondary },
    success: { bg: colors.successMuted, text: colors.success },
    warning: { bg: colors.warningMuted, text: colors.warning },
    error: { bg: colors.errorMuted, text: colors.error },
    accent: { bg: colors.accentMuted, text: colors.accent },
  }[variant];

  return (
    <View style={[styles.badge, { backgroundColor: variantColors.bg }]}>
      <Text style={[styles.text, { color: variantColors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.metadata,
    fontWeight: '500',
  },
});

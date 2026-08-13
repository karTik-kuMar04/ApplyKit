import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { radius, spacing, typography } from '@/lib/theme/tokens';

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export function QuickAction({ icon, label, onPress }: QuickActionProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.action,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.accentMuted }]}>
        {icon}
      </View>
      <Text style={[styles.label, { color: colors.text }]} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.caption,
    fontWeight: '500',
  },
});

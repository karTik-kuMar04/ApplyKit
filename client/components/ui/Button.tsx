import { Pressable, StyleSheet, Text, ActivityIndicator, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { componentSizes, radius, spacing, typography } from '@/lib/theme/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'md' | 'sm';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  accessibilityLabel,
}: ButtonProps) {
  const colors = useColors();
  const isDisabled = disabled || loading;

  const variantStyles = {
    primary: {
      bg: colors.accent,
      bgPressed: colors.accent + 'CC',
      text: '#FFFFFF',
      border: 'transparent',
    },
    secondary: {
      bg: colors.surface,
      bgPressed: colors.borderSubtle,
      text: colors.text,
      border: colors.border,
    },
    ghost: {
      bg: 'transparent',
      bgPressed: colors.borderSubtle,
      text: colors.accent,
      border: 'transparent',
    },
    destructive: {
      bg: colors.errorMuted,
      bgPressed: colors.error + '33',
      text: colors.error,
      border: 'transparent',
    },
  }[variant];

  const height = size === 'sm' ? componentSizes.buttonHeightSm : componentSizes.buttonHeight;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          height,
          backgroundColor: pressed ? variantStyles.bgPressed : variantStyles.bg,
          borderColor: variantStyles.border,
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text} size="small" />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[styles.text, { color: variantStyles.text, fontSize: size === 'sm' ? 14 : 16 }]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  text: {
    ...typography.bodyMedium,
  },
});

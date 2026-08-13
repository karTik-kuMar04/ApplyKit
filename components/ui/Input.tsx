import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { componentSizes, radius, spacing, typography } from '@/lib/theme/tokens';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export function Input({ label, error, required, style, ...props }: InputProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
          {required && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
          },
          style,
        ]}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={label}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: colors.error }]} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    ...typography.caption,
    fontWeight: '500',
  },
  input: {
    height: componentSizes.inputHeight,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    ...typography.body,
  },
  error: {
    ...typography.caption,
  },
});

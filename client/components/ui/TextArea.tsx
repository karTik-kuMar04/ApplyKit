import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { radius, spacing, typography } from '@/lib/theme/tokens';

interface TextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export function TextArea({ label, error, required, style, ...props }: TextAreaProps) {
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
        multiline
        textAlignVertical="top"
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
    minHeight: 120,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
  },
  error: {
    ...typography.caption,
  },
});

import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { SearchIcon } from '@/components/ui/icons';
import { useColors } from '@/lib/theme';
import { componentSizes, radius, spacing, typography } from '@/lib/theme/tokens';

interface SearchInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search',
  ...props
}: SearchInputProps) {
  const colors = useColors();

  return (
    <View style={styles.wrapper}>
      <View style={styles.icon} pointerEvents="none">
        <SearchIcon size={18} color={colors.textMuted} />
      </View>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel="Search"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: spacing.lg,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  input: {
    height: componentSizes.inputHeight,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingLeft: spacing['3xl'] + spacing.sm,
    ...typography.body,
  },
});

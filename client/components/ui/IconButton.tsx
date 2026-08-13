import { Pressable, StyleSheet, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { componentSizes, radius } from '@/lib/theme/tokens';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
  size?: number;
}

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  disabled = false,
  size = componentSizes.iconButton,
}: IconButtonProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          backgroundColor: pressed ? colors.borderSubtle : 'transparent',
          opacity: disabled ? 0.4 : 1,
        },
      ]}
    >
      <View>{icon}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

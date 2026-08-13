import { StyleSheet, View, ViewProps } from 'react-native';
import { useColors } from '@/lib/theme';
import { radius, spacing } from '@/lib/theme/tokens';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevated?: boolean;
  padding?: keyof typeof spacing | number;
}

export function Card({ children, elevated = false, padding = 'lg', style, ...props }: CardProps) {
  const colors = useColors();
  const paddingValue = typeof padding === 'number' ? padding : spacing[padding];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
          borderColor: colors.border,
          padding: paddingValue,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
  },
});

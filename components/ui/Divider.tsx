import { StyleSheet, View, ViewProps } from 'react-native';
import { useColors } from '@/lib/theme';

interface DividerProps extends ViewProps {
  vertical?: boolean;
}

export function Divider({ vertical = false, style, ...props }: DividerProps) {
  const colors = useColors();

  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        { backgroundColor: colors.border },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    height: '100%',
  },
});

import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/lib/theme';
import { spacing } from '@/lib/theme/tokens';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  noPadding?: boolean;
}

export function ScreenContainer({ children, noPadding = false }: ScreenContainerProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingHorizontal: noPadding ? 0 : spacing.lg,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

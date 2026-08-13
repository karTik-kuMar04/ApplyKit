import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { radius, typography } from '@/lib/theme/tokens';

interface InitialsAvatarProps {
  name: string;
  size?: number;
}

export function InitialsAvatar({ name, size = 40 }: InitialsAvatarProps) {
  const colors = useColors();
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.accentMuted,
        },
      ]}
      accessibilityLabel={`Avatar for ${name}`}
    >
      <Text style={[styles.initials, { color: colors.accent, fontSize: size * 0.35 }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
});

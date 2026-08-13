import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { radius, spacing, typography } from '@/lib/theme/tokens';
import { formatRelativeTime } from '@/utils';
import type { ActivityItem } from '@/types';

interface ActivityRowProps {
  item: ActivityItem;
}

export function ActivityRow({ item }: ActivityRowProps) {
  const colors = useColors();

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: colors.accent }]} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>
      <Text style={[styles.time, { color: colors.textMuted }]}>
        {formatRelativeTime(item.timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.caption,
    fontWeight: '500',
  },
  subtitle: {
    ...typography.metadata,
  },
  time: {
    ...typography.metadata,
  },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRightIcon } from '@/components/ui/icons';
import { useColors } from '@/lib/theme';
import { radius, spacing, typography } from '@/lib/theme/tokens';
import { APPLICATION_STATUS_LABELS } from '@/constants';
import { formatRelativeTime } from '@/utils';
import { Badge } from '@/components/ui';
import type { Application, ApplicationStatus } from '@/types';

const STATUS_VARIANT: Record<ApplicationStatus, 'default' | 'accent' | 'success' | 'warning' | 'error'> = {
  draft: 'default',
  ready: 'accent',
  applied: 'default',
  interview: 'success',
  offer: 'success',
  rejected: 'error',
  withdrawn: 'default',
};

interface ApplicationCardProps {
  application: Application;
  onPress: () => void;
}

export function ApplicationCard({ application, onPress }: ApplicationCardProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${application.company}, ${application.role}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.company, { color: colors.text }]} numberOfLines={1}>
          {application.company}
        </Text>
        <Text style={[styles.role, { color: colors.textSecondary }]} numberOfLines={1}>
          {application.role}
        </Text>
        <View style={styles.meta}>
          {application.location ? (
            <Text style={[styles.location, { color: colors.textMuted }]} numberOfLines={1}>
              {application.location}
            </Text>
          ) : null}
          <Text style={[styles.updated, { color: colors.textMuted }]}>
            {formatRelativeTime(application.updatedAt)}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <Badge
          label={APPLICATION_STATUS_LABELS[application.status]}
          variant={STATUS_VARIANT[application.status]}
        />
        <ArrowRightIcon size={18} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  company: {
    ...typography.bodyMedium,
  },
  role: {
    ...typography.caption,
  },
  meta: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  location: {
    ...typography.metadata,
    flex: 1,
  },
  updated: {
    ...typography.metadata,
  },
  right: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
});

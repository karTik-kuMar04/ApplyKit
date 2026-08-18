import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ResumeIcon } from '@/components/ui/icons';
import { useColors } from '@/lib/theme';
import { radius, spacing, typography } from '@/lib/theme/tokens';
import { formatRelativeTime } from '@/utils';
import { StatusIndicator } from './StatusIndicator';
import type { SyncStatus } from '@/types';

interface DocumentCardProps {
  fileName: string;
  fileType?: string;
  updatedAt?: string;
  syncStatus?: SyncStatus;
  metadata?: string;
  onPress?: () => void;
  action?: React.ReactNode;
}

export function DocumentCard({
  fileName,
  fileType = 'PDF',
  updatedAt,
  syncStatus,
  metadata,
  onPress,
  action,
}: DocumentCardProps) {
  const colors = useColors();

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.accentMuted }]}>
        <ResumeIcon size={24} color={colors.accent} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>
          {fileName}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {[fileType, metadata].filter(Boolean).join(' · ')}
          </Text>
          {updatedAt && (
            <Text style={[styles.meta, { color: colors.textMuted }]}>
              · {formatRelativeTime(updatedAt)}
            </Text>
          )}
        </View>
        {syncStatus && <StatusIndicator status={syncStatus} />}
      </View>
      {action}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Open ${fileName}`}
        style={({ pressed }: { pressed: boolean }) => [{ opacity: pressed ? 0.7 : 1 }]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
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
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  fileName: {
    ...typography.bodyMedium,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    ...typography.caption,
  },
});

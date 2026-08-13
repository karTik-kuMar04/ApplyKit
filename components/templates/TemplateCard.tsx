import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRightIcon, CopyIcon, DeleteIcon } from '@/components/ui/icons';
import { useColors } from '@/lib/theme';
import { radius, spacing, typography } from '@/lib/theme/tokens';
import { formatRelativeTime } from '@/utils';
import { IconButton } from '@/components/ui';

interface TemplateCardProps {
  name: string;
  description: string;
  updatedAt: string;
  onPress: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function TemplateCard({
  name,
  description,
  updatedAt,
  onPress,
  onDuplicate,
  onDelete,
}: TemplateCardProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Template: ${name}`}
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
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.description, { color: colors.textMuted }]} numberOfLines={2}>
          {description}
        </Text>
        <Text style={[styles.updated, { color: colors.textMuted }]}>
          Updated {formatRelativeTime(updatedAt)}
        </Text>
      </View>
      <View style={styles.actions}>
        {onDuplicate && (
          <IconButton
            icon={<CopyIcon size={18} color={colors.textSecondary} />}
            onPress={onDuplicate}
            accessibilityLabel={`Duplicate ${name}`}
            size={36}
          />
        )}
        {onDelete && (
          <IconButton
            icon={<DeleteIcon size={18} color={colors.error} />}
            onPress={onDelete}
            accessibilityLabel={`Delete ${name}`}
            size={36}
          />
        )}
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
  name: {
    ...typography.bodyMedium,
  },
  description: {
    ...typography.caption,
  },
  updated: {
    ...typography.metadata,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});

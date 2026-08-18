import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { radius, spacing, typography } from '@/lib/theme/tokens';
import { ResumeIcon } from '@/components/ui/icons';

interface ResumePreviewPlaceholderProps {
  original_filename: string;
  pageCount: number;
  onPress?: () => void;
}

export function ResumePreviewPlaceholder({
  original_filename,
  pageCount,
  onPress,
}: ResumePreviewPlaceholderProps) {
  const colors = useColors();

  const content = (
    <View style={[styles.container, { backgroundColor: colors.borderSubtle, borderColor: colors.border }]}>
      <View style={[styles.page, { backgroundColor: colors.surface }]}>
        <View style={styles.topBar}>
          <View style={[styles.header, { backgroundColor: colors.accentMuted }]}>
            <ResumeIcon size={24} color={colors.accent} />
          </View>
          {onPress && (
            <View style={[styles.badge, { backgroundColor: colors.accentMuted }]}>
              <Text style={[styles.badgeText, { color: colors.accent }]}>Tap to open PDF</Text>
            </View>
          )}
        </View>
        <View style={styles.lines}>
          {[0.9, 0.7, 0.85, 0.6, 0.75, 0.5].map((width, i) => (
            <View
              key={i}
              style={[styles.line, { backgroundColor: colors.border, width: `${width * 100}%` }]}
            />
          ))}
        </View>
        <Text style={[styles.label, { color: colors.textMuted }]} numberOfLines={1}>
          {original_filename}
        </Text>
      </View>
      {pageCount > 1 && (
        <Text style={[styles.pageCount, { color: colors.textMuted }]}>
          {pageCount} pages
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Open ${original_filename}`}
        style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  page: {
    width: '100%',
    aspectRatio: 0.707,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.lg,
    maxHeight: 360,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '600',
  },
  lines: {
    flex: 1,
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  line: {
    height: 8,
    borderRadius: 4,
  },
  label: {
    ...typography.caption,
    textAlign: 'center',
  },
  pageCount: {
    ...typography.metadata,
  },
});

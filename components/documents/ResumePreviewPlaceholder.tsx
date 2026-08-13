import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { radius, spacing, typography } from '@/lib/theme/tokens';
import { FileText } from 'lucide-react-native';

interface ResumePreviewPlaceholderProps {
  fileName: string;
  pageCount: number;
}

export function ResumePreviewPlaceholder({ fileName, pageCount }: ResumePreviewPlaceholderProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.borderSubtle, borderColor: colors.border }]}>
      <View style={[styles.page, { backgroundColor: colors.surface }]}>
        <View style={[styles.header, { backgroundColor: colors.accentMuted }]}>
          <FileText size={24} color={colors.accent} />
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
          {fileName}
        </Text>
      </View>
      {pageCount > 1 && (
        <Text style={[styles.pageCount, { color: colors.textMuted }]}>
          {pageCount} pages
        </Text>
      )}
    </View>
  );
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
  header: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
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

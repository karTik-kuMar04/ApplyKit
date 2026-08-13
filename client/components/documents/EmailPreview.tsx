import { StyleSheet, Text, View } from 'react-native';
import { PaperclipIcon } from '@/components/ui/icons';
import { useColors } from '@/lib/theme';
import { radius, spacing, typography } from '@/lib/theme/tokens';

interface EmailPreviewProps {
  to: string;
  subject: string;
  body: string;
  attachments?: string[];
}

export function EmailPreview({ to, subject, body, attachments = [] }: EmailPreviewProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textMuted }]}>To</Text>
        <Text style={[styles.value, { color: colors.text }]}>{to || '—'}</Text>
      </View>
      <View style={[styles.separator, { backgroundColor: colors.border }]} />
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Subject</Text>
        <Text style={[styles.value, { color: colors.text }]}>{subject}</Text>
      </View>
      <View style={[styles.separator, { backgroundColor: colors.border }]} />
      <Text style={[styles.body, { color: colors.text }]}>{body}</Text>
      {attachments.length > 0 && (
        <>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <View style={styles.attachments}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Attachments</Text>
            {attachments.map((file) => (
              <View key={file} style={styles.attachmentRow}>
                <PaperclipIcon size={14} color={colors.accent} />
                <Text style={[styles.attachmentName, { color: colors.accent }]}>{file}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  field: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  label: {
    ...typography.metadata,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    ...typography.body,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  body: {
    ...typography.body,
    lineHeight: 24,
    padding: spacing.lg,
  },
  attachments: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  attachmentName: {
    ...typography.caption,
    fontWeight: '500',
  },
});

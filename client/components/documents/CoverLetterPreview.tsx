import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/lib/theme';
import { radius, spacing, typography } from '@/lib/theme/tokens';
import { formatDate } from '@/utils';

interface CoverLetterPreviewProps {
  company: string;
  role: string;
  hiringManager: string;
  body: string;
}

export function CoverLetterPreview({
  company,
  role,
  hiringManager,
  body,
}: CoverLetterPreviewProps) {
  const colors = useColors();
  const today = formatDate(new Date().toISOString());

  return (
    <View style={[styles.document, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Cover Letter — {role} at {company}
      </Text>
      <Text style={[styles.date, { color: colors.textMuted }]}>{today}</Text>
      <Text style={[styles.recipient, { color: colors.textSecondary }]}>
        {hiringManager || 'Hiring Manager'}
      </Text>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <Text style={[styles.body, { color: colors.text }]}>{body}</Text>
      <Text style={[styles.closing, { color: colors.textSecondary }]}>
        Best regards,{'\n'}Kartik Kumar
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  document: {
    padding: spacing['2xl'],
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
  },
  title: {
    ...typography.subheading,
  },
  date: {
    ...typography.caption,
  },
  recipient: {
    ...typography.bodyMedium,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.sm,
  },
  body: {
    ...typography.body,
    lineHeight: 24,
  },
  closing: {
    ...typography.body,
    marginTop: spacing.lg,
  },
});

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Pressable,
} from 'react-native';
import {
  PenLine,
  Mail,
  FileText,
  ChevronDown,
} from 'lucide-react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import {
  Card,
  Badge,
  Button,
  Divider,
  LoadingState,
  ErrorState,
  IconButton,
} from '@/components/ui';
import { useColors } from '@/lib/theme';
import { spacing, typography, radius } from '@/lib/theme/tokens';
import { APPLICATION_STATUS_LABELS } from '@/constants';
import { formatDate, formatRelativeTime } from '@/utils';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { applicationService } from '@/services';
import type { ApplicationStatus } from '@/types';

const STATUS_OPTIONS: ApplicationStatus[] = [
  'draft',
  'ready',
  'applied',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
];

export default function ApplicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const { data: app, loading, error, refetch } = useAsyncData(
    () => applicationService.getApplication(id!),
    [id]
  );

  const updateStatus = useAsyncAction(
    (status: ApplicationStatus) => applicationService.updateStatus(id!, status)
  );

  const handleStatusChange = async (status: ApplicationStatus) => {
    setShowStatusPicker(false);
    await updateStatus.execute(status);
    refetch();
  };

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading application…" />
      </ScreenContainer>
    );
  }

  if (error || !app) {
    return (
      <ScreenContainer>
        <ErrorState
          message={error ?? 'Application not found.'}
          onRetry={refetch}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScreenHeader
          title={app.company}
          subtitle={app.role}
          rightAction={
            <Button
              title="Edit"
              variant="ghost"
              size="sm"
              onPress={() => router.push({ pathname: '/applications/new', params: { editId: id } })}
            />
          }
        />

        <Pressable
          onPress={() => setShowStatusPicker(!showStatusPicker)}
          style={[styles.statusButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Change status"
        >
          <Badge label={APPLICATION_STATUS_LABELS[app.status]} variant="accent" />
          <ChevronDown size={16} color={colors.textMuted} />
        </Pressable>

        {showStatusPicker && (
          <Card style={styles.statusPicker}>
            {STATUS_OPTIONS.map((status) => (
              <Pressable
                key={status}
                onPress={() => handleStatusChange(status)}
                style={({ pressed }) => [
                  styles.statusOption,
                  { opacity: pressed ? 0.7 : 1, backgroundColor: app.status === status ? colors.accentMuted : 'transparent' },
                ]}
              >
                <Text style={[styles.statusOptionText, { color: colors.text }]}>
                  {APPLICATION_STATUS_LABELS[status]}
                </Text>
              </Pressable>
            ))}
          </Card>
        )}

        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Details</Text>
          <DetailRow label="Location" value={app.location} colors={colors} />
          <DetailRow label="Applied" value={app.dateApplied ? formatDate(app.dateApplied) : 'Not yet'} colors={colors} />
          <DetailRow label="Hiring Manager" value={app.hiringManager} colors={colors} />
          <DetailRow label="Email" value={app.email} colors={colors} />
          <DetailRow label="Updated" value={formatRelativeTime(app.updatedAt)} colors={colors} />
          {app.notes && (
            <>
              <Divider style={{ marginVertical: spacing.md }} />
              <Text style={[styles.notesLabel, { color: colors.textSecondary }]}>Notes</Text>
              <Text style={[styles.notes, { color: colors.text }]}>{app.notes}</Text>
            </>
          )}
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Documents</Text>
        <Card style={styles.section}>
          <DocRow
            icon={<FileText size={18} color={colors.accent} />}
            label="Resume"
            value={app.resumeUsed ?? 'Not attached'}
            colors={colors}
            onPress={() => router.push('/(tabs)/resume')}
          />
          <Divider style={{ marginVertical: spacing.sm }} />
          <DocRow
            icon={<PenLine size={18} color={colors.accent} />}
            label="Cover Letter"
            value={app.coverLetterUsed ?? 'Not created'}
            colors={colors}
            onPress={() =>
              router.push({
                pathname: '/cover-letter/create',
                params: { company: app.company, role: app.role, hiringManager: app.hiringManager ?? '' },
              })
            }
          />
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions</Text>
        <View style={styles.actions}>
          <Button
            title="Create Cover Letter"
            onPress={() =>
              router.push({
                pathname: '/cover-letter/create',
                params: { company: app.company, role: app.role, hiringManager: app.hiringManager ?? '' },
              })
            }
            fullWidth
          />
          <Button
            title="Prepare Email"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: '/email/prepare',
                params: { company: app.company, role: app.role, hiringManager: app.hiringManager ?? '' },
              })
            }
            fullWidth
          />
          <Button
            title="Open Resume"
            variant="ghost"
            onPress={() => router.push('/(tabs)/resume')}
            fullWidth
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function DetailRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string | null | undefined;
  colors: ReturnType<typeof import('@/lib/theme').useColors>;
}) {
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function DocRow({
  icon,
  label,
  value,
  colors,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colors: ReturnType<typeof import('@/lib/theme').useColors>;
  onPress?: () => void;
}) {
  const content = (
    <View style={styles.docRow}>
      {icon}
      <View style={styles.docContent}>
        <Text style={[styles.docLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.docValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing['4xl'],
    gap: spacing.lg,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  statusPicker: {
    gap: spacing.xs,
    padding: spacing.sm,
  },
  statusOption: {
    padding: spacing.md,
    borderRadius: radius.sm,
  },
  statusOptionText: {
    ...typography.body,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.subheading,
    marginBottom: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  detailLabel: {
    ...typography.caption,
  },
  detailValue: {
    ...typography.caption,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  notesLabel: {
    ...typography.caption,
    fontWeight: '500',
  },
  notes: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  docContent: {
    flex: 1,
    gap: 2,
  },
  docLabel: {
    ...typography.metadata,
  },
  docValue: {
    ...typography.bodyMedium,
  },
  actions: {
    gap: spacing.md,
  },
});

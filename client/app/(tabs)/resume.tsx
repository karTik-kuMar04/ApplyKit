import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { ShareIcon, SyncIcon } from '@/components/ui/icons';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ResumePreviewPlaceholder } from '@/components/documents/ResumePreviewPlaceholder';
import {
  Card,
  Button,
  StatusIndicator,
  LoadingState,
  ErrorState,
  IconButton,
} from '@/components/ui';
import { useColors } from '@/lib/theme';
import { spacing, typography } from '@/lib/theme/tokens';
import { formatRelativeTime, formatDate } from '@/utils';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { resumeService } from '@/services';

export default function ResumeScreen() {
  const colors = useColors();
  const { data: resume, loading, error, refetch } = useAsyncData(
    () => resumeService.getResume(),
    []
  );

  const syncAction = useAsyncAction(async () => {
    const result = await resumeService.syncResume();
    if (result.success) {
      refetch();
    }
    return result;
  });

  const shareAction = useAsyncAction(() => resumeService.shareResume());

  const handleSync = async () => {
    const result = await syncAction.execute();
    if (result) {
      Alert.alert('Synced', 'Resume is up to date.');
    }
  };

  const handleShare = async () => {
    const result = await shareAction.execute();
    if (result) {
      Alert.alert('Shared', result.message);
    }
  };

  const sizeKB = resume?.size_bytes
    ? (Number(resume.size_bytes) / 1024).toFixed(1) + ' KB'
    : '';

  if (loading && !resume) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading resume…" />
      </ScreenContainer>
    );
  }

  if (error && !resume) {
    return (
      <ScreenContainer>
        <ErrorState message={error} onRetry={refetch} />
      </ScreenContainer>
    );
  }

  const isSyncing = syncAction.loading;
  const displayStatus = isSyncing ? 'syncing' : (resume?.syncStatus ?? 'synced');

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScreenHeader
          title="Resume"
          subtitle="Your current resume"
          rightAction={
            <View style={styles.headerActions}>
              <IconButton
                icon={<ShareIcon size={20} color={colors.textSecondary} />}
                onPress={handleShare}
                accessibilityLabel="Share resume"
                disabled={shareAction.loading}
              />
              <IconButton
                icon={<SyncIcon size={20} color={colors.textSecondary} />}
                onPress={handleSync}
                accessibilityLabel="Sync resume"
                disabled={isSyncing}
              />
            </View>
          }
        />

        {resume && (
          <>
            <ResumePreviewPlaceholder
              original_filename={resume.original_filename}
              pageCount={resume.pageCount || 2}
            />

            <Card style={styles.metaCard}>
              <View style={styles.currentBadge}>
                <View style={[styles.currentDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.currentLabel, { color: colors.success }]}>
                  Current version
                </Text>
              </View>

              <Text style={[styles.fileName, { color: colors.text }]}>
                {resume.original_filename}
              </Text>

              <View style={styles.metaRow}>
                <Text style={[styles.meta, { color: colors.textMuted }]}>
                  PDF · {sizeKB} · {resume.pageCount || 2} pages
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={[styles.meta, { color: colors.textMuted }]}>
                  Updated {formatDate(resume.uploaded_at)}
                </Text>
              </View>

              <StatusIndicator
                status={displayStatus}
                label={
                  displayStatus === 'synced' && resume.lastSyncedAt
                    ? `Synced ${formatRelativeTime(resume.lastSyncedAt)}`
                    : displayStatus === 'syncing'
                    ? 'Syncing...'
                    : undefined
                }
              />

              {syncAction.error && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {syncAction.error}
                </Text>
              )}
            </Card>

            <View style={styles.actions}>
              <Button
                title="Sync Resume"
                onPress={handleSync}
                loading={isSyncing}
                fullWidth
              />
              <Button
                title="Share"
                variant="secondary"
                onPress={handleShare}
                loading={shareAction.loading}
                fullWidth
              />
            </View>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing['4xl'],
    gap: spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  metaCard: {
    gap: spacing.md,
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  currentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  currentLabel: {
    ...typography.caption,
    fontWeight: '600',
  },
  fileName: {
    ...typography.subheading,
  },
  metaRow: {
    flexDirection: 'row',
  },
  meta: {
    ...typography.caption,
  },
  errorText: {
    ...typography.caption,
  },
  actions: {
    gap: spacing.md,
  },
});

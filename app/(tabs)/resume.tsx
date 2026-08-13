import { useState } from 'react';
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
import type { Resume } from '@/types';

export default function ResumeScreen() {
  const colors = useColors();
  const [localResume, setLocalResume] = useState<Resume | null>(null);

  const resume = useAsyncData(async () => {
    const result = await resumeService.getResume();
    if (result.success) setLocalResume(result.data);
    return result;
  }, []);

  const syncAction = useAsyncAction(() => resumeService.syncResume());
  const shareAction = useAsyncAction(() => resumeService.shareResume());

  const current = localResume ?? resume.data;

  const handleSync = async () => {
    const result = await syncAction.execute();
    if (result) {
      setLocalResume(result);
      resume.refetch();
    }
  };

  const handleShare = async () => {
    const result = await shareAction.execute();
    if (result) {
      Alert.alert('Shared', result.message);
    }
  };

  if (resume.loading && !current) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading resume…" />
      </ScreenContainer>
    );
  }

  if (resume.error && !current) {
    return (
      <ScreenContainer>
        <ErrorState message={resume.error} onRetry={resume.refetch} />
      </ScreenContainer>
    );
  }

  const isSyncing = current?.syncStatus === 'syncing' || syncAction.loading;
  const displayStatus = isSyncing ? 'syncing' : current?.syncStatus ?? 'synced';

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

        {current && (
          <>
            <ResumePreviewPlaceholder
              fileName={current.fileName}
              pageCount={current.pageCount}
            />

            <Card style={styles.metaCard}>
              <View style={styles.currentBadge}>
                <View style={[styles.currentDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.currentLabel, { color: colors.success }]}>
                  Current version
                </Text>
              </View>

              <Text style={[styles.fileName, { color: colors.text }]}>
                {current.fileName}
              </Text>

              <View style={styles.metaRow}>
                <Text style={[styles.meta, { color: colors.textMuted }]}>
                  PDF · {current.fileSize} · {current.pageCount} pages
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={[styles.meta, { color: colors.textMuted }]}>
                  Updated {formatDate(current.updatedAt)}
                </Text>
              </View>

              <StatusIndicator
                status={displayStatus}
                label={
                  displayStatus === 'synced' && current.lastSyncedAt
                    ? `Synced ${formatRelativeTime(current.lastSyncedAt)}`
                    : undefined
                }
              />

              {displayStatus === 'offline' && (
                <View style={[styles.offlineBanner, { backgroundColor: colors.warningMuted }]}>
                  <Text style={[styles.offlineText, { color: colors.warning }]}>
                    You're offline. Showing your most recently cached resume.
                  </Text>
                </View>
              )}

              {displayStatus === 'failed' && (
                <View style={[styles.offlineBanner, { backgroundColor: colors.errorMuted }]}>
                  <Text style={[styles.offlineText, { color: colors.error }]}>
                    Couldn't sync your resume. Your cached copy is still available.
                  </Text>
                  <Button
                    title="Retry sync"
                    variant="secondary"
                    size="sm"
                    onPress={handleSync}
                    loading={isSyncing}
                  />
                </View>
              )}

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
  offlineBanner: {
    padding: spacing.md,
    borderRadius: 8,
    gap: spacing.sm,
  },
  offlineText: {
    ...typography.caption,
  },
  errorText: {
    ...typography.caption,
  },
  actions: {
    gap: spacing.md,
  },
});

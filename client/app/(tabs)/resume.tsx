import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { DownloadIcon, ShareIcon, SyncIcon } from '@/components/ui/icons';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import {
  ResumePdfViewer,
  ResumeFullScreenModal,
} from '@/components/documents';
import {
  Card,
  Button,
  StatusIndicator,
  LoadingState,
  ErrorState,
  IconButton,
} from '@/components/ui';
import { useColors } from '@/lib/theme';
import { radius, spacing, typography } from '@/lib/theme/tokens';
import { formatRelativeTime, formatDate } from '@/utils';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { resumeService } from '@/services';

export default function ResumeScreen() {
  const colors = useColors();
  const [isFullScreen, setIsFullScreen] = useState(false);

  // 1. Fetch metadata from GET /api/resume/meta
  const {
    data: resume,
    loading: metaLoading,
    error: metaError,
    refetch: refetchMeta,
  } = useAsyncData(() => resumeService.getResume(), []);

  // 2. Fetch signed temporary PDF download URL from GET /api/resume/url
  const {
    data: urlData,
    loading: urlLoading,
    error: urlError,
    refetch: refetchUrl,
  } = useAsyncData(() => resumeService.getResumeUrl(), []);

  // Sync action refreshes both metadata and the temporary signed URL
  const syncAction = useAsyncAction(async () => {
    const result = await resumeService.syncResume();
    if (result.success) {
      refetchMeta();
      refetchUrl();
    }
    return result;
  });

  const shareAction = useAsyncAction(() => resumeService.shareResume());

  const downloadAction = useAsyncAction(async () => {
    const filename = resume?.original_filename || 'resume.pdf';
    return resumeService.downloadResume(filename);
  });

  const handleDownload = async () => {
    await downloadAction.execute();
  };

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

  const initialLoading = (metaLoading || urlLoading) && !resume && !urlData;
  const initialError = metaError || urlError;

  if (initialLoading) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading resume…" />
      </ScreenContainer>
    );
  }

  if (initialError && !resume) {
    return (
      <ScreenContainer>
        <ErrorState
          message={initialError}
          onRetry={() => {
            refetchMeta();
            refetchUrl();
          }}
        />
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
                icon={<DownloadIcon size={20} color={colors.textSecondary} />}
                onPress={handleDownload}
                accessibilityLabel="Download resume"
                disabled={downloadAction.loading || !urlData?.url}
              />
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

        {/* In-app PDF Preview Container with full screen trigger */}
        {urlData?.url ? (
          <View style={styles.previewWrapper}>
            <ResumePdfViewer
              url={urlData.url}
              original_filename={resume?.original_filename}
              height={380}
              onRetry={refetchUrl}
            />

            {/* Click to open full screen overlay button */}
            <TouchableOpacity
              style={[
                styles.fullScreenButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => setIsFullScreen(true)}
              activeOpacity={0.85}
              accessibilityLabel="Open resume in full screen"
            >
              <Text style={[styles.fullScreenButtonText, { color: colors.text }]}>
                ⛶ Open Full Screen
              </Text>
            </TouchableOpacity>
          </View>
        ) : urlLoading ? (
          <LoadingState message="Fetching signed PDF link..." />
        ) : (
          <ErrorState
            message={urlError || "Couldn't load resume URL."}
            onRetry={refetchUrl}
          />
        )}

        {resume && (
          <>
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
                title="Open Full Screen"
                variant="primary"
                onPress={() => setIsFullScreen(true)}
                disabled={!urlData?.url}
                fullWidth
              />
              <Button
                title="Download PDF"
                variant="secondary"
                onPress={handleDownload}
                loading={downloadAction.loading}
                disabled={!urlData?.url}
                fullWidth
              />
              <Button
                title="Sync Resume"
                variant="secondary"
                onPress={handleSync}
                loading={isSyncing}
                fullWidth
              />
            </View>
          </>
        )}
      </ScrollView>

      {/* Full Screen In-App PDF Modal with Close & Download buttons */}
      {urlData?.url && (
        <ResumeFullScreenModal
          visible={isFullScreen}
          onClose={() => setIsFullScreen(false)}
          url={urlData.url}
          filename={resume?.original_filename}
          onRetry={refetchUrl}
        />
      )}
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
  previewWrapper: {
    position: 'relative',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  fullScreenButton: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  fullScreenButtonText: {
    ...typography.caption,
    fontWeight: '600',
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

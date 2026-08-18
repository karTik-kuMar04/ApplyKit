import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '@/lib/theme';
import { radius, spacing, typography } from '@/lib/theme/tokens';
import { CloseIcon, DownloadIcon } from '@/components/ui/icons';
import { resumeService } from '@/services';
import { ResumePdfViewer } from './ResumePdfViewer';

interface ResumeFullScreenModalProps {
  visible: boolean;
  onClose: () => void;
  url: string;
  filename?: string;
  onRetry?: () => void;
}

export function ResumeFullScreenModal({
  visible,
  onClose,
  url,
  filename = 'resume.pdf',
  onRetry,
}: ResumeFullScreenModalProps) {
  const colors = useColors();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await resumeService.downloadResume(filename);
      if (!res.success) {
        Alert.alert('Download Error', res.error?.message || 'Failed to download resume.');
      }
    } catch (err: any) {
      Alert.alert('Download Error', err.message || 'Failed to download resume.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.modalSafeContainer, { backgroundColor: colors.background }]}
      >
        <View
          style={[
            styles.modalHeader,
            { backgroundColor: colors.surface, borderBottomColor: colors.border },
          ]}
        >
          <View style={styles.titleContainer}>
            <Text
              style={[styles.modalTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {filename}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.accent, borderColor: colors.accent },
              ]}
              onPress={handleDownload}
              disabled={downloading}
              activeOpacity={0.8}
              accessibilityLabel="Download Resume PDF"
            >
              {downloading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <DownloadIcon size={18} color="#FFFFFF" />
              )}
              <Text style={styles.downloadText}>
                {downloading ? 'Downloading...' : 'Download'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityLabel="Close full screen resume viewer"
            >
              <CloseIcon size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.viewerContainer}>
          <ResumePdfViewer
            url={url}
            original_filename={filename}
            height="100%"
            onRetry={onRetry}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalSafeContainer: {
    flex: 1,
  },
  modalHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    zIndex: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  modalTitle: {
    ...typography.subheading,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.md,
  },
  downloadText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
});

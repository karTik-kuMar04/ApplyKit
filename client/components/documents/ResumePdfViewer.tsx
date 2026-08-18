import { useState } from 'react';
import {
  ActivityIndicator,
  DimensionValue,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useColors } from '@/lib/theme';
import { radius, spacing, typography } from '@/lib/theme/tokens';
import { Button } from '@/components/ui';

interface ResumePdfViewerProps {
  url: string;
  original_filename?: string;
  height?: DimensionValue;
  onRetry?: () => void;
}

export function ResumePdfViewer({
  url,
  original_filename,
  height = 420,
  onRetry,
}: ResumePdfViewerProps) {
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const containerStyle = {
    height,
    flex: height === '100%' ? 1 : undefined,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  };

  if (hasError) {
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.stateContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            Unable to display PDF
          </Text>
          <Text style={[styles.subText, { color: colors.textMuted }]}>
            The signed link may have expired or network failed.
          </Text>
          {onRetry && (
            <Button
              title="Reload PDF"
              variant="secondary"
              size="sm"
              onPress={() => {
                setHasError(false);
                setLoading(true);
                onRetry();
              }}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {Platform.OS === 'web' ? (
        <View style={styles.webContainer}>
          {/* Native Web PDF Embedding — keeps signed URL private to this client instance */}
          <iframe
            src={`${url}#toolbar=0&navpanes=0`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: radius.md,
              backgroundColor: 'transparent',
            }}
            title={original_filename || 'Resume PDF'}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setHasError(true);
            }}
          />
        </View>
      ) : (
        <WebView
          source={{ uri: url }}
          style={styles.webview}
          originWhitelist={['*']}
          scalesPageToFit
          bounces={false}
          scrollEnabled
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setHasError(true);
          }}
        />
      )}

      {loading && (
        <View
          style={[
            styles.loadingOverlay,
            { backgroundColor: colors.surface },
          ]}
          pointerEvents="none"
        >
          <ActivityIndicator color={colors.accent} size="small" />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading resume...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  webContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: radius.md,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    zIndex: 10,
  },
  loadingText: {
    ...typography.caption,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  errorText: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  subText: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
});

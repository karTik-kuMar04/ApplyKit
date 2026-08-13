import { StyleSheet, Text, View } from 'react-native';
import { Check, RefreshCw, WifiOff, AlertCircle } from 'lucide-react-native';
import { useColors } from '@/lib/theme';
import { spacing, typography } from '@/lib/theme/tokens';
import type { SyncStatus } from '@/types';

interface StatusIndicatorProps {
  status: SyncStatus;
  label?: string;
}

const STATUS_CONFIG: Record<
  SyncStatus,
  { icon: typeof Check; colorKey: 'success' | 'accent' | 'warning' | 'error'; defaultLabel: string }
> = {
  synced: { icon: Check, colorKey: 'success', defaultLabel: 'Synced' },
  syncing: { icon: RefreshCw, colorKey: 'accent', defaultLabel: 'Syncing…' },
  offline: { icon: WifiOff, colorKey: 'warning', defaultLabel: 'Offline' },
  failed: { icon: AlertCircle, colorKey: 'error', defaultLabel: 'Sync failed' },
};

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const colors = useColors();
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const color = colors[config.colorKey];

  return (
    <View style={styles.container} accessibilityRole="text">
      <Icon size={14} color={color} />
      <Text style={[styles.label, { color }]}>{label ?? config.defaultLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: '500',
  },
});

import { StyleSheet, Text, View } from 'react-native';
import { CheckIcon, SyncIcon, WifiOffIcon, ErrorIcon } from '@/components/ui/icons';
import { useColors } from '@/lib/theme';
import { spacing, typography } from '@/lib/theme/tokens';
import type { SyncStatus } from '@/types';

interface StatusIndicatorProps {
  status: SyncStatus;
  label?: string;
}

type IconComponent = typeof CheckIcon;

const STATUS_CONFIG: Record<
  SyncStatus,
  { icon: IconComponent; colorKey: 'success' | 'accent' | 'warning' | 'error'; defaultLabel: string }
> = {
  synced: { icon: CheckIcon, colorKey: 'success', defaultLabel: 'Synced' },
  syncing: { icon: SyncIcon, colorKey: 'accent', defaultLabel: 'Syncing…' },
  offline: { icon: WifiOffIcon, colorKey: 'warning', defaultLabel: 'Offline' },
  failed: { icon: ErrorIcon, colorKey: 'error', defaultLabel: 'Sync failed' },
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

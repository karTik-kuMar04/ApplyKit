import { ScrollView, StyleSheet, Text, View, Pressable, Switch } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card, Divider } from '@/components/ui';
import { useTheme } from '@/lib/theme';
import { spacing, typography, radius } from '@/lib/theme/tokens';
import { APP_VERSION } from '@/constants';
import { preferencesService } from '@/services';
import { useAsyncData } from '@/hooks/useAsyncData';
import type { ThemeMode } from '@/types';

export default function SettingsScreen() {
  const { colors, themeMode, setThemeMode } = useTheme();
  const prefs = useAsyncData(() => preferencesService.getPreferences(), []);

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    preferencesService.updatePreferences({ themeMode: mode });
  };

  const handleAutoSync = async (value: boolean) => {
    await preferencesService.updatePreferences({ autoSyncResume: value });
    prefs.refetch();
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Settings" subtitle="Preferences" />

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Appearance</Text>
        <Card style={styles.section}>
          {(['light', 'dark', 'system'] as ThemeMode[]).map((mode, index) => (
            <View key={mode}>
              {index > 0 && <Divider />}
              <Pressable
                onPress={() => handleThemeChange(mode)}
                style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
                accessibilityRole="radio"
                accessibilityState={{ selected: themeMode === mode }}
              >
                <Text style={[styles.rowLabel, { color: colors.text }]}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
                {themeMode === mode && (
                  <View style={[styles.check, { backgroundColor: colors.accent }]} />
                )}
              </Pressable>
            </View>
          ))}
        </Card>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Preferences</Text>
        <Card style={styles.section}>
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>Auto-sync resume</Text>
              <Text style={[styles.rowDesc, { color: colors.textMuted }]}>
                Automatically sync when opening the app
              </Text>
            </View>
            <Switch
              value={prefs.data?.autoSyncResume ?? true}
              onValueChange={handleAutoSync}
              trackColor={{ false: colors.border, true: colors.accent }}
            />
          </View>
        </Card>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>About</Text>
        <Card style={styles.section}>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Version</Text>
            <Text style={[styles.rowValue, { color: colors.textMuted }]}>{APP_VERSION}</Text>
          </View>
          <Divider style={{ marginVertical: spacing.sm }} />
          <Text style={[styles.aboutText, { color: colors.textMuted }]}>
            Career OS helps you manage your job search — resume, applications, cover letters, and emails in one place.
          </Text>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing['4xl'],
  },
  sectionLabel: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  section: {
    padding: 0,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    gap: spacing.md,
  },
  rowContent: {
    flex: 1,
    gap: spacing.xs,
  },
  rowLabel: {
    ...typography.body,
  },
  rowDesc: {
    ...typography.caption,
  },
  rowValue: {
    ...typography.body,
  },
  check: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  aboutText: {
    ...typography.caption,
    padding: spacing.lg,
    paddingTop: 0,
    lineHeight: 20,
  },
});

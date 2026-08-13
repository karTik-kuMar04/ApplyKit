import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PlusIcon, ResumeIcon, EmailIcon, CoverLetterIcon, ApplicationIcon, CalendarIcon } from '@/components/ui/icons';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { QuickAction } from '@/components/home/QuickAction';
import { ActivityRow } from '@/components/home/ActivityRow';
import {
  Card,
  DocumentCard,
  SectionHeader,
  Button,
  LoadingState,
  ErrorState,
} from '@/components/ui';
import { useColors } from '@/lib/theme';
import { spacing, typography } from '@/lib/theme/tokens';
import { CANDIDATE_NAME } from '@/constants';
import { getGreeting } from '@/utils';
import { useAsyncData } from '@/hooks/useAsyncData';
import { resumeService, applicationService } from '@/services';

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();

  const resume = useAsyncData(() => resumeService.getResume(), []);
  const activity = useAsyncData(() => applicationService.getActivity(), []);
  const overview = applicationService.getOverview();

  if (resume.loading && !resume.data) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading your workspace…" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.greeting}>
          <Text style={[styles.greetingText, { color: colors.textMuted }]}>
            {getGreeting()}
          </Text>
          <Text style={[styles.name, { color: colors.text }]}>{CANDIDATE_NAME}</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Resume" />
          {resume.error ? (
            <ErrorState message={resume.error} onRetry={resume.refetch} />
          ) : resume.data ? (
            <DocumentCard
              fileName={resume.data.fileName}
              fileType={resume.data.fileType}
              updatedAt={resume.data.updatedAt}
              syncStatus={resume.data.syncStatus}
              metadata={resume.data.fileSize}
              onPress={() => router.push('/(tabs)/resume')}
            />
          ) : null}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Applications" />
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <ApplicationIcon size={18} color={colors.accent} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {overview.activeCount}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Active</Text>
            </Card>
            <Card style={styles.statCard}>
              <CalendarIcon size={18} color={colors.success} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {overview.interviewCount}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Interviews</Text>
            </Card>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Quick Actions" />
          <View style={styles.quickActions}>
            <QuickAction
              icon={<PlusIcon size={18} color={colors.accent} />}
              label="New Application"
              onPress={() => router.push('/applications/new')}
            />
            <QuickAction
              icon={<ResumeIcon size={18} color={colors.accent} />}
              label="Open Resume"
              onPress={() => router.push('/(tabs)/resume')}
            />
            <QuickAction
              icon={<CoverLetterIcon size={18} color={colors.accent} />}
              label="Create Cover Letter"
              onPress={() => router.push('/cover-letter/create')}
            />
            <QuickAction
              icon={<EmailIcon size={18} color={colors.accent} />}
              label="Prepare Email"
              onPress={() => router.push('/email/prepare')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Recent Activity"
            action={
              <Button
                title="View all"
                variant="ghost"
                size="sm"
                onPress={() => router.push('/(tabs)/applications')}
              />
            }
          />
          {activity.loading ? (
            <LoadingState message="Loading activity…" />
          ) : activity.error ? (
            <ErrorState message={activity.error} onRetry={activity.refetch} />
          ) : activity.data && activity.data.length > 0 ? (
            <Card>
              {activity.data.slice(0, 5).map((item) => (
                <ActivityRow key={item.id} item={item} />
              ))}
            </Card>
          ) : (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No recent activity
            </Text>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing['4xl'],
  },
  greeting: {
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  greetingText: {
    ...typography.caption,
  },
  name: {
    ...typography.display,
  },
  section: {
    marginBottom: spacing['2xl'],
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  statValue: {
    ...typography.heading,
  },
  statLabel: {
    ...typography.caption,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});

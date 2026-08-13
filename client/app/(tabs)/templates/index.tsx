import { useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { CoverLetterIcon, EmailIcon } from '@/components/ui/icons';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { useColors } from '@/lib/theme';
import { spacing, typography, radius } from '@/lib/theme/tokens';

type TemplateTab = 'cover-letters' | 'emails';

export default function TemplatesScreen() {
  const colors = useColors();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TemplateTab>('cover-letters');

  return (
    <ScreenContainer>
      <ScreenHeader title="Templates" subtitle="Cover letters and emails" />

      <View style={[styles.tabBar, { backgroundColor: colors.borderSubtle }]}>
        <TabButton
          label="Cover Letters"
          icon={<CoverLetterIcon size={16} color={activeTab === 'cover-letters' ? colors.accent : colors.textMuted} />}
          active={activeTab === 'cover-letters'}
          onPress={() => {
            setActiveTab('cover-letters');
            router.push('/(tabs)/templates/cover-letters');
          }}
          colors={colors}
        />
        <TabButton
          label="Emails"
          icon={<EmailIcon size={16} color={activeTab === 'emails' ? colors.accent : colors.textMuted} />}
          active={activeTab === 'emails'}
          onPress={() => {
            setActiveTab('emails');
            router.push('/(tabs)/templates/emails');
          }}
          colors={colors}
        />
      </View>

      <View style={styles.redirect}>
        <Pressable
          onPress={() => router.push('/(tabs)/templates/cover-letters')}
          style={[styles.link, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <CoverLetterIcon size={20} color={colors.accent} />
          <View style={styles.linkContent}>
            <Text style={[styles.linkTitle, { color: colors.text }]}>Cover Letter Templates</Text>
            <Text style={[styles.linkDesc, { color: colors.textMuted }]}>
              Manage reusable cover letter templates
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(tabs)/templates/emails')}
          style={[styles.link, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <EmailIcon size={20} color={colors.accent} />
          <View style={styles.linkContent}>
            <Text style={[styles.linkTitle, { color: colors.text }]}>Email Templates</Text>
            <Text style={[styles.linkDesc, { color: colors.textMuted }]}>
              Manage reusable email templates
            </Text>
          </View>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

function TabButton({
  label,
  icon,
  active,
  onPress,
  colors,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onPress: () => void;
  colors: ReturnType<typeof import('@/lib/theme').useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tab,
        active && { backgroundColor: colors.surface },
      ]}
    >
      {icon}
      <Text style={[styles.tabLabel, { color: active ? colors.text : colors.textMuted }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderRadius: radius.md,
    padding: spacing.xs,
    marginBottom: spacing['2xl'],
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
  },
  tabLabel: {
    ...typography.caption,
    fontWeight: '500',
  },
  redirect: {
    gap: spacing.md,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
  },
  linkContent: {
    flex: 1,
    gap: spacing.xs,
  },
  linkTitle: {
    ...typography.bodyMedium,
  },
  linkDesc: {
    ...typography.caption,
  },
});

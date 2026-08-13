import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Input, TextArea, Button } from '@/components/ui';
import { spacing } from '@/lib/theme/tokens';
import { useColors } from '@/lib/theme';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { applicationService } from '@/services';

export default function NewApplicationScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams<{ company?: string; role?: string; hiringManager?: string }>();

  const [company, setCompany] = useState(params.company ?? '');
  const [role, setRole] = useState(params.role ?? '');
  const [hiringManager, setHiringManager] = useState(params.hiringManager ?? '');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ company?: string; role?: string }>({});

  const createAction = useAsyncAction((data: Parameters<typeof applicationService.createApplication>[0]) =>
    applicationService.createApplication(data)
  );

  const validate = () => {
    const newErrors: { company?: string; role?: string } = {};
    if (!company.trim()) newErrors.company = 'Company is required';
    if (!role.trim()) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const result = await createAction.execute({
      company: company.trim(),
      role: role.trim(),
      hiringManager: hiringManager.trim() || undefined,
      email: email.trim() || undefined,
      location: location.trim() || undefined,
      jobUrl: jobUrl.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    if (result) {
      router.replace(`/applications/${result.id}`);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <ScreenHeader
            title="New Application"
            subtitle="Track a new job opportunity"
          />

          <View style={styles.form}>
            <Input
              label="Company"
              required
              value={company}
              onChangeText={setCompany}
              placeholder="e.g. Linear"
              error={errors.company}
              autoCapitalize="words"
            />
            <Input
              label="Role"
              required
              value={role}
              onChangeText={setRole}
              placeholder="e.g. Senior Frontend Engineer"
              error={errors.role}
            />
            <Input
              label="Hiring Manager"
              value={hiringManager}
              onChangeText={setHiringManager}
              placeholder="e.g. Sarah Chen"
              autoCapitalize="words"
            />
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. sarah@company.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Location"
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. San Francisco, CA or Remote"
            />
            <Input
              label="Job URL"
              value={jobUrl}
              onChangeText={setJobUrl}
              placeholder="https://…"
              keyboardType="url"
              autoCapitalize="none"
            />
            <TextArea
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Any notes about this opportunity…"
            />
          </View>

          {createAction.error && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {createAction.error}
            </Text>
          )}

          <View style={styles.actions}>
            <Button
              title="Create Application"
              onPress={handleSubmit}
              loading={createAction.loading}
              fullWidth
            />
            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => router.back()}
              fullWidth
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing['4xl'],
  },
  form: {
    gap: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  errorText: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  actions: {
    gap: spacing.md,
  },
});

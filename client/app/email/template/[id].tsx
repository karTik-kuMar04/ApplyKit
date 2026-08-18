import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Input, TextArea, Button, LoadingState, ErrorState, Card } from '@/components/ui';
import { useColors } from '@/lib/theme';
import { spacing, typography } from '@/lib/theme/tokens';
import { PLACEHOLDER_HINTS } from '@/constants';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { emailTemplateService } from '@/services';

export default function EmailTemplateEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const isNew = id === 'new';

  const template = useAsyncData(
    () =>
      isNew
        ? Promise.resolve({ success: true as const, data: null })
        : emailTemplateService.getTemplate(id!),
    [id]
  );

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [initialized, setInitialized] = useState(isNew);

  if (template.data && !initialized) {
    setName(template.data.name);
    setDescription(template.data.description || '');
    setSubject(template.data.subject);
    setBody(template.data.body);
    setInitialized(true);
  }

  const saveAction = useAsyncAction(async () => {
    if (isNew) {
      return emailTemplateService.createTemplate({ name, description, subject, body });
    }
    return emailTemplateService.updateTemplate(id!, { name, description, subject, body });
  });

  const handleSave = async () => {
    if (!name.trim() || !subject.trim() || !body.trim()) {
      Alert.alert('Missing fields', 'Name, subject, and body are required.');
      return;
    }
    const result = await saveAction.execute();
    if (result) {
      Alert.alert('Saved', 'Template saved successfully.');
      router.back();
    }
  };

  if (!isNew && template.loading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    );
  }

  if (!isNew && template.error) {
    return (
      <ScreenContainer>
        <ErrorState message={template.error} onRetry={template.refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <ScreenHeader
            title={isNew ? 'New Template' : 'Edit Template'}
            subtitle="Email template"
          />

          <View style={styles.form}>
            <Input label="Name" required value={name} onChangeText={setName} />
            <Input label="Description" value={description} onChangeText={setDescription} />
            <Input label="Subject" required value={subject} onChangeText={setSubject} placeholder="Email subject line…" />
            <TextArea label="Body" required value={body} onChangeText={setBody} placeholder="Email body…" />

            <Card style={styles.hints}>
              <Text style={[styles.hintsTitle, { color: colors.textSecondary }]}>Placeholders</Text>
              <Text style={[styles.hintsText, { color: colors.textMuted }]}>
                {PLACEHOLDER_HINTS.join(' · ')}
              </Text>
            </Card>
          </View>

          {saveAction.error && (
            <Text style={[styles.error, { color: colors.error }]}>{saveAction.error}</Text>
          )}

          <View style={styles.actions}>
            <Button title="Save Template" onPress={handleSave} loading={saveAction.loading} fullWidth />
            <Button title="Cancel" variant="ghost" onPress={() => router.back()} fullWidth />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: spacing['4xl'] },
  form: { gap: spacing.lg, marginBottom: spacing['2xl'] },
  hints: { gap: spacing.xs },
  hintsTitle: { ...typography.caption, fontWeight: '500' },
  hintsText: { ...typography.caption },
  error: { textAlign: 'center', marginBottom: spacing.md },
  actions: { gap: spacing.md },
});

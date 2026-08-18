import { useState, useMemo } from 'react';
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
import { EmailPreview } from '@/components/documents/EmailPreview';
import { Input, Button, Card, LoadingState, ErrorState } from '@/components/ui';
import { useColors } from '@/lib/theme';
import { spacing, typography } from '@/lib/theme/tokens';
import { CANDIDATE_NAME } from '@/constants';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { emailTemplateService } from '@/services';

export default function EmailPrepareScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams<{
    company?: string;
    role?: string;
    hiringManager?: string;
    templateId?: string;
  }>();

  const [step, setStep] = useState<'template' | 'form' | 'preview'>(
    params.templateId ? 'form' : 'template'
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    params.templateId ?? null
  );
  const [company, setCompany] = useState(params.company ?? '');
  const [role, setRole] = useState(params.role ?? '');
  const [hiringManager, setHiringManager] = useState(params.hiringManager ?? '');
  const [candidateName] = useState(CANDIDATE_NAME);

  const templates = useAsyncData(() => emailTemplateService.getTemplates(), []);
  const prepareAction = useAsyncAction(() => emailTemplateService.prepareEmail());

  const selectedTemplate = useMemo(
    () => templates.data?.find((t) => t.id === selectedTemplateId),
    [templates.data, selectedTemplateId]
  );

  const preview = useMemo(() => {
    if (!selectedTemplate) return null;
    return emailTemplateService.generatePreview(selectedTemplate, {
      company,
      role,
      hiringManager,
      candidateName,
    });
  }, [selectedTemplate, company, role, hiringManager, candidateName]);

  const attachments = ['Kartik_Kumar_Resume.pdf', 'cover-letter.pdf'];

  const handlePrepare = async () => {
    const result = await prepareAction.execute();
    if (result) {
      Alert.alert('Ready to send', result.message);
      router.back();
    }
  };

  if (templates.loading) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading templates…" />
      </ScreenContainer>
    );
  }

  if (templates.error) {
    return (
      <ScreenContainer>
        <ErrorState message={templates.error} onRetry={templates.refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <ScreenHeader
            title="Prepare Email"
            subtitle={
              step === 'template' ? 'Choose a template' : step === 'form' ? 'Fill in details' : 'Review and send'
            }
          />

          {step === 'template' && (
            <View style={styles.templateList}>
              {templates.data?.map((template) => (
                <Card key={template.id} style={styles.templateCard}>
                  <Text style={[styles.templateName, { color: colors.text }]}>{template.name}</Text>
                  <Text style={[styles.templateDesc, { color: colors.textMuted }]}>
                    {template.description || template.subject}
                  </Text>
                  <Button
                    title="Use template"
                    size="sm"
                    onPress={() => {
                      setSelectedTemplateId(template.id);
                      setStep('form');
                    }}
                  />
                </Card>
              ))}
            </View>
          )}

          {step === 'form' && (
            <View style={styles.form}>
              <Input label="Company" required value={company} onChangeText={setCompany} />
              <Input label="Role" required value={role} onChangeText={setRole} />
              <Input label="Hiring Manager" value={hiringManager} onChangeText={setHiringManager} />
              <Input label="Your Name" value={candidateName} editable={false} />
              <View style={styles.formActions}>
                <Button title="Back" variant="ghost" onPress={() => setStep('template')} />
                <Button title="Preview" onPress={() => setStep('preview')} disabled={!company || !role} />
              </View>
            </View>
          )}

          {step === 'preview' && preview && (
            <>
              <EmailPreview
                to={preview.to}
                subject={preview.subject}
                body={preview.body}
                attachments={attachments}
              />
              <Text style={[styles.finalNote, { color: colors.textMuted }]}>
                This is the final stage before sending. Your resume and cover letter will be attached.
              </Text>
              <View style={styles.previewActions}>
                <Button
                  title="Prepare Email"
                  onPress={handlePrepare}
                  loading={prepareAction.loading}
                  fullWidth
                />
                <Button title="Edit Details" variant="ghost" onPress={() => setStep('form')} fullWidth />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: spacing['4xl'], gap: spacing.lg },
  templateList: { gap: spacing.md },
  templateCard: { gap: spacing.sm },
  templateName: { ...typography.bodyMedium },
  templateDesc: { ...typography.caption },
  form: { gap: spacing.lg },
  formActions: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  finalNote: { ...typography.caption, textAlign: 'center', marginTop: spacing.md },
  previewActions: { gap: spacing.md, marginTop: spacing.lg },
});

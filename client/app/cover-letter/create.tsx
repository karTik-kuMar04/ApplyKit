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
import * as Clipboard from 'expo-clipboard';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { CoverLetterPreview } from '@/components/documents/CoverLetterPreview';
import { Input, Button, Card, LoadingState, ErrorState } from '@/components/ui';
import { useColors } from '@/lib/theme';
import { spacing, typography } from '@/lib/theme/tokens';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { coverLetterService } from '@/services';

export default function CoverLetterCreateScreen() {
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

  const templates = useAsyncData(() => coverLetterService.getTemplates(), []);
  const exportAction = useAsyncAction(() => coverLetterService.exportPdf());

  const selectedTemplate = useMemo(
    () => templates.data?.find((t) => t.id === selectedTemplateId),
    [templates.data, selectedTemplateId]
  );

  const previewBody = useMemo(() => {
    if (!selectedTemplate) return '';
    return coverLetterService.generatePreview(selectedTemplate.body, {
      company,
      role,
      hiringManager,
    });
  }, [selectedTemplate, company, role, hiringManager]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(previewBody);
    Alert.alert('Copied', 'Cover letter copied to clipboard.');
  };

  const handleExport = async () => {
    const result = await exportAction.execute();
    if (result) Alert.alert('Exported', result.message);
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
            title="Create Cover Letter"
            subtitle={
              step === 'template'
                ? 'Choose a template'
                : step === 'form'
                  ? 'Fill in details'
                  : 'Preview'
            }
          />

          {step === 'template' && (
            <View style={styles.templateList}>
              {templates.data?.map((template) => (
                <Card
                  key={template.id}
                  style={[
                    styles.templateCard,
                    selectedTemplateId === template.id && {
                      borderColor: colors.accent,
                      borderWidth: 2,
                    },
                  ]}
                >
                  <Text style={[styles.templateName, { color: colors.text }]}>
                    {template.name}
                  </Text>
                  <Text style={[styles.templateDesc, { color: colors.textMuted }]}>
                    {template.description}
                  </Text>
                  <Button
                    title="Use template"
                    size="sm"
                    variant={selectedTemplateId === template.id ? 'primary' : 'secondary'}
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
              <Input
                label="Company"
                required
                value={company}
                onChangeText={setCompany}
                placeholder="e.g. Google"
              />
              <Input
                label="Role"
                required
                value={role}
                onChangeText={setRole}
                placeholder="e.g. Frontend Developer"
              />
              <Input
                label="Hiring Manager"
                value={hiringManager}
                onChangeText={setHiringManager}
                placeholder="e.g. Sarah"
              />
              <View style={styles.formActions}>
                <Button
                  title="Back"
                  variant="ghost"
                  onPress={() => setStep('template')}
                />
                <Button
                  title="Preview"
                  onPress={() => setStep('preview')}
                  disabled={!company || !role}
                />
              </View>
            </View>
          )}

          {step === 'preview' && selectedTemplate && (
            <>
              <CoverLetterPreview
                company={company}
                role={role}
                hiringManager={hiringManager}
                body={previewBody}
              />
              <View style={styles.previewActions}>
                <Button title="Copy" variant="secondary" onPress={handleCopy} fullWidth />
                <Button
                  title="Export PDF"
                  onPress={handleExport}
                  loading={exportAction.loading}
                  fullWidth
                />
                <Button
                  title="Save Draft"
                  variant="ghost"
                  onPress={() => {
                    Alert.alert('Saved', 'Cover letter draft saved.');
                    router.back();
                  }}
                  fullWidth
                />
                <Button
                  title="Edit Details"
                  variant="ghost"
                  onPress={() => setStep('form')}
                  fullWidth
                />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing['4xl'],
    gap: spacing.lg,
  },
  templateList: {
    gap: spacing.md,
  },
  templateCard: {
    gap: spacing.sm,
  },
  templateName: {
    ...typography.bodyMedium,
  },
  templateDesc: {
    ...typography.caption,
  },
  form: {
    gap: spacing.lg,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  previewActions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});

import { useState } from 'react';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { TemplateCard } from '@/components/templates/TemplateCard';
import {
  Button,
  EmptyState,
  LoadingState,
  ErrorState,
  Modal,
} from '@/components/ui';
import { spacing } from '@/lib/theme/tokens';
import { useAsyncData } from '@/hooks/useAsyncData';
import { emailTemplateService } from '@/services';

export default function EmailTemplatesScreen() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data, loading, error, refetch } = useAsyncData(
    () => emailTemplateService.getTemplates(),
    []
  );

  const handleDuplicate = async (id: string) => {
    const result = await emailTemplateService.duplicateTemplate(id);
    if (result.success) refetch();
    else Alert.alert('Error', result.error.message);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const result = await emailTemplateService.deleteTemplate(deleteId);
    setDeleting(false);
    setDeleteId(null);
    if (result.success) refetch();
    else Alert.alert('Error', result.error.message);
  };

  if (loading && !data) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading templates…" />
      </ScreenContainer>
    );
  }

  if (error && !data) {
    return (
      <ScreenContainer>
        <ErrorState message={error} onRetry={refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Emails"
        subtitle={`${data?.length ?? 0} templates`}
        rightAction={
          <Button
            title="New"
            size="sm"
            onPress={() => router.push('/email/template/new')}
            icon={<Plus size={16} color="#FFFFFF" />}
          />
        }
      />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TemplateCard
            name={item.name}
            description={item.description}
            updatedAt={item.updatedAt}
            onPress={() => router.push(`/email/template/${item.id}`)}
            onDuplicate={() => handleDuplicate(item.id)}
            onDelete={() => setDeleteId(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListEmptyComponent={
          <EmptyState
            title="No email templates yet"
            description="Create a reusable email template for your applications."
            actionLabel="Create Template"
            onAction={() => router.push('/email/template/new')}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete template?"
      >
        <Button
          title="Delete"
          variant="destructive"
          onPress={handleDelete}
          loading={deleting}
          fullWidth
        />
        <Button
          title="Cancel"
          variant="ghost"
          onPress={() => setDeleteId(null)}
          fullWidth
        />
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: spacing['4xl'],
    flexGrow: 1,
  },
});

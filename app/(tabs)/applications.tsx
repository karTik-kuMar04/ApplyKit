import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PlusIcon } from '@/components/ui/icons';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ApplicationCard } from '@/components/applications/ApplicationCard';
import {
  Button,
  SearchInput,
  EmptyState,
  LoadingState,
  ErrorState,
} from '@/components/ui';
import { useColors } from '@/lib/theme';
import { spacing } from '@/lib/theme/tokens';
import { useAsyncData } from '@/hooks/useAsyncData';
import { applicationService } from '@/services';
import type { ApplicationStatus } from '@/types';

const FILTERS: { label: string; value: ApplicationStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'applied' },
  { label: 'Interview', value: 'interview' },
  { label: 'Draft', value: 'draft' },
];

export default function ApplicationsScreen() {
  const colors = useColors();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');

  const { data, loading, error, refetch } = useAsyncData(
    () => applicationService.getApplications(),
    []
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((app) => {
      const matchesSearch =
        !search ||
        app.company.toLowerCase().includes(search.toLowerCase()) ||
        app.role.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        (filter === 'applied'
          ? ['applied', 'ready', 'interview', 'offer'].includes(app.status)
          : app.status === filter);
      return matchesSearch && matchesFilter;
    });
  }, [data, search, filter]);

  if (loading && !data) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading applications…" />
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
        title="Applications"
        subtitle={`${data?.length ?? 0} total`}
        rightAction={
          <Button
            title="New"
            size="sm"
            onPress={() => router.push('/applications/new')}
            icon={<PlusIcon size={16} color="#FFFFFF" />}
          />
        }
      />

      <View style={styles.searchContainer}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search applications…"
        />
      </View>

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            title={f.label}
            size="sm"
            variant={filter === f.value ? 'primary' : 'secondary'}
            onPress={() => setFilter(f.value)}
          />
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ApplicationCard
            application={item}
            onPress={() => router.push(`/applications/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListEmptyComponent={
          <EmptyState
            title="No applications yet"
            description="Track your job applications and stay organized throughout your search."
            actionLabel="New Application"
            onAction={() => router.push('/applications/new')}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: spacing.md,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  list: {
    paddingBottom: spacing['4xl'],
    flexGrow: 1,
  },
});

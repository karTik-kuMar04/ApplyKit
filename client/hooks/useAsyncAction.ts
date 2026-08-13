import { useCallback, useState } from 'react';

export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<{ success: true; data: TResult } | { success: false; error: { message: string } }>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: TArgs) => {
      setLoading(true);
      setError(null);
      const result = await action(...args);
      setLoading(false);
      if (result.success) {
        return result.data;
      }
      setError(result.error.message);
      return null;
    },
    [action]
  );

  return { execute, loading, error, clearError: () => setError(null) };
}

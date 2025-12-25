// lib/hooks/useAwardXp.ts
import { fetcher } from '@/constants/fetchers';
import useSWRMutation from 'swr/mutation';

export function useAwardXp() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    '/api/gamification/xp',
    (url, { arg }: any) =>
      fetcher(url, {
        method: 'POST',
        body: JSON.stringify(arg),
      })
  );

  return {
    awardXp: trigger,
    response: data,
    isMutating,
    error,
  };
}

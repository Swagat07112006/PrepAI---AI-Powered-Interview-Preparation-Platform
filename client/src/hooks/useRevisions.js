import { useQuery } from '@tanstack/react-query';
import { revisionsApi } from '@/lib/api';

export function useRevisions(type) {
  return useQuery({
    queryKey: ['revisions', type],
    queryFn: async () => {
      const response = await revisionsApi[type]();
      return response.data;
    },
    enabled: Boolean(type),
  });
}
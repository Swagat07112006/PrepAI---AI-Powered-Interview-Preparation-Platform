import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await dashboardApi.get();
      return response.data;
    },
  });
}
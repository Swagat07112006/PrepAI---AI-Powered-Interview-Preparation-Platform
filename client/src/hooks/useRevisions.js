import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export function useQuestionRevisions(questionId) {
  return useQuery({
    queryKey: ['revisions', 'question', questionId],
    queryFn: async () => {
      const response = await revisionsApi.byQuestion(questionId);
      return response.data;
    },
    enabled: Boolean(questionId),
  });
}

export function useRevisionActions() {
  const queryClient = useQueryClient();

  const completeRevision = useMutation({
    mutationFn: (id) => revisionsApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revisions'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  const skipRevision = useMutation({
    mutationFn: (id) => revisionsApi.skip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revisions'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  const rescheduleRevision = useMutation({
    mutationFn: ({ id, payload }) => revisionsApi.reschedule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revisions'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  const markMissed = useMutation({
    mutationFn: (id) => revisionsApi.markMissed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revisions'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  return { completeRevision, skipRevision, rescheduleRevision, markMissed };
}
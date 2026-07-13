import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '@/lib/api';

export function useQuestions(params) {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: async () => {
      const response = await questionsApi.list(params);
      return response.data;
    },
  });
}

export function useQuestion(id) {
  return useQuery({
    queryKey: ['questions', id],
    queryFn: async () => {
      const response = await questionsApi.get(id);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useQuestionActions() {
  const queryClient = useQueryClient();

  const createQuestion = useMutation({
    mutationFn: questionsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] }),
  });
  const updateQuestion = useMutation({
    mutationFn: ({ id, payload }) => questionsApi.update(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ['questions', variables.id] });
      }
    },
  });
  const deleteQuestion = useMutation({
    mutationFn: questionsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] }),
  });

  return { createQuestion, updateQuestion, deleteQuestion };
}
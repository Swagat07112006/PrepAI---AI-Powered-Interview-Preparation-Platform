import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '@/lib/api';

export function useNotes(params) {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: async () => {
      const response = await notesApi.list(params);
      return response.data;
    },
  });
}

export function useNote(id) {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: async () => {
      const response = await notesApi.get(id);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useNoteActions() {
  const queryClient = useQueryClient();

  const createNote = useMutation({
    mutationFn: notesApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });
  const updateNote = useMutation({
    mutationFn: ({ id, payload }) => notesApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });
  const deleteNote = useMutation({
    mutationFn: notesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  return { createNote, updateNote, deleteNote };
}
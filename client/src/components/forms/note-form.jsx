import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNoteActions } from '@/hooks/useNotes';

const noteSchema = z.object({
  title: z.string().min(2, 'Note title is required'),
  content: z.string().min(4, 'Content is required'),
  topics: z.string().optional(),
  tags: z.string().optional(),
});

export function NoteFormDialog({ open, onOpenChange, initialData }) {
  const { createNote, updateNote } = useNoteActions();
  const mode = initialData ? 'edit' : 'create';

  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      topics: Array.isArray(initialData?.topics) ? initialData.topics.join(', ') : '',
      tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : '',
    },
  });

  React.useEffect(() => {
    form.reset({
      title: initialData?.title || '',
      content: initialData?.content || '',
      topics: Array.isArray(initialData?.topics) ? initialData.topics.join(', ') : '',
      tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : '',
    });
  }, [form, initialData]);

  const submit = form.handleSubmit(async (values) => {
    const payload = {
      title: values.title,
      content: values.content,
      topics: values.topics ? values.topics.split(',').map((item) => item.trim()).filter(Boolean) : [],
      tags: values.tags ? values.tags.split(',').map((item) => item.trim()).filter(Boolean) : [],
    };

    try {
      if (mode === 'edit') {
        await updateNote.mutateAsync({ id: initialData._id, payload });
      } else {
        await createNote.mutateAsync(payload);
      }
      toast.success(mode === 'edit' ? 'Note updated' : 'Note created');
      onOpenChange(false);
      form.reset();
    } catch {
      toast.error('Unable to save note');
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit note' : 'Add note'}</DialogTitle>
          <DialogDescription>
            Shape your interview thinking into reusable notes and summaries.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" {...form.register('content')} className="min-h-[220px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topics">Topics</Label>
            <Input id="topics" {...form.register('topics')} placeholder="dp, trees, system design" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" {...form.register('tags')} placeholder="summary, pattern, follow-up" />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>{mode === 'edit' ? 'Save changes' : 'Create note'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
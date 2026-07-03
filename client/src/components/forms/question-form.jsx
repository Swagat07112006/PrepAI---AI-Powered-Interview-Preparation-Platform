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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuestionActions } from '@/hooks/useQuestions';

const questionSchema = z.object({
  title: z.string().min(2, 'Question title is required'),
  platform: z.string().min(2, 'Platform is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  status: z.enum(['Not Started', 'In Progress', 'Solved', 'Needs Revision']).default('Not Started'),
  url: z.string().url().optional().or(z.literal('')),
  topics: z.string().optional(),
  tags: z.string().optional(),
});

export function QuestionFormDialog({ open, onOpenChange, initialData }) {
  const { createQuestion, updateQuestion } = useQuestionActions();
  const mode = initialData ? 'edit' : 'create';

  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: initialData?.title || '',
      platform: initialData?.platform || '',
      difficulty: initialData?.difficulty || 'medium',
      status: initialData?.status || 'Not Started',
      url: initialData?.url || '',
      topics: Array.isArray(initialData?.topics) ? initialData.topics.join(', ') : '',
      tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : '',
    },
  });

  React.useEffect(() => {
    form.reset({
      title: initialData?.title || '',
      platform: initialData?.platform || '',
      difficulty: initialData?.difficulty || 'medium',
      status: initialData?.status || 'Not Started',
      url: initialData?.url || '',
      topics: Array.isArray(initialData?.topics) ? initialData.topics.join(', ') : '',
      tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : '',
    });
  }, [form, initialData]);

  const submit = form.handleSubmit(async (values) => {
    const payload = {
      title: values.title,
      platform: values.platform,
      difficulty: values.difficulty,
      status: values.status,
      url: values.url || '',
      topics: values.topics ? values.topics.split(',').map((item) => item.trim()).filter(Boolean) : [],
      tags: values.tags ? values.tags.split(',').map((item) => item.trim()).filter(Boolean) : [],
    };

    try {
      if (mode === 'edit') {
        await updateQuestion.mutateAsync({ id: initialData._id, payload });
      } else {
        await createQuestion.mutateAsync(payload);
      }
      toast.success(mode === 'edit' ? 'Question updated' : 'Question created');
      onOpenChange(false);
      form.reset();
    } catch {
      toast.error('Unable to save question');
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit question' : 'Add question'}</DialogTitle>
          <DialogDescription>
            Capture the problem, platform, and revision signals in a single structure.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Input id="platform" {...form.register('platform')} placeholder="LeetCode, Codeforces, etc." />
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={form.watch('difficulty')} onValueChange={(value) => form.setValue('difficulty', value)}>
              <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.watch('status')} onValueChange={(value) => form.setValue('status', value)}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Solved">Solved</SelectItem>
                <SelectItem value="Needs Revision">Needs Revision</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="url">Reference URL</Label>
            <Input id="url" {...form.register('url')} placeholder="https://" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="topics">Topics</Label>
            <Input id="topics" {...form.register('topics')} placeholder="arrays, hashing, sliding window" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" {...form.register('tags')} placeholder="dp, interview, greedy" />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>{mode === 'edit' ? 'Save changes' : 'Create question'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
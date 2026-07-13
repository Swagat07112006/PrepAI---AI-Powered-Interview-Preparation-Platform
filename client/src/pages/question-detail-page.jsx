import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Pencil, Trash2, Sparkles, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { PageShell } from '@/components/common/page-shell';
import { LoadingState, ErrorState } from '@/components/common/state-views';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { QuestionFormDialog } from '@/components/forms/question-form';
import { useQuestionActions, useQuestion } from '@/hooks/useQuestions';
import { useQuestionRevisions, useRevisionActions } from '@/hooks/useRevisions';
import { useNoteActions } from '@/hooks/useNotes';
import { formatDateTime, getStatusTone } from '@/lib/utils';

export function QuestionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = React.useState(false);
  const [noteTitle, setNoteTitle] = React.useState('');
  const [noteContent, setNoteContent] = React.useState('');
  const [noteWriting, setNoteWriting] = React.useState(false);

  const { data, isLoading, error, refetch } = useQuestion(id);
  const { deleteQuestion } = useQuestionActions();
  const { createNote } = useNoteActions();

  const { data: revisions, isLoading: isLoadingRevisions, refetch: refetchRevisions } = useQuestionRevisions(id);
  const { completeRevision, skipRevision, rescheduleRevision, markMissed } = useRevisionActions();

  if (isLoading) return <PageShell><LoadingState title="Loading question" description="Opening the detailed question workspace." /></PageShell>;
  if (error) return <PageShell><ErrorState description={error.message} onRetry={refetch} /></PageShell>;

  const question = data;
  const activeRevision = revisions?.find(r => r.status === 'Pending');

  const handleDelete = async () => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await deleteQuestion.mutateAsync(question._id);
      toast.success('Question deleted');
      navigate('/questions');
    } catch {
      toast.error('Unable to delete question');
    }
  };

  const handleCompleteRevision = async () => {
    if (!activeRevision) return;
    try {
      await completeRevision.mutateAsync(activeRevision._id);
      toast.success('Revision completed');
      refetchRevisions();
    } catch {
      toast.error('Failed to complete revision');
    }
  };

  const handleSkipRevision = async () => {
    if (!activeRevision) return;
    try {
      await skipRevision.mutateAsync(activeRevision._id);
      toast.success('Revision skipped');
      refetchRevisions();
    } catch {
      toast.error('Failed to skip revision');
    }
  };

  const handleRescheduleRevision = async () => {
    if (!activeRevision) return;
    const days = prompt('Enter number of days from now to schedule this revision:', '7');
    if (!days) return;
    const daysNum = parseInt(days, 10);
    if (isNaN(daysNum)) return;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysNum);
    try {
      await rescheduleRevision.mutateAsync({ id: activeRevision._id, payload: { dueDate } });
      toast.success('Revision rescheduled');
      refetchRevisions();
    } catch {
      toast.error('Failed to reschedule revision');
    }
  };

  const handleMarkMissed = async () => {
    if (!activeRevision) return;
    try {
      await markMissed.mutateAsync(activeRevision._id);
      toast.success('Revision marked as missed');
      refetchRevisions();
    } catch {
      toast.error('Failed to mark missed');
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!id || !noteTitle.trim() || !noteContent.trim()) return;

    try {
      // Create Note
      const newNote = await createNote.mutateAsync({
        title: noteTitle,
        content: noteContent,
        topics: question?.topics || [],
        tags: question?.tags || []
      });

      const newNoteId = newNote.data._id;
      // Append Note ID to Question's notes list
      const existingNoteIds = (question?.notes || []).map(n => n._id || n);

      await updateQuestion.mutateAsync({
        id: id,
        payload: {
          notes: [...existingNoteIds, newNoteId]
        }
      });

      // Clear input form
      setNoteTitle('');
      setNoteContent('');
      setNoteWriting(false);
      refetch(); // Refetch question data so the new notes render
    } catch (err) {
      console.error("Failed to add note inline:", err);
      toast.error("Failed to add note inline");
    }
  };

  return (
    <PageShell className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" asChild><Link to="/questions"><ArrowLeft className="h-4 w-4" /> Back to questions</Link></Button>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}><Pencil className="h-4 w-4" /> Edit</Button>
          <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4" /> Delete</Button>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <Badge variant={getStatusTone(question.status)}>{question.status}</Badge>
            <h1 className="text-4xl font-semibold tracking-tight">{question.title}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{question.platform}</Badge>
              <Badge variant="neutral">{question.difficulty}</Badge>
              {question.topics?.map((topic) => <Badge key={topic} variant="neutral">{topic}</Badge>)}
            </div>
            <Separator className="bg-white/10" />
            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <p>Created {formatDateTime(question.createdAt)}</p>
              <p>Updated {formatDateTime(question.updatedAt)}</p>
              <p>Solved at {formatDateTime(question.solvedAt)}</p>
              <p>Tags: {question.tags?.length ? question.tags.join(', ') : 'none'}</p>
            </div>
            {question.url ? (
              <Button variant="secondary" asChild className="w-fit"><a href={question.url} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /> Open source link</a></Button>
            ) : null}
            <div className="rounded-[28px] border border-white/10 bg-[#14110d] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 font-semibold uppercase tracking-wider text-[10px]">Linked Notes</p>
                {!noteWriting && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNoteWriting(true)}
                    className="h-7 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-2 rounded-lg"
                  >
                    Write Note
                  </Button>
                )}
              </div>

              {/* Inline writing form */}
              {noteWriting && (
                <form
                  onSubmit={handleSaveNote}
                  className="bg-white/5 border border-white/5 p-3 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <Input
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Note title..."
                    required
                    className="h-8 text-xs bg-transparent border-0 border-b border-white/10 px-0 rounded-none text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Jot down quick solution notes, tips or code blocks..."
                    required
                    rows={3}
                    className="w-full bg-transparent border-0 text-xs text-slate-200 placeholder-slate-500 focus:outline-none resize-none"
                  />
                  <div className="flex justify-end gap-1.5 pt-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => setNoteWriting(false)}
                      className="h-7 text-[10px] rounded-lg text-slate-400"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      type="submit"
                      className="h-7 text-[10px] rounded-lg bg-amber-500 text-black hover:bg-amber-400 font-semibold"
                    >
                      Save Note
                    </Button>
                  </div>
                </form>
              )}

              {Array.isArray(question.notes) && question.notes.length > 0 ? (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                  {question.notes.map((note) => (
                    <div key={note._id || note} className="bg-white/5 border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-colors">
                      <h4 className="font-semibold text-slate-200 text-xs truncate">{note.title || 'Untitled Note'}</h4>
                      <p className="mt-1 text-slate-400 text-[11px] whitespace-pre-wrap leading-relaxed font-sans mt-2">
                        {note.content}
                      </p>
                      <p className="text-[9px] text-slate-500 mt-3 text-right font-sans">
                        {formatDateTime(note.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-2">No notes linked to this question yet. Click "Write Note" to jot down your first note here!</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revision plan</p>
                <h2 className="mt-1 text-2xl font-semibold">Spaced repetition scaffold</h2>
              </div>
              <CalendarDays className="h-5 w-5 text-amber-400" />
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
              {isLoadingRevisions ? (
                <p className="text-xs text-slate-400 italic py-4">Loading revisions plan...</p>
              ) : revisions?.length > 0 ? (
                revisions.map((rev, index) => (
                  <div key={rev._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-200">Revision {index + 1}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Due: {formatDateLabel(rev.dueDate, rev.status)}</span>
                    </div>
                    <Badge variant={getStatusTone(rev.status)}>{rev.status}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic py-4">No revisions scheduled. Revisions are created automatically when a question is first marked as Solved.</p>
              )}
            </div>

            <div className="rounded-[28px] border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-100 font-sans leading-relaxed text-xs">
              Revision records are created automatically when a question becomes Solved in the database. Use controls below to process the active drill.
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant="secondary"
                disabled={!activeRevision || completeRevision.isPending}
                onClick={handleCompleteRevision}
                className="rounded-xl"
              >
                <Sparkles className="h-4 w-4 mr-1 text-amber-400 animate-pulse" /> Complete
              </Button>
              <Button
                variant="secondary"
                disabled={!activeRevision || skipRevision.isPending}
                onClick={handleSkipRevision}
                className="rounded-xl"
              >
                Skip
              </Button>
              <Button
                variant="secondary"
                disabled={!activeRevision || rescheduleRevision.isPending}
                onClick={handleRescheduleRevision}
                className="rounded-xl"
              >
                Reschedule
              </Button>
              <Button
                variant="secondary"
                disabled={!activeRevision || markMissed.isPending}
                onClick={handleMarkMissed}
                className="rounded-xl text-rose-300 hover:text-rose-200"
              >
                Mark missed
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <QuestionFormDialog open={editOpen} onOpenChange={setEditOpen} initialData={question} />
    </PageShell>
  );
}

function formatDateLabel(dateStr, status) {
  if (status === 'Completed') return 'Done';
  if (!dateStr) return '—';
  const val = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((val - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `${formatDateTime(dateStr)} (Overdue)`;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return `${formatDateTime(dateStr)} (in ${diffDays} days)`;
}
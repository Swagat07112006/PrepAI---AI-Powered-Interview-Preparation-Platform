import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Pencil, Trash2, Sparkles, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { PageShell } from '@/components/common/page-shell';
import { LoadingState, ErrorState } from '@/components/common/state-views';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { QuestionFormDialog } from '@/components/forms/question-form';
import { useQuestionActions, useQuestion } from '@/hooks/useQuestions';
import { formatDateTime, getStatusTone } from '@/lib/utils';

export function QuestionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = React.useState(false);
  const { data, isLoading, error, refetch } = useQuestion(id);
  const { deleteQuestion } = useQuestionActions();

  if (isLoading) return <PageShell><LoadingState title="Loading question" description="Opening the detailed question workspace." /></PageShell>;
  if (error) return <PageShell><ErrorState description={error.message} onRetry={refetch} /></PageShell>;

  const question = data;

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

  const revisionSchedule = [1, 7, 14, 28, 56];

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
            <div className="rounded-[28px] border border-white/10 bg-[#08101f] p-5">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{question.notes || 'No question-specific notes yet. Add reflections, pitfalls, or interview follow-ups here.'}</p>
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
              <CalendarDays className="h-5 w-5 text-cyan-300" />
            </div>
            <div className="space-y-3">
              {revisionSchedule.map((day) => (
                <div key={day} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Day {day}</span>
                  <Badge variant="accent">Auto-generated after solved</Badge>
                </div>
              ))}
            </div>
            <div className="rounded-[28px] border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm text-cyan-100">
              Revision records are created automatically when a question becomes Solved in the backend.
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="secondary" disabled><Sparkles className="h-4 w-4" /> Complete</Button>
              <Button variant="secondary" disabled>Skip</Button>
              <Button variant="secondary" disabled>Reschedule</Button>
              <Button variant="secondary" disabled>Mark missed</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <QuestionFormDialog open={editOpen} onOpenChange={setEditOpen} initialData={question} />
    </PageShell>
  );
}
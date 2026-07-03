import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MoreHorizontal, Plus, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { PageShell } from '@/components/common/page-shell';
import { LoadingState, ErrorState, EmptyState } from '@/components/common/state-views';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQuestions } from '@/hooks/useQuestions';
import { QuestionFormDialog } from '@/components/forms/question-form';
import { formatDateTime, getStatusTone } from '@/lib/utils';

export function QuestionsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = React.useState(false);
  const params = React.useMemo(() => ({
    q: searchParams.get('q') || undefined,
    difficulty: searchParams.get('difficulty') || undefined,
    status: searchParams.get('status') || undefined,
    platform: searchParams.get('platform') || undefined,
    page: searchParams.get('page') || 1,
    limit: 12,
  }), [searchParams]);

  const { data, isLoading, error, refetch } = useQuestions(params);
  const questions = data?.data || [];
  const meta = data?.meta || {};

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    next.delete('page');
    setSearchParams(next);
  };

  if (isLoading) return <PageShell><LoadingState title="Loading questions" description="Fetching your question inventory and filters." /></PageShell>;
  if (error) return <PageShell><ErrorState description={error.message} onRetry={refetch} /></PageShell>;

  return (
    <PageShell className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="accent">Questions</Badge>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Interview practice inventory</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Track every question with platforms, tags, topics, and revision status. The layout stays calm while still dense enough for power use.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Add question</Button>
      </section>

      <Card className="border-white/10 bg-white/5">
        <CardContent className="grid gap-3 p-4 md:grid-cols-[1.2fr_repeat(3,minmax(0,180px))_auto] md:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input defaultValue={params.q || ''} onKeyDown={(event) => { if (event.key === 'Enter') setFilter('q', event.currentTarget.value); }} placeholder="Search title or tags" className="pl-10" />
          </div>
          <Select value={params.difficulty || 'all'} onValueChange={(value) => setFilter('difficulty', value)}><SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger><SelectContent><SelectItem value="all">All difficulties</SelectItem><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent></Select>
          <Select value={params.status || 'all'} onValueChange={(value) => setFilter('status', value)}><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="Not Started">Not Started</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Solved">Solved</SelectItem><SelectItem value="Needs Revision">Needs Revision</SelectItem></SelectContent></Select>
          <Select value={params.platform || 'all'} onValueChange={(value) => setFilter('platform', value)}><SelectTrigger><SelectValue placeholder="Platform" /></SelectTrigger><SelectContent><SelectItem value="all">All platforms</SelectItem><SelectItem value="LeetCode">LeetCode</SelectItem><SelectItem value="Codeforces">Codeforces</SelectItem><SelectItem value="Interview">Interview</SelectItem></SelectContent></Select>
          <Button variant="secondary" onClick={() => setSearchParams({})}><SlidersHorizontal className="h-4 w-4" /> Reset</Button>
        </CardContent>
      </Card>

      {questions.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {questions.map((question, index) => (
            <Card key={question._id} className="overflow-hidden border-white/10 bg-white/5">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">#{String(index + 1).padStart(2, '0')} · {question.platform}</p>
                    <h2 className="mt-2 text-xl font-semibold leading-tight">{question.title}</h2>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/questions/${question._id}`)}>Open</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/questions/${question._id}`)}>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getStatusTone(question.status)}>{question.status}</Badge>
                  <Badge variant="outline">{question.difficulty}</Badge>
                  {question.topics?.slice(0, 2).map((topic) => <Badge key={topic} variant="neutral">{topic}</Badge>)}
                </div>
                <p className="text-sm text-muted-foreground">Created {formatDateTime(question.createdAt)}{question.solvedAt ? ` · solved ${formatDateTime(question.solvedAt)}` : ''}</p>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">{question.tags?.length || 0} tags · {question.notes?.length || 0} notes linked</div>
                  <Button variant="secondary" size="sm" asChild><Link to={`/questions/${question._id}`}>Open question</Link></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No questions yet" description="Add your first practice question to start building a focused inventory." actionLabel="Add question" onAction={() => setCreateOpen(true)} icon={Sparkles} />
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Page {meta.page || 1} of {meta.totalPages || 1}</p>
        <p>{meta.total || 0} questions tracked</p>
      </div>

      <QuestionFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageShell>
  );
}
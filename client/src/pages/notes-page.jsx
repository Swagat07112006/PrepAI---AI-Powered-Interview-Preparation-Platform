import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoreHorizontal, Plus, Search, Sparkles } from 'lucide-react';
import { PageShell } from '@/components/common/page-shell';
import { LoadingState, ErrorState, EmptyState } from '@/components/common/state-views';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNotes } from '@/hooks/useNotes';
import { NoteFormDialog } from '@/components/forms/note-form';
import { formatDateTime } from '@/lib/utils';

const noteContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
};

const noteItemVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 15 } }
};

export function NotesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = React.useState(false);
  const params = React.useMemo(() => ({ q: searchParams.get('q') || undefined, page: 1, limit: 12 }), [searchParams]);
  const { data, isLoading, error, refetch } = useNotes(params);
  const notes = data?.data || [];

  if (isLoading) return <PageShell><LoadingState title="Loading notes" description="Collecting your note library and summaries." /></PageShell>;
  if (error) return <PageShell><ErrorState description={error.message} onRetry={refetch} /></PageShell>;

  const applySearch = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('q', value); else next.delete('q');
    setSearchParams(next);
  };

  return (
    <PageShell className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="accent">Notes</Badge>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Interview thinking, structured.</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Create concise summaries, topic clusters, and follow-up reminders from every study session.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Add note</Button>
      </section>

      <Card className="border-white/10 bg-white/5">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input defaultValue={params.q || ''} onKeyDown={(event) => { if (event.key === 'Enter') applySearch(event.currentTarget.value); }} placeholder="Search title or content" className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {notes.length ? (
        <motion.div
          variants={noteContainerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-4 xl:grid-cols-2"
        >
          {notes.map((note) => (
            <motion.div key={note._id} variants={noteItemVariants}>
              <Card className="border-white/10 bg-white/5 hover:border-cyan-500/10 transition-all duration-300 shadow-xl hover:shadow-cyan-950/10">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{formatDateTime(note.createdAt)}</p>
                      <h2 className="mt-2 text-xl font-semibold leading-tight text-white tracking-tight">{note.title}</h2>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end"><DropdownMenuItem onClick={() => navigate(`/notes/${note._id}`)}>Open</DropdownMenuItem><DropdownMenuItem onClick={() => navigate(`/notes/${note._id}`)}>Edit</DropdownMenuItem></DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">{note.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {note.topics?.slice(0, 2).map((topic) => <Badge key={topic} variant="neutral">{topic}</Badge>)}
                    {note.tags?.slice(0, 2).map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-muted-foreground">{note.tags?.length || 0} tags · {note.topics?.length || 0} topics</div>
                    <Button variant="secondary" size="sm" asChild className="rounded-xl hover:bg-white/10 transition"><Link to={`/notes/${note._id}`}>Open note</Link></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState title="No notes yet" description="Create your first note to capture interview intuition and fix patterns." actionLabel="Add note" onAction={() => setCreateOpen(true)} icon={Sparkles} />
      )}

      <NoteFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageShell>
  );
}
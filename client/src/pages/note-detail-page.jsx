import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, NotebookPen } from 'lucide-react';
import { toast } from 'sonner';
import { PageShell } from '@/components/common/page-shell';
import { LoadingState, ErrorState } from '@/components/common/state-views';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NoteFormDialog } from '@/components/forms/note-form';
import { useNote, useNoteActions } from '@/hooks/useNotes';
import { formatDateTime } from '@/lib/utils';

export function NoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = React.useState(false);
  const { data, isLoading, error, refetch } = useNote(id);
  const { deleteNote } = useNoteActions();

  if (isLoading) return <PageShell><LoadingState title="Loading note" description="Opening the note editor and detail surface." /></PageShell>;
  if (error) return <PageShell><ErrorState description={error.message} onRetry={refetch} /></PageShell>;

  const note = data;

  const handleDelete = async () => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteNote.mutateAsync(note._id);
      toast.success('Note deleted');
      navigate('/notes');
    } catch {
      toast.error('Unable to delete note');
    }
  };

  return (
    <PageShell className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" asChild><Link to="/notes"><ArrowLeft className="h-4 w-4" /> Back to notes</Link></Button>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}><Pencil className="h-4 w-4" /> Edit</Button>
          <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4" /> Delete</Button>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <Badge variant="accent">Note</Badge>
            <h1 className="text-4xl font-semibold tracking-tight">{note.title}</h1>
            <div className="flex flex-wrap gap-2">
              {note.topics?.map((topic) => <Badge key={topic} variant="neutral">{topic}</Badge>)}
              {note.tags?.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
            </div>
            <Separator className="bg-white/10" />
            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <p>Created {formatDateTime(note.createdAt)}</p>
              <p>Updated {formatDateTime(note.updatedAt)}</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-[#14110d] p-5">
              <p className="whitespace-pre-wrap text-sm leading-7">{note.content}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Summary utilities</p>
                <h2 className="mt-1 text-2xl font-semibold">Future note AI tools</h2>
              </div>
              <NotebookPen className="h-5 w-5 text-amber-400" />
            </div>
            <div className="rounded-[28px] border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-100">
              Note summarization, condensation, and follow-up question extraction are designed as future surfaces.
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="secondary" disabled>Summarize</Button>
              <Button variant="secondary" disabled>Extract actions</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <NoteFormDialog open={editOpen} onOpenChange={setEditOpen} initialData={note} />
    </PageShell>
  );
}
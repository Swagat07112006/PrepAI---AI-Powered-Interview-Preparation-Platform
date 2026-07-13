import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreHorizontal, Plus, Search, SlidersHorizontal, Sparkles, ExternalLink,
  BookOpen, CircleCheckBig, Clock, BadgeAlert, Trash2, ArrowUpRight, CheckCircle2, ChevronRight, X, NotebookPen
} from 'lucide-react';
import { PageShell } from '@/components/common/page-shell';
import { LoadingState, ErrorState, EmptyState } from '@/components/common/state-views';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuestions, useQuestion, useQuestionActions } from '@/hooks/useQuestions';
import { useNoteActions, useNotes } from '@/hooks/useNotes';
import { QuestionFormDialog } from '@/components/forms/question-form';
import { formatDateTime, getStatusTone } from '@/lib/utils';

const listContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 15 } }
};

export function QuestionsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  // Quick note states
  const [noteTitle, setNoteTitle] = React.useState('');
  const [noteContent, setNoteContent] = React.useState('');
  const [noteWriting, setNoteWriting] = React.useState(false);

  const params = React.useMemo(() => ({
    q: searchParams.get('q') || undefined,
    difficulty: searchParams.get('difficulty') || undefined,
    status: searchParams.get('status') || undefined,
    platform: searchParams.get('platform') || undefined,
    page: searchParams.get('page') || 1,
    limit: 30, // rich list viewport
  }), [searchParams]);

  const { data, isLoading, error, refetch } = useQuestions(params);
  const questions = data?.data || [];
  const meta = data?.meta || {};

  const platformsList = React.useMemo(() => {
    const seen = new Set();
    const list = [];
    if (Array.isArray(meta?.platforms)) {
      meta.platforms.forEach(p => {
        if (p && p.trim()) {
          const cleaned = p.trim();
          const lower = cleaned.toLowerCase();
          if (!seen.has(lower)) {
            seen.add(lower);
            list.push(cleaned);
          }
        }
      });
    }
    return list.sort((a, b) => a.localeCompare(b));
  }, [meta?.platforms]);

  // Fetch detailed info of selected question (with populated notes!)
  const { data: activeDetail, isLoading: isLoadingDetail } = useQuestion(selectedId);
  const activeQuestion = activeDetail || null;

  const { data: allNotesData } = useNotes({ limit: 1000 });
  const notesLibrary = React.useMemo(() => allNotesData?.data || [], [allNotesData]);

  // A helper function to get note details
  const getNoteFromIdOrObj = React.useCallback((noteRef) => {
    if (!noteRef) return null;
    if (typeof noteRef === 'object' && noteRef.content) return noteRef;
    const noteId = typeof noteRef === 'object' ? noteRef._id : noteRef;
    return notesLibrary.find(n => n._id === noteId) || null;
  }, [notesLibrary]);

  const { updateQuestion, deleteQuestion } = useQuestionActions();
  const { createNote } = useNoteActions();

  // Reset selected question if it is page filtered out
  React.useEffect(() => {
    if (selectedId && questions.length > 0 && !questions.some(q => q._id === selectedId)) {
      setSelectedId(null);
    }
  }, [questions, selectedId]);

  React.useEffect(() => {
    const handleSelectQuestion = (e) => {
      if (e.detail?.id) {
        setSelectedId(e.detail.id);
      }
    };
    window.addEventListener('selectWorkspaceQuestion', handleSelectQuestion);
    return () => window.removeEventListener('selectWorkspaceQuestion', handleSelectQuestion);
  }, []);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    next.delete('page');
    setSearchParams(next);
  };

  const handleUpdateStatus = (statusValue) => {
    if (!selectedId) return;
    updateQuestion.mutate({
      id: selectedId,
      payload: { status: statusValue }
    });
  };

  const handleUpdateDifficulty = (diffValue) => {
    if (!selectedId) return;
    updateQuestion.mutate({
      id: selectedId,
      payload: { difficulty: diffValue }
    });
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!selectedId || !noteTitle.trim() || !noteContent.trim()) return;

    try {
      // Create Note
      const newNote = await createNote.mutateAsync({
        title: noteTitle,
        content: noteContent,
        topics: activeQuestion?.topics || [],
        tags: activeQuestion?.tags || []
      });

      const newNoteId = newNote.data._id;
      // Append Note ID to Question's notes list
      const existingNoteIds = (activeQuestion?.notes || []).map(n => n._id || n);

      await updateQuestion.mutateAsync({
        id: selectedId,
        payload: {
          notes: [...existingNoteIds, newNoteId]
        }
      });

      // Clear input form
      setNoteTitle('');
      setNoteContent('');
      setNoteWriting(false);
    } catch (err) {
      console.error("Failed to add note inline:", err);
    }
  };

  const handleDelete = () => {
    if (!selectedId) return;
    if (confirm("Are you sure you want to delete this question? This will also cascades-delete associated revisions.")) {
      deleteQuestion.mutate(selectedId, {
        onSuccess: () => {
          setSelectedId(null);
        }
      });
    }
  };

  if (isLoading) return <PageShell><LoadingState title="Loading Workspace" description="Summoning interview matrices and practice logs..." /></PageShell>;
  if (error) return <PageShell><ErrorState description={error.message} onRetry={refetch} /></PageShell>;

  return (
    <PageShell className="space-y-6">
      {/* Workspace Sub-header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Interview Workspace</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-cyan-400 font-medium">Registry & Spec Board</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Practice Command Center</h1>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-semibold shadow-lg shadow-cyan-500/10">
          <Plus className="h-4 w-4 mr-1.5" /> Add Question
        </Button>
      </section>

      {/* Main Double Panel Workspace Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_390px] gap-6 items-start">

        {/* Left Side: Filter & Interactive Feed */}
        <div className="space-y-4 min-w-0">

          {/* Flat Filters Bar */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center bg-white/5 border border-white/5 p-2 rounded-2xl">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                defaultValue={params.q || ''}
                onKeyDown={(event) => { if (event.key === 'Enter') setFilter('q', event.currentTarget.value); }}
                placeholder="Search queries..."
                className="pl-9 h-9 text-xs bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder-slate-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={params.difficulty || 'all'} onValueChange={(value) => setFilter('difficulty', value)}>
                <SelectTrigger className="h-9 w-[115px] bg-[#14110d] border-white/5 rounded-xl text-[11px] text-slate-300"><SelectValue placeholder="Difficulty" /></SelectTrigger>
                <SelectContent className="bg-[#14110d] border-white/10">
                  <SelectItem value="all">Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              <Select value={params.status || 'all'} onValueChange={(value) => setFilter('status', value)}>
                <SelectTrigger className="h-9 w-[115px] bg-[#14110d] border-white/5 rounded-xl text-[11px] text-slate-300"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent className="bg-[#14110d] border-white/10">
                  <SelectItem value="all">Statuses</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Solved">Solved</SelectItem>
                  <SelectItem value="Needs Revision">Needs Revision</SelectItem>
                </SelectContent>
              </Select>

              <Select value={params.platform || 'all'} onValueChange={(value) => setFilter('platform', value)}>
                <SelectTrigger className="h-9 w-[115px] bg-[#14110d] border-white/5 rounded-xl text-[11px] text-slate-300"><SelectValue placeholder="Platform" /></SelectTrigger>
                <SelectContent className="bg-[#14110d] border-white/10">
                  <SelectItem value="all">Platform</SelectItem>
                  {platformsList.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(params.q || params.difficulty || params.status || params.platform) && (
                <Button variant="ghost" size="sm" onClick={() => setSearchParams({})} className="text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl h-8 px-2">
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Interactive Rows Feed */}
          {questions.length ? (
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="show"
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/5"
            >
              {questions.map((question) => {
                const isSelected = selectedId === question._id;
                return (
                  <motion.div
                    key={question._id}
                    variants={listItemVariants}
                    onClick={() => setSelectedId(question._id)}
                    className={`group relative flex items-center justify-between gap-4 px-5 py-4 cursor-pointer transition-all duration-200 ${isSelected
                      ? 'bg-gradient-to-r from-cyan-950/20 via-cyan-900/10 to-transparent border-l-2 border-cyan-400'
                      : 'hover:bg-white/[0.04] border-l-2 border-transparent'
                      }`}
                  >
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`h-2 w-2 rounded-full ${question.status === 'Solved' ? 'bg-amber-400 shadow-md shadow-amber-400/25' :
                          question.status === 'Needs Revision' ? 'bg-rose-400 shadow-md shadow-rose-400/22' :
                            question.status === 'In Progress' ? 'bg-orange-400 shadow-md shadow-orange-400/20' : 'bg-slate-500'
                          }`} />
                        <h3 className="font-semibold text-slate-100 text-sm md:text-base leading-tight group-hover:text-cyan-300 transition-colors truncate">
                          {question.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="font-medium text-slate-300">{question.platform}</span>
                        <span>·</span>
                        <span className={`font-medium ${question.difficulty?.toLowerCase() === 'easy' ? 'text-amber-400' :
                          question.difficulty?.toLowerCase() === 'medium' ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                          {question.difficulty}
                        </span>
                        {question.topics?.length > 0 && (
                          <>
                            <span>·</span>
                            <div className="flex items-center gap-1">
                              {question.topics.slice(0, 1).map(topic => (
                                <span key={topic} className="bg-white/5 px-2 py-0.5 rounded-md text-[10px]">{topic}</span>
                              ))}
                            </div>
                          </>
                        )}
                        <span>·</span>
                        <span>{question.notes?.length || 0} notes</span>
                      </div>

                      {(() => {
                        const firstNote = question.notes?.[0] ? getNoteFromIdOrObj(question.notes[0]) : null;
                        if (!firstNote || !firstNote.content) return null;
                        return (
                          <div className="text-xs text-slate-400 font-normal line-clamp-2 mt-2 leading-relaxed bg-white/5 border border-white/5 p-2.5 rounded-xl max-w-[650px] whitespace-pre-wrap">
                            <span className="text-cyan-400 font-medium mr-1">Latest Note:</span>
                            <strong className="text-slate-200 font-semibold">{firstNote.title}</strong> — {firstNote.content}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      {question.url && (
                        <a
                          href={question.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()} // Prevents selection click trigger
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                          title="Open on Platform"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" asChild>
                        <Link to={`/questions/${question._id}`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <EmptyState title="No questions matching filters" description="Try resetting your criteria or add a new workspace problem." icon={Sparkles} />
          )}

          {/* Simple Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <p>Page {meta.page || 1} of {meta.totalPages || 1} · {meta.total || 0} tracked</p>
          </div>
        </div>

        {/* Right Side: Interactive Spec Inspector (Slide pane) */}
        <div className="sticky top-6">
          <AnimatePresence mode="wait">
            {selectedId ? (
              <motion.div
                key={selectedId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-white/10 bg-[#14110d]/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
                  <CardContent className="p-6 space-y-6">
                    {/* Inspector Header */}
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${activeQuestion?.difficulty?.toLowerCase() === 'easy' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            activeQuestion?.difficulty?.toLowerCase() === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                            {activeQuestion?.difficulty}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">{activeQuestion?.platform}</span>
                        </div>
                        <h2 className="text-lg font-bold text-white mt-1.5 leading-snug truncate max-w-[280px]" title={activeQuestion?.title}>
                          {activeQuestion?.title}
                        </h2>
                      </div>

                      <Button variant="ghost" size="icon" onClick={() => setSelectedId(null)} className="h-7 w-7 text-slate-400 hover:text-white rounded-lg">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {isLoadingDetail ? (
                      <div className="py-20 text-center text-xs text-slate-500">Syncing detail spec...</div>
                    ) : (
                      <>
                        {/* Control Deck (Update Fields Instantly) */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Specifications</h4>

                          <div className="grid grid-cols-[100px_1fr] items-center gap-2 text-xs">
                            <span className="text-slate-400">Current Status:</span>
                            <Select value={activeQuestion?.status || 'Not Started'} onValueChange={handleUpdateStatus}>
                              <SelectTrigger className="h-8 bg-white/5 border-white/5 text-[11px] text-slate-200">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#14110d] border-white/10 text-xs">
                                <SelectItem value="Not Started">Not Started</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Solved">Solved</SelectItem>
                                <SelectItem value="Needs Revision">Needs Revision</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-[100px_1fr] items-center gap-2 text-xs">
                            <span className="text-slate-400">Difficulty:</span>
                            <Select value={activeQuestion?.difficulty || 'easy'} onValueChange={handleUpdateDifficulty}>
                              <SelectTrigger className="h-8 bg-white/5 border-white/5 text-[11px] text-slate-200">
                                <SelectValue placeholder="Difficulty" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#14110d] border-white/10 text-xs animate-none">
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {activeQuestion?.url && (
                            <Button asChild className="w-full h-9 rounded-xl bg-cyan-600/10 text-cyan-400 hover:bg-cyan-600/20 border border-cyan-800/20 text-xs">
                              <a href={activeQuestion?.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                                Launch Problem Page <ArrowUpRight className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          )}
                        </div>

                        {/* Quick Notes Linked Section */}
                        <div className="space-y-3 pt-4 border-t border-white/5">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <NotebookPen className="h-3.5 w-3.5" /> Linked Notes ({activeQuestion?.notes?.length || 0})
                            </h4>

                            {!noteWriting && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setNoteWriting(true)}
                                className="h-7 text-[11px] text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 px-2 rounded-lg"
                              >
                                Write Note
                              </Button>
                            )}
                          </div>

                          {/* Inline writing form */}
                          {noteWriting && (
                            <motion.form
                              onSubmit={handleSaveNote}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="bg-white/5 border border-white/5 p-3 rounded-xl space-y-2"
                            >
                              <Input
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                                placeholder="Note title..."
                                required
                                className="h-8 text-xs bg-transparent border-0 border-b border-white/10 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 rounded-none text-white"
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
                                  className="h-7 text-[10px] rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 font-semibold"
                                >
                                  Save Note
                                </Button>
                              </div>
                            </motion.form>
                          )}

                          {/* Notes Feed list wrapper */}
                          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                            {activeQuestion?.notes?.length > 0 ? (
                              activeQuestion.notes.map((noteRef) => {
                                const note = getNoteFromIdOrObj(noteRef);

                                return note ? (
                                  <div key={note._id} className="bg-white/5 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
                                    <h5 className="font-semibold text-slate-200 text-xs truncate">{note.title}</h5>
                                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-4 leading-relaxed whitespace-pre-wrap font-sans">
                                      {note.content}
                                    </p>
                                    <p className="text-[9px] text-slate-500 mt-2 text-right font-sans">
                                      {formatDateTime(note.createdAt)}
                                    </p>
                                  </div>
                                ) : (
                                  <div key={typeof noteRef === 'object' ? noteRef._id : noteRef} className="bg-white/5 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors text-xs text-slate-400 italic">
                                    Note syncing...
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-xs text-slate-500 italic py-4">No notes linked to this question yet.</p>
                            )}
                          </div>
                        </div>

                        {/* Delete Command zone */}
                        <div className="pt-4 border-t border-white/5 flex gap-2">
                          <Button
                            variant="secondary"
                            className="flex-1 h-9 rounded-xl text-xs text-slate-400 hover:text-white"
                            onClick={() => navigate(`/questions/${selectedId}`)}
                          >
                            Explore Workspace
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-9 w-9 rounded-xl text-rose-400 hover:text-rose-350 hover:bg-rose-500/10 p-0"
                            onClick={handleDelete}
                            title="Delete problem"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-dashed border-white/10 bg-transparent rounded-2xl p-8 text-center">
                  <CardContent className="p-0 py-16 flex flex-col items-center justify-center space-y-4">
                    <div className="h-12 w-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-cyan-400 shadow-inner">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-sm">Specification Deck</h3>
                      <p className="text-xs text-slate-400 max-w-[220px]">
                        Select any question from the registry board to view linked notes, edit difficulty, or update statuses in real-time.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      <QuestionFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageShell>
  );
}
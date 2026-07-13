import React from 'react';
import { PageShell } from '@/components/common/page-shell';
import { LoadingState, ErrorState, EmptyState } from '@/components/common/state-views';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useRevisions } from '@/hooks/useRevisions';
import { formatDateTime, getStatusTone } from '@/lib/utils';
import { CalendarDays, CheckCircle2, Clock3, Sparkles } from 'lucide-react';

const revisionContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
};

const revisionItemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 15 } }
};

function RevisionList({ items, emptyTitle, emptyDescription }) {
  if (!items.length) return <EmptyState title={emptyTitle} description={emptyDescription} icon={Sparkles} />;
  return (
    <motion.div
      variants={revisionContainerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-4 xl:grid-cols-2"
    >
      {items.map((revision) => (
        <motion.div key={revision._id} variants={revisionItemVariants}>
          <Card className="border-white/10 bg-white/5 hover:border-cyan-500/10 transition-all duration-300 shadow-xl hover:shadow-cyan-950/10">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Due {formatDateTime(revision.dueDate)}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white tracking-tight">{revision.questionId?.title || 'Question'}</h3>
                </div>
                <Badge variant={getStatusTone(revision.status)}>{revision.status}</Badge>
              </div>
              <p className="text-sm text-slate-400">Platform: {revision.questionId?.platform || '—'} · Difficulty: {revision.questionId?.difficulty || '—'}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" disabled className="rounded-xl">Complete</Button>
                <Button variant="secondary" disabled className="rounded-xl">Skip</Button>
                <Button variant="secondary" disabled className="rounded-xl">Reschedule</Button>
              </div>
              <p className="text-[10px] text-slate-500 font-light italic">Those actions are intentionally disabled until corresponding backend endpoints exist.</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function RevisionsPage() {
  const dueQuery = useRevisions('due');
  const upcomingQuery = useRevisions('upcoming');
  const completedQuery = useRevisions('completed');

  const loading = dueQuery.isLoading || upcomingQuery.isLoading || completedQuery.isLoading;
  const error = dueQuery.error || upcomingQuery.error || completedQuery.error;

  if (loading) return <PageShell><LoadingState title="Loading revisions" description="Gathering due, upcoming, and completed revision records." /></PageShell>;
  if (error) return <PageShell><ErrorState description={error.message} onRetry={() => { dueQuery.refetch(); upcomingQuery.refetch(); completedQuery.refetch(); }} /></PageShell>;

  return (
    <PageShell className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <Badge variant="accent">Revisions</Badge>
            <h1 className="text-4xl font-semibold tracking-tight">Spaced repetition without the noise.</h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">The revision workspace keeps your prep loop honest. Due work stays visible, upcoming work stays calm, and completed work accumulates as proof of consistency.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-muted-foreground">Due</p><p className="mt-2 text-2xl font-semibold text-rose-300">{dueQuery.data?.length || 0}</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-muted-foreground">Upcoming</p><p className="mt-2 text-2xl font-semibold text-cyan-300">{upcomingQuery.data?.length || 0}</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-muted-foreground">Completed</p><p className="mt-2 text-2xl font-semibold text-amber-300">{completedQuery.data?.length || 0}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <div className="flex items-center gap-3"><CalendarDays className="h-5 w-5 text-cyan-300" /><p className="font-medium">Revision status</p></div>
            <div className="space-y-3">
              {[
                ['Due now', dueQuery.data?.length || 0, 'danger'],
                ['Upcoming', upcomingQuery.data?.length || 0, 'accent'],
                ['Completed', completedQuery.data?.length || 0, 'success'],
              ].map(([label, value, tone]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <Badge variant={tone}>{value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="due">
        <TabsList>
          <TabsTrigger value="due">Due</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="due"><RevisionList items={dueQuery.data || []} emptyTitle="No due revisions" emptyDescription="You're caught up right now. New due items will appear here automatically." /></TabsContent>
        <TabsContent value="upcoming"><RevisionList items={upcomingQuery.data || []} emptyTitle="No upcoming revisions" emptyDescription="No scheduled revision records were found yet." /></TabsContent>
        <TabsContent value="completed"><RevisionList items={completedQuery.data || []} emptyTitle="No completed revisions" emptyDescription="Completed revisions will be listed here once you finish scheduled work." /></TabsContent>
      </Tabs>
    </PageShell>
  );
}
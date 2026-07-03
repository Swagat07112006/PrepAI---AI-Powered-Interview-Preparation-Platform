import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, CalendarDays, CircleCheckBig, Flame, ListTodo, Sparkles, Target, NotebookPen, BadgeAlert, Lightbulb, WandSparkles } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { PageShell } from '@/components/common/page-shell';
import { LoadingState, ErrorState, EmptyState } from '@/components/common/state-views';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDateTime, formatCompactNumber, getStatusTone } from '@/lib/utils';

function Counter({ value }) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let frame;
    const duration = 600;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(value * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span>{formatCompactNumber(count)}</span>;
}

function SectionTitle({ title, description, action }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

function ProgressRing({ value = 0, label }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative grid h-32 w-32 place-items-center">
      <svg viewBox="0 0 110 110" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="55" cy="55" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none" />
        <circle cx="55" cy="55" r={radius} stroke="url(#dashboard-ring)" strokeWidth="10" strokeLinecap="round" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} />
        <defs>
          <linearGradient id="dashboard-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5eead4" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center">
        <p className="text-2xl font-semibold">{Math.round(value)}%</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboard();

  if (isLoading) return <PageShell><LoadingState title="Loading dashboard" description="Pulling your progress, activity, and revision surfaces." /></PageShell>;
  if (error) return <PageShell><ErrorState description={error.message} onRetry={refetch} /></PageShell>;

  const overview = data?.overview || {};
  const topicAnalytics = data?.topicAnalytics || [];
  const chart = data?.solvedQuestionsChart || [];
  const recentActivities = data?.recentActivities || [];
  const solvedRate = overview.totalQuestions ? Math.round((overview.solvedQuestions / overview.totalQuestions) * 100) : 0;
  const goalCompletion = Math.min(100, Math.round(((overview.solvedQuestions || 0) + (overview.dueRevisions || 0)) * 12));

  return (
    <PageShell className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="relative overflow-hidden border-white/10 bg-white/5">
          <CardContent className="relative grid gap-6 p-6 sm:p-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
            <div>
              <Badge variant="accent">Today&apos;s workspace</Badge>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Build momentum without losing the revision loop.</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">PrepAI surfaces the only numbers that matter: solving velocity, revision pressure, and the depth of your note capture.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild><Link to="/questions">Open questions <ArrowRight className="h-4 w-4" /></Link></Button>
                <Button variant="secondary" asChild><Link to="/revisions">Review due revisions</Link></Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[28px] border border-white/10 bg-[#08101f] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Daily goal</p>
                    <p className="mt-1 text-2xl font-semibold">{goalCompletion}% complete</p>
                  </div>
                  <Target className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Focus blocks</span>
                  <span>{overview.totalQuestions || 0} questions tracked</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400" style={{ width: `${goalCompletion}%` }} />
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-[#08101f] p-5">
                <p className="text-sm text-muted-foreground">Current streak</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-semibold text-amber-300">{overview.streak || 0}</p>
                    <p className="mt-1 text-sm text-muted-foreground">days in a row</p>
                  </div>
                  <Flame className="h-8 w-8 text-amber-300" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <SectionTitle title="Weekly signal" description="A compact view of solving consistency." />
            <div className="flex items-center gap-5">
              <ProgressRing value={solvedRate} label="solved rate" />
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3"><CircleCheckBig className="h-4 w-4 text-emerald-300" /> <span>{overview.solvedQuestions || 0} solved questions</span></div>
                <div className="flex items-center gap-3"><BadgeAlert className="h-4 w-4 text-amber-300" /> <span>{overview.pendingQuestions || 0} pending questions</span></div>
                <div className="flex items-center gap-3"><CalendarDays className="h-4 w-4 text-cyan-300" /> <span>{overview.dueRevisions || 0} revisions due</span></div>
              </div>
            </div>
            <Separator className="bg-white/10" />
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-semibold"><Counter value={overview.totalQuestions || 0} /></p><p className="text-xs text-muted-foreground">Questions</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-semibold"><Counter value={overview.totalNotes || 0} /></p><p className="text-xs text-muted-foreground">Notes</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-semibold"><Counter value={overview.dueRevisions || 0} /></p><p className="text-xs text-muted-foreground">Due</p></div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <SectionTitle title="Learning timeline" description="Solved history mapped to a calm, readable cadence." />
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#08101f] p-5">
              <div className="absolute inset-x-4 top-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="grid grid-cols-[repeat(auto-fit,minmax(68px,1fr))] gap-3">
                {chart.slice(-7).map((entry) => (
                  <div key={entry.date} className="flex flex-col items-center gap-2">
                    <div className="mt-auto flex h-40 w-full items-end justify-center">
                      <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-8 origin-bottom rounded-t-2xl bg-gradient-to-t from-blue-500 to-cyan-300" style={{ height: `${Math.max(14, (entry.count / Math.max(...chart.map((item) => item.count || 1), 1)) * 100)}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground">{entry.date.slice(5)}</p>
                  </div>
                ))}
                {!chart.length ? <div className="col-span-full py-12 text-center text-sm text-muted-foreground">No solved-question chart data yet.</div> : null}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <SectionTitle title="Topic analytics" description="Where your preparation is strongest and where it still drifts." action={<Badge variant="outline">{topicAnalytics.length} topics</Badge>} />
            <div className="space-y-4">
              {topicAnalytics.length ? topicAnalytics.slice(0, 6).map((topic) => (
                <div key={topic.topic} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{topic.topic}</p>
                      <p className="text-xs text-muted-foreground">{topic.total} questions tracked</p>
                    </div>
                    <Badge variant={getStatusTone(topic.completion >= 70 ? 'Solved' : topic.completion >= 40 ? 'In Progress' : 'Needs Revision')}>{Math.round(topic.completion || 0)}%</Badge>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400" style={{ width: `${Math.min(100, Math.max(0, topic.completion || 0))}%` }} />
                  </div>
                </div>
              )) : <EmptyState title="No topic analytics yet" description="Solve questions tagged with topics to unlock the analytics surface." icon={Sparkles} />}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <SectionTitle title="Revision center" description="Your spaced-repetition pressure surface." />
            <div className="space-y-3">
              {[{ label: 'Due now', value: overview.dueRevisions || 0, tone: 'danger' }, { label: 'Pending problems', value: overview.pendingQuestions || 0, tone: 'warning' }, { label: 'Solved recently', value: overview.solvedQuestions || 0, tone: 'success' }].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <Badge variant={item.tone}>{item.value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <SectionTitle title="Recent activity" description="What changed most recently across the workspace." />
            <div className="space-y-3">
              {recentActivities.length ? recentActivities.map((item, index) => (
                <div key={`${item.title}-${index}`} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mt-0.5 rounded-full border border-white/10 bg-[#07111d] p-2 text-cyan-300">
                    {item.type === 'Question' ? <ListTodo className="h-4 w-4" /> : item.type === 'note' ? <NotebookPen className="h-4 w-4" /> : <CircleCheckBig className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.type} · {formatDateTime(item.time)}</p>
                  </div>
                </div>
              )) : <EmptyState title="No recent activity" description="Solve questions and save notes to populate your activity feed." icon={Sparkles} />}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <SectionTitle title="Quick actions" description="Move fast without leaving the workspace." />
            <div className="grid gap-3 sm:grid-cols-2">
              {[{ title: 'Add question', href: '/questions', icon: ListTodo }, { title: 'Write note', href: '/notes', icon: NotebookPen }, { title: 'Review revisions', href: '/revisions', icon: CalendarDays }, { title: 'Open profile', href: '/profile', icon: CircleCheckBig }].map((item) => (
                <Button key={item.title} asChild variant="secondary" className="h-auto justify-between rounded-3xl px-4 py-4">
                  <Link to={item.href}><span className="flex items-center gap-2"><item.icon className="h-4 w-4" /> {item.title}</span><ArrowRight className="h-4 w-4" /></Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <SectionTitle title="AI recommendations" description="Placeholder for the future assistant engine." />
            <div className="rounded-[28px] border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm text-cyan-100">
              Soon this surface can suggest what to solve next, what to revise today, and which notes need compression.
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {['Weakest topic summary', 'Upcoming study route', 'Revision compression', 'Company-specific drills'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">{item}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
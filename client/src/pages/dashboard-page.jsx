import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, CalendarDays, CircleCheckBig, Flame, ListTodo, Sparkles, Target, NotebookPen, BadgeAlert, Lightbulb } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { PageShell } from '@/components/common/page-shell';
import { LoadingState, ErrorState, EmptyState } from '@/components/common/state-views';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDateTime, formatCompactNumber, getStatusTone } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

function Counter({ value }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame;
    const duration = 800;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const easedProgress = progress * (2 - progress);
      setCount(Math.round(value * easedProgress));
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
        <h2 className="text-xl font-semibold sm:text-2xl text-white tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

function ProgressRing({ value = 0, label }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const [offsetState, setOffsetState] = useState(circumference);

  useEffect(() => {
    const targetOffset = circumference - (value / 100) * circumference;
    const timer = setTimeout(() => {
      setOffsetState(targetOffset);
    }, 150);
    return () => clearTimeout(timer);
  }, [value, circumference]);

  return (
    <div className="relative grid h-32 w-32 place-items-center">
      <svg viewBox="0 0 110 110" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="55" cy="55" r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" />
        <circle
          cx="55"
          cy="55"
          r={radius}
          stroke="url(#dashboard-ring)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: offsetState,
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
        <defs>
          <linearGradient id="dashboard-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center">
        <p className="text-2xl font-bold text-white tracking-tight">
          <Counter value={value} />%
        </p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
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
    <PageShell>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.section variants={itemVariants} className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <Card className="relative overflow-hidden border-white/10 bg-white/5 shadow-xl hover:border-cyan-500/10 transition-all duration-300">
            <CardContent className="relative grid gap-6 p-6 sm:p-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
              <div className="space-y-4">
                <Badge variant="accent" className="w-fit">Today&apos;s workspace</Badge>
                <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Build momentum without losing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">revision loop</span>.
                </h1>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                  PrepAI surfaces the only numbers that matter: solving velocity, revision pressure, and the depth of your note capture.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button asChild className="rounded-xl shadow-glow transition duration-300 hover:scale-[1.03]">
                    <Link to="/questions">Open questions <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                  <Button variant="secondary" asChild className="rounded-xl transition duration-300 hover:bg-white/10">
                    <Link to="/revisions">Review due revisions</Link>
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-[28px] border border-white/5 bg-[#14110d] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Daily goal</p>
                      <p className="mt-1 text-xl font-semibold text-white">{goalCompletion}% complete</p>
                    </div>
                    <Target className="h-5 w-5 text-amber-500 shadow-glow shrink-0" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Focus blocks</span>
                    <span>{overview.totalQuestions || 0} questions tracked</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goalCompletion}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                    />
                  </div>
                </div>
                <div className="rounded-[28px] border border-white/5 bg-[#14110d] p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Current streak</p>
                    <p className="mt-2 text-3xl font-bold text-amber-300 leading-none">
                      <Counter value={overview.streak || 0} />
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-none">days active streak</p>
                  </div>
                  <Flame className="h-9 w-9 text-amber-300 shrink-0 filter drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 hover:border-amber-500/10 transition-all duration-300 shadow-xl">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <SectionTitle title="Weekly signal" description="A compact view of solving consistency." />
              <div className="flex items-center gap-5 justify-between">
                <ProgressRing value={solvedRate} label="solved rate" />
                <div className="space-y-2.5 text-sm text-muted-foreground flex-1 pl-4 border-l border-white/5">
                  <div className="flex items-center gap-2"><CircleCheckBig className="h-4 w-4 text-amber-400 shrink-0" /> <span className="text-white"><Counter value={overview.solvedQuestions || 0} /> solved</span></div>
                  <div className="flex items-center gap-2"><BadgeAlert className="h-4 w-4 text-amber-400 shrink-0" /> <span><Counter value={overview.pendingQuestions || 0} /> pending</span></div>
                  <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-amber-400 shrink-0" /> <span><Counter value={overview.dueRevisions || 0} /> revisions due</span></div>
                </div>
              </div>
              <Separator className="bg-white/10" />
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3"><p className="text-xl font-bold text-white"><Counter value={overview.totalQuestions || 0} /></p><p className="text-[10px] text-muted-foreground uppercase mt-1">Questions</p></div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3"><p className="text-xl font-bold text-white"><Counter value={overview.totalNotes || 0} /></p><p className="text-[10px] text-muted-foreground uppercase mt-1">Notes</p></div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3"><p className="text-xl font-bold text-white"><Counter value={overview.dueRevisions || 0} /></p><p className="text-[10px] text-muted-foreground uppercase mt-1">Due</p></div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants} className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <Card className="border-white/10 bg-white/5 hover:border-amber-500/10 transition-all duration-300 shadow-xl">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <SectionTitle title="Learning timeline" description="Solved history mapped to a calm, readable cadence." />
              <div className="relative overflow-hidden rounded-[28px] border border-white/5 bg-[#14110d] p-5">
                <div className="absolute inset-x-4 top-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="grid grid-cols-[repeat(auto-fit,minmax(68px,1fr))] gap-3">
                  {chart.slice(-7).map((entry) => (
                    <div key={entry.date} className="flex flex-col items-center gap-2">
                      <div className="mt-auto flex h-36 w-full items-end justify-center">
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="w-full max-w-8 origin-bottom rounded-t-xl bg-gradient-to-t from-amber-600 to-amber-400 hover:from-amber-700 hover:to-amber-500 transition duration-200 cursor-pointer"
                          style={{ height: `${Math.max(14, (entry.count / Math.max(...chart.map((item) => item.count || 1), 1)) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono">{entry.date.slice(5)}</p>
                    </div>
                  ))}
                  {!chart.length ? <div className="col-span-full py-12 text-center text-xs text-muted-foreground font-light">No solved-question chart data yet.</div> : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 hover:border-cyan-500/10 transition-all duration-300 shadow-xl">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <SectionTitle title="Topic analytics" description="Where your preparation is strongest and where it still drifts." action={<Badge variant="outline" className="border-cyan-400/20 text-cyan-300">{topicAnalytics.length} topics</Badge>} />
              <div className="space-y-3">
                {topicAnalytics.length ? topicAnalytics.slice(0, 5).map((topic) => (
                  <div key={topic.topic} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition duration-200">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white leading-normal">{topic.topic}</p>
                        <p className="text-[10px] text-muted-foreground">{topic.total} questions tracked</p>
                      </div>
                      <Badge variant={getStatusTone(topic.completion >= 70 ? 'Solved' : topic.completion >= 40 ? 'In Progress' : 'Needs Revision')}>{Math.round(topic.completion || 0)}%</Badge>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(0, topic.completion || 0))}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      />
                    </div>
                  </div>
                )) : <EmptyState title="No topic analytics yet" description="Solve questions tagged with topics to unlock the analytics surface." icon={Sparkles} />}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants} className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-white/10 bg-white/5 hover:border-cyan-500/10 transition-all duration-300 shadow-xl">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <SectionTitle title="Revision center" description="Your spaced-repetition pressure surface." />
              <div className="space-y-2.5">
                {[
                  { label: 'Due now', value: overview.dueRevisions || 0, tone: 'danger' },
                  { label: 'Pending problems', value: overview.pendingQuestions || 0, tone: 'warning' },
                  { label: 'Solved recently', value: overview.solvedQuestions || 0, tone: 'success' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition duration-200">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <Badge variant={item.tone} className="px-2.5 py-0.5">{item.value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 hover:border-cyan-500/10 transition-all duration-300 shadow-xl">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <SectionTitle title="Recent activity" description="What changed most recently across the workspace." />
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                {recentActivities.length ? recentActivities.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition duration-200">
                    <div className="mt-0.5 rounded-full border border-white/10 bg-[#07111d] p-1.5 text-cyan-400">
                      {item.type === 'Question' ? <ListTodo className="h-3.5 w-3.5" /> : item.type === 'note' ? <NotebookPen className="h-3.5 w-3.5" /> : <CircleCheckBig className="h-3.5 w-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-white leading-normal">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.type} · {formatDateTime(item.time)}</p>
                    </div>
                  </div>
                )) : <EmptyState title="No recent activity" description="Solve questions and save notes to populate your activity feed." icon={Sparkles} />}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants} className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-white/10 bg-white/5 hover:border-cyan-500/10 transition-all duration-300 shadow-xl">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <SectionTitle title="Quick actions" description="Move fast without leaving the workspace." />
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: 'Add question', href: '/questions', icon: ListTodo },
                  { title: 'Write note', href: '/notes', icon: NotebookPen },
                  { title: 'Review revisions', href: '/revisions', icon: CalendarDays },
                  { title: 'Open profile', href: '/profile', icon: CircleCheckBig }
                ].map((item) => (
                  <Button key={item.title} asChild variant="secondary" className="h-auto justify-between rounded-2xl px-4 py-3.5 border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] transition duration-300 group">
                    <Link to={item.href}>
                      <span className="flex items-center gap-2 text-xs font-semibold text-white">
                        <item.icon className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition duration-300 shrink-0" />
                        {item.title}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-white transition duration-300" />
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 hover:border-cyan-500/10 transition-all duration-300 shadow-xl">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <SectionTitle title="AI recommendations" description="Direct cues from your study telemetry." />
              <div className="rounded-[22px] border border-cyan-400/20 bg-cyan-400/10 p-4 text-xs font-light leading-relaxed text-cyan-100 flex gap-2 items-start shadow-glow">
                <Lightbulb className="h-4 w-4 text-cyan-300 shrink-0 mt-0.5" />
                <p>Soon this surface can suggest what to solve next, what to revise today, and which notes need compression.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {['Weakest topic summary', 'Upcoming study route', 'Revision compression', 'Company-specific drills'].map((item) => (
                  <div key={item} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center text-xs text-muted-foreground shadow-sm hover:border-white/10 transition duration-200 select-none">{item}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>
    </PageShell>
  );
}
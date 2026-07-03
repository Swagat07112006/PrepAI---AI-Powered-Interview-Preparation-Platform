import { ArrowRight, Check, CirclePlay, Sparkles, Star, Zap, ShieldCheck, Layers3, Brain, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SpaceBackdrop } from '@/components/common/space-backdrop';

const featureCopy = [
  { icon: Brain, title: 'AI-first practice loop', text: 'Plan, solve, revise, and review in one workspace with no tab fragmentation.' },
  { icon: Layers3, title: 'Bento workspace', text: 'A premium asymmetrical dashboard that feels closer to Linear than an admin panel.' },
  { icon: ShieldCheck, title: 'Structured prep', text: 'Questions, notes, revisions, and insights are all aligned to a repeatable process.' },
  { icon: Zap, title: 'Fast mutation flows', text: 'Create and edit entries with forms tuned for clarity, speed, and low friction.' },
];

const testimonials = [
  { name: 'Aarav', role: 'SWE Intern', quote: 'PrepAI finally makes interview prep feel like a calm operating system instead of a spreadsheet.' },
  { name: 'Maya', role: 'Backend Engineer', quote: 'The revision workspace is the first thing I have used that actually changes my daily cadence.' },
  { name: 'Noah', role: 'Product Engineer', quote: 'It feels like a funded startup product from the first screen. Strong brand, strong motion.' },
];

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <SpaceBackdrop />
      <header className="relative z-10 mx-auto flex max-w-[1600px] items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-[#07111d] shadow-lg shadow-cyan-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">PrepAI</p>
            <p className="text-xs text-muted-foreground">AI interview prep platform</p>
          </div>
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild><Link to="/dashboard">Workspace</Link></Button>
          <Button variant="secondary" asChild><Link to="/login">Sign in</Link></Button>
          <Button asChild><Link to="/register">Get started</Link></Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-8">
            <Badge variant="accent" className="w-fit">Built for serious interview preparation</Badge>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">Prep like a funded startup built your own interview OS.</h1>
              <p className="max-w-2xl text-lg text-muted-foreground text-balance sm:text-xl">PrepAI turns coding practice into a premium workspace for questions, notes, revisions, and progress tracking. The AI surfaces are designed now, even before backend support lands.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild><Link to="/register">Start free <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button size="lg" variant="secondary" asChild><Link to="/dashboard"><CirclePlay className="h-4 w-4" /> View workspace</Link></Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-300" /> Premium motion language</div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-cyan-300" /> Built for solo prep and teams</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative">
            <Card className="relative overflow-hidden border-white/10 bg-[#0a1020]/70 p-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_32%)]" />
              <div className="absolute inset-0 bg-grid bg-[size:42px_42px] opacity-20" />
              <CardContent className="relative grid gap-4 p-4 sm:p-6">
                <div className="glass-panel rounded-[28px] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today&apos;s goal</p>
                      <p className="mt-1 text-2xl font-semibold">2 problems, 1 note, 3 revisions</p>
                    </div>
                    <Badge variant="success">84% streak adherence</Badge>
                  </div>
                  <div className="mt-6 grid grid-cols-4 gap-3">
                    {['Focus', 'Solve', 'Revise', 'Reflect'].map((item, index) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <p className="text-xs text-muted-foreground">0{index + 1}</p>
                        <p className="mt-2 text-sm font-medium">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-muted-foreground">AI preview</p>
                    <p className="mt-3 text-xl font-semibold">Explain the sliding window pattern for a junior engineer.</p>
                    <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                      Start with a moving boundary, expand to gather context, then contract when the window becomes invalid.
                    </div>
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-[#07111d]">
                        <span className="text-xl font-semibold">73%</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p>Questions solved</p>
                        <p>Revision stability</p>
                        <p>Note coverage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section className="grid gap-4 py-10 md:grid-cols-2 xl:grid-cols-4">
          {featureCopy.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.06 }} className="glass-panel rounded-[28px] p-5">
              <feature.icon className="h-5 w-5 text-cyan-300" />
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
            </motion.div>
          ))}
        </section>

        <section className="grid gap-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden border-white/10 bg-white/5">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product showcase</p>
                  <h2 className="mt-2 text-3xl font-semibold">Designed to feel like a premium operating surface.</h2>
                </div>
                <Badge variant="outline">Motion-first</Badge>
              </div>
              <Separator className="my-6 bg-white/10" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-[#08101f] p-5">
                  <p className="text-sm text-muted-foreground">Revision center</p>
                  <div className="mt-4 space-y-3">
                    {['Array traversal', 'Binary search variants', 'Dynamic programming states'].map((item) => (
                      <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <span className="text-sm">{item}</span>
                        <Check className="h-4 w-4 text-emerald-300" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-[#08101f] p-5">
                  <p className="text-sm text-muted-foreground">Learning timeline</p>
                  <div className="mt-5 space-y-4">
                    {['Interview recap saved', 'Revision scheduled', 'Topic weakness reduced'].map((item, index) => (
                      <div key={item} className="flex items-start gap-3">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                        <div>
                          <p className="text-sm font-medium">{item}</p>
                          <p className="text-xs text-muted-foreground">{index + 1} hour ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">AI preview</p>
                <h3 className="mt-3 text-2xl font-semibold">Generate a revision plan from your weakest topic.</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">The UI for future AI features is already complete, but each page intentionally stays in a ready state until the backend lands.</p>
                <div className="mt-5 flex items-center gap-2 text-sm text-cyan-200"><Sparkles className="h-4 w-4" /> Coming soon surface already designed</div>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Pricing placeholder</p>
                <h3 className="mt-3 text-2xl font-semibold">Simple, founder-friendly pricing.</h3>
                <p className="mt-3 text-sm text-muted-foreground">This section is intentionally ready for future billing integration.</p>
                <Button className="mt-5 w-full" variant="secondary">Launch waitlist</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="border-white/10 bg-white/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-amber-300">
                    <Star className="h-4 w-4" />
                    <Star className="h-4 w-4" />
                    <Star className="h-4 w-4" />
                    <Star className="h-4 w-4" />
                    <Star className="h-4 w-4" />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.quote}</p>
                  <div className="mt-6">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-10">
          <Card className="border-white/10 bg-white/5">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-3xl font-semibold">Frequently asked questions</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  ['Does PrepAI use the backend right now?', 'Yes, existing auth, dashboard, questions, notes, and revisions are wired. New AI surfaces are designed as polished placeholders.'],
                  ['Can I manage interview notes?', 'Yes. Notes support create, edit, delete, list, and detail views with topic and tag metadata.'],
                  ['Are revisions automatic?', 'The backend creates revision records when a question moves to Solved. The UI reflects due, upcoming, and completed states.'],
                  ['What about future AI features?', 'They already have finished product pages and clear coming-soon states, ready for API integration later.'],
                ].map(([q, a]) => (
                  <div key={q} className="rounded-[28px] border border-white/10 bg-[#08101f] p-5">
                    <p className="font-medium">{q}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{a}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="py-10 text-sm text-muted-foreground">
          <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center">
            <p>PrepAI — a premium workspace for interview preparation.</p>
            <div className="flex gap-4">
              <Link to="/login">Sign in</Link>
              <Link to="/register">Create account</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, Check, CirclePlay, Sparkles, Star, Zap, ShieldCheck, Layers3, Brain, Users, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SpaceBackdrop } from '@/components/common/space-backdrop';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const containerRef = useRef(null);
  const heroCardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header fade-down
      gsap.fromTo('.nav-animate',
        { opacity: 0, y: -25 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );

      // 2. Hero content stagers
      gsap.fromTo('.hero-animate',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.15, ease: 'power4.out', delay: 0.1 }
      );

      // 3. Hero card bento stagger
      gsap.fromTo('.bento-animate',
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.6 }
      );

      // 4. Features Section Reveal
      gsap.fromTo('.feature-animate-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.features-section-trigger',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // 5. Showcase Section Reveal
      gsap.fromTo('.showcase-animate-element',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.showcase-section-trigger',
            start: 'top 85%'
          }
        }
      );

      // 6. Testimonial Section Reveal
      gsap.fromTo('.testimonial-animate-card',
        { opacity: 0, scale: 0.96, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.testimonial-section-trigger',
            start: 'top 85%'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <SpaceBackdrop />
      <header className="relative z-10 mx-auto flex max-w-[1600px] items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 nav-animate">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-[#120f0c] shadow-lg shadow-cyan-500/30 transition duration-300 hover:rotate-6">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">PrepAI</p>
            <p className="text-xs text-muted-foreground">AI interview prep platform</p>
          </div>
        </Link>
        <div className="hidden items-center gap-2 md:flex nav-animate">
          <Button variant="ghost" asChild className="hover:bg-white/5 rounded-xl"><Link to="/dashboard">Workspace</Link></Button>
          <Button variant="secondary" asChild className="rounded-xl"><Link to="/login">Sign in</Link></Button>
          <Button asChild className="rounded-xl shadow-glow"><Link to="/register">Get started</Link></Button>
        </div>
      </header>


      <main className="relative z-10 mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="space-y-8">
            <Badge variant="accent" className="w-fit hero-animate block">Built for serious interview preparation</Badge>
            <div className="space-y-5 hero-animate">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Prep like a funded startup built your own <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">interview OS</span>.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground text-balance sm:text-xl">
                PrepAI turns coding practice into a premium workspace for questions, notes, revisions, and progress tracking. The AI surfaces are fully designed, integrated, and ready to elevate your performance.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 hero-animate">
              <Button size="lg" asChild className="rounded-xl shadow-glow transition duration-300 hover:scale-105"><Link to="/register">Start free <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button size="lg" variant="secondary" asChild className="rounded-xl transition duration-300 hover:bg-white/10"><Link to="/dashboard"><CirclePlay className="h-4 w-4" /> View workspace</Link></Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground hero-animate">
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-300" /> Premium motion language</div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-cyan-300" /> Built for solo prep and teams</div>
            </div>
          </div>

          <div className="relative bento-animate">
            <Card
              ref={heroCardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative overflow-hidden border-white/10 bg-[#110f0b]/75 p-0 transition-all duration-300 hover:border-cyan-500/30 shadow-2xl"
              style={{
                '--x': `${coords.x}px`,
                '--y': `${coords.y}px`
              }}
            >
              {/* Radian hover follow spotlight */}
              {isHovered && (
                <div
                  className="absolute inset-0 pointer-events-none transition duration-500"
                  style={{
                    background: 'radial-gradient(350px circle at var(--x) var(--y), rgba(245,158,11,0.06), transparent 82%)'
                  }}
                />
              )}
              <div className="absolute inset-0 bg-grid bg-[size:42px_42px] opacity-15" />
              <CardContent className="relative grid gap-4 p-4 sm:p-6 select-none">
                <div className="glass-panel rounded-[28px] p-5 bg-white/5 border border-white/5 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today&apos;s goal</p>
                      <p className="mt-1 text-2xl font-semibold text-white">2 problems, 1 note, 3 revisions</p>
                    </div>
                    <Badge variant="success" className="animate-pulse">84% streak adherence</Badge>
                  </div>
                  <div className="mt-6 grid grid-cols-4 gap-3">
                    {['Focus', 'Solve', 'Revise', 'Reflect'].map((item, index) => (
                      <div key={item} className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center">
                        <p className="text-xs text-muted-foreground">0{index + 1}</p>
                        <p className="mt-2 text-sm font-medium text-white">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[28px] border border-white/5 bg-white/[0.03] p-5">
                    <p className="text-sm text-muted-foreground">AI preview</p>
                    <p className="mt-3 text-sm font-medium text-white">Explain the sliding window pattern for a junior engineer.</p>
                    <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-xs font-mono text-cyan-100 leading-relaxed">
                      Start with a moving boundary, expand to gather context, then contract when the window becomes invalid.
                    </div>
                  </div>
                  <div className="rounded-[28px] border border-white/5 bg-white/[0.03] p-5 flex flex-col justify-between">
                    <p className="text-sm text-muted-foreground leading-none">Progress</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="grid h-16 w-16 place-items-center rounded-full border border-cyan-400/20 bg-[#120f0c] text-cyan-300 font-bold shadow-glow text-sm">
                        <span>73%</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        <p>Questions solved</p>
                        <p>Revision stability</p>
                        <p>Note coverage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feature Cards Grid Section */}
        <section className="grid gap-4 py-10 md:grid-cols-2 xl:grid-cols-4 features-section-trigger">
          {featureCopy.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
              className="glass-panel rounded-[28px] p-5 bg-white/5 border border-white/10 hover:border-cyan-500/20 hover:bg-white/[0.08] transition duration-300 feature-animate-card cursor-pointer shadow-lg"
            >
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                <feature.icon className="h-5 w-5 text-cyan-300" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
            </motion.div>
          ))}
        </section>

        {/* Product Showcase Section */}
        <section className="grid gap-6 py-10 lg:grid-cols-[1.1fr_0.9fr] showcase-section-trigger">
          <Card className="overflow-hidden border-white/10 bg-white/5 showcase-animate-element">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product showcase</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">Designed to feel like a premium operating surface.</h2>
                </div>
                <Badge variant="outline" className="border-cyan-400/30 text-cyan-300">Motion-first</Badge>
              </div>
              <Separator className="my-6 bg-white/10" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-white/5 bg-[#14110d] p-5">
                  <p className="text-sm text-muted-foreground">Revision center</p>
                  <div className="mt-4 space-y-3">
                    {['Array traversal', 'Binary search variants', 'Dynamic programming states'].map((item) => (
                      <div key={item} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-white">
                        <span className="text-xs">{item}</span>
                        <Check className="h-4 w-4 text-amber-300 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[28px] border border-white/5 bg-[#14110d] p-5">
                  <p className="text-sm text-muted-foreground">Learning timeline</p>
                  <div className="mt-5 space-y-4">
                    {['Interview recap saved', 'Revision scheduled', 'Topic weakness reduced'].map((item, index) => (
                      <div key={item} className="flex items-start gap-3 text-white">
                        <div className="mt-1 h-2 w-2 rounded-full bg-cyan-400 shrink-0 shadow-glow" />
                        <div>
                          <p className="text-xs font-medium leading-none">{item}</p>
                          <p className="text-[10px] text-[#555] mt-1">{index + 1} hour ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-6 showcase-animate-element">
            <Card className="border-white/10 bg-white/5 hover:border-cyan-500/10 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">AI preview</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Generate a revision plan from your weakest topic.</h3>
                <p className="mt-3 text-xs leading-5 text-muted-foreground font-light">
                  Input modules allow setting exact duration parameters, custom topic targeting, and timeline stagers to tailor interview preparation.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs text-cyan-200"><Sparkles className="h-4 w-4" /> Coming soon surface already designed</div>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5 hover:border-cyan-500/10 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Pricing placeholder</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Simple, founder-friendly pricing.</h3>
                <p className="mt-3 text-xs text-muted-foreground font-light">PrepAI features transparent, simple options tailored for continuous integration.</p>
                <Button className="mt-5 w-full rounded-xl" variant="secondary">Launch waitlist</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials section */}
        <section className="py-10 testimonial-section-trigger">
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="border-white/10 bg-white/5 testimonial-animate-card hover:border-white/20 transition duration-300 cursor-default">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-amber-305">
                    <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                    <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                    <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                    <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                    <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  </div>
                  <p className="mt-4 text-xs leading-5 text-muted-foreground font-light">{item.quote}</p>
                  <div className="mt-6">
                    <p className="font-semibold text-white text-xs leading-none">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-none">{item.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-10">
          <Card className="border-white/10 bg-white/5">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-3xl font-semibold text-white">Frequently asked questions</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  ['Does PrepAI use the backend right now?', 'Yes, existing auth, dashboard, questions, notes, and revisions are fully wired. Stage 1-4 AI features (Roadmap, Assistant, Resume Analyzer, and Mock Simulator) are complete and operational.'],
                  ['Can I manage interview notes?', 'Yes. Notes support create, edit, delete, list, and detail views with topic and tag metadata.'],
                  ['Are revisions automatic?', 'The backend creates revision records when a question moves to Solved. The UI reflects due, upcoming, and completed states.'],
                  ['What framework is used?', 'Vite, React, Tailwind, Radix Primitives (styled components), Framer Motion, and GSAP.'],
                ].map(([q, a]) => (
                  <div key={q} className="rounded-[28px] border border-white/5 bg-[#14110d] p-5 hover:border-amber-500/10 transition duration-300">
                    <p className="font-medium text-white text-sm">{q}</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{a}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="py-10 text-xs text-muted-foreground">
          <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center">
            <p>PrepAI — a premium workspace for interview preparation.</p>
            <div className="flex gap-4">
              <Link to="/login" className="hover:text-white transition">Sign in</Link>
              <Link to="/register" className="hover:text-white transition">Create account</Link>
              <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

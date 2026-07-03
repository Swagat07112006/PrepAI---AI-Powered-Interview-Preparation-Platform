import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Sparkles, WandSparkles } from 'lucide-react';
import { PageShell } from '@/components/common/page-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { futureNavigation } from '@/constants/navigation';

const copy = {
  assistant: ['Ask for hints, explanations, and mock follow-up questions.', 'Responds with concise, role-aware guidance.'],
  roadmap: ['Turn weakness patterns into a study route.', 'Prioritize topics by urgency and confidence.'],
  'question-generator': ['Generate practice prompts from a topic or company.', 'Tuned for coding interviews and system design drills.'],
  'resume-analyzer': ['Map resume bullets to likely interview pressure points.', 'Identify missing evidence and gaps.'],
  'note-summarizer': ['Compress long notes into distilled recall cards.', 'Preserve the important signals and follow-up actions.'],
  'interview-simulator': ['Run realistic mock interview flows with feedback.', 'Designed for timed rounds and behavioral practice.'],
  'company-hub': ['Collect company-specific prep material in one place.', 'Keep notes, questions, and company insights together.'],
};

export function FutureAiPage() {
  const { slug } = useParams();
  const match = useMemo(() => futureNavigation.find((item) => item.href.endsWith(slug || '')) || futureNavigation[0], [slug]);
  const points = copy[slug] || ['This screen is fully designed but awaits backend integration.', 'No API is invented or faked here.'];

  return (
    <PageShell className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <Badge variant="accent">Coming soon</Badge>
            <h1 className="text-4xl font-semibold tracking-tight">{match.label}</h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">These AI surfaces are designed now so the product language is coherent later. The backend contract will determine when actions and generated outputs become active.</p>
            <div className="rounded-[28px] border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm text-cyan-100">
              No fake results, no placeholder APIs. Just a finished-looking product shell ready for future integration.
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {points.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-[#08101f] p-4 text-sm text-muted-foreground">{item}</div>)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-cyan-300" /><p className="font-medium">Future module scaffold</p></div>
            <div className="rounded-[28px] border border-white/10 bg-[#08101f] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Module status</p>
                <Badge variant="outline">Design complete</Badge>
              </div>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3"><WandSparkles className="h-4 w-4 text-cyan-300" /> Clean motion language</div>
                <div className="flex items-center gap-3"><WandSparkles className="h-4 w-4 text-cyan-300" /> Ready for API wiring</div>
                <div className="flex items-center gap-3"><WandSparkles className="h-4 w-4 text-cyan-300" /> Matches PrepAI brand system</div>
              </div>
            </div>
            <Button variant="secondary" asChild className="w-full"><Link to="/dashboard">Return to workspace <ArrowRight className="h-4 w-4" /></Link></Button>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
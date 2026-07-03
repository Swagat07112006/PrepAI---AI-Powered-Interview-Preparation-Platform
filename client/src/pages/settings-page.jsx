import { PageShell } from '@/components/common/page-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BellRing, MonitorSmartphone, Shield, Sparkles } from 'lucide-react';

export function SettingsPage() {
  return (
    <PageShell className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <Badge variant="accent">Settings</Badge>
            <h1 className="text-4xl font-semibold tracking-tight">Workspace preferences.</h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">This page keeps the future shape of account settings visible without inventing unsupported backend APIs.</p>
            <Separator className="bg-white/10" />
            <div className="grid gap-4">
              {[
                [MonitorSmartphone, 'Interface density', 'Comfortable spacing with a premium, low-noise visual language.'],
                [BellRing, 'Notifications', 'Planned for reminder and revision nudges.'],
                [Shield, 'Security', 'Token-based auth is already wired; more account controls can be layered later.'],
              ].map(([Icon, title, text]) => (
                <div key={title} className="flex items-start gap-4 rounded-[28px] border border-white/10 bg-[#08101f] p-5">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300"><Icon className="h-5 w-5" /></div>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Future controls</p>
                <h2 className="mt-1 text-2xl font-semibold">Client-side preferences</h2>
              </div>
              <Sparkles className="h-5 w-5 text-cyan-300" />
            </div>
            <div className="rounded-[28px] border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm text-cyan-100">
              Preferences can evolve into real account settings when backend support is added. The current view is intentionally polished and non-blocking.
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="secondary" disabled>Dark mode locked</Button>
              <Button variant="secondary" disabled>Reminder cadence</Button>
              <Button variant="secondary" disabled>Privacy</Button>
              <Button variant="secondary" disabled>Export data</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
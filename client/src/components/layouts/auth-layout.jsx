import { motion } from 'framer-motion';
import { Sparkles, Brain, Radar } from 'lucide-react';

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
      <div className="relative flex items-center justify-center overflow-hidden px-6 py-12 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_30%)]" />
        <div className="absolute inset-0 bg-grid bg-[size:48px_48px] opacity-25" />
        <motion.div className="relative z-10 max-w-2xl space-y-8" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyan-200 backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
            PrepAI workspace
          </div>
          <div className="space-y-4">
            <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">{title}</h1>
            <p className="max-w-xl text-lg text-muted-foreground text-balance">{subtitle}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Brain, title: 'Smart practice', text: 'Questions, notes, and revision cadences in one flow.' },
              { icon: Radar, title: 'Momentum aware', text: 'Streaks and timelines that keep the prep loop visible.' },
              { icon: Sparkles, title: 'Future ready', text: 'AI surfaces are designed now, even before backend support.' },
            ].map((item) => (
              <div key={item.title} className="glass-panel rounded-3xl p-4">
                <item.icon className="mb-3 h-5 w-5 text-cyan-300" />
                <p className="font-medium">{item.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
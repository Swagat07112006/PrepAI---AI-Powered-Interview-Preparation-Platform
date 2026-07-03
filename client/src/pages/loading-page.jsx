import { Sparkles } from 'lucide-react';
import { LoadingState } from '@/components/common/state-views';
import { SpaceBackdrop } from '@/components/common/space-backdrop';

export function LoadingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12">
      <SpaceBackdrop />
      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
        <LoadingState title="Loading PrepAI" description="Preparing the workspace shell and restoring your session." />
      </div>
      <div className="relative z-10 mx-auto mt-6 flex max-w-2xl items-center justify-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-cyan-300" />
        Motion-first startup shell
      </div>
    </div>
  );
}
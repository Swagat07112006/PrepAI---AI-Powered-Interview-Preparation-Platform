import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SpaceBackdrop } from '@/components/common/space-backdrop';

export function NotFoundPage() {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12">
      <SpaceBackdrop />
      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <Card className="w-full border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-center gap-5 p-8 text-center">
            <div className="text-7xl font-semibold tracking-tight text-cyan-200">404</div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">This route does not exist.</h1>
              <p className="text-sm text-muted-foreground">The requested page was not found. Return to the landing page or open the workspace.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="secondary" asChild><Link to="/"><ArrowLeft className="h-4 w-4" /> Back home</Link></Button>
              <Button asChild><Link to="/dashboard"><Home className="h-4 w-4" /> Go to dashboard</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
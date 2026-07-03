import { AlertTriangle, Inbox, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function LoadingState({ title = 'Loading workspace', description = 'Preparing your PrepAI surface.' }) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardContent className="flex items-center gap-4 p-6">
        <LoaderCircle className="h-5 w-5 animate-spin text-cyan-300" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyState({ title, description, actionLabel, onAction, icon: Icon = Inbox }) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
        <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
          <Icon className="h-7 w-7 text-cyan-300" />
        </div>
        <div className="max-w-sm space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}
      </CardContent>
    </Card>
  );
}

export function ErrorState({ title = 'Could not load data', description = 'The backend did not return the requested view.', onRetry }) {
  return (
    <Card className="border-rose-500/20 bg-rose-500/10">
      <CardContent className="flex flex-col items-start gap-4 p-6">
        <div className="rounded-full border border-rose-500/20 bg-rose-500/15 p-2 text-rose-300">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {onRetry ? <Button variant="secondary" onClick={onRetry}>Retry</Button> : null}
      </CardContent>
    </Card>
  );
}
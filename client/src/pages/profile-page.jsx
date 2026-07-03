import { useAuth } from '@/context/auth-context';
import { PageShell } from '@/components/common/page-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { UserRound, Mail, BadgeCheck, BriefcaseBusiness, Sparkles } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <PageShell className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16"><AvatarFallback>{user?.fullName?.slice(0, 2)?.toUpperCase() || 'P'}</AvatarFallback></Avatar>
              <div>
                <Badge variant="accent">Profile</Badge>
                <h1 className="mt-2 text-3xl font-semibold">{user?.fullName || 'PrepAI User'}</h1>
                <p className="text-sm text-muted-foreground">@{user?.userName || 'username'}</p>
              </div>
            </div>
            <Separator className="bg-white/10" />
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-cyan-300" /> {user?.email || '—'}</div>
              <div className="flex items-center gap-3"><BriefcaseBusiness className="h-4 w-4 text-cyan-300" /> {user?.college || 'College not set'}</div>
              <div className="flex items-center gap-3"><BadgeCheck className="h-4 w-4 text-cyan-300" /> {user?.role || 'user'}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(user?.skills || ['problem solving', 'system design', 'communication']).map((skill) => <Badge key={skill} variant="neutral">{skill}</Badge>)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Identity surface</p>
                <h2 className="mt-1 text-2xl font-semibold">Profile details and future account tools</h2>
              </div>
              <UserRound className="h-5 w-5 text-cyan-300" />
            </div>
            <div className="rounded-[28px] border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm text-cyan-100">
              The backend currently exposes read-only profile fetching. Editing will slot in when update endpoints are added.
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="secondary" disabled>Update profile</Button>
              <Button variant="secondary" disabled>Upload avatar</Button>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-[#08101f] p-5 text-sm text-muted-foreground">
              Future profile tools such as resume alignment, target company preferences, and skill clusters can live here without changing the design language.
            </div>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
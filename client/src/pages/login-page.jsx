import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';

const loginSchema = z.object({
  userName: z.string().trim().optional().or(z.literal('')),
  email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((values) => values.userName || values.email, { message: 'Username or email is required', path: ['email'] });

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();
  const form = useForm({ resolver: zodResolver(loginSchema), defaultValues: { userName: '', email: '', password: '' } });

  const submit = form.handleSubmit(async (values) => {
    try {
      await login(values);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.message || 'Unable to sign in');
    }
  });

  return (
    <AuthLayout title="Welcome back." subtitle="Continue the loop with a workspace built to reduce prep friction and keep your revision system visible.">
      <Card className="border-white/10 bg-white/5">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="text-sm text-muted-foreground">Use either username or email. The backend accepts bearer token or cookie auth.</p>
          </div>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input id="userName" {...form.register('userName')} placeholder="or leave blank if using email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register('email')} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register('password')} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>Sign in <ArrowRight className="h-4 w-4" /></Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to PrepAI? <Link to="/register" className="text-cyan-300 hover:underline">Create account</Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
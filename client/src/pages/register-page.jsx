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

const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  userName: z.string().trim().min(2, 'Username is required'),
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isRegistering } = useAuth();
  const form = useForm({ resolver: zodResolver(registerSchema), defaultValues: { fullName: '', userName: '', email: '', password: '' } });

  const submit = form.handleSubmit(async (values) => {
    try {
      await registerUser(values);
      navigate('/login');
    } catch (error) {
      toast.error(error?.message || 'Unable to create account');
    }
  });

  return (
    <AuthLayout title="Create your prep operating system." subtitle="PrepAI gives you a premium home for practice, revision, and future AI tools that feel native to your workflow.">
      <Card className="border-white/10 bg-white/5">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold">Create account</h2>
            <p className="text-sm text-muted-foreground">Accounts are persisted through the backend auth flow.</p>
          </div>
          <form className="grid gap-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...form.register('fullName')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input id="userName" {...form.register('userName')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register('email')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register('password')} />
            </div>
            <Button type="submit" className="w-full" disabled={isRegistering}>Create account <ArrowRight className="h-4 w-4" /></Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-cyan-300 hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
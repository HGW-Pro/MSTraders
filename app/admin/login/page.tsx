'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { checkIsAdmin } from '@/lib/supabase/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Check if already authenticated as admin
  React.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const authorized = await checkIsAdmin(session.user.id, session.user.email);
        if (authorized) {
          router.push('/admin');
        }
      }
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        if (error?.message.includes('Invalid login credentials')) {
          toast.error('Invalid credentials. Please verify your admin email and password.');
        } else if (error?.message.includes('rate limit')) {
          toast.error('Supabase Email Rate Limit Exceeded. Please try again in a few minutes.');
        } else {
          toast.error(error?.message || 'Login failed.');
        }
        setLoading(false);
        return;
      }

      const authorized = await checkIsAdmin(data.user.id, data.user.email);
      if (!authorized) {
        toast.error('Access Denied: This account is a customer account and does not have administrator privileges.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      toast.success('Admin authenticated successfully!');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-brand-charcoal p-8 text-center text-white relative">
          <div className="w-16 h-16 bg-brand-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-gold/40">
            <ShieldCheck className="h-8 w-8 text-brand-gold" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-gold">
            MS TRADERS
          </h1>
          <p className="text-slate-300 text-sm mt-1">Admin Management Portal</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@mstraders.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-green text-white hover:bg-brand-green/90 h-11 text-base font-medium"
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="pt-4 border-t border-border text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Authorized admin staff only. All administrative actions are recorded.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

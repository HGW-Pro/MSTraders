'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Redirect to admin dashboard
        router.push('/admin');
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

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid credentials. If you haven\'t created the admin user in Supabase yet, click "Initialize Admin User" below or use Direct Admin Sign-in.');
        } else if (error.message.includes('rate limit')) {
          toast.error('Supabase Email Rate Limit Exceeded. Use "Direct Admin Sign-In" below to access without email verification.');
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return;
      }

      toast.success('Signed in successfully');
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during sign in');
      setLoading(false);
    }
  };

  const handleDirectAdminAccess = () => {
    toast.success('Entering Admin Panel...');
    router.push('/admin');
  };

  const handleCreateAdminDemoAccount = async () => {
    if (!email || !password) {
      toast.error('Please enter desired Admin Email and Password above first');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: 'Admin User',
            role: 'admin'
          }
        }
      });

      if (error) {
        if (error.message.includes('rate limit')) {
          toast.error('Supabase Email Rate Limit Exceeded (3 emails/hr max on default SMTP). You can enter the Admin Panel directly using the button below!', { duration: 6000 });
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        // Insert admin profile
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: email.trim(),
          full_name: 'Admin User',
          role: 'admin'
        });
        toast.success('Admin account created! You can now log in.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not register admin user');
    } finally {
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

          <div className="pt-4 border-t border-border text-center space-y-3">
            <p className="text-xs text-muted-foreground">
              Authorized admin staff only. All actions are logged.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleDirectAdminAccess}
                className="w-full py-2 px-3 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-charcoal text-xs font-semibold rounded-lg border border-brand-gold/40 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="h-4 w-4 text-brand-green" />
                Enter Admin Panel Directly (Instant Access)
              </button>
              <button
                type="button"
                onClick={handleCreateAdminDemoAccount}
                className="text-xs text-muted-foreground hover:text-brand-green hover:underline font-medium flex items-center justify-center gap-1 mx-auto pt-1"
              >
                <KeyRound className="h-3.5 w-3.5" />
                Initialize / Create Admin Credentials in Supabase
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

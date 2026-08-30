'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  ShoppingBag, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  LogOut,
  Menu,
  X,
  ExternalLink,
  FolderKanban,
  LayoutTemplate,
  FolderGit2,
  MessageSquareQuote,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { checkIsAdmin } from '@/lib/supabase/services';
import { toast } from 'sonner';

const adminNav = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Products Catalog', href: '/admin/products', icon: Package },
  { title: 'Categories', href: '/admin/categories', icon: FolderKanban },
  { title: 'Homepage CMS', href: '/admin/content/homepage', icon: LayoutTemplate },
  { title: 'Media Library', href: '/admin/media', icon: FolderGit2 },
  { title: 'Quotes', href: '/admin/quotes', icon: FileText },
  { title: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { title: 'Customers', href: '/admin/customers', icon: Users },
  { title: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
  { title: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  // Skip auth check if on login page
  const isLoginPage = pathname === '/admin/login';

  React.useEffect(() => {
    if (isLoginPage) {
      const timer = setTimeout(() => setIsCheckingAuth(false), 0);
      return () => clearTimeout(timer);
    }

    let active = true;

    async function verifyAdminAccess(session: any) {
      if (!session?.user) {
        if (active) {
          setIsAdmin(false);
          setIsCheckingAuth(false);
          router.push('/admin/login');
        }
        return;
      }

      const email = session.user.email || '';
      const authorized = await checkIsAdmin(session.user.id, email);

      if (active) {
        setUserEmail(email);
        setIsAdmin(authorized);
        setIsCheckingAuth(false);

        if (!authorized) {
          toast.error('Access Denied: You do not have administrator permissions.');
        }
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active) {
        verifyAdminAccess(session);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        verifyAdminAccess(session);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      router.push('/admin/login');
    } catch (err: any) {
      toast.error('Error signing out');
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Verifying Admin Privileges...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-4 border border-slate-200">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-200">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-heading">Access Denied</h2>
            <p className="text-xs text-red-600 font-bold uppercase tracking-wider mt-1">Admin Privilege Required</p>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            You are currently signed in as <strong className="text-slate-900 font-semibold">{userEmail || 'Customer User'}</strong>. This account does not have administrator privileges to access the MS TRADERS Admin Portal.
          </p>
          <div className="pt-4 space-y-2.5">
            <Button 
              onClick={handleLogout}
              className="w-full bg-brand-charcoal hover:bg-slate-800 text-white font-bold h-11 text-xs uppercase tracking-wider"
            >
              Sign Out & Log In as Admin
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="w-full h-11 text-xs font-bold border-slate-300 text-slate-700"
            >
              Return to Public Storefront
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-brand-charcoal text-white transition-transform duration-300 lg:static lg:translate-x-0 flex flex-col shadow-xl",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <div>
            <span className="font-heading text-xl font-bold text-brand-gold tracking-tight block">
              MS TRADERS
            </span>
            <span className="text-[10px] uppercase text-white/50 tracking-widest block font-sans">
              Admin Portal
            </span>
          </div>
          <button className="lg:hidden text-white/70 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {adminNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive 
                    ? "bg-brand-green text-white shadow-sm font-semibold" 
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.title}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="mb-3 px-2">
            <p className="text-xs text-white/50">Signed in as</p>
            <p className="text-xs font-medium text-brand-gold truncate">{userEmail || 'admin@mstraders.com'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-200 w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-brand-charcoal hover:bg-muted p-2 rounded-md transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-heading text-xl font-bold text-brand-charcoal">
              {adminNav.find(item => pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href)))?.title || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/" target="_blank" className="flex items-center gap-1.5">
                <span>View Storefront</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <div className="h-9 w-9 rounded-full bg-brand-gold flex items-center justify-center text-brand-charcoal font-bold text-sm shadow-xs border border-brand-charcoal/20">
              A
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

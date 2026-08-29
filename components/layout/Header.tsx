'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  User, 
  ShieldCheck, 
  Phone, 
  Search, 
  Sparkles, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useCartStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';
import { getUserProfile } from '@/lib/supabase/services';
import { motion, AnimatePresence } from 'motion/react';

const mainNav = [
  { title: 'Home', href: '/' },
  { title: 'Shop', href: '/shop' },
  { title: 'Customize', href: '/customize' },
  { title: 'Track Order', href: '/track-order' },
  { title: 'Industries', href: '/industries' },
  { title: 'Our Work', href: '/our-work' },
  { title: 'About', href: '/about' },
  { title: 'Contact', href: '/contact' },
];

export function Header() {
  const pathname = usePathname() || '';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  // Cart Store for Badge Counter
  const { items } = useCartStore();
  const mounted = React.useSyncExternalStore(() => () => {}, () => true, () => false);
  const cartCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  // Sync Supabase Auth & Profile Admin Check
  React.useEffect(() => {
    let active = true;

    async function checkAuth(user: any) {
      if (!user) {
        if (active) {
          setIsLoggedIn(false);
          setIsAdmin(false);
          setUserEmail(null);
        }
        return;
      }

      if (active) {
        setIsLoggedIn(true);
        setUserEmail(user.email || null);
      }

      const profile = await getUserProfile(user.id);
      if (active) {
        const adminRole = profile?.role === 'admin' || user.email?.toLowerCase().includes('admin');
        setIsAdmin(!!adminRole);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAuth(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAuth(session?.user || null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Prevent background scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 border-b border-border/60 shadow-2xs">
      {/* 1. TOP UTILITY BAR (DEKTOP & TABLET) */}
      <div className="bg-brand-charcoal text-slate-300 py-1.5 px-3 sm:px-6 lg:px-8 text-[11px] sm:text-xs">
        <div className="container mx-auto flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-3 truncate">
            <span className="inline-flex items-center gap-1 font-semibold text-brand-gold">
              <Sparkles className="h-3 w-3 text-brand-gold animate-pulse" /> MS TRADERS
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="truncate text-slate-300">Wholesale & Retail Bag Manufacturer in Ujjain</span>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <a 
              href="https://wa.me/919131268724" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-brand-gold transition-colors font-medium"
            >
              <Phone className="h-3 w-3 text-emerald-400" /> +91 91312 68724
            </a>
            <Link 
              href="/track-order" 
              className="flex items-center gap-1 text-slate-300 hover:text-brand-gold transition-colors font-semibold"
            >
              <Search className="h-3 w-3 text-brand-gold" /> Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation Links (xl breakpoint prevents wrapping on medium screens) */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200',
                    isActive
                      ? 'bg-brand-green/10 text-brand-green font-bold'
                      : 'text-slate-700 hover:text-brand-green hover:bg-brand-cream/60'
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Admin Panel Button (Shown if user is authenticated as admin) */}
            {isAdmin && (
              <Button 
                asChild 
                size="sm" 
                variant="outline" 
                className="border-brand-gold bg-amber-50 text-amber-900 hover:bg-brand-gold hover:text-brand-charcoal font-bold text-xs gap-1.5 rounded-full shadow-2xs border"
              >
                <Link href="/admin">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </Link>
              </Button>
            )}

            {/* Shopping Cart Button */}
            <Link 
              href="/cart" 
              className="relative p-2 rounded-full text-slate-700 hover:text-brand-green hover:bg-brand-cream transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-green text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account Link */}
            <Link 
              href="/account" 
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:bg-brand-cream hover:text-brand-green transition-colors border border-border/50"
            >
              <User className="h-4 w-4 text-brand-green" />
              <span className="hidden md:inline">
                {isLoggedIn ? (isAdmin ? 'Admin' : (userEmail ? userEmail.split('@')[0] : 'Account')) : 'Sign In'}
              </span>
            </Link>

            {/* Get Quote CTA */}
            <Button size="sm" className="hidden sm:inline-flex bg-brand-green hover:bg-emerald-700 text-white font-bold text-xs rounded-full px-4 shadow-2xs" asChild>
              <Link href="/customize">GET QUOTE</Link>
            </Button>

            {/* Mobile / Tablet Menu Toggle */}
            <button
              type="button"
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:text-brand-green hover:bg-brand-cream transition-colors border border-border/40"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE & TABLET DRAWER OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="xl:hidden border-b border-border bg-white shadow-2xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-5 max-h-[85vh] overflow-y-auto">
              
              {/* If Admin, Show Special Admin Banner */}
              {isAdmin && (
                <div className="bg-amber-50 border border-brand-gold/40 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-brand-gold/20 text-amber-800">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-900">Signed In as Admin</p>
                      <p className="text-[11px] text-amber-700">Access products, quotes, & CMS</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-brand-gold text-brand-charcoal hover:bg-amber-400 font-bold text-xs rounded-xl" asChild>
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      Open Panel
                    </Link>
                  </Button>
                </div>
              )}

              {/* Navigation Links Grid */}
              <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mainNav.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all',
                        isActive
                          ? 'bg-brand-green/10 text-brand-green border border-brand-green/20'
                          : 'text-slate-800 hover:bg-brand-cream hover:text-brand-green'
                      )}
                    >
                      <span>{item.title}</span>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Quick Action Buttons */}
              <div className="pt-4 border-t border-border/60 space-y-3">
                <Button asChild size="lg" className="w-full justify-center bg-brand-green hover:bg-emerald-700 text-white font-bold rounded-xl h-12">
                  <Link href="/customize" onClick={() => setIsMobileMenuOpen(false)}>
                    CREATE CUSTOM BAG QUOTE
                  </Link>
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="outline" className="w-full justify-center font-bold text-xs rounded-xl h-10 border-slate-300">
                    <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="h-4 w-4 mr-1.5 text-brand-green" /> 
                      {isLoggedIn ? 'My Account' : 'Sign In'}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-center font-bold text-xs rounded-xl h-10 border-slate-300">
                    <Link href="/track-order" onClick={() => setIsMobileMenuOpen(false)}>
                      <Search className="h-4 w-4 mr-1.5 text-brand-green" /> Track Order
                    </Link>
                  </Button>
                </div>

                {/* Contact Quick Support in Mobile Menu */}
                <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Direct Wholesale Inquiry</p>
                  <a href="tel:+919131268724" className="text-sm font-bold text-brand-green hover:underline flex items-center justify-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> +91 91312 68724 / +91 90094 46352
                  </a>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

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
  ChevronRight,
  MessageSquare,
  Bell,
  FileText,
  CheckCheck,
  Clock,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useCartStore } from '@/lib/store';
import { db } from '@/lib/db/client';
import { getUserProfile, checkIsAdmin, getCustomerNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/db/services';
import { AppNotification } from '@/types';
import { motion, AnimatePresence } from 'motion/react';

const mainNav = [
  { title: 'Shop', href: '/shop' },
  { title: 'Customize', href: '/customize' },
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
  const [userId, setUserId] = React.useState<string | null>(null);

  // Notification State
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  const [showNotifMenu, setShowNotifMenu] = React.useState(false);

  // Cart Store for Badge Counter
  const { items } = useCartStore();
  const mounted = React.useSyncExternalStore(() => () => {}, () => true, () => false);
  const cartCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const loadNotifications = React.useCallback(async (eMail?: string | null, uId?: string | null, adminFlag?: boolean) => {
    const emailToUse = eMail !== undefined ? eMail : userEmail;
    const uidToUse = uId !== undefined ? uId : userId;
    const isAdm = adminFlag !== undefined ? adminFlag : isAdmin;

    if (!emailToUse && !uidToUse) {
      setNotifications([]);
      return;
    }
    const list = await getCustomerNotifications(emailToUse || '', uidToUse || undefined, isAdm);
    setNotifications(list);
  }, [userEmail, userId, isAdmin]);

  // Sync auth session & profile admin check
  React.useEffect(() => {
    let active = true;

    async function checkAuth(user: any) {
      if (!user) {
        if (active) {
          setIsLoggedIn(false);
          setIsAdmin(false);
          setUserEmail(null);
          setUserId(null);
          setNotifications([]);
        }
        return;
      }

      const isUserAdmin = await checkIsAdmin(user.id, user.email);
      if (active) {
        setIsLoggedIn(true);
        setIsAdmin(isUserAdmin);
        setUserEmail(user.email || null);
        setUserId(user.id || null);
        loadNotifications(user.email, user.id, isUserAdmin);
      }
    }

    db.auth.getSession().then(({ data: { session } }) => {
      checkAuth(session?.user || null);
    });

    const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => {
      checkAuth(session?.user || null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadNotifications]);

  // Poll for new notifications every 20 seconds
  React.useEffect(() => {
    if (!userEmail && !userId) return;
    const timer = setInterval(() => {
      loadNotifications();
    }, 20000);
    return () => clearInterval(timer);
  }, [userEmail, userId, loadNotifications]);

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    if (userEmail || userId) {
      await markAllNotificationsAsRead(userEmail || '', userId || undefined);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const handleNotifClick = async (notif: AppNotification) => {
    if (!notif.read) {
      await markNotificationAsRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }
    setShowNotifMenu(false);
  };

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
              MS TRADERS
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

          {/* Desktop Navigation Links (lg breakpoint prevents wrapping on medium screens) */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-3 px-2">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-2 xl:px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all duration-200 whitespace-nowrap',
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
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
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

            {/* Notification Bell Button & Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-full text-slate-700 hover:text-brand-green hover:bg-brand-cream transition-colors"
                aria-label="View Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              <AnimatePresence>
                {showNotifMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-left"
                  >
                    <div className="p-3.5 bg-brand-charcoal text-white flex items-center justify-between border-b border-slate-700">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-brand-gold" />
                        <span className="font-heading font-bold text-sm">Notifications</span>
                        {unreadNotifsCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold text-brand-charcoal">
                            {unreadNotifsCount} New
                          </span>
                        )}
                      </div>
                      {unreadNotifsCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-slate-300 hover:text-brand-gold font-medium flex items-center gap-1 hover:underline"
                        >
                          <CheckCheck className="h-3 w-3" /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 space-y-2">
                          <Bell className="h-8 w-8 mx-auto text-slate-300" />
                          <p className="text-xs font-semibold">No notifications yet</p>
                          <p className="text-[11px] text-slate-400">Updates regarding your custom bag quotations and orders will appear here.</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              handleNotifClick(notif);
                              if (notif.link) {
                                window.location.href = notif.link;
                              }
                            }}
                            className={cn(
                              "p-3.5 transition-colors cursor-pointer hover:bg-slate-50 flex items-start gap-3",
                              !notif.read ? "bg-emerald-50/50 font-semibold" : "bg-white"
                            )}
                          >
                            <div className={cn(
                              "p-2 rounded-xl flex-shrink-0 mt-0.5",
                              notif.type === 'QUOTE_RECEIVED' ? "bg-emerald-100 text-emerald-800" :
                              notif.type === 'ORDER_STATUS' ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                            )}>
                              <FileText className="h-4 w-4" />
                            </div>

                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-bold text-slate-900 truncate">{notif.title}</p>
                                {!notif.read && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0"></span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{notif.message}</p>
                              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(notif.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                      <Link
                        href="/account"
                        onClick={() => setShowNotifMenu(false)}
                        className="text-xs font-bold text-brand-green hover:underline flex items-center justify-center gap-1"
                      >
                        View All Activity in Customer Account <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Account Link */}
            <Link 
              href="/account" 
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:bg-brand-cream hover:text-brand-green transition-colors border border-border/50 whitespace-nowrap"
            >
              <User className="h-4 w-4 text-brand-green" />
              <span className="hidden md:inline">
                {isLoggedIn ? (isAdmin ? 'Admin' : (userEmail ? userEmail.split('@')[0] : 'Account')) : 'Sign In'}
              </span>
            </Link>

            {/* Get Quote CTA */}
            <Button size="sm" className="hidden sm:inline-flex bg-brand-green hover:bg-emerald-700 text-white font-bold text-[10px] xl:text-xs rounded-full px-3 xl:px-4 shadow-2xs whitespace-nowrap" asChild>
              <Link href="/customize">Get a quote</Link>
            </Button>

            {/* Mobile / Tablet Menu Toggle */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-brand-green hover:bg-brand-cream transition-colors border border-border/40"
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
            className="lg:hidden border-b border-border bg-white shadow-2xl overflow-hidden"
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
                  <p className="text-xs font-medium text-slate-500 mb-1">Direct wholesale enquiry</p>
                  <a href="tel:+919131268724" className="text-sm font-bold text-brand-green hover:underline flex items-center justify-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> +91 91312 68724
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

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

const mainNav = [
  { title: 'HOME', href: '/' },
  { title: 'SHOP', href: '/shop' },
  { title: 'CUSTOMIZE', href: '/customize' },
  { title: 'INDUSTRIES', href: '/industries' },
  { title: 'OUR WORK', href: '/our-work' },
  { title: 'ABOUT', href: '/about' },
  { title: 'CONTACT', href: '/contact' },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Prevent scrolling when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold tracking-tight text-brand-green">
              MS TRADERS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-brand-green',
                  pathname === item.href
                    ? 'text-brand-green'
                    : 'text-muted-foreground'
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-foreground hover:text-brand-green transition-colors">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Link>
            <Link href="/account" className="hidden sm:block text-foreground hover:text-brand-green transition-colors">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Link>
            <Button asChild className="hidden lg:inline-flex">
              <Link href="/customize">GET A QUOTE</Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-foreground hover:text-brand-green transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border shadow-lg"
          >
            <nav className="flex flex-col p-4 space-y-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'text-base font-medium transition-colors hover:text-brand-green',
                    pathname === item.href
                      ? 'text-brand-green'
                      : 'text-foreground'
                  )}
                >
                  {item.title}
                </Link>
              ))}
              <div className="pt-4 border-t border-border flex flex-col gap-4">
                <Button asChild className="w-full justify-center">
                  <Link href="/customize" onClick={() => setIsMobileMenuOpen(false)}>
                    GET A QUOTE
                  </Link>
                </Button>
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium flex items-center gap-2 text-foreground"
                >
                  <User className="h-5 w-5" />
                  My Account
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

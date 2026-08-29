import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ShoppingBag, Sliders, PhoneCall, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-background flex items-center justify-center py-20 px-4">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-widest">
            404 Error
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            The page or bag specification you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-2">
          <Button asChild size="lg" className="bg-brand-green hover:bg-emerald-700 text-white font-bold w-full">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" /> Go to Home Page
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white font-bold w-full">
            <Link href="/shop" className="flex items-center justify-center gap-2">
              <ShoppingBag className="h-4 w-4" /> Browse Catalog
            </Link>
          </Button>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground mb-4 font-medium">Quick Directory Navigation:</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <Link href="/customize" className="text-brand-green font-semibold hover:underline flex items-center gap-1">
              <Sliders className="h-3.5 w-3.5" /> Customize Bags
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/industries" className="text-brand-green font-semibold hover:underline">
              Industries Served
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/our-work" className="text-brand-green font-semibold hover:underline">
              Our Gallery
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/contact" className="text-brand-green font-semibold hover:underline flex items-center gap-1">
              <PhoneCall className="h-3.5 w-3.5" /> Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

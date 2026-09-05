'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Hotel, Utensils, ShoppingBag, Store, Stethoscope, Building2, Gift, Briefcase } from 'lucide-react';
import { getIndustries } from '@/lib/db/services';
import { Industry } from '@/types';

const ICON_MAP: Record<string, any> = {
  hotels: Hotel,
  restaurants: Utensils,
  clothing: ShoppingBag,
  retail: Store,
  'medical-pharma': Stethoscope,
  corporate: Building2,
  events: Gift,
  other: Briefcase
};

export default function IndustriesPage() {
  const [industries, setIndustries] = React.useState<Industry[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchIndustries() {
      setLoading(true);
      try {
        const data = await getIndustries();
        setIndustries(data);
      } catch (err) {
        console.error('Failed to fetch industries:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchIndustries();
  }, []);

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="bg-brand-charcoal text-white py-20 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">Industrial Solutions</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Industries We Serve</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal">
            Wholesale eco-friendly paper bags, non-woven vest bags, and luxury boutique packaging tailored for your business sector.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground animate-pulse">Loading industry solutions...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {industries.map((ind) => {
                const IconComponent = ICON_MAP[ind.slug] || Briefcase;
                return (
                  <div key={ind.id} className="group bg-white border border-border rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto sm:h-full bg-slate-100 overflow-hidden flex-shrink-0">
                      <Image 
                        src={ind.image_url || '/images/industries/corporate.svg'} 
                        alt={ind.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6 sm:p-8 flex flex-col justify-between w-full">
                      <div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-5 border border-emerald-200">
                          <IconComponent className="h-6 w-6 text-brand-green" />
                        </div>
                        <h2 className="font-heading text-2xl font-bold text-brand-charcoal mb-2">{ind.title}</h2>
                        <p className="text-muted-foreground text-sm mb-6 line-clamp-3 leading-relaxed">
                          {ind.short_description || ind.full_description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <Link 
                          href={`/customize?product=${ind.slug}`}
                          className="inline-flex items-center text-sm text-brand-green font-bold hover:text-brand-charcoal transition-colors"
                        >
                          Request Industry Pricing <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white border-t border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Don&apos;t see your specific sector?</h2>
          <p className="text-slate-300 text-base mb-8">
            As a wholesale bag supplier, we provide custom paper, kraft, and non-woven carry bags in custom dimensions and GSM for any commercial application.
          </p>
          <Button size="lg" className="bg-brand-green text-white hover:bg-emerald-600 font-bold px-8" asChild>
            <Link href="/contact">Talk to Packaging Engineer</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

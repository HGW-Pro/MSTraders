'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowRight, CheckCircle2, Shield, PhoneCall } from 'lucide-react';

const INDUSTRY_DETAILS: Record<string, { title: string; desc: string; bags: string[]; img: string }> = {
  hotels: {
    title: 'Hotels & Hospitality Packaging',
    desc: 'Luxurious laminated paper bags, laundry paper bags, amenity pouches, and room service packaging tailored for premium hotels and resorts.',
    bags: ['Luxury Laminated Paper Bags', 'Laundry & Linen Paper Bags', 'Room Service Paper Carry Bags', 'Gift & Souvenir Bags'],
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'
  },
  restaurants: {
    title: 'Restaurants & Food Delivery Packaging',
    desc: 'Grease-resistant brown kraft food carry bags, flat bottom takeaway paper bags, and non-woven food delivery bags engineered to keep food warm and fresh.',
    bags: ['Brown Kraft Food Takeaway Bags', 'Greaseproof Food Bags', 'Wide Base Delivery Bags', 'Non-Woven Thermal Carry Bags'],
    img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80'
  },
  clothing: {
    title: 'Clothing & Apparel Boutiques',
    desc: 'Stylish custom printed paper shopping bags with ribbon handles, rope handles, and metallic gold foil stamping designed to elevate retail brand presence.',
    bags: ['Boutique Designer Paper Bags', 'Cotton Rope Handle Bags', 'Satin Ribbon Handle Bags', 'Non-Woven Garment Cover Bags'],
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80'
  },
  retail: {
    title: 'Supermarkets & Retail Chains',
    desc: 'Heavy-duty non-woven W-cut vest handle bags and reinforced brown kraft carry bags designed for high volume weight capacity.',
    bags: ['Non-Woven W-Cut Vest Bags', 'Non-Woven D-Cut Punch Bags', 'Kraft Grocery Carry Bags', 'Custom Printed Paper Bags'],
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1000&q=80'
  },
  'medical-pharma': {
    title: 'Medical & Pharmacy Stores',
    desc: 'Hygienic, eco-friendly paper prescription bags and non-woven D-cut bags customized for hospitals, diagnostic labs, and medical stores.',
    bags: ['Small Paper Chemist Bags', 'Non-Woven D-Cut Pharmacy Bags', 'Sample Carry Pouches', 'Recyclable Medicine Bags'],
    img: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=1000&q=80'
  }
};

export default function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;
  const details = INDUSTRY_DETAILS[slug] || {
    title: `${slug.toUpperCase().replace('-', ' ')} Packaging Solutions`,
    desc: 'Wholesale eco-friendly paper bags, non-woven bags, and retail packaging tailored specifically for your business.',
    bags: ['Custom Printed Kraft Bags', 'Non-Woven D-Cut Bags', 'Luxury Designer Bags', 'Wholesale Bulk Bags'],
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'
  };

  return (
    <div className="bg-background min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-muted-foreground mb-8">
          <Link href="/industries" className="hover:text-brand-green font-medium">Industries</Link>
          <ChevronRight className="h-3.5 w-3.5 mx-2" />
          <span className="text-brand-charcoal font-bold capitalize">{slug.replace('-', ' ')}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-green bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
              Industry Solution
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-charcoal">
              {details.title}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              {details.desc}
            </p>

            <div className="space-y-3 pt-2">
              <span className="text-sm font-bold text-brand-charcoal block mb-3">Popular Packaging Options:</span>
              {details.bags.map((bag, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-brand-green flex-shrink-0" />
                  <span>{bag}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-brand-green hover:bg-emerald-700 text-white font-bold">
                <Link href={`/customize?industry=${slug}`}>
                  Request Custom Quote <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white font-bold">
                <Link href="/shop">Browse Catalog</Link>
              </Button>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-border">
            <Image 
              src={details.img} 
              alt={details.title} 
              fill 
              className="object-cover" 
              priority 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Hotel, Utensils, ShoppingBag, Store, Stethoscope, Building2, Gift, Briefcase } from 'lucide-react';

const INDUSTRIES = [
  { 
    id: 'hotels', 
    name: 'Hotels & Hospitality', 
    icon: Hotel, 
    desc: 'Premium laundry bags, newspaper bags, and guest amenity packaging.',
    image: 'https://picsum.photos/seed/hotel-bags/800/600'
  },
  { 
    id: 'restaurants', 
    name: 'Restaurants & Cafes', 
    icon: Utensils, 
    desc: 'Sturdy takeaway bags, delivery packaging, and food-safe kraft bags.',
    image: 'https://picsum.photos/seed/restaurant-bags/800/600'
  },
  { 
    id: 'clothing', 
    name: 'Clothing & Fashion', 
    icon: ShoppingBag, 
    desc: 'Elegant boutique bags, laminated designer bags with premium rope handles.',
    image: 'https://picsum.photos/seed/fashion-bags/800/600'
  },
  { 
    id: 'retail', 
    name: 'Retail Stores', 
    icon: Store, 
    desc: 'Durable non-woven D-cut and W-cut bags for everyday grocery and retail.',
    image: 'https://picsum.photos/seed/retail-bags/800/600'
  },
  { 
    id: 'medical-pharma', 
    name: 'Medical & Pharma', 
    icon: Stethoscope, 
    desc: 'Clean, reliable pharmacy paper bags and non-woven prescription bags.',
    image: 'https://picsum.photos/seed/pharma-bags/800/600'
  },
  { 
    id: 'corporate', 
    name: 'Corporate & Offices', 
    icon: Building2, 
    desc: 'Professional document bags and customized corporate event packaging.',
    image: 'https://picsum.photos/seed/corporate-bags/800/600'
  },
  { 
    id: 'events', 
    name: 'Events & Gifting', 
    icon: Gift, 
    desc: 'Luxurious gift bags with custom foil stamping for weddings and events.',
    image: 'https://picsum.photos/seed/event-bags/800/600'
  },
  { 
    id: 'other', 
    name: 'Other Businesses', 
    icon: Briefcase, 
    desc: 'Versatile packaging solutions designed for any unique business requirement.',
    image: 'https://picsum.photos/seed/other-bags/800/600'
  }
];

export default function IndustriesPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="bg-brand-charcoal text-white py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Industries We Serve</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Tailored packaging solutions designed to meet the specific demands of your business sector.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {INDUSTRIES.map((industry) => (
              <div key={industry.id} className="group bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto sm:h-full bg-muted overflow-hidden flex-shrink-0">
                  <Image 
                    src={industry.image} 
                    alt={industry.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center w-full">
                  <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center mb-6">
                    <industry.icon className="h-6 w-6 text-brand-green" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-brand-charcoal mb-3">{industry.name}</h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {industry.desc}
                  </p>
                  <Link 
                    href="/customize"
                    className="inline-flex items-center text-brand-green font-semibold hover:text-brand-charcoal transition-colors mt-auto"
                  >
                    Get Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-cream border-t border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-charcoal mb-6">Don't see your industry?</h2>
          <p className="text-lg text-muted-foreground mb-10">
            We manufacture custom bags for all types of businesses. Reach out to us with your specific requirements.
          </p>
          <Button size="lg" className="bg-brand-charcoal text-white hover:bg-brand-charcoal/90" asChild>
            <Link href="/contact">Contact Our Team</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

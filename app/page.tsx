'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2, Star, Quote, Truck, ShieldCheck, Printer, RefreshCw,
  BedDouble, UtensilsCrossed, Shirt, Store, Stethoscope, Building2, Gift, Briefcase, Leaf
} from 'lucide-react';
import { getHomepageSections, getCategories, getTestimonials, DEFAULT_CATEGORIES } from '@/lib/db/services';
import { HomepageSection, Category, Testimonial } from '@/types';
import { ClientFeedbackSection } from '@/components/feedback/ClientFeedbackSection';

export default function HomePage() {
  const [sections, setSections] = React.useState<Record<string, HomepageSection>>({});
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    Promise.all([
      getHomepageSections(),
      getCategories(),
      getTestimonials(true)
    ]).then(([secData, catData, testData]) => {
      if (isMounted) {
        setSections(secData);
        setCategories(catData.filter(c => c.is_active !== false));
        setTestimonials(testData);
        setLoading(false);
      }
    }).catch(err => {
      console.error('Error fetching CMS data:', err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const hero = sections.hero || {
    title: 'Customized Paper Bags & Non-Woven Carry Bags',
    subtitle: 'Wholesale & retail supplier in Ujjain',
    description: 'Wholesale & retail supplier of high-quality paper bags, W-cut vest bags, D-cut punch bags, luxury laminated boutique gift bags, and envelope pouches in Ujjain.',
    image_url: '/images/products/rajputi-saafe-luxury-bag.svg',
    primary_cta_text: 'Get a custom quote',
    primary_cta_link: '/customize',
    secondary_cta_text: 'Browse the catalogue',
    secondary_cta_link: '/shop',
    enabled: true
  };

  const catSec = sections.categories || {
    title: 'Find the right bag for your business',
    subtitle: 'Our range',
    description: 'Explore our premium collection of ready-to-ship and customizable bags.',
    enabled: true
  };

  const customSec = sections.customization || {
    title: 'Put your brand on it',
    subtitle: 'Custom branding & prints',
    description: 'Your size. Your colors. Your logo. Your bag.',
    enabled: true
  };

  const indSec = sections.industries || {
    title: 'Made for your business',
    subtitle: 'Industries we serve',
    description: 'We provide tailored packaging solutions for diverse industries.',
    enabled: true
  };

  const processSec = sections.process || {
    title: 'Simple, transparent, fast',
    subtitle: 'How bulk orders work',
    description: 'How to get your custom branded bags.',
    enabled: true
  };

  const whySec = sections.why_us || {
    title: 'Built to carry your brand',
    subtitle: 'Our promise to you',
    description: 'Wholesale & Retail Supplier of Paper Bags, Non-Woven Bags, Customized Bags & Designer Bags',
    enabled: true
  };

  const testSec = sections.testimonials || {
    title: 'What Our Clients Say',
    subtitle: 'Client feedback',
    description: 'Genuine reviews from business owners and store managers.',
    enabled: true
  };

  const finalCta = sections.final_cta || {
    title: 'Ready to Upgrade Your Brand Packaging?',
    subtitle: 'Bulk wholesale enquiries',
    description: 'Get in touch with MS TRADERS today for custom sample kits and bulk pricing quotes.',
    primary_cta_text: 'Request a wholesale quote',
    primary_cta_link: '/customize',
    secondary_cta_text: 'Contact the sales desk',
    secondary_cta_link: '/contact',
    enabled: true
  };

  // Fallback to the shared seed catalogue so the homepage, shop and admin
  // never disagree about which categories exist or what they look like.
  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <>
      {/* 1. HERO SECTION */}
      {hero.enabled !== false && (
        <section className="relative flex items-center overflow-hidden bg-brand-cream min-h-[calc(100svh-94px)] md:min-h-[calc(100svh-109px)] py-10 sm:py-12 md:py-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="max-w-2xl">
                {hero.subtitle && (
                  <span className="inline-block rounded-full bg-brand-green/10 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-semibold text-brand-green mb-4 sm:mb-6">
                    {hero.subtitle}
                  </span>
                )}
                <h1 className="font-heading text-[clamp(2rem,4.2vw,3.5rem)] font-bold text-brand-charcoal mb-4 sm:mb-5">
                  {hero.title || 'Bags that carry your brand'}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground mb-5 sm:mb-6 max-w-lg">
                  {hero.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {hero.primary_cta_text && (
                    <Button size="lg" className="w-full sm:w-auto justify-center bg-brand-green hover:bg-emerald-700 text-white font-bold" asChild>
                      <Link href={hero.primary_cta_link || '/customize'}>
                        {hero.primary_cta_text}
                      </Link>
                    </Button>
                  )}
                  {hero.secondary_cta_text && (
                    <Button size="lg" variant="outline" className="w-full sm:w-auto justify-center font-bold border-brand-charcoal text-brand-charcoal" asChild>
                      <Link href={hero.secondary_cta_link || '/shop'}>
                        {hero.secondary_cta_text}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="relative aspect-[4/3] md:aspect-[5/4] w-full max-h-[min(64vh,600px)] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src={hero.image_url || '/images/products/rajputi-saafe-luxury-bag.svg'} 
                  alt={hero.metadata?.alt_text || hero.title}
                  fill
                  className="object-cover"
                  priority
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. PRODUCT CATEGORY SECTION */}
      {catSec.enabled !== false && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-medium text-brand-green/80 mb-3 block">
                {catSec.subtitle || 'Our range'}
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-charcoal mb-4">
                {catSec.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {catSec.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCategories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/shop?category=${encodeURIComponent(category.name.toLowerCase())}`}
                  className="group flex flex-col rounded-xl overflow-hidden bg-brand-cream border border-border/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image 
                      src={category.image_url || '/images/categories/paper-bags.svg'} 
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-brand-charcoal mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                      {category.description || 'Custom wholesale carry bag'}
                    </p>
                    <span className="text-brand-green text-sm font-medium group-hover:underline underline-offset-4">
                      View range
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. CUSTOMIZATION SECTION */}
      {customSec.enabled !== false && (
        <section className="py-24 bg-brand-charcoal text-white relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-sm font-medium text-brand-gold/90 mb-3 block">
                  {customSec.subtitle || 'Custom branding & prints'}
                </span>
                <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-brand-gold">
                  {customSec.title}
                </h2>
                <p className="text-xl md:text-2xl font-light mb-8 text-gray-300">
                  {customSec.description}
                </p>
                
                <ul className="space-y-4 mb-10">
                  {[
                    'Custom sizes for perfect fit',
                    'High-quality logo printing',
                    'Wide color selection',
                    'Multiple handle options',
                    'Choice of bag type & material',
                    'Wholesale quantities'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle2 className="h-6 w-6 text-brand-gold flex-shrink-0" />
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button size="lg" className="bg-brand-gold text-brand-charcoal hover:bg-brand-gold/90 font-bold" asChild>
                  <Link href="/customize">
                    Design your custom bag
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-white/10 bg-white/5 p-4 flex items-center justify-center">
                    <Image src="/images/products/kraft-twisted-handle-bags.svg" alt="Custom Kraft Paper Bag" fill className="object-contain p-2" referrerPolicy="no-referrer" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-white/10 bg-white/5 p-4 flex items-center justify-center">
                    <Image src="/images/products/rajputi-saafe-luxury-bag.svg" alt="Custom Boutique Designer Bag" fill className="object-contain p-2" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. INDUSTRIES SECTION */}
      {indSec.enabled !== false && (
        <section className="py-20 bg-brand-cream">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-medium text-brand-green/80 mb-3 block">
                {indSec.subtitle || 'Industries we serve'}
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-charcoal mb-4">
                {indSec.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {indSec.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { name: 'Hotels', icon: BedDouble, link: '/industries/hotels' },
                { name: 'Restaurants', icon: UtensilsCrossed, link: '/industries/restaurants' },
                { name: 'Clothing & Fashion', icon: Shirt, link: '/industries/clothing' },
                { name: 'Retail Stores', icon: Store, link: '/industries/retail' },
                { name: 'Medical & Pharma', icon: Stethoscope, link: '/industries/medical-pharma' },
                { name: 'Corporate', icon: Building2, link: '/industries/corporate' },
                { name: 'Events & Gifting', icon: Gift, link: '/industries/events' },
                { name: 'Other Businesses', icon: Briefcase, link: '/industries/other' }
              ].map((industry) => (
                <Link 
                  key={industry.name} 
                  href={industry.link}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 text-center hover:shadow-md transition-all group"
                >
                  <industry.icon className="h-7 w-7 mb-4 text-brand-green" strokeWidth={1.5} aria-hidden />
                  <h3 className="font-semibold text-brand-charcoal">{industry.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. BRAND PROMISE & VALUE PILLARS */}
      {whySec.enabled !== false && (
        <section className="py-16 bg-brand-green text-white relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-brand-gold/90 text-sm font-medium mb-3 block">
                {whySec.subtitle || 'Our promise to you'}
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-3">
                {whySec.title}
              </h2>
              <p className="text-brand-cream/80 text-base md:text-lg">
                {whySec.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-xs p-6 rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-brand-gold/15 text-brand-gold mx-auto flex items-center justify-center mb-3">
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="font-heading font-semibold text-lg text-brand-gold mb-1">Premium quality</h3>
                <p className="text-xs text-white/80">High-load bearing capacity & top-grade paper & fabric</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-6 rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-brand-gold/15 text-brand-gold mx-auto flex items-center justify-center mb-3">
                  <Leaf className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="font-heading font-semibold text-lg text-brand-gold mb-1">Eco-friendly</h3>
                <p className="text-xs text-white/80">Reusable, 100% recyclable & planet-conscious materials</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-6 rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-brand-gold/15 text-brand-gold mx-auto flex items-center justify-center mb-3">
                  <Printer className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="font-heading font-semibold text-lg text-brand-gold mb-1">Custom printing</h3>
                <p className="text-xs text-white/80">Precision logo reproduction in all sizes & color variants</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-6 rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-brand-gold/15 text-brand-gold mx-auto flex items-center justify-center mb-3">
                  <Truck className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="font-heading font-semibold text-lg text-brand-gold mb-1">Reliable service</h3>
                <p className="text-xs text-white/80">Wholesale pricing with guaranteed on-time dispatch</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. HOW IT WORKS */}
      {processSec.enabled !== false && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-medium text-brand-green/80 mb-3 block">
                {processSec.subtitle || 'How bulk orders work'}
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-charcoal mb-4">
                {processSec.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {processSec.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[
                { num: '01', title: 'Choose your bag', desc: 'Select your bag category, size, quantity and material requirements.' },
                { num: '02', title: 'Add your brand', desc: 'Upload your logo or artwork design for custom printing.' },
                { num: '03', title: 'Get your quote', desc: 'Our team reviews your specs and sends an instant formal quote.' },
                { num: '04', title: 'Approve & prepare', desc: 'Once approved, we prepare and print your branded bags.' },
                { num: '05', title: 'Safe delivery', desc: 'Your finished order is safely delivered to your doorstep.' }
              ].map((step, i) => (
                <div key={step.num} className="relative">
                  {i !== 4 && (
                    <div className="hidden md:block absolute top-6 left-1/2 w-full h-[1px] bg-border" />
                  )}
                  <div className="relative z-10 bg-brand-cream w-12 h-12 rounded-full flex items-center justify-center font-bold text-brand-green mb-6 border-2 border-brand-green">
                    {step.num}
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2 text-brand-charcoal">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. CLIENT TESTIMONIALS & FEEDBACK DESK */}
      {testSec.enabled !== false && (
        <ClientFeedbackSection 
          testimonials={testimonials}
          sectionConfig={testSec}
          onFeedbackSubmitted={() => {
            getTestimonials(true).then(setTestimonials);
          }}
        />
      )}

      {/* 8. FINAL CALL TO ACTION */}
      {finalCta.enabled !== false && (
        <section className="py-20 bg-brand-charcoal text-white text-center relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
            <span className="text-sm font-medium text-brand-gold/90 mb-3 block">
              {finalCta.subtitle || 'Bulk wholesale enquiries'}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
              {finalCta.title}
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              {finalCta.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {finalCta.primary_cta_text && (
                <Button size="lg" className="w-full sm:w-auto bg-brand-green hover:bg-emerald-700 text-white font-bold h-12 px-8" asChild>
                  <Link href={finalCta.primary_cta_link || '/customize'}>
                    {finalCta.primary_cta_text}
                  </Link>
                </Button>
              )}
              {finalCta.secondary_cta_text && (
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 font-bold h-12 px-8" asChild>
                  <Link href={finalCta.secondary_cta_link || '/contact'}>
                    {finalCta.secondary_cta_text}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

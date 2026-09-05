'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Star, Quote, Truck, ShieldCheck, Printer, RefreshCw } from 'lucide-react';
import { getHomepageSections, getCategories, getTestimonials, DEFAULT_CATEGORIES } from '@/lib/supabase/services';
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
    subtitle: 'WHOLESALE & RETAIL SUPPLIER IN UJJAIN',
    description: 'Wholesale & retail supplier of high-quality paper bags, W-cut vest bags, D-cut punch bags, luxury laminated boutique gift bags, and envelope pouches in Ujjain.',
    image_url: '/images/products/rajputi-saafe-luxury-bag.svg',
    primary_cta_text: 'GET CUSTOM QUOTE',
    primary_cta_link: '/customize',
    secondary_cta_text: 'EXPLORE CATALOG',
    secondary_cta_link: '/shop',
    enabled: true
  };

  const catSec = sections.categories || {
    title: 'FIND THE RIGHT BAG FOR YOUR BUSINESS',
    subtitle: 'BROWSE OUR RANGE',
    description: 'Explore our premium collection of ready-to-ship and customizable bags.',
    enabled: true
  };

  const customSec = sections.customization || {
    title: 'PUT YOUR BRAND ON IT.',
    subtitle: 'CUSTOM BRANDING & PRINTS',
    description: 'Your size. Your colors. Your logo. Your bag.',
    enabled: true
  };

  const indSec = sections.industries || {
    title: 'MADE FOR YOUR BUSINESS',
    subtitle: 'INDUSTRIES WE SERVE',
    description: 'We provide tailored packaging solutions for diverse industries.',
    enabled: true
  };

  const processSec = sections.process || {
    title: 'SIMPLE. TRANSPARENT. FAST.',
    subtitle: 'HOW BULK ORDERS WORK',
    description: 'How to get your custom branded bags.',
    enabled: true
  };

  const whySec = sections.why_us || {
    title: 'TRUST • QUALITY • VALUE',
    subtitle: 'OUR PROMISE TO YOU',
    description: 'Wholesale & Retail Supplier of Paper Bags, Non-Woven Bags, Customized Bags & Designer Bags',
    enabled: true
  };

  const testSec = sections.testimonials || {
    title: 'What Our Clients Say',
    subtitle: 'CLIENT FEEDBACK',
    description: 'Genuine reviews from business owners and store managers.',
    enabled: true
  };

  const finalCta = sections.final_cta || {
    title: 'Ready to Upgrade Your Brand Packaging?',
    subtitle: 'BULK WHOLESALE INQUIRIES',
    description: 'Get in touch with MS TRADERS today for custom sample kits and bulk pricing quotes.',
    primary_cta_text: 'REQUEST WHOLESALE QUOTE',
    primary_cta_link: '/customize',
    secondary_cta_text: 'CONTACT SALES DESK',
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
        <section className="relative overflow-hidden bg-brand-cream pb-12 pt-16 sm:pb-16 sm:pt-24 md:pb-24 md:pt-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="max-w-2xl">
                {hero.subtitle && (
                  <span className="inline-block rounded-full bg-brand-green/10 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-semibold text-brand-green mb-4 sm:mb-6">
                    {hero.subtitle}
                  </span>
                )}
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight text-brand-charcoal leading-[1.1] mb-4 sm:mb-6">
                  {hero.title || 'BAGS THAT CARRY YOUR BRAND.'}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-lg">
                  {hero.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {hero.primary_cta_text && (
                    <Button size="lg" className="w-full sm:w-auto justify-center bg-brand-green hover:bg-emerald-700 text-white font-bold" asChild>
                      <Link href={hero.primary_cta_link || '/customize'}>
                        {hero.primary_cta_text} <ArrowRight className="ml-2 h-5 w-5" />
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
              
              <div className="relative aspect-[4/3] md:aspect-square w-full rounded-2xl overflow-hidden shadow-2xl">
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
              <span className="text-xs font-bold tracking-widest text-brand-green uppercase mb-2 block">
                {catSec.subtitle || 'BROWSE OUR RANGE'}
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-charcoal mb-4">
                {catSec.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {catSec.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {category.description || 'Custom wholesale carry bag'}
                    </p>
                    <span className="text-brand-green text-sm font-medium flex items-center group-hover:underline">
                      Explore <ArrowRight className="ml-1 h-4 w-4" />
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
                <span className="text-xs font-bold tracking-widest text-brand-gold uppercase mb-2 block">
                  {customSec.subtitle || 'CUSTOM BRANDING & PRINTS'}
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
                    CREATE YOUR CUSTOM BAG <ArrowRight className="ml-2 h-5 w-5" />
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
              <span className="text-xs font-bold tracking-widest text-brand-green uppercase mb-2 block">
                {indSec.subtitle || 'INDUSTRIES WE SERVE'}
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
                { name: 'Hotels', icon: '🏨', link: '/industries/hotels' },
                { name: 'Restaurants', icon: '🍽️', link: '/industries/restaurants' },
                { name: 'Clothing & Fashion', icon: '👗', link: '/industries/clothing' },
                { name: 'Retail Stores', icon: '🛍️', link: '/industries/retail' },
                { name: 'Medical & Pharma', icon: '⚕️', link: '/industries/medical-pharma' },
                { name: 'Corporate', icon: '🏢', link: '/industries/corporate' },
                { name: 'Events & Gifting', icon: '🎁', link: '/industries/events' },
                { name: 'Other Businesses', icon: '💼', link: '/industries/other' }
              ].map((industry) => (
                <Link 
                  key={industry.name} 
                  href={industry.link}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 text-center hover:shadow-md transition-all group"
                >
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{industry.icon}</div>
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
              <span className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
                {whySec.subtitle || 'OUR PROMISE TO YOU'}
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
                <div className="w-12 h-12 rounded-full bg-brand-gold/20 text-brand-gold mx-auto flex items-center justify-center font-bold text-xl mb-3">
                  ✓
                </div>
                <h3 className="font-heading font-semibold text-lg text-brand-gold mb-1">PREMIUM QUALITY</h3>
                <p className="text-xs text-white/80">High-load bearing capacity & top-grade paper & fabric</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-6 rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-brand-gold/20 text-brand-gold mx-auto flex items-center justify-center font-bold text-xl mb-3">
                  🍃
                </div>
                <h3 className="font-heading font-semibold text-lg text-brand-gold mb-1">ECO-FRIENDLY</h3>
                <p className="text-xs text-white/80">Reusable, 100% recyclable & planet-conscious materials</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-6 rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-brand-gold/20 text-brand-gold mx-auto flex items-center justify-center font-bold text-xl mb-3">
                  🖨️
                </div>
                <h3 className="font-heading font-semibold text-lg text-brand-gold mb-1">CUSTOM PRINTING</h3>
                <p className="text-xs text-white/80">Precision logo reproduction in all sizes & color variants</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-6 rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-brand-gold/20 text-brand-gold mx-auto flex items-center justify-center font-bold text-xl mb-3">
                  🚚
                </div>
                <h3 className="font-heading font-semibold text-lg text-brand-gold mb-1">RELIABLE SERVICE</h3>
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
              <span className="text-xs font-bold tracking-widest text-brand-green uppercase mb-2 block">
                {processSec.subtitle || 'HOW BULK ORDERS WORK'}
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
                { num: '01', title: 'CHOOSE YOUR BAG', desc: 'Select your bag category, size, quantity and material requirements.' },
                { num: '02', title: 'ADD YOUR BRAND', desc: 'Upload your logo or artwork design for custom printing.' },
                { num: '03', title: 'GET YOUR QUOTE', desc: 'Our team reviews your specs and sends an instant formal quote.' },
                { num: '04', title: 'APPROVE & PREPARE', desc: 'Once approved, we prepare and print your branded bags.' },
                { num: '05', title: 'SAFE DELIVERY', desc: 'Your finished order is safely delivered to your doorstep.' }
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
            <span className="text-xs font-bold tracking-widest text-brand-gold uppercase mb-3 block">
              {finalCta.subtitle || 'BULK WHOLESALE INQUIRIES'}
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
                    {finalCta.primary_cta_text} <ArrowRight className="ml-2 h-5 w-5" />
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

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-brand-cream pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <span className="inline-block rounded-full bg-brand-green/10 px-4 py-1.5 text-sm font-semibold text-brand-green mb-6">
                Wholesale • Retail • Custom Printing • Nationwide Delivery
              </span>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-brand-charcoal leading-[1.1] mb-6">
                BAGS THAT CARRY <br />
                <span className="text-brand-green">YOUR BRAND.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
                Premium paper, non-woven and designer bags for businesses, brands and everyday shopping.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/shop">
                    SHOP BAGS <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/customize">CUSTOMIZE YOUR BAG</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative aspect-[4/3] md:aspect-square w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80" 
                alt="Premium customized paper bags by MS TRADERS"
                fill
                className="object-cover"
                priority
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-10">
           {/* Abstract organic shape resembling a leaf */}
           <svg width="600" height="600" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#0E3D2B" d="M42.7,-73.4C55.9,-67.8,67.6,-57.4,75.3,-44.6C83,-31.8,86.6,-16.6,87,-1.2C87.3,14.3,84.4,30,76.5,43.2C68.6,56.4,55.8,67.2,41.4,74.2C27,81.1,11.1,84.3,-4.2,84.7C-19.5,85.2,-34.3,83.1,-48.1,76C-61.9,68.9,-74.6,56.8,-82.3,42.4C-89.9,28,-92.5,11.4,-90.1,-4.2C-87.7,-19.8,-80.4,-34.4,-70.7,-46.5C-60.9,-58.5,-48.7,-68,-35.3,-73.5C-21.9,-79,-7.4,-80.5,6.7,-78C20.8,-75.4,41.6,-70.2,42.7,-73.4Z" transform="translate(100 100)" />
          </svg>
        </div>
      </section>

      {/* 2. PRODUCT CATEGORY SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-charcoal mb-4">
              FIND THE RIGHT BAG FOR YOUR BUSINESS
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore our premium collection of ready-to-ship and customizable bags.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Paper Bags', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', desc: 'Eco-friendly retail' },
              { name: 'Kraft Bags', imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80', desc: 'Natural & durable' },
              { name: 'Non-Woven Bags', imageUrl: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=800&q=80', desc: 'Reusable & strong' },
              { name: 'W-Cut Bags', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80', desc: 'Standard shopping' },
              { name: 'D-Cut Bags', imageUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80', desc: 'Modern handle' },
              { name: 'Designer Bags', imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', desc: 'Premium luxury' },
              { name: 'Gift Bags', imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80', desc: 'Special occasions' },
              { name: 'Customized Bags', imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80', desc: 'Your exact design' }
            ].map((category) => (
              <Link 
                key={category.name} 
                href={`/shop?category=${encodeURIComponent(category.name.toLowerCase())}`}
                className="group flex flex-col rounded-xl overflow-hidden bg-brand-cream border border-border/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image 
                    src={category.imageUrl} 
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
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.desc}
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

      {/* 3. CUSTOMIZATION SECTION */}
      <section className="py-24 bg-brand-charcoal text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-brand-gold">
                PUT YOUR BRAND ON IT.
              </h2>
              <p className="text-xl md:text-2xl font-light mb-8 text-gray-300">
                Your size. Your colors. Your logo. Your bag.
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
              
              <Button size="lg" className="bg-brand-gold text-brand-charcoal hover:bg-brand-gold/90" asChild>
                <Link href="/customize">
                  CREATE YOUR CUSTOM BAG <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-4 pt-12">
                 <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-white/10">
                    <Image src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80" alt="Custom Kraft Paper Bag" fill className="object-cover" referrerPolicy="no-referrer" />
                 </div>
               </div>
               <div className="space-y-4">
                 <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-white/10">
                    <Image src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80" alt="Custom Boutique Designer Bag" fill className="object-cover" referrerPolicy="no-referrer" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INDUSTRIES SECTION */}
      <section className="py-20 bg-brand-cream">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-charcoal mb-4">
              MADE FOR YOUR BUSINESS
            </h2>
            <p className="text-lg text-muted-foreground">
              We provide tailored packaging solutions for diverse industries.
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

      {/* 5. BRAND PROMISE & VALUE PILLARS */}
      <section className="py-16 bg-brand-green text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
              OUR PROMISE TO YOU
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-3">
              TRUST • QUALITY • VALUE
            </h2>
            <p className="text-brand-cream/80 text-base md:text-lg">
              Wholesale & Retail Supplier of Paper Bags, Non-Woven Bags, Customized Bags & Designer Bags
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
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

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-sm text-brand-cream/90">
            <div>
              <span className="font-semibold text-brand-gold">Factory & Showroom:</span> 57, Kalasari, Dabripitha, Ujjain (M.P.)
            </div>
            <div className="flex items-center gap-4">
              <a href="tel:9131268724" className="hover:text-brand-gold transition-colors font-medium">
                📞 +91 91312 68724
              </a>
              <span>|</span>
              <a href="tel:9009446352" className="hover:text-brand-gold transition-colors font-medium">
                📞 +91 90094 46352
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-charcoal mb-4">
              SIMPLE. TRANSPARENT. FAST.
            </h2>
            <p className="text-lg text-muted-foreground">
              How to get your custom branded bags.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { num: '01', title: 'TELL US WHAT YOU NEED', desc: 'Choose your bag type, size, quantity and requirements.' },
              { num: '02', title: 'SHARE YOUR DESIGN', desc: 'Upload your logo or artwork.' },
              { num: '03', title: 'GET YOUR QUOTE', desc: 'Our team reviews your requirements and provides pricing.' },
              { num: '04', title: 'APPROVE & PRODUCE', desc: 'Production begins immediately after approval.' },
              { num: '05', title: 'DELIVERY', desc: 'Your order is safely delivered to your location.' }
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
    </>
  );
}

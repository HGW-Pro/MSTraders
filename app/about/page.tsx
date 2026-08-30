import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Truck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="bg-brand-cream py-20 md:py-28 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-brand-charcoal mb-6">
              Packaging that protects your product and your brand.
            </h1>
            <p className="text-xl text-muted-foreground">
              MS TRADERS is a premier wholesale and retail bag supplier specializing in custom paper, kraft, non-woven bags, and branded packaging based in Ujjain (M.P).
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80" 
                alt="MS TRADERS Wholesale Bag Supply"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-charcoal">
                Our Commitment to Quality
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We understand that a bag is more than just a carrier; it&apos;s a mobile billboard for your brand. That&apos;s why every batch that leaves our warehouse is selected with precision, using premium materials that reflect the quality of your business.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From luxury retail boutiques and upscale hotels to everyday supermarkets and pharmacies, we supply customized solutions that meet specific requirements across sizes, materials, and printing techniques.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div>
                  <h3 className="text-4xl font-bold text-brand-green font-heading mb-2">100%</h3>
                  <p className="font-medium text-brand-charcoal">Customizable</p>
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-brand-green font-heading mb-2">PAN</h3>
                  <p className="font-medium text-brand-charcoal">India Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-brand-charcoal text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-brand-gold">Why Choose Us</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">The principles that drive our wholesale supply and custom printing service.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: 'Premium Quality', desc: 'Strict quality inspection ensuring high load durability and clean finish.' },
              { icon: Sparkles, title: 'Custom Printing', desc: 'Customized with your logo, brand colors, and precise dimensions.' },
              { icon: Leaf, title: 'Eco-Friendly Options', desc: 'Sustainable kraft, paper, and reusable non-woven alternatives to plastic.' },
              { icon: Truck, title: 'Reliable Wholesale Supply', desc: 'Consistent bulk fulfillment with guaranteed on-time delivery.' }
            ].map((val, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <val.icon className="h-10 w-10 text-brand-gold mb-6" />
                <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-green text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">Ready to elevate your packaging?</h2>
          <p className="text-xl text-white/80 mb-10">Get in touch with our team to discuss your requirements and receive a customized quote.</p>
          <Button size="lg" variant="secondary" className="bg-brand-gold text-brand-charcoal hover:bg-white" asChild>
            <Link href="/customize">
              Request a Quote <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

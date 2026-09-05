import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Leaf, ShieldCheck, Printer, Truck } from 'lucide-react';

const CAPABILITIES = [
  {
    icon: ShieldCheck,
    title: 'Load-tested construction',
    desc: 'Every batch is checked for handle pull strength and base seal before it leaves the workshop, so bags survive a full trolley, not just a photograph.',
  },
  {
    icon: Printer,
    title: 'Print that matches your brand',
    desc: 'Screen, offset and flexo printing, plus gold foil and spot UV for boutique work. Send artwork and we return a proof before the run starts.',
  },
  {
    icon: Leaf,
    title: 'Paper, kraft and reusable non-woven',
    desc: 'Recyclable kraft and paper for retail and food, and reusable non-woven where a bag needs to last past the first trip home.',
  },
  {
    icon: Truck,
    title: 'Bulk supply you can plan around',
    desc: 'Repeat orders run to an agreed schedule so your packaging arrives before you run out, not after.',
  },
];

const PROCESS = [
  { step: '01', title: 'Tell us the spec', desc: 'Bag type, dimensions, GSM, handle and quantity. A photograph of a bag you already use works just as well.' },
  { step: '02', title: 'We quote and proof', desc: 'You get a price per piece at your quantity, and a print proof if the bag is branded.' },
  { step: '03', title: 'Production', desc: 'Cutting, printing and finishing, with a quality check on the finished batch.' },
  { step: '04', title: 'Dispatch', desc: 'Packed and dispatched across Ujjain, Madhya Pradesh and the rest of India.' },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="bg-brand-cream py-14 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold text-brand-charcoal mb-5">
              Packaging that protects your product and carries your name
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
              MS Traders manufactures and supplies paper, kraft and non-woven carry bags from
              Ujjain, Madhya Pradesh, for retailers, boutiques, bakeries, pharmacies and
              wholesalers who need packaging in quantity.
            </p>
          </div>
        </div>
      </section>

      {/* Figures */}
      <section className="border-y border-border bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <dl className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
            {[
              ['9', 'Bag categories in production'],
              ['300+', 'Minimum order, most lines'],
              ['Pan-India', 'Dispatch coverage'],
              ['Same day', 'Typical quote turnaround'],
            ].map(([value, label]) => (
              <div key={label} className="px-4 py-6 sm:px-6 sm:py-8 first:pl-0 lg:last:pr-0">
                <dt className="font-heading text-2xl sm:text-3xl font-bold text-brand-green mb-1">{value}</dt>
                <dd className="text-xs sm:text-sm text-muted-foreground leading-snug">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Story */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative aspect-[4/3] w-full max-h-[440px] rounded-2xl overflow-hidden shadow-xl order-first lg:order-last">
              <Image
                src="/images/gallery/kraft-trio.svg"
                alt="Kraft carry bags produced by MS Traders"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="space-y-5">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-charcoal">
                A bag is the last thing a customer carries away
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                It leaves the shop, goes down the street and sits in someone&apos;s kitchen for a
                week. That makes it the cheapest advertising a business owns, and the most
                obvious place to look careless if it tears.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                We supply boutiques, supermarkets, bakeries, pharmacies, hotels and event
                organisers, in runs from a few hundred pieces to standing monthly orders.
                Whether the bag is plain stock or printed with your logo, it is made to the
                same specification and checked before it ships.
              </p>
              <div className="pt-2">
                <Button asChild className="bg-brand-green text-white hover:bg-brand-green/90 w-full sm:w-auto">
                  <Link href="/our-work">See work we have produced</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-14 sm:py-20 bg-brand-charcoal text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-brand-gold">
              What we do well
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              The parts of the job that decide whether packaging works in a shop rather than in a
              catalogue.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            {CAPABILITIES.map(c => (
              <div key={c.title} className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <c.icon className="h-8 w-8 text-brand-gold mb-5" strokeWidth={1.5} aria-hidden />
                <h3 className="font-heading text-lg font-semibold mb-2">{c.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process - genuinely a sequence, so numbered */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-2xl mb-10 sm:mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-charcoal mb-3">
              How an order runs
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              From first enquiry to dispatch, so you know what to expect and when.
            </p>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {PROCESS.map(p => (
              <li key={p.step} className="border-t-2 border-brand-green/25 pt-5">
                <span className="block font-heading text-sm font-semibold text-brand-green mb-2">{p.step}</span>
                <h3 className="font-heading text-lg font-semibold text-brand-charcoal mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Tell us what you need and we will price it
          </h2>
          <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed">
            Send the bag type, size and quantity. If you already have a bag you like, a photograph
            is enough to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild className="bg-brand-gold text-brand-charcoal hover:bg-white w-full sm:w-auto">
              <Link href="/customize">Get a custom quote</Link>
            </Button>
            <Button size="lg" variant="outline" asChild
                    className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white w-full sm:w-auto">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, MessageCircle, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '@/components/settings-provider';
import { createQuote } from '@/lib/db/services';

export default function ContactPage() {
  const { settings } = useSettings();
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({
    name: '', business: '', email: '', phone: '', subject: '', message: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  // Enquiries are saved as quotes so they land in Admin > Quotes, which
  // already has status tracking and notifications. Previously this form had
  // no submit handler at all and every message was silently discarded.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error('Please fill in your name, email, phone and message.');
      return;
    }
    setSending(true);
    try {
      const quote = await createQuote({
        customer_name: form.name.trim(),
        business_name: form.business.trim() || undefined,
        email: form.email.trim(),
        phone: form.phone.trim(),
        bag_type: form.subject.trim() || 'General enquiry',
        quantity: 0,
        notes: form.message.trim(),
        requirements: { source: 'contact-form', subject: form.subject.trim() || 'General enquiry' },
      });
      if (!quote) throw new Error('Could not save your message');
      setSent(quote.quote_number || 'received');
      setForm({ name: '', business: '', email: '', phone: '', subject: '', message: '' });
      toast.success('Message sent. We will be in touch.');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not send your message. Please call or WhatsApp us instead.');
    } finally {
      setSending(false);
    }
  };

  const phone = settings.phone || '+91 91312 68724';
  const whatsapp = settings.whatsapp || '919131268724';
  const email = settings.email || 'contact@mstradersujjain.com';
  const hours = settings.business_hours || 'Monday to Saturday, 9:30 AM to 8:30 PM';

  const channels = [
    { icon: Phone, label: 'Phone', value: phone, href: `tel:${phone.replace(/[^\d+]/g, '')}`, note: 'Fastest for urgent bulk orders' },
    { icon: MessageCircle, label: 'WhatsApp', value: `+${whatsapp}`, href: `https://wa.me/${whatsapp}`, note: 'Send artwork and get a quote back' },
    { icon: Mail, label: 'Email', value: email, href: `mailto:${email}`, note: 'For specifications and purchase orders' },
  ];

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="bg-brand-charcoal text-white py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-2xl">
            <h1 className="font-heading text-[clamp(2rem,5vw,3.25rem)] font-bold mb-4">
              Talk to us about your packaging
            </h1>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              Tell us the bag type, size and quantity you need. We will come back with pricing,
              material options and a print proof.
            </p>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="border-b border-border bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {channels.map(c => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="group flex items-start gap-4 py-6 sm:py-8 sm:px-6 first:sm:pl-0 last:sm:pr-0 hover:bg-brand-cream/60 transition-colors"
              >
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <c.icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground mb-0.5">{c.label}</span>
                  <span className="block font-semibold text-brand-charcoal break-words group-hover:text-brand-green transition-colors">
                    {c.value}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1">{c.note}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16">

            {/* Where to find us */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-charcoal mb-5">
                  Where to find us
                </h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-green">
                      <MapPin className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-brand-charcoal mb-1">Workshop &amp; office</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {settings.address || '57 Kalalseri, Behind Power House, Dabri Pitha'}<br />
                        {settings.city || 'Ujjain'}, {settings.state || 'Madhya Pradesh'} {settings.pincode || '456006'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-green">
                      <Clock className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-brand-charcoal mb-1">Opening hours</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{hours}</p>
                      <p className="text-sm text-muted-foreground">Sunday closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-brand-cream p-6">
                <h3 className="font-heading text-lg font-semibold text-brand-charcoal mb-2">
                  Need pricing on a specific bag?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  The quote form captures size, material, handle and print in one go, so we can
                  price it without going back and forth.
                </p>
                <Button asChild className="bg-brand-green text-white hover:bg-brand-green/90 w-full sm:w-auto">
                  <Link href="/customize">Get a custom quote</Link>
                </Button>
              </div>
            </div>

            {/* Form */}
            <div className="bg-surface border border-border rounded-2xl p-5 sm:p-8 shadow-xs">
              {sent ? (
                <div className="text-center py-10">
                  <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                    <Check className="h-7 w-7" />
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-brand-charcoal mb-2">Message received</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {sent !== 'received'
                      ? <>Your reference is <strong className="text-brand-charcoal">{sent}</strong>. We usually reply the same working day.</>
                      : 'We usually reply the same working day.'}
                  </p>
                  <Button variant="outline" onClick={() => setSent(null)}>Send another message</Button>
                </div>
              ) : (
                <>
                  <h2 className="font-heading text-2xl font-bold text-brand-charcoal mb-1">Send a message</h2>
                  <p className="text-sm text-muted-foreground mb-6">Fields marked * are required.</p>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your name *</Label>
                        <Input id="name" value={form.name} onChange={set('name')} autoComplete="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business">Business name</Label>
                        <Input id="business" value={form.business} onChange={set('business')} autoComplete="organization" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" inputMode="email" autoComplete="email"
                               value={form.email} onChange={set('email')} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input id="phone" type="tel" inputMode="tel" autoComplete="tel"
                               value={form.phone} onChange={set('phone')} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">What is it about?</Label>
                      <Input id="subject" placeholder="e.g. 5,000 kraft bags with our logo"
                             value={form.subject} onChange={set('subject')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" rows={5} value={form.message} onChange={set('message')} required />
                    </div>
                    <Button type="submit" size="lg" disabled={sending}
                            className="w-full bg-brand-green text-white hover:bg-brand-green/90">
                      {sending ? 'Sending…' : 'Send message'}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

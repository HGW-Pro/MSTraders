import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="bg-brand-charcoal text-white py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            We are here to help your business find the perfect packaging solutions. Reach out to us today.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h2 className="font-heading text-3xl font-bold text-brand-charcoal mb-8">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-brand-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-brand-charcoal mb-1">Phone & WhatsApp</h3>
                      <p className="text-muted-foreground">+91 00000 00000</p>
                      <p className="text-muted-foreground">+91 00000 00000 (Wholesale Inquiries)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-brand-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-brand-charcoal mb-1">Email</h3>
                      <p className="text-muted-foreground">info@mstraders.com</p>
                      <p className="text-muted-foreground">sales@mstraders.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-brand-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-brand-charcoal mb-1">Location</h3>
                      <p className="text-muted-foreground">
                        123 Business Park, Industrial Area,<br />
                        Mumbai, Maharashtra 400001,<br />
                        India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-brand-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-brand-charcoal mb-1">Business Hours</h3>
                      <p className="text-muted-foreground">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                      <p className="text-muted-foreground">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-border p-8 rounded-2xl shadow-sm">
              <h3 className="font-heading text-2xl font-bold text-brand-charcoal mb-6">Send a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" rows={5} required />
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

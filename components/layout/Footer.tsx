'use client';

import Link from 'next/link';
import { useSettings } from '@/components/settings-provider';
import { Logo } from '@/components/logo';

export function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-brand-charcoal text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <Logo variant="light" size="lg" />
            </Link>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              {settings.footer_about || settings.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-brand-gold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop Catalog</Link></li>
              <li><Link href="/customize" className="hover:text-white transition-colors">Customize Bags</Link></li>
              <li><Link href="/industries" className="hover:text-white transition-colors">Industries Served</Link></li>
              <li><Link href="/our-work" className="hover:text-white transition-colors">Our Work & Gallery</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Industry Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-brand-gold">Industry Solutions</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/industries/hotels" className="hover:text-white transition-colors">Hotels & Hospitality</Link></li>
              <li><Link href="/industries/restaurants" className="hover:text-white transition-colors">Restaurants & Food</Link></li>
              <li><Link href="/industries/clothing" className="hover:text-white transition-colors">Clothing & Boutiques</Link></li>
              <li><Link href="/industries/retail" className="hover:text-white transition-colors">Supermarkets & Retail</Link></li>
              <li><Link href="/industries/medical-pharma" className="hover:text-white transition-colors">Medical & Pharmacies</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-brand-gold">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="text-gray-300 font-medium">Phone:</span> {settings.phone}</li>
              <li>
                <span className="text-gray-300 font-medium">WhatsApp:</span>{' '}
                <a 
                  href={`https://wa.me/${settings.whatsapp}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold underline"
                >
                  +{settings.whatsapp}
                </a>
              </li>
              <li><span className="text-gray-300 font-medium">Email:</span> {settings.email}</li>
              <li className="pt-2 leading-relaxed">
                {settings.address},<br />
                {settings.city}, {settings.state} {settings.pincode}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {settings.business_name}. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            {settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">Instagram</a>
            )}
            {settings.social_facebook && (
              <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">Facebook</a>
            )}
            {settings.social_linkedin && (
              <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">LinkedIn</a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

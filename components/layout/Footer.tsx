import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-heading text-2xl font-bold tracking-tight text-brand-gold">
                MS TRADERS
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs">
              Premium paper, non-woven and designer bags for businesses, brands and everyday shopping. Wholesale, retail, and custom printing across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-brand-gold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop Ready-Made</Link></li>
              <li><Link href="/customize" className="hover:text-white transition-colors">Customize Bags</Link></li>
              <li><Link href="/industries" className="hover:text-white transition-colors">Industries We Serve</Link></li>
              <li><Link href="/our-work" className="hover:text-white transition-colors">Our Work</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-brand-gold">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-brand-gold">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Phone: +91 00000 00000</li>
              <li>WhatsApp: +91 00000 00000</li>
              <li>Email: info@mstraders.com</li>
              <li className="pt-2">
                123 Business Park,<br />
                Industrial Area,<br />
                Mumbai, Maharashtra 400001
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MS Traders. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Social Links placeholders */}
            <a href="#" className="hover:text-brand-gold transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Facebook</a>
            <a href="#" className="hover:text-brand-gold transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

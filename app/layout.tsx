import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css'; // Global styles
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'MS Traders | Premium Packaging & Custom Bags',
  description: 'Premium paper, non-woven and designer bags for businesses, brands and everyday shopping. Wholesale, retail, and custom printing.',
  openGraph: {
    title: 'MS Traders | Premium Packaging & Custom Bags',
    description: 'Premium paper, non-woven and designer bags for businesses, brands and everyday shopping.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MS Traders | Premium Packaging',
    description: 'Premium paper, non-woven and designer bags for businesses, brands and everyday shopping.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased" suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

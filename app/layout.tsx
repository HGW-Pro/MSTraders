import './globals.css';
import * as React from 'react';
import { SettingsProvider } from '@/components/settings-provider';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { Toaster } from 'sonner';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MS TRADERS - Wholesale & Retail Bag Supplier & Custom Printing',
  description: 'Premier wholesale & retail supplier of custom kraft bags, paper bags, non-woven D-cut/W-cut bags, and luxury designer gift bags in Ujjain.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        {/*
          The stylesheet previously named Playfair Display and Inter without
          ever loading them, so every heading rendered in Georgia.

          Loaded via <link> rather than next/font because next/font fetches at
          BUILD time and fails the whole build if Google is unreachable. This
          way a network problem degrades to the fallback stack instead of
          breaking a deploy.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="h-full flex flex-col font-sans antialiased text-foreground bg-background">
        <SettingsProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Toaster position="top-right" richColors />
        </SettingsProvider>
      </body>
    </html>
  );
}

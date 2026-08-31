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

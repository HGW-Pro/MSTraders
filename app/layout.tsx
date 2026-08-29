import './globals.css';
import * as React from 'react';
import { SettingsProvider } from '@/components/settings-provider';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { Toaster } from 'sonner';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MS TRADERS - Eco-Friendly Bag Manufacturers & Printing Specialists',
  description: 'Premier Indian manufacturer of custom kraft bags, paper bags, non-woven D-cut/W-cut bags, and luxury designer gift bags.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col font-sans antialiased text-foreground bg-background">
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

'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'light';
  showText?: boolean;
}

export function Logo({
  className = '',
  size = 'md',
  variant = 'default',
}: LogoProps) {
  const dimensions = {
    sm: { width: 140, height: 35 },
    md: { width: 180, height: 45 },
    lg: { width: 220, height: 55 },
    xl: { width: 280, height: 70 },
  };

  const dim = dimensions[size] || dimensions.md;
  const logoSrc = variant === 'light' ? '/logo-light.svg' : '/logo.svg';

  return (
    <div className={cn("inline-flex items-center select-none flex-shrink-0 min-w-0 max-w-full", className)}>
      <Image
        src={logoSrc}
        alt="MS TRADERS - Wholesale & Retail Supplier"
        width={dim.width}
        height={dim.height}
        className="object-contain h-auto max-h-12 w-auto max-w-full"
        priority
      />
    </div>
  );
}




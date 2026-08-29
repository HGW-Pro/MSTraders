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
  showText = true,
}: LogoProps) {
  // Dimensions configuration
  const sizes = {
    sm: { iconSize: 36, titleClass: 'text-base', subtitleClass: 'text-[9px]' },
    md: { iconSize: 44, titleClass: 'text-lg sm:text-xl', subtitleClass: 'text-[10px]' },
    lg: { iconSize: 60, titleClass: 'text-2xl', subtitleClass: 'text-xs' },
    xl: { iconSize: 84, titleClass: 'text-3xl sm:text-4xl', subtitleClass: 'text-sm' },
  };

  const currentSize = sizes[size] || sizes.md;
  const isLight = variant === 'light';

  return (
    <div className={cn("inline-flex items-center gap-2.5 max-w-full min-w-0 select-none", className)}>
      {/* Official Brand SVG Mark */}
      <div 
        className="relative flex-shrink-0"
        style={{ width: currentSize.iconSize, height: currentSize.iconSize }}
      >
        <Image
          src="/logo.svg"
          alt="MS TRADERS"
          width={currentSize.iconSize}
          height={currentSize.iconSize}
          className="object-contain w-full h-full"
          priority
        />
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col leading-none min-w-0">
          <div className="flex items-center gap-1 font-heading font-extrabold tracking-tight whitespace-nowrap">
            <span className={cn(currentSize.titleClass, isLight ? 'text-white' : 'text-[#0E3D2B]')}>
              MS
            </span>
            <span className={cn(currentSize.titleClass, 'text-[#D4AF37]')}>
              TRADERS
            </span>
          </div>
          <span
            className={cn(
              "font-semibold tracking-wider uppercase hidden sm:block truncate mt-0.5",
              currentSize.subtitleClass,
              isLight ? 'text-[#D4AF37]' : 'text-neutral-500'
            )}
          >
            Wholesale & Retail
          </span>
        </div>
      )}
    </div>
  );
}



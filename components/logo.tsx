'use client';

import * as React from 'react';
import Image from 'next/image';

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
  // Dimensions map
  const dimensions = {
    sm: { icon: 40, titleSize: 'text-base', subtitleSize: 'text-[9px]' },
    md: { icon: 54, titleSize: 'text-xl', subtitleSize: 'text-[10px]' },
    lg: { icon: 72, titleSize: 'text-2xl', subtitleSize: 'text-xs' },
    xl: { icon: 110, titleSize: 'text-4xl', subtitleSize: 'text-sm' },
  };

  const currentDim = dimensions[size] || dimensions.md;

  const isLight = variant === 'light';
  const greenColor = '#0E3D2B';
  const goldColor = '#D4AF37';
  const textColor = isLight ? '#FFFFFF' : greenColor;
  const subtextColor = isLight ? '#D4AF37' : '#555555';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Visual Vector Symbol of MS TRADERS Logo */}
      <div 
        className="relative flex-shrink-0"
        style={{ width: currentDim.icon, height: currentDim.icon }}
      >
        <Image
          src="/logo.svg"
          alt="MS TRADERS Logo"
          width={currentDim.icon}
          height={currentDim.icon}
          className="object-contain w-full h-full drop-shadow-xs"
          priority
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5 font-heading font-bold tracking-tight">
            <span className={currentDim.titleSize} style={{ color: textColor }}>
              MS
            </span>
            <span className={currentDim.titleSize} style={{ color: goldColor }}>
              TRADERS
            </span>
          </div>
          <span
            className={`font-semibold tracking-widest uppercase ${currentDim.subtitleSize}`}
            style={{ color: subtextColor }}
          >
            Wholesale & Retail Supplier
          </span>
        </div>
      )}
    </div>
  );
}


'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, ChevronRight, Info } from 'lucide-react';
import { FALLBACK_PRODUCTS } from '@/lib/data';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Use React.use() to unwrap params in Next.js 15+ if needed, but for simplicity here we just use it directly since it's a client component and we're mocking data for now.
  // Actually, since Next 15, params is a Promise. We should handle it properly or just let Next.js handle it if we are using it simply. 
  // Let's use `React.use(params as any)` to be safe with Next.js 15.
  
  const unwrappedParams = React.use(params);
  const product = FALLBACK_PRODUCTS.find(p => p.slug === unwrappedParams.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/shop" className="hover:text-brand-green transition-colors">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-brand-green transition-colors capitalize">{product.category}</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-brand-charcoal font-medium truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border/50">
              <Image 
                src={product.images[0]} 
                alt={product.name}
                fill
                className="object-cover"
                priority
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-brand-green font-semibold">{product.category}</span>
              {product.is_customizable && (
                <span className="bg-brand-gold/20 text-brand-charcoal text-xs px-2 py-0.5 rounded-sm font-medium">
                  Customizable
                </span>
              )}
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-brand-charcoal mb-4">
              {product.name}
            </h1>
            
            <div className="text-2xl font-medium text-brand-charcoal mb-6">
              {product.price ? `₹${product.price} / piece` : 'Bulk Quote Only'}
            </div>
            
            <p className="text-muted-foreground text-lg mb-8">
              {product.description}
            </p>

            <div className="space-y-6 mb-10 border-t border-b border-border/60 py-6">
              {/* Specifications */}
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <span className="text-muted-foreground block mb-1">Material</span>
                  <span className="font-medium text-brand-charcoal">{product.material}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Minimum Order Qty</span>
                  <span className="font-medium text-brand-charcoal">{product.moq} pieces</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Available Sizes</span>
                  <span className="font-medium text-brand-charcoal">{product.sizes.join(', ')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Available Colors</span>
                  <span className="font-medium text-brand-charcoal">{product.colors.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
               <Button size="lg" className="w-full sm:w-auto" asChild>
                 <Link href={`/customize?product=${product.slug}`}>
                    REQUEST BULK QUOTE
                 </Link>
               </Button>
               {product.price && (
                 <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    ADD TO CART
                 </Button>
               )}
            </div>
            
            <div className="mt-6 flex items-start gap-3 bg-brand-cream p-4 rounded-lg">
              <Info className="h-5 w-5 text-brand-green flex-shrink-0 mt-0.5" />
              <p className="text-sm text-brand-charcoal">
                Need a specific size or custom logo printing? We manufacture bags exactly to your requirements. 
                Use the quote button above to share your specifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

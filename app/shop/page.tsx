'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types';
import { Search, Filter, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FALLBACK_PRODUCTS } from '@/lib/data';

export default function ShopPage() {
  const [products, setProducts] = React.useState<Product[]>(FALLBACK_PRODUCTS);
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const categories = Array.from(new Set(FALLBACK_PRODUCTS.map(p => p.category)));

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="font-heading text-4xl font-bold text-brand-charcoal mb-2">Our Products</h1>
            <p className="text-muted-foreground">Browse our collection of premium bags for your business.</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search bags..." 
                className="pl-9 w-full md:w-[250px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-8 hidden lg:block">
            <div>
              <h3 className="font-semibold text-brand-charcoal mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className={`text-sm hover:text-brand-green transition-colors ${selectedCategory === null ? 'text-brand-green font-medium' : 'text-muted-foreground'}`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-sm hover:text-brand-green transition-colors capitalize ${selectedCategory === cat ? 'text-brand-green font-medium' : 'text-muted-foreground'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-white border border-border rounded-xl">
                <p className="text-lg text-muted-foreground mb-4">No products found matching your criteria.</p>
                <Button onClick={() => { setSearch(''); setSelectedCategory(null); }}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Link 
                    key={product.id} 
                    href={`/shop/${product.slug}`}
                    className="group bg-white border border-border/60 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="relative aspect-square bg-muted">
                      {product.images[0] && (
                         <Image 
                           src={product.images[0]} 
                           alt={product.name}
                           fill
                           className="object-cover group-hover:scale-105 transition-transform duration-500"
                           referrerPolicy="no-referrer"
                         />
                      )}
                      {product.is_customizable && (
                        <div className="absolute top-3 left-3 bg-brand-gold text-brand-charcoal text-xs font-bold px-2 py-1 rounded-sm shadow-sm">
                          Customizable
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="text-xs text-muted-foreground capitalize mb-1">{product.category}</div>
                      <h3 className="font-heading font-semibold text-lg text-brand-charcoal mb-2 line-clamp-1 group-hover:text-brand-green transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-4">
                        <div className="font-medium text-brand-charcoal">
                          {product.price ? `₹${product.price} / pc` : 'Bulk Quote Only'}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-brand-cream flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-colors">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Product, Category } from '@/types';
import { getProducts, getCategories } from '@/lib/db/services';
import { getPricing, formatInr } from '@/lib/utils';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ShopPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadShopData() {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          getProducts({ status: 'published' }),
          getCategories()
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShopData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory 
      ? p.category.toLowerCase() === selectedCategory.toLowerCase() 
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-border pb-8">
          <div>
            <span className="text-sm font-medium text-brand-green/80 mb-2 block">Product catalogue</span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-charcoal">Our bag collection</h1>
            <p className="text-muted-foreground text-sm mt-1">Wholesale pricing for bulk custom printed carry bags & luxury packaging.</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-9 w-full md:w-[260px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {selectedCategory && (
              <Button variant="outline" size="sm" onClick={() => setSelectedCategory(null)}>
                Clear Filter ({selectedCategory})
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Filter Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white border border-border rounded-xl p-5 shadow-xs">
              <h3 className="font-semibold text-sm text-brand-charcoal mb-4 border-b border-border pb-2">
                Categories
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      selectedCategory === null 
                        ? 'bg-brand-green text-white font-bold' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    All Catalog Items ({products.length})
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => setSelectedCategory(cat.slug || cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex justify-between items-center ${
                        (selectedCategory?.toLowerCase() === cat.slug?.toLowerCase() || selectedCategory?.toLowerCase() === cat.name?.toLowerCase())
                          ? 'bg-brand-green text-white font-bold' 
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="capitalize">{cat.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="p-16 text-center text-muted-foreground animate-pulse">Loading catalog...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-border rounded-2xl p-8">
                <p className="text-base text-muted-foreground mb-4">No products found matching your search criteria.</p>
                <Button onClick={() => { setSearch(''); setSelectedCategory(null); }}>Reset All Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Link 
                    key={product.id} 
                    href={`/shop/${product.slug}`}
                    className="group bg-white border border-border/80 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="relative aspect-square bg-slate-50 dark:bg-slate-800/40 p-4 flex items-center justify-center overflow-hidden">
                      {product.images && product.images[0] ? (
                         <Image 
                           src={product.images[0]} 
                           alt={product.name}
                           fill
                           className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                           referrerPolicy="no-referrer"
                         />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                          MS TRADERS
                        </div>
                      )}
                      {product.is_customizable && (
                        <div className="absolute top-3 left-3 bg-brand-gold text-brand-charcoal text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                          Custom Print Available
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] font-medium text-brand-green/80 mb-1">
                          {product.category}
                        </div>
                        <h3 className="font-heading font-bold text-base text-brand-charcoal mb-2 line-clamp-1 group-hover:text-brand-green transition-colors">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                            {product.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                        <div className="font-extrabold text-brand-charcoal text-sm">
                          {getPricing(product).effective !== null ? (
                            <>
                              {formatInr(getPricing(product).effective)} / pc
                              {getPricing(product).compareAt !== null && (
                                <span className="ml-1.5 text-xs font-normal text-muted-foreground line-through">{formatInr(getPricing(product).compareAt)}</span>
                              )}
                            </>
                          ) : 'Bulk Custom Quote'}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-colors">
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

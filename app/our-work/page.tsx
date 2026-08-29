'use client';

import * as React from 'react';
import Image from 'next/image';
import { Maximize2, X, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { getGalleryItems } from '@/lib/supabase/services';
import { GalleryItem } from '@/types';

export default function OurWorkPage() {
  const [items, setItems] = React.useState<GalleryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('all');
  const [selectedImage, setSelectedImage] = React.useState<GalleryItem | null>(null);

  React.useEffect(() => {
    async function fetchGallery() {
      setLoading(true);
      try {
        const data = await getGalleryItems();
        setItems(data);
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category || 'general').filter(Boolean)))];

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => (item.category || 'general').toLowerCase() === filter.toLowerCase());

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-2 block">Portfolio Showcase</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-charcoal mb-4">Our Manufacturing Portfolio</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of custom printed paper bags, non-woven bags, and luxury boutique packaging manufactured for clients across India.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                filter === cat 
                  ? 'bg-brand-green text-white shadow-xs' 
                  : 'bg-white text-slate-700 border border-border hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Grid */}
        {loading ? (
          <div className="p-16 text-center text-muted-foreground animate-pulse">Loading showcase gallery from Supabase...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white border border-border rounded-2xl p-8">
            <p className="text-muted-foreground">No showcase photos found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="relative group rounded-2xl overflow-hidden cursor-pointer bg-slate-100 border border-border shadow-xs hover:shadow-md transition-all flex flex-col"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image 
                    src={item.image_url} 
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <div className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white">
                      <Maximize2 className="h-4 w-4" />
                    </div>
                    <span className="text-brand-gold text-[10px] font-extrabold uppercase tracking-wider mb-1">{item.category}</span>
                    <h3 className="text-white font-heading text-lg font-bold">{item.title}</h3>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <div className="text-[10px] font-bold text-brand-green uppercase tracking-wider">{item.category || 'Showcase'}</div>
                  <h3 className="font-bold text-sm text-brand-charcoal">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl bg-transparent border-none p-0 shadow-none flex flex-col items-center justify-center">
          <DialogTitle className="sr-only">Image preview</DialogTitle>
          {selectedImage && (
            <div className="relative w-full max-h-[85vh] flex items-center justify-center bg-black/90 rounded-2xl overflow-hidden p-2">
              <Image 
                src={selectedImage.image_url} 
                alt={selectedImage.title}
                width={1200}
                height={900}
                unoptimized
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-center">
                <h3 className="text-white font-heading text-xl font-bold">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-slate-300 text-xs mt-1 max-w-lg mx-auto">{selectedImage.description}</p>
                )}
              </div>
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

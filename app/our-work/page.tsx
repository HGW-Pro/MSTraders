'use client';

import * as React from 'react';
import Image from 'next/image';
import { Maximize2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const GALLERY_ITEMS = [
  { id: 1, category: 'designer', title: 'Luxury Retail Bag', image: 'https://picsum.photos/seed/g1/800/1000' },
  { id: 2, category: 'kraft', title: 'Restaurant Takeaway', image: 'https://picsum.photos/seed/g2/800/800' },
  { id: 3, category: 'non-woven', title: 'Supermarket D-Cut', image: 'https://picsum.photos/seed/g3/1000/800' },
  { id: 4, category: 'paper', title: 'Pharmacy Prescription Bag', image: 'https://picsum.photos/seed/g4/800/1200' },
  { id: 5, category: 'designer', title: 'Corporate Event Gift Bag', image: 'https://picsum.photos/seed/g5/1200/800' },
  { id: 6, category: 'kraft', title: 'Coffee Shop Carry Bag', image: 'https://picsum.photos/seed/g6/800/800' },
  { id: 7, category: 'non-woven', title: 'Retail W-Cut Bag', image: 'https://picsum.photos/seed/g7/800/1000' },
  { id: 8, category: 'custom', title: 'Custom Printed Foil Logo', image: 'https://picsum.photos/seed/g8/1000/1000' },
];

const CATEGORIES = ['all', 'paper', 'kraft', 'non-woven', 'designer', 'custom'];

export default function OurWorkPage() {
  const [filter, setFilter] = React.useState('all');
  const [selectedImage, setSelectedImage] = React.useState<typeof GALLERY_ITEMS[0] | null>(null);

  const filteredItems = filter === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === filter);

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-charcoal mb-6">Our Work</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of premium bags we've manufactured for brands and businesses across India.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === cat 
                  ? 'bg-brand-green text-white' 
                  : 'bg-brand-cream text-brand-charcoal hover:bg-brand-green/10'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer bg-muted border border-border"
              onClick={() => setSelectedImage(item)}
            >
              <Image 
                src={item.image} 
                alt={item.title}
                width={800}
                height={800} // Dynamic aspect ratio handled by next/image + columns
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white">
                  <Maximize2 className="h-5 w-5" />
                </div>
                <span className="text-brand-gold text-xs font-bold uppercase tracking-wider mb-1">{item.category}</span>
                <h3 className="text-white font-heading text-xl font-bold">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-5xl bg-transparent border-none p-0 shadow-none flex flex-col items-center justify-center">
          <DialogTitle className="sr-only">Image preview</DialogTitle>
          {selectedImage && (
            <div className="relative w-full max-h-[85vh] flex items-center justify-center">
              <img 
                src={selectedImage.image} 
                alt={selectedImage.title}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 rounded-b-lg text-center">
                <h3 className="text-white font-heading text-2xl font-bold">{selectedImage.title}</h3>
                <p className="text-gray-300 capitalize mt-2">{selectedImage.category}</p>
              </div>
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"
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

'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { getProductBySlug } from '@/lib/supabase/services';
import { useCartStore } from '@/lib/store';
import { ChevronRight, Info, ShoppingCart, MessageSquare, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '@/components/settings-provider';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const { settings } = useSettings();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [orderQty, setOrderQty] = React.useState<number>(100);

  React.useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await getProductBySlug(unwrappedParams.slug);
        setProduct(data);
        if (data && data.moq) {
          setOrderQty(data.moq);
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [unwrappedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-32 flex items-center justify-center text-muted-foreground animate-pulse">
        Loading product specification from Supabase...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-32 text-center">
        <h1 className="font-heading text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The requested product could not be located in our catalog.</p>
        <Button asChild><Link href="/shop">Return to Shop Catalog</Link></Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, orderQty);
    toast.success(`Added ${orderQty} units of ${product.name} to cart`);
  };

  return (
    <div className="bg-background min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-xs text-muted-foreground mb-8">
          <Link href="/shop" className="hover:text-brand-green transition-colors font-medium">Catalog</Link>
          <ChevronRight className="h-3.5 w-3.5 mx-2" />
          <span className="capitalize">{product.category}</span>
          <ChevronRight className="h-3.5 w-3.5 mx-2" />
          <span className="text-brand-charcoal font-bold truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/40 border border-border shadow-xs p-6 flex items-center justify-center">
              {product.images && product.images[selectedImageIndex] ? (
                <Image 
                  src={product.images[selectedImageIndex]} 
                  alt={product.name}
                  fill
                  className="object-contain p-2 drop-shadow-md"
                  priority
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                  MS TRADERS
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx ? 'border-brand-green ring-2 ring-brand-green/20' : 'border-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-brand-green font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                {product.category}
              </span>
              {product.is_customizable && (
                <span className="bg-brand-gold text-brand-charcoal text-[10px] px-2.5 py-0.5 rounded font-extrabold uppercase tracking-wider">
                  Custom Logo Printing
                </span>
              )}
            </div>
            
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-charcoal mb-3">
              {product.name}
            </h1>
            
            <div className="text-2xl font-extrabold text-brand-green mb-6">
              {product.price ? `₹${product.price} / piece` : 'Wholesale Bulk Pricing Only'}
            </div>
            
            <p className="text-slate-600 text-base mb-8 leading-relaxed">
              {product.description || 'Wholesale high quality custom printed bag solution.'}
            </p>

            <div className="space-y-6 mb-8 border-t border-b border-border py-6">
              {/* Specifications */}
              <div className="grid grid-cols-2 gap-y-4 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">Material / Fabric</span>
                  <span className="font-bold text-slate-800">{product.material || 'Premium Kraft Paper'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Minimum Order Qty (MOQ)</span>
                  <span className="font-bold text-brand-green">{product.moq || 100} pieces</span>
                </div>
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <span className="text-slate-500 block mb-1">Standard Sizes</span>
                    <span className="font-bold text-slate-800">{product.sizes.join(', ')}</span>
                  </div>
                )}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <span className="text-slate-500 block mb-1">Available Shades</span>
                    <span className="font-bold text-slate-800">{product.colors.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Quantity Picker */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-800 mb-2">Order Quantity (Units)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    min={product.moq || 50}
                    step={50}
                    value={orderQty}
                    onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-32 h-10 px-3 border border-input rounded-md text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                  <span className="text-xs text-muted-foreground font-semibold">Min order: {product.moq || 100} units</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              {!settings.enable_direct_cart_checkout ? (
                <>
                  <Button 
                    size="lg" 
                    className="bg-brand-green text-white hover:bg-brand-green/90 font-bold h-12 flex-1 shadow-md"
                    asChild
                  >
                    <Link href={`/customize?product=${product.slug}&qty=${orderQty}`}>
                      Request Wholesale Quote ({orderQty} Units)
                    </Link>
                  </Button>

                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-emerald-700 text-emerald-800 hover:bg-emerald-50 font-bold h-12 flex-1" 
                    asChild
                  >
                    <a 
                      href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hi MS TRADERS, I am interested in ordering ${orderQty} units of ${product.name} (${product.material || ''}). Please send price quotation.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="h-5 w-5 text-emerald-600" />
                      <span>Inquire on WhatsApp</span>
                    </a>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    onClick={handleAddToCart}
                    className="bg-brand-green text-white hover:bg-brand-green/90 font-bold h-12 flex-1 shadow-xs"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add {orderQty} Units to Cart
                  </Button>

                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white font-bold h-12 flex-1" 
                    asChild
                  >
                    <Link href={`/customize?product=${product.slug}&qty=${orderQty}`}>
                      Request Custom Quote
                    </Link>
                  </Button>
                </>
              )}
            </div>
            
            <div className="mt-6 flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <Info className="h-5 w-5 text-brand-green flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">
                Need a specific size or custom logo printing? MS TRADERS supplies custom bags tailored exactly to your brand guidelines. 
                Contact our sales team directly on WhatsApp for sample dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

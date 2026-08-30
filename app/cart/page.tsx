
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ShieldAlert, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '@/components/settings-provider';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { settings } = useSettings();
  const mounted = React.useSyncExternalStore(() => () => {}, () => true, () => false);

  if (!mounted) return null; // Prevent hydration mismatch

  const subtotal = items.reduce((total, item) => {
    const unitPrice = item.product.sale_price ?? item.product.price ?? 0;
    return total + (unitPrice * item.quantity);
  }, 0);
  const isDirectCheckoutDisabled = !settings.enable_direct_cart_checkout;
  const hasItemsRequiringQuote = items.some(item => !item.product.price) || isDirectCheckoutDisabled;
  
  if (items.length === 0) {
    return (
      <div className="bg-background min-h-screen pt-24 pb-32">
        <div className="container mx-auto px-4 text-center max-w-md">
          <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="h-10 w-10 text-brand-green" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-brand-charcoal mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added any products to your cart yet.</p>
          <Button size="lg" className="w-full" asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-charcoal mb-10">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-border text-sm font-semibold text-muted-foreground">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>
            
            {items.map((item) => (
              <div key={item.product.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-6 border-b border-border/50">
                <div className="col-span-1 sm:col-span-6 flex gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      fill 
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-charcoal line-clamp-2">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize mt-1">{item.product.category}</p>
                    <div className="mt-2 text-sm font-medium">
                      {item.product.price ? `₹${item.product.price}` : 'Bulk Quote Required'}
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1 sm:col-span-3 flex justify-start sm:justify-center mt-4 sm:mt-0">
                  <div className="flex items-center border border-border rounded-md">
                    <button 
                      className="p-2 hover:bg-muted transition-colors"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="w-10 text-center font-medium text-sm">
                      {item.quantity}
                    </div>
                    <button 
                      className="p-2 hover:bg-muted transition-colors"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="col-span-1 sm:col-span-3 flex justify-between sm:justify-end items-center mt-4 sm:mt-0">
                  <div className="font-bold text-brand-charcoal">
                    {item.product.price ? `₹${item.product.price * item.quantity}` : '-'}
                  </div>
                  <button 
                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors sm:ml-4"
                    onClick={() => {
                      removeItem(item.product.id);
                      toast.success('Item removed from cart');
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-4">
              <Button variant="ghost" onClick={clearCart} className="text-muted-foreground">
                Clear Cart
              </Button>
              <Button variant="outline" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-brand-cream border border-border/50 rounded-2xl p-6 md:p-8 sticky top-24">
              <h2 className="font-heading text-2xl font-bold text-brand-charcoal mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6 pb-6 border-b border-border/60">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-brand-charcoal">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-brand-charcoal">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium text-brand-charcoal">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-8">
                <span className="font-semibold text-brand-charcoal">Estimated Total</span>
                <span className="font-bold text-2xl text-brand-charcoal">₹{subtotal}</span>
              </div>
              
              {isDirectCheckoutDisabled ? (
                 <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
                    <p className="font-bold flex items-center gap-1.5 text-amber-900 text-sm">
                       <FileText className="h-4 w-4 text-amber-700" /> B2B Wholesale Quotation Mode
                    </p>
                    <p className="leading-relaxed">
                       Direct online order checkout is currently turned off. Click below to submit your cart items directly as a formal B2B Wholesale Quotation Request to MS TRADERS!
                    </p>
                 </div>
              ) : hasItemsRequiringQuote ? (
                 <div className="mb-6 p-4 bg-white rounded-lg border border-border text-sm text-brand-charcoal">
                    <p className="font-semibold mb-1 flex items-center gap-2">
                       <ShoppingBag className="h-4 w-4 text-brand-gold" /> Bulk Items Included
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                       Your cart contains custom bulk items. Proceeding will send a quote request directly to MS TRADERS sales team.
                    </p>
                 </div>
              ) : null}

              <Button size="lg" className="w-full bg-brand-green text-white hover:bg-brand-green/90 font-bold shadow-md" asChild>
                <Link href={hasItemsRequiringQuote ? "/customize?from_cart=true" : "/checkout"}>
                  {isDirectCheckoutDisabled ? "SUBMIT CART AS WHOLESALE QUOTE" : hasItemsRequiringQuote ? "REQUEST CART QUOTE" : "PROCEED TO CHECKOUT"} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import * as React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const mounted = React.useSyncExternalStore(() => () => {}, () => true, () => false);
  const [step, setStep] = React.useState(1);
  const [isProcessing, setIsProcessing] = React.useState(false);

  if (!mounted) return null;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    // Simulate API delay
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3); // Success step
      clearCart();
      toast.success('Order placed successfully!');
    }, 2000);
  };

  if (step === 3) {
    return (
      <div className="bg-background min-h-screen pt-24 pb-32">
        <div className="container mx-auto px-4 text-center max-w-md">
          <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-12 w-12 text-brand-green" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-brand-charcoal mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. We&apos;ve sent a confirmation email with your order details.
          </p>
          <div className="space-y-4">
            <Button size="lg" className="w-full" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty and not on success step
  if (items.length === 0 && step !== 3) {
    return (
      <div className="bg-background min-h-screen pt-24 text-center">
        <h1 className="font-heading text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button asChild><Link href="/shop">Go to Shop</Link></Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex items-center gap-2 mb-10 text-sm font-medium">
          <Link href="/cart" className="text-muted-foreground hover:text-brand-charcoal transition-colors">Cart</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className={step === 1 ? 'text-brand-charcoal' : 'text-muted-foreground'}>Information</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className={step === 2 ? 'text-brand-charcoal' : 'text-muted-foreground'}>Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-brand-charcoal mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="you@example.com" />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-brand-charcoal mb-6">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input id="company" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="Street address, P.O. box, company name, c/o" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="apartment">Apartment, suite, etc. (Optional)</Label>
                      <Input id="apartment" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State / Province</Label>
                      <Input id="state" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal">Postal / Zip Code</Label>
                      <Input id="postal" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" />
                    </div>
                  </div>
                </div>

                <Button size="lg" className="w-full" onClick={() => setStep(2)}>
                  Continue to Payment
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-brand-charcoal mb-6">Payment Method</h2>
                  <div className="bg-white border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Secure Credit Card Payment</span>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cc-name">Name on Card</Label>
                        <Input id="cc-name" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cc-number">Card Number</Label>
                        <Input id="cc-number" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cc-exp">Expiration (MM/YY)</Label>
                          <Input id="cc-exp" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cc-cvc">CVC</Label>
                          <Input id="cc-cvc" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" size="lg" onClick={() => setStep(1)} disabled={isProcessing}>
                    Back
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 bg-brand-charcoal text-white hover:bg-brand-charcoal/90" 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Pay ₹${subtotal}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 lg:p-8 sticky top-24">
              <h3 className="font-heading text-xl font-bold text-brand-charcoal mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-border/60 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white border border-border/50 flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="object-cover w-full h-full" />
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-brand-charcoal text-white rounded-full text-xs flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 text-sm">
                      <h4 className="font-medium text-brand-charcoal line-clamp-2">{item.product.name}</h4>
                      <div className="text-muted-foreground mt-1 capitalize">{item.product.category}</div>
                    </div>
                    <div className="font-medium text-sm">
                      ₹{(item.product.price || 0) * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-border/60">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="font-medium">Included</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-brand-charcoal">Total</span>
                <span className="font-bold text-brand-charcoal">₹{subtotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, ChevronRight, Building2, Truck, FileCheck, Phone, ShieldCheck, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { createOrder } from '@/lib/supabase/services';
import { useSettings } from '@/components/settings-provider';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const { settings } = useSettings();
  const mounted = React.useSyncExternalStore(() => () => {}, () => true, () => false);

  const [step, setStep] = React.useState(1);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [orderNumber, setOrderNumber] = React.useState('');

  const [form, setForm] = React.useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    gstin: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    paymentMethod: 'invoice', // invoice, cod, whatsapp
    notes: ''
  });

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.firstName || !form.phone || !form.address || !form.city || !form.postalCode) {
      toast.error('Please complete all required customer & shipping fields');
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    try {
      const orderItemsData = items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        unit_price: item.product.price || 0,
        quantity: item.quantity,
        total_price: (item.product.price || 0) * item.quantity,
        variant_details: item.variantId ? { variantId: item.variantId } : null
      }));

      const shippingFee = subtotal > 5000 ? 0 : 250;
      const taxAmount = Math.round(subtotal * 0.18);
      const grandTotal = subtotal + shippingFee + taxAmount;

      const created = await createOrder({
        customer_name: `${form.firstName} ${form.lastName}`.trim(),
        company_name: form.company || undefined,
        email: form.email,
        phone: form.phone,
        shipping_address: {
          firstName: form.firstName,
          lastName: form.lastName,
          company: form.company,
          address: form.address,
          apartment: form.apartment,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          phone: form.phone
        },
        payment_method: form.paymentMethod,
        subtotal: subtotal,
        tax: taxAmount,
        shipping_fee: shippingFee,
        total: grandTotal,
        items: orderItemsData,
        notes: form.notes || undefined
      });

      if (created) {
        setOrderNumber(created.order_number);
        setStep(3);
        clearCart();
        toast.success('Order request submitted successfully!');
      } else {
        toast.error('Failed to process order. Please try again or order via WhatsApp.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error placing order request');
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 3) {
    return (
      <div className="bg-background min-h-screen pt-24 pb-32">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-300">
            <CheckCircle2 className="h-10 w-10 text-brand-green" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-brand-charcoal mb-3">Order Request Submitted!</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Thank you for placing your order with MS TRADERS. Your official order manifest has been recorded in our fulfillment database.
          </p>

          <div className="bg-white border border-border p-6 rounded-2xl mb-8 shadow-xs text-left space-y-3 text-xs">
             <div className="flex justify-between items-center border-b border-border pb-3">
               <span className="text-slate-500 font-semibold uppercase tracking-wider">Order Reference #</span>
               <span className="text-xl font-extrabold text-brand-charcoal font-mono">{orderNumber}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-slate-500">Customer Name:</span>
               <span className="font-bold text-slate-800">{form.firstName} {form.lastName}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-slate-500">Payment Terms:</span>
               <span className="font-bold text-slate-800 uppercase">{form.paymentMethod.replace('_', ' ')}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-slate-500">Dispatch Location:</span>
               <span className="font-semibold text-slate-800">{form.city}, {form.state}</span>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold" asChild>
               <a 
                href={`https://wa.me/${settings.whatsapp}?text=Hi%20MS%20TRADERS,%20I%20have%20submitted%20Order%20%23${orderNumber}.%20Please%20send%20proforma%20invoice.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
               >
                 <MessageSquare className="h-5 w-5" />
                 <span>Confirm on WhatsApp</span>
               </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/shop">Back to Shop Catalog</Link>
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
        <Button asChild><Link href="/shop">Browse Bag Catalog</Link></Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex items-center gap-2 mb-10 text-xs font-bold uppercase tracking-wider">
          <Link href="/cart" className="text-muted-foreground hover:text-brand-charcoal transition-colors">Cart</Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className={step === 1 ? 'text-brand-green font-extrabold' : 'text-muted-foreground'}>Shipping Details</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className={step === 2 ? 'text-brand-green font-extrabold' : 'text-muted-foreground'}>Payment & Confirmation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            {step === 1 && (
              <form onSubmit={handleNextToPayment} className="space-y-8 animate-in fade-in">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-brand-charcoal mb-4 flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-brand-green" /> Contact & Business Info
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="purchasing@company.com" 
                        value={form.email}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="company">Company / Business Name</Label>
                      <Input 
                        id="company" 
                        name="company"
                        placeholder="Enterprise Brand Pvt Ltd" 
                        value={form.company}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="gstin">GSTIN (Optional for Business Invoice)</Label>
                      <Input 
                        id="gstin" 
                        name="gstin"
                        placeholder="24AAAAA0000A1Z5" 
                        value={form.gstin}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-brand-charcoal mb-4 flex items-center gap-2">
                    <Truck className="h-6 w-6 text-brand-green" /> Delivery / Factory Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label htmlFor="address">Street Address / Warehouse Unit *</Label>
                      <Input 
                        id="address" 
                        name="address"
                        placeholder="Plot / Building No., Industrial Area, Street Name" 
                        value={form.address}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label htmlFor="apartment">Apartment, Suite, Landmark (Optional)</Label>
                      <Input 
                        id="apartment" 
                        name="apartment"
                        value={form.apartment}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city" 
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="state">State *</Label>
                      <Input 
                        id="state" 
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="postalCode">Pincode *</Label>
                      <Input 
                        id="postalCode" 
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Contact Phone Number *</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        value={form.phone}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full bg-brand-green text-white hover:bg-brand-green/90 font-bold">
                  Continue to Payment Method
                </Button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-brand-charcoal mb-2">Select B2B Payment Term</h2>
                  <p className="text-xs text-muted-foreground mb-6">Choose how you would like to complete your purchase or receive your proforma invoice.</p>
                  
                  <div className="space-y-4">
                    {[
                      {
                        id: 'invoice',
                        title: 'Proforma Invoice & Bank Transfer (NEFT / RTGS)',
                        desc: 'We will dispatch an official Proforma Invoice with bank details for bank transfer approval.'
                      },
                      {
                        id: 'cod',
                        title: 'Cash / Pay on Delivery / Pickup',
                        desc: 'Pay cash upon delivery or factory dispatch inspection.'
                      },
                      {
                        id: 'whatsapp',
                        title: 'WhatsApp Direct Invoice Confirmation',
                        desc: 'Receive immediate order summary and payment link on your registered WhatsApp.'
                      }
                    ].map((method) => (
                      <label 
                        key={method.id}
                        onClick={() => setForm(p => ({ ...p, paymentMethod: method.id }))}
                        className={`p-5 rounded-xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                          form.paymentMethod === method.id 
                            ? 'border-brand-green bg-emerald-50/50 ring-1 ring-brand-green' 
                            : 'border-border bg-white hover:border-slate-300'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value={method.id}
                          checked={form.paymentMethod === method.id}
                          onChange={() => {}}
                          className="mt-1 text-brand-green focus:ring-brand-green"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{method.title}</div>
                          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{method.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Order Dispatch Notes (Optional)</Label>
                  <Textarea 
                    id="notes" 
                    name="notes"
                    placeholder="Provide special instructions, preferred transport provider, or batch packaging requests..."
                    value={form.notes}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" size="lg" onClick={() => setStep(1)} disabled={isProcessing}>
                    Back
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 bg-brand-charcoal text-white hover:bg-slate-800 font-bold" 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Submitting Order to Supabase...' : 'Confirm & Place Purchase Order'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-border rounded-2xl p-6 lg:p-8 sticky top-24 shadow-xs">
              <h3 className="font-heading text-xl font-bold text-brand-charcoal mb-6 border-b border-border pb-4">
                Order Items Summary
              </h3>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-slate-100 border border-border flex-shrink-0">
                      {item.product.images[0] ? (
                        <Image src={item.product.images[0]} fill alt={item.product.name} className="object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold">BAG</div>
                      )}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-green text-white rounded-full text-[10px] font-bold flex items-center justify-center z-10">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 text-xs">
                      <h4 className="font-bold text-brand-charcoal line-clamp-2">{item.product.name}</h4>
                      <div className="text-muted-foreground mt-0.5 capitalize">{item.product.category}</div>
                    </div>
                    <div className="font-bold text-xs text-brand-green">
                      ₹{((item.product.price || 0) * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2.5 text-xs mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Shipping Fee:</span>
                  <span className="font-semibold text-slate-800">{subtotal > 5000 ? 'FREE' : '₹250'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST Tax (18%):</span>
                  <span className="font-semibold text-slate-800">₹{Math.round(subtotal * 0.18).toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-brand-charcoal">Grand Total:</span>
                <span className="font-extrabold text-brand-green">
                  ₹{(subtotal + (subtotal > 5000 ? 0 : 250) + Math.round(subtotal * 0.18)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

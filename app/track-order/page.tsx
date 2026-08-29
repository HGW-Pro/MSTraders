'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Package, Clock, Truck, CheckCircle2, AlertCircle, Phone, ArrowLeft, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getOrderByNumberAndPhone } from '@/lib/supabase/services';
import { Order, OrderStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'PENDING', label: 'Order Placed', desc: 'Order request received' },
  { status: 'CONFIRMED', label: 'Confirmed', desc: 'Verified by MS TRADERS sales team' },
  { status: 'PROCESSING', label: 'In Production', desc: 'Paper cutting & custom printing' },
  { status: 'READY_TO_SHIP', label: 'Ready for Dispatch', desc: 'Quality inspected & packed' },
  { status: 'SHIPPED', label: 'In Transit', desc: 'Handed over to transport/courier' },
  { status: 'DELIVERED', label: 'Delivered', desc: 'Successfully fulfilled' },
];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);
  const [order, setOrder] = React.useState<Order | null>(null);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast.error('Please enter your Order Reference Number');
      return;
    }
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const foundOrder = await getOrderByNumberAndPhone(orderNumber, phone);
      setOrder(foundOrder);
      if (foundOrder) {
        toast.success(`Order ${foundOrder.order_number} found`);
      } else {
        toast.error('No matching order found for the provided details.');
      }
    } catch (err) {
      toast.error('Could not load order status');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (currentStatus: OrderStatus) => {
    if (currentStatus === 'CANCELLED') return -1;
    return STATUS_STEPS.findIndex(s => s.status === currentStatus);
  };

  return (
    <div className="bg-background min-h-screen py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-green transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Storefront
          </Link>
        </div>

        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-2 block">
            Public Order Desk
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-charcoal mb-3">
            Track Wholesale Order Status
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Check the real-time production, custom printing, or dispatch status of your paper and non-woven bag orders.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-xs mb-10">
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Reference Number *</Label>
                <Input 
                  id="orderNumber" 
                  placeholder="e.g. MST-ORD-20260829-1001" 
                  value={orderNumber} 
                  onChange={(e) => setOrderNumber(e.target.value)} 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Registered Phone Number *</Label>
                <Input 
                  id="phone" 
                  placeholder="e.g. 9131268724" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-brand-green hover:bg-emerald-700 text-white font-bold h-11">
              {loading ? 'Querying Database...' : 'Track Order Status'}
            </Button>
          </form>
        </div>

        {/* Results */}
        {searched && !loading && !order && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-amber-600 mx-auto" />
            <h3 className="font-heading text-lg font-bold text-amber-900">Order Not Found</h3>
            <p className="text-xs text-amber-800 max-w-md mx-auto">
              We could not find an order matching reference number <strong>{orderNumber}</strong> and phone number <strong>{phone}</strong>. Please verify your invoice details or contact our dispatch desk.
            </p>
          </div>
        )}

        {order && (
          <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Order Reference</span>
                <h2 className="font-heading text-2xl font-bold text-brand-charcoal">{order.order_number}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div className="sm:text-right">
                <span className={cn(
                  "inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold border",
                  order.status === 'DELIVERED' && "bg-emerald-50 text-emerald-800 border-emerald-300",
                  order.status === 'SHIPPED' && "bg-blue-50 text-blue-800 border-blue-300",
                  order.status === 'PROCESSING' && "bg-amber-50 text-amber-800 border-amber-300",
                  order.status === 'CONFIRMED' && "bg-teal-50 text-teal-800 border-teal-300",
                  order.status === 'PENDING' && "bg-slate-100 text-slate-800 border-slate-300",
                  order.status === 'CANCELLED' && "bg-red-50 text-red-800 border-red-300",
                )}>
                  {order.status.replace(/_/g, ' ')}
                </span>
                <p className="text-xs font-bold text-brand-green mt-2">
                  Total Amount: ₹{(order.total || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Status Timeline */}
            <div>
              <h3 className="font-heading text-base font-bold text-brand-charcoal mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-green" /> Production & Delivery Status Timeline
              </h3>

              {order.status === 'CANCELLED' ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700">
                  This order has been marked as <strong>CANCELLED</strong>. Please contact our support team for any queries.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {STATUS_STEPS.map((step, idx) => {
                    const currentIndex = getStepIndex(order.status);
                    const isCompleted = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <div 
                        key={step.status} 
                        className={cn(
                          "p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between",
                          isCurrent && "border-brand-green bg-emerald-50/70 ring-2 ring-brand-green/20",
                          isCompleted && !isCurrent && "border-slate-200 bg-slate-50 opacity-80",
                          !isCompleted && "border-slate-100 bg-white opacity-40"
                        )}
                      >
                        <div className="mb-2">
                          {isCompleted ? (
                            <CheckCircle2 className={cn("h-6 w-6 mx-auto", isCurrent ? "text-brand-green" : "text-emerald-600")} />
                          ) : (
                            <div className="h-6 w-6 rounded-full border-2 border-slate-300 mx-auto" />
                          )}
                        </div>
                        <div>
                          <p className={cn("text-xs font-bold leading-tight", isCurrent ? "text-brand-green" : "text-slate-700")}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1 leading-tight hidden sm:block">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-heading text-base font-bold text-brand-charcoal mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-brand-green" /> Ordered Items ({order.order_items?.length || 0})
              </h3>
              <div className="border border-border rounded-xl divide-y divide-border overflow-hidden text-xs">
                {order.order_items?.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-brand-charcoal">{item.product_name}</p>
                      {item.variant_details && (
                        <p className="text-muted-foreground text-[11px] mt-0.5">
                          {Object.entries(item.variant_details).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <p className="font-bold text-slate-800">{item.quantity} units</p>
                      <p className="text-muted-foreground">₹{item.unit_price} / unit</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Shipping info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border text-xs">
              <div className="space-y-1.5">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-brand-green" /> Customer Info
                </p>
                <p className="font-semibold text-brand-charcoal">{order.customer_name}</p>
                {order.company_name && <p className="text-muted-foreground">{order.company_name}</p>}
                <p className="text-muted-foreground">{order.email}</p>
                <p className="text-muted-foreground">{order.phone}</p>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-brand-green" /> Shipping Address
                </p>
                {order.shipping_address ? (
                  <div className="text-muted-foreground leading-relaxed">
                    <p className="font-medium text-slate-800">
                      {order.shipping_address.firstName} {order.shipping_address.lastName}
                    </p>
                    <p>{order.shipping_address.address} {order.shipping_address.apartment}</p>
                    <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postalCode}</p>
                    <p>Phone: {order.shipping_address.phone}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No physical shipping address recorded</p>
                )}
              </div>
            </div>

            {/* Dispatch Desk CTA */}
            <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between flex-wrap gap-3 text-xs border border-slate-200">
              <span className="text-muted-foreground">
                Questions about dispatch or delivery schedule?
              </span>
              <a 
                href="https://wa.me/919131268724" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-brand-green hover:underline"
              >
                <Phone className="h-3.5 w-3.5" /> Contact Dispatch Desk on WhatsApp (+91 91312 68724)
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

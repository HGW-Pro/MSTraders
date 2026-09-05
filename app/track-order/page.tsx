'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Search, 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  Copy, 
  ExternalLink, 
  Printer, 
  Check, 
  PackageCheck,
  ShieldCheck,
  Sparkles,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getOrderByNumberAndPhone } from '@/lib/db/services';
import { Order, OrderStatus } from '@/types';
import { cn } from '@/lib/utils';

const TIMELINE_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { 
    status: 'PENDING', 
    label: 'Order Placed & Logged', 
    desc: 'Order reference generated and logged in MS TRADERS dispatch log.' 
  },
  { 
    status: 'CONFIRMED', 
    label: 'Order Confirmed & Specs Verified', 
    desc: 'GSM material, handle specifications, and custom printing approved by quality supervisor.' 
  },
  { 
    status: 'PREPARING', 
    label: 'Custom Printing & Manufacturing', 
    desc: 'Flexographic printing, cylinder setup, roll slitting & ultrasonic handle sealing in progress.' 
  },
  { 
    status: 'READY_FOR_DELIVERY', 
    label: 'Quality Inspected & Bale Packed', 
    desc: 'Goods inspected for tensile strength, counted into bundles & packed in moisture-proof bales.' 
  },
  { 
    status: 'OUT_FOR_DELIVERY', 
    label: 'Dispatched / In Transport', 
    desc: 'Shipment loaded onto transport vehicle / handed over to logistics carrier partner.' 
  },
  { 
    status: 'DELIVERED', 
    label: 'Delivered', 
    desc: 'Package delivered successfully to customer address.' 
  },
];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);
  const [order, setOrder] = React.useState<Order | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast.error('Please enter your Order or Quote Reference Number');
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
        toast.success(`Record ${foundOrder.order_number} retrieved`);
      } else {
        toast.error('No matching record found for the provided details.');
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
    const idx = TIMELINE_STEPS.findIndex(s => s.status === currentStatus);
    return idx >= 0 ? idx : 0;
  };

  const handleCopyAWB = (awb: string) => {
    navigator.clipboard.writeText(awb);
    setCopied(true);
    toast.success('Tracking / AWB Number copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatExpectedDate = (dateStr?: string | null, createdAt?: string) => {
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
      return dateStr;
    }
    // Fallback: Default 5-7 business days from created_at
    const base = createdAt ? new Date(createdAt) : new Date();
    base.setDate(base.getDate() + 5);
    return base.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-slate-50/70 min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-green transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Storefront
          </Link>
        </div>

        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-1.5 block">
            Public Fulfillment & Tracking Portal
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-charcoal mb-2">
            Track Order & Quote Status
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Live real-time status tracking with expected delivery date and logistics timeline.
          </p>
        </div>

        {/* Search Form Card */}
        <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="orderNumber" className="font-bold text-xs text-slate-800">Order or Quote Reference Number *</Label>
                <Input 
                  id="orderNumber" 
                  placeholder="e.g. MST-ORD-... or MST-QT-20260830-9588" 
                  value={orderNumber} 
                  onChange={(e) => setOrderNumber(e.target.value)} 
                  required
                  className="bg-slate-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="font-bold text-xs text-slate-800">Registered Phone Number *</Label>
                <Input 
                  id="phone" 
                  placeholder="e.g. 7067935252" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required
                  className="bg-slate-50/50"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-brand-green hover:bg-emerald-700 text-white font-bold h-11">
              {loading ? 'Querying Database...' : 'Track Status'}
            </Button>
          </form>
        </div>

        {/* Not Found Alert */}
        {searched && !loading && !order && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-amber-600 mx-auto" />
            <h3 className="font-heading text-lg font-bold text-amber-900">Record Not Found</h3>
            <p className="text-xs text-amber-800 max-w-md mx-auto">
              We could not find an order or quotation matching reference number <strong>{orderNumber}</strong> and phone number <strong>{phone}</strong>. Please check your reference code or contact our dispatch desk.
            </p>
          </div>
        )}

        {/* Order Tracking Dashboard */}
        {order && (
          <div className="space-y-6">
            {/* Amazon/Flipkart Style Expected Delivery Banner */}
            <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                      Reference: <span className="text-brand-charcoal">{order.order_number}</span>
                    </span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border uppercase tracking-wider",
                      order.status === 'DELIVERED' && "bg-emerald-100 text-emerald-800 border-emerald-300",
                      (order.status === 'OUT_FOR_DELIVERY' || order.status === 'READY_FOR_DELIVERY') && "bg-blue-100 text-blue-800 border-blue-300",
                      order.status === 'PREPARING' && "bg-amber-100 text-amber-800 border-amber-300",
                      order.status === 'CONFIRMED' && "bg-teal-100 text-teal-800 border-teal-300",
                      order.status === 'PENDING' && "bg-slate-100 text-slate-800 border-slate-300",
                      order.status === 'CANCELLED' && "bg-red-100 text-red-800 border-red-300",
                    )}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-charcoal flex items-center gap-2">
                    {order.status === 'DELIVERED' ? (
                      <span className="text-emerald-700">Delivered Successfully</span>
                    ) : order.status === 'CANCELLED' ? (
                      <span className="text-rose-700">Order Cancelled</span>
                    ) : (
                      <>
                        <span className="text-slate-500 font-medium">Expected Delivery:</span>{' '}
                        <span className="text-brand-green">{formatExpectedDate(order.expected_delivery_date, order.created_at)}</span>
                      </>
                    )}
                  </h2>

                  <p className="text-xs text-muted-foreground mt-1">
                    Order Placed Date: {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-right min-w-[200px]">
                  <span className="text-[11px] font-semibold text-slate-500 block uppercase">Total Amount</span>
                  <span className="font-heading text-xl font-extrabold text-brand-green">
                    ₹{(order.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                    {order.payment_method || 'Standard B2B Invoice'}
                  </span>
                </div>
              </div>

              {/* Courier & AWB Banner if available */}
              {(order.courier_partner || order.tracking_number) && (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-green text-white rounded-lg shadow-xs">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        Carrier: {order.courier_partner || 'MS TRADERS Express Logistics'}
                      </p>
                      {order.tracking_number && (
                        <p className="text-slate-600 font-mono mt-0.5 flex items-center gap-2">
                          Waybill / AWB: <strong>{order.tracking_number}</strong>
                          <button 
                            onClick={() => handleCopyAWB(order.tracking_number!)} 
                            className="text-brand-green hover:underline inline-flex items-center gap-0.5 text-[11px]"
                          >
                            {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                        </p>
                      )}
                    </div>
                  </div>

                  {order.tracking_url && (
                    <a 
                      href={order.tracking_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-green text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Track on Courier Portal
                    </a>
                  )}
                </div>
              )}

              {/* Progress Summary Line */}
              {order.status !== 'CANCELLED' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Progress Tracker</span>
                    <span>
                      {Math.round(((getStepIndex(order.status) + 1) / TIMELINE_STEPS.length) * 100)}% Completed
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-brand-green transition-all duration-700 ease-out"
                      style={{ width: `${((getStepIndex(order.status) + 1) / TIMELINE_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Amazon & Flipkart Style Vertical Line Order Status Timeline */}
            <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-brand-charcoal mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand-green" /> Live Order Progress Timeline
              </h3>

              {order.status === 'CANCELLED' ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-xs text-red-700 space-y-2">
                  <AlertCircle className="h-8 w-8 text-rose-600 mx-auto" />
                  <p className="font-bold text-sm">Order Status: CANCELLED</p>
                  <p>This order or quote has been marked as cancelled. Please contact our support team for queries.</p>
                </div>
              ) : (
                <div className="relative pl-6 sm:pl-8 space-y-8">
                  {/* Vertical Connecting Line */}
                  <div className="absolute left-[15px] sm:left-[23px] top-3 bottom-3 w-1 bg-slate-200 rounded-full" />
                  
                  {/* Dynamic Completed Vertical Line Overlay */}
                  <div 
                    className="absolute left-[15px] sm:left-[23px] top-3 w-1 bg-brand-green rounded-full transition-all duration-500"
                    style={{
                      height: `${(getStepIndex(order.status) / (TIMELINE_STEPS.length - 1)) * 92}%`
                    }}
                  />

                  {TIMELINE_STEPS.map((step, idx) => {
                    const currentIndex = getStepIndex(order.status);
                    const isCompleted = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <div key={step.status} className="relative flex items-start gap-4 sm:gap-6 group">
                        {/* Node Circle Dot */}
                        <div className={cn(
                          "absolute -left-[30px] sm:-left-[38px] top-0 flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs transition-all shadow-xs z-10",
                          isCurrent && "bg-brand-green text-white ring-4 ring-emerald-100 scale-110 shadow-md animate-pulse",
                          isCompleted && !isCurrent && "bg-brand-green text-white",
                          !isCompleted && "bg-white border-2 border-slate-300 text-slate-400"
                        )}>
                          {isCompleted ? (
                            <Check className="h-4 w-4 stroke-[3]" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        {/* Step Details */}
                        <div className={cn(
                          "flex-1 p-4 rounded-xl border transition-all",
                          isCurrent && "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300 shadow-2xs",
                          isCompleted && !isCurrent && "bg-slate-50/60 border-slate-200 opacity-90",
                          !isCompleted && "bg-white border-slate-100 opacity-50"
                        )}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <h4 className={cn(
                              "font-bold text-sm sm:text-base",
                              isCurrent ? "text-brand-green" : isCompleted ? "text-slate-900" : "text-slate-500"
                            )}>
                              {step.label}
                            </h4>

                            {isCompleted && (
                              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full inline-block w-fit">
                                {isCurrent ? 'Current Status' : 'Completed'}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {step.desc}
                          </p>

                          {/* Extra info for active/completed steps */}
                          {isCurrent && step.status === 'PREPARING' && (
                            <div className="mt-3 text-[11px] text-emerald-900 bg-emerald-100/60 p-2.5 rounded-lg border border-emerald-200 space-y-1">
                              <p className="font-bold flex items-center gap-1">
                                <Sparkles className="h-3.5 w-3.5 text-brand-green" /> Production Active:
                              </p>
                              <p>Bags are currently on high-speed flexographic printing cylinders and precision heat-seal machines.</p>
                            </div>
                          )}

                          {isCurrent && step.status === 'OUT_FOR_DELIVERY' && (
                            <div className="mt-3 text-[11px] text-blue-900 bg-blue-100/60 p-2.5 rounded-lg border border-blue-200 space-y-1">
                              <p className="font-bold flex items-center gap-1">
                                <Truck className="h-3.5 w-3.5 text-blue-700" /> Out for Local Transport:
                              </p>
                              <p>Driver / Logistics representative is en route to your delivery location.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Grid of Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address Card */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-3 text-xs">
                <h3 className="font-heading text-sm font-bold text-brand-charcoal flex items-center gap-2 border-b border-slate-100 pb-3">
                  <MapPin className="h-4 w-4 text-brand-green" /> Delivery Destination Address
                </h3>
                {order.shipping_address ? (
                  typeof order.shipping_address === 'string' ? (
                    <p className="text-slate-800 font-medium leading-relaxed">{order.shipping_address}</p>
                  ) : (
                    <div className="text-slate-700 space-y-1 leading-relaxed">
                      <p className="font-bold text-slate-900 text-sm">
                        {order.shipping_address.firstName} {order.shipping_address.lastName}
                      </p>
                      {order.shipping_address.company && (
                        <p className="font-semibold text-brand-green">{order.shipping_address.company}</p>
                      )}
                      <p>{order.shipping_address.address} {order.shipping_address.apartment}</p>
                      <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postalCode}</p>
                      <p className="font-mono text-slate-600 pt-1">Phone: {order.shipping_address.phone}</p>
                    </div>
                  )
                ) : (
                  <p className="text-muted-foreground italic">Standard address recorded on quote sheet</p>
                )}
              </div>

              {/* Customer Profile Card */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-3 text-xs">
                <h3 className="font-heading text-sm font-bold text-brand-charcoal flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Building2 className="h-4 w-4 text-brand-green" /> Customer & Business Profile
                </h3>
                <div className="space-y-1.5 text-slate-700">
                  <p><span className="text-slate-500">Contact Name:</span> <strong className="text-slate-900">{order.customer_name}</strong></p>
                  {order.company_name && (
                    <p><span className="text-slate-500">Business Name:</span> <strong className="text-brand-green">{order.company_name}</strong></p>
                  )}
                  <p><span className="text-slate-500">Email:</span> <strong className="text-slate-900">{order.email}</strong></p>
                  <p><span className="text-slate-500">Phone:</span> <strong className="text-slate-900">{order.phone}</strong></p>
                  <p className="pt-2 flex items-center gap-1.5 text-emerald-800 font-medium">
                    <ShieldCheck className="h-4 w-4 text-brand-green" /> GST Tax Invoice eligible purchase
                  </p>
                </div>
              </div>
            </div>

            {/* Ordered Items Breakdown */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-heading text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-slate-100 pb-3">
                <Package className="h-4 w-4 text-brand-green" /> Ordered Goods ({order.order_items?.length || 0})
              </h3>

              <div className="border border-border rounded-xl divide-y divide-border overflow-hidden text-xs">
                {order.order_items?.map((item, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40">
                    <div className="space-y-1">
                      <p className="font-bold text-brand-charcoal text-sm">{item.product_name}</p>
                      {item.variant_details && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {Object.entries(item.variant_details).map(([k, v]) => v ? (
                            <span key={k} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
                              {k}: {v}
                            </span>
                          ) : null)}
                        </div>
                      )}
                    </div>

                    <div className="text-left sm:text-right whitespace-nowrap border-t sm:border-0 pt-2 sm:pt-0 border-slate-200">
                      <p className="font-extrabold text-brand-green text-sm">₹{item.total_price?.toLocaleString('en-IN')}</p>
                      <p className="text-slate-500 text-[11px] font-medium">{item.quantity?.toLocaleString('en-IN')} units @ ₹{item.unit_price}/unit</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-end text-xs space-y-1">
                <div className="w-full max-w-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges:</span>
                    <span>₹{order.shipping_fee?.toLocaleString('en-IN') || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST Tax (18%):</span>
                    <span>₹{order.tax?.toLocaleString('en-IN') || '0.00'}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-base text-brand-green pt-2 border-t border-slate-300">
                    <span>Grand Total:</span>
                    <span>₹{order.total?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Print & WhatsApp Help Bar */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-md">
              <div>
                <p className="font-bold text-sm text-brand-gold">Need Urgent Dispatch Updates?</p>
                <p className="text-slate-300 mt-0.5">Contact our Ujjain factory dispatch desk directly on WhatsApp.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold inline-flex items-center gap-1.5 transition-colors text-xs"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Receipt
                </button>

                <a 
                  href={`https://wa.me/919131268724?text=${encodeURIComponent(`Hi MS TRADERS Dispatch Desk, I am checking status for Order Reference #${order.order_number}. Phone: ${order.phone}`)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-lg bg-brand-green hover:bg-emerald-600 text-white font-bold inline-flex items-center gap-1.5 transition-colors text-xs flex-1 sm:flex-none justify-center shadow-xs"
                >
                  <Phone className="h-3.5 w-3.5" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

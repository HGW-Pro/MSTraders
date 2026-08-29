'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, Search, ShieldAlert, Package, Phone, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountPage() {
  const [orderId, setOrderId] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId && !phone) {
      toast.error('Please enter an Order ID or Phone Number to track');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
      toast.info('Order details loaded below');
    }, 600);
  };

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-2 block">
            Customer Portal
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-charcoal mb-3">
            Track Order & Wholesale Status
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Track the production, manufacturing, or dispatch status of your bulk paper and non-woven bag orders with MS TRADERS.
          </p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 sm:p-10 shadow-xs mb-8">
          <h2 className="font-heading text-xl font-bold text-brand-charcoal mb-6 flex items-center gap-2">
            <Search className="h-5 w-5 text-brand-green" /> Quick Order Lookup
          </h2>

          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order Reference ID</Label>
                <Input 
                  id="orderId" 
                  placeholder="e.g. MST-ORD-1001" 
                  value={orderId} 
                  onChange={(e) => setOrderId(e.target.value)} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Registered Phone / WhatsApp</Label>
                <Input 
                  id="phone" 
                  placeholder="+91 91312 68724" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-brand-green hover:bg-emerald-700 text-white font-bold h-11">
              {loading ? 'Searching Orders...' : 'Track Order Status'}
            </Button>
          </form>

          {searched && (
            <div className="mt-8 pt-8 border-t border-border bg-slate-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block">Order Reference</span>
                  <span className="font-bold text-brand-charcoal text-base">{orderId || 'MST-ORD-1001'}</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  In Production / Manufacturing
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
                <div>
                  <span className="text-muted-foreground block">Customer</span>
                  <span className="font-semibold text-slate-800">Ujjain Retail Traders</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Order Date</span>
                  <span className="font-semibold text-slate-800">28 Aug 2026</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Total Quantity</span>
                  <span className="font-semibold text-slate-800">1,000 Pieces</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Bag Specification</span>
                  <span className="font-semibold text-slate-800">Brown Kraft Bag (120 GSM)</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground pt-2 border-t border-slate-200">
                Need immediate update? Contact MS TRADERS dispatch desk on WhatsApp: <a href="https://wa.me/919131268724" target="_blank" className="text-brand-green font-bold underline">+91 91312 68724</a>
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 bg-brand-gold/20 rounded-lg flex items-center justify-center mb-3">
                <ShieldAlert className="h-5 w-5 text-brand-gold" />
              </div>
              <h3 className="font-heading text-lg font-bold">Admin Management Portal</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Management portal for MS TRADERS staff to update product stock, process custom bag quotes, manage orders, and upload artwork files.
              </p>
            </div>
            <Button asChild className="bg-brand-gold text-brand-charcoal hover:bg-yellow-400 font-bold w-full">
              <Link href="/admin/login">Open Admin Management Portal</Link>
            </Button>
          </div>

          <div className="bg-white border border-border p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-xs">
            <div>
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-3">
                <Package className="h-5 w-5 text-brand-green" />
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-charcoal">Request Wholesale Catalog</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Looking for bulk wholesale pricing, GSM samples, or custom design print mockups? Talk to our sales team.
              </p>
            </div>
            <Button asChild variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white font-bold w-full">
              <Link href="/customize">Request Custom Quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { Package, FileText, ShoppingBag, IndianRupee, TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { getProducts, getQuotes, getOrders } from '@/lib/supabase/services';
import { Product, Quote, Order } from '@/types';

export default function AdminDashboardPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const [prods, qts, ords] = await Promise.all([
          getProducts({ status: 'all' as any }),
          getQuotes(),
          getOrders()
        ]);
        setProducts(prods);
        setQuotes(qts);
        setOrders(ords);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeQuotesCount = quotes.filter(q => q.status === 'NEW' || q.status === 'SUBMITTED' || q.status === 'UNDER_REVIEW' || q.status === 'CHANGES_REQUESTED').length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-brand-charcoal text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-brand-gold tracking-wider">Live System Overview</span>
          <h2 className="font-heading text-2xl font-bold mt-1">MS TRADERS Admin Control Center</h2>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Real-time catalog control, live quote management, custom artwork reviews, and order fulfillment pipeline.
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/products" 
            className="px-4 py-2.5 bg-brand-green text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
          >
            Manage Products
          </Link>
          <Link 
            href="/admin/quotes" 
            className="px-4 py-2.5 bg-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/20 transition-colors"
          >
            Review Quotes
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Order Value', 
            value: `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`, 
            icon: IndianRupee, 
            subtitle: `${orders.length} Total Orders`, 
            color: 'text-emerald-600 bg-emerald-50 border-emerald-200' 
          },
          { 
            title: 'Active Quotes', 
            value: `${activeQuotesCount}`, 
            icon: FileText, 
            subtitle: `${quotes.length} Total Inquiries`, 
            color: 'text-amber-600 bg-amber-50 border-amber-200' 
          },
          { 
            title: 'Catalog Items', 
            value: `${products.length}`, 
            icon: Package, 
            subtitle: 'Published & Draft', 
            color: 'text-blue-600 bg-blue-50 border-blue-200' 
          },
          { 
            title: 'Completed Orders', 
            value: `${orders.filter(o => o.status === 'DELIVERED').length}`, 
            icon: ShoppingBag, 
            subtitle: 'Fulfilling Pipeline', 
            color: 'text-purple-600 bg-purple-50 border-purple-200' 
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-border shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.title}</h3>
              <div className={`p-2.5 rounded-lg border ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-extrabold text-brand-charcoal">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-500">{stat.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Quotes */}
        <div className="bg-white border border-border rounded-xl shadow-xs overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between bg-slate-50">
            <h2 className="font-semibold text-lg text-brand-charcoal">Recent Quote Inquiries</h2>
            <Link href="/admin/quotes" className="text-sm text-brand-green font-semibold hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-semibold">Quote #</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Quantity</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {quotes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No quote requests yet.</td>
                  </tr>
                ) : (
                  quotes.slice(0, 5).map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-brand-charcoal">{q.quote_number}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{q.customer_name}</div>
                        <div className="text-xs text-muted-foreground">{q.email}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-brand-green">{q.quantity.toLocaleString()} units</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-border rounded-xl shadow-xs overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between bg-slate-50">
            <h2 className="font-semibold text-lg text-brand-charcoal">Recent Customer Orders</h2>
            <Link href="/admin/orders" className="text-sm text-brand-green font-semibold hover:underline flex items-center gap-1">
              <span>Manage Orders</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order #</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Total Amount</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No customer orders submitted yet.</td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-brand-charcoal">{o.order_number}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{o.customer_name}</td>
                      <td className="px-6 py-4 font-bold text-brand-green">₹{o.total?.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { getQuotes, getOrders } from '@/lib/db/services';
import { Input } from '@/components/ui/input';
import { Search, Users, Mail, Phone, Building2, ShoppingBag, FileText } from 'lucide-react';

interface AggregatedCustomer {
  email: string;
  name: string;
  phone: string;
  businessName?: string;
  quoteCount: number;
  orderCount: number;
  lastActive: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<AggregatedCustomer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  const loadCustomerDirectory = React.useCallback(async () => {
    setLoading(true);
    try {
      const [quotes, orders] = await Promise.all([getQuotes(), getOrders()]);

      const customerMap = new Map<string, AggregatedCustomer>();

      quotes.forEach((q) => {
        const key = q.email.toLowerCase();
        const existing = customerMap.get(key) || {
          email: q.email,
          name: q.customer_name,
          phone: q.phone,
          businessName: q.business_name || undefined,
          quoteCount: 0,
          orderCount: 0,
          lastActive: q.created_at
        };

        existing.quoteCount += 1;
        if (new Date(q.created_at) > new Date(existing.lastActive)) {
          existing.lastActive = q.created_at;
        }
        if (q.business_name) existing.businessName = q.business_name;
        customerMap.set(key, existing);
      });

      orders.forEach((o) => {
        const key = o.email.toLowerCase();
        const existing = customerMap.get(key) || {
          email: o.email,
          name: o.customer_name,
          phone: o.phone,
          businessName: o.company_name || undefined,
          quoteCount: 0,
          orderCount: 0,
          lastActive: o.created_at
        };

        existing.orderCount += 1;
        if (new Date(o.created_at) > new Date(existing.lastActive)) {
          existing.lastActive = o.created_at;
        }
        if (o.company_name) existing.businessName = o.company_name;
        customerMap.set(key, existing);
      });

      const list = Array.from(customerMap.values()).sort(
        (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
      );

      setCustomers(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    Promise.all([getQuotes(), getOrders()]).then(([quotes, orders]) => {
      if (!active) return;
      const customerMap = new Map<string, AggregatedCustomer>();

      quotes.forEach((q) => {
        const key = q.email.toLowerCase();
        const existing = customerMap.get(key) || {
          email: q.email,
          name: q.customer_name,
          phone: q.phone,
          businessName: q.business_name || undefined,
          quoteCount: 0,
          orderCount: 0,
          lastActive: q.created_at
        };

        existing.quoteCount += 1;
        if (new Date(q.created_at) > new Date(existing.lastActive)) {
          existing.lastActive = q.created_at;
        }
        if (q.business_name) existing.businessName = q.business_name;
        customerMap.set(key, existing);
      });

      orders.forEach((o) => {
        const key = o.email.toLowerCase();
        const existing = customerMap.get(key) || {
          email: o.email,
          name: o.customer_name,
          phone: o.phone,
          businessName: o.company_name || undefined,
          quoteCount: 0,
          orderCount: 0,
          lastActive: o.created_at
        };

        existing.orderCount += 1;
        if (new Date(o.created_at) > new Date(existing.lastActive)) {
          existing.lastActive = o.created_at;
        }
        if (o.company_name) existing.businessName = o.company_name;
        customerMap.set(key, existing);
      });

      const list = Array.from(customerMap.values()).sort(
        (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
      );

      setCustomers(list);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    (c.businessName && c.businessName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-charcoal">Customer Directory</h1>
        <p className="text-sm text-muted-foreground">Comprehensive record of clients, businesses, quote requesters, and buyers</p>
      </div>

      <div className="bg-white border border-border rounded-xl p-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by customer name, email, company..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground animate-pulse">Aggregating customer directory...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No customers found in directory.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Company / Business</th>
                  <th className="px-6 py-3 font-semibold">Contact Info</th>
                  <th className="px-6 py-3 font-semibold">Activity Summary</th>
                  <th className="px-6 py-3 font-semibold">Last Interaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((cust, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {cust.name}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {cust.businessName || 'Individual'}
                    </td>
                    <td className="px-6 py-4 text-xs space-y-0.5">
                      <div className="text-brand-green font-semibold">{cust.email}</div>
                      <div className="text-slate-600">{cust.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                          {cust.quoteCount} Quotes
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                          {cust.orderCount} Orders
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(cust.lastActive).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

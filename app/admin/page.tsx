import * as React from 'react';
import { Package, FileText, IndianRupee, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: '₹2,45,000', icon: IndianRupee, trend: '+12%', color: 'text-green-600' },
          { title: 'Active Quotes', value: '18', icon: FileText, trend: '+4', color: 'text-brand-gold' },
          { title: 'Products', value: '42', icon: Package, trend: 'Updated', color: 'text-blue-500' },
          { title: 'Conversion Rate', value: '24%', icon: TrendingUp, trend: '+2.4%', color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
              <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-brand-charcoal">{stat.value}</div>
              <div className="text-sm font-medium text-brand-green">{stat.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Quotes */}
        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-lg text-brand-charcoal">Recent Quotes</h2>
            <Link href="/admin/quotes" className="text-sm text-brand-green font-medium hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Quote #</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { id: 'MST-QT-10492', name: 'Rahul Sharma', product: 'Kraft Bags', status: 'New' },
                  { id: 'MST-QT-10491', name: 'Taj Hotels', product: 'Designer Bags', status: 'Reviewing' },
                  { id: 'MST-QT-10490', name: 'Priya Boutique', product: 'Non-Woven D-Cut', status: 'Quote Sent' },
                  { id: 'MST-QT-10489', name: 'Apollo Pharmacy', product: 'W-Cut Bags', status: 'Approved' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-charcoal">{row.id}</td>
                    <td className="px-6 py-4">{row.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.product}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                        ${row.status === 'New' ? 'bg-blue-100 text-blue-700' : 
                          row.status === 'Reviewing' ? 'bg-amber-100 text-amber-700' :
                          row.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-lg text-brand-charcoal">Top Products</h2>
            <Link href="/admin/products" className="text-sm text-brand-green font-medium hover:underline">Manage Catalog</Link>
          </div>
          <div className="p-6 space-y-6">
            {[
              { name: 'Premium Kraft Paper Bag', category: 'Kraft Bags', views: 1240, orders: 48 },
              { name: 'Standard Non-Woven D-Cut', category: 'Non-Woven', views: 980, orders: 112 },
              { name: 'Luxury Boutique Bag', category: 'Designer', views: 845, orders: 24 },
            ].map((prod, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-brand-charcoal text-sm">{prod.name}</h4>
                    <p className="text-xs text-muted-foreground">{prod.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-brand-charcoal text-sm">{prod.orders} orders</div>
                  <div className="text-xs text-muted-foreground">{prod.views} views</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

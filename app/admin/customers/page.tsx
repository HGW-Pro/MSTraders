import * as React from 'react';

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-brand-charcoal">Customers</h1>
      </div>
      <div className="bg-white border border-border rounded-xl shadow-sm p-6 text-center text-muted-foreground">
        Customers directory would go here.
      </div>
    </div>
  );
}

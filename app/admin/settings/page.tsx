import * as React from 'react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-brand-charcoal">Settings</h1>
      </div>
      <div className="bg-white border border-border rounded-xl shadow-sm p-6 text-center text-muted-foreground">
        Admin settings would go here.
      </div>
    </div>
  );
}

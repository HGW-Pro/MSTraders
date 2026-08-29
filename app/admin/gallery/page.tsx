import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminGalleryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-brand-charcoal">Gallery Management</h1>
        <Button className="bg-brand-green text-white hover:bg-brand-green/90">
          <Plus className="mr-2 h-4 w-4" /> Add Image
        </Button>
      </div>
      <div className="bg-white border border-border rounded-xl shadow-sm p-6 text-center text-muted-foreground">
        Gallery management interface would go here.
      </div>
    </div>
  );
}

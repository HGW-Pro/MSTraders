'use client';

import * as React from 'react';
import { 
  MessageSquareQuote, 
  Plus, 
  Edit2, 
  Trash2, 
  Star, 
  Building2, 
  User, 
  Check, 
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getTestimonials, saveTestimonial, deleteTestimonial } from '@/lib/supabase/services';
import { Testimonial } from '@/types';
import { cn } from '@/lib/utils';

export default function AdminTestimonialsPage() {
  const [items, setItems] = React.useState<Testimonial[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Partial<Testimonial> | null>(null);
  const [saving, setSaving] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const data = await getTestimonials(false); // include drafts
      setItems(data);
    } catch (err) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    getTestimonials(false).then((data) => {
      if (isMounted) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const handleOpenCreate = () => {
    setEditingItem({
      name: '',
      company: '',
      role: 'Store Owner',
      content: '',
      rating: 5,
      status: 'published',
      display_order: items.length + 1
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.content) {
      toast.error('Please enter client name and testimonial content');
      return;
    }

    setSaving(true);
    try {
      const saved = await saveTestimonial(editingItem);
      if (saved) {
        toast.success('Testimonial saved');
        setShowModal(false);
        setEditingItem(null);
        loadData();
      } else {
        toast.error('Failed to save testimonial');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error saving testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete testimonial by "${name}"?`)) return;
    const success = await deleteTestimonial(id);
    if (success) {
      toast.success('Testimonial deleted');
      loadData();
    } else {
      toast.error('Could not delete testimonial');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green block mb-1">
            Social Proof & Client Reviews
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-charcoal">
            Testimonials Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Add and manage genuine wholesale client feedback displayed on the homepage.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="bg-brand-green hover:bg-emerald-700 text-white font-bold h-11 px-6 shadow-xs">
          <Plus className="h-4 w-4 mr-2" /> Add Client Testimonial
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Loading Testimonials...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <MessageSquareQuote className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="font-heading text-lg font-bold text-brand-charcoal">No Testimonials Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Add your first business client review to boost customer trust.
          </p>
          <Button onClick={handleOpenCreate} className="bg-brand-green hover:bg-emerald-700 text-white font-bold text-xs mt-2">
            Add First Review
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.id} className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-3.5 w-3.5", i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                    ))}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border",
                    t.status === 'published' ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-slate-100 text-slate-500 border-slate-300"
                  )}>
                    {t.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </p>

                <div className="pt-2 border-t border-slate-100">
                  <p className="font-bold text-xs text-brand-charcoal">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.role}{t.company ? `, ${t.company}` : ''}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(t)} className="flex-1 text-xs font-bold">
                  <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(t.id, t.name || t.customer_name || 'Client')} className="text-xs font-bold text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              {editingItem?.id ? 'Edit Testimonial' : 'Add Client Review'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="space-y-1">
              <Label htmlFor="tName">Client Name *</Label>
              <Input 
                id="tName" 
                placeholder="e.g. Vikram Sharma" 
                value={editingItem?.name || ''} 
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="tComp">Company / Store Name</Label>
                <Input 
                  id="tComp" 
                  placeholder="e.g. Ujjain Footwear" 
                  value={editingItem?.company || ''} 
                  onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tRole">Role / Title</Label>
                <Input 
                  id="tRole" 
                  placeholder="e.g. Managing Partner" 
                  value={editingItem?.role || ''} 
                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="tContent">Testimonial Review Copy *</Label>
              <Textarea 
                id="tContent" 
                rows={3}
                placeholder="Client comments about quality, delivery, and printing..." 
                value={editingItem?.content || ''} 
                onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })} 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="tRating">Star Rating (1-5)</Label>
                <Input 
                  id="tRating" 
                  type="number" 
                  min={1} 
                  max={5} 
                  value={editingItem?.rating || 5} 
                  onChange={(e) => setEditingItem({ ...editingItem, rating: parseInt(e.target.value) || 5 })} 
                />
              </div>

              <div className="space-y-1">
                <Label>Status</Label>
                <div className="flex items-center gap-2 pt-1.5">
                  <Switch 
                    checked={editingItem?.status === 'published'}
                    onCheckedChange={(val) => setEditingItem({ ...editingItem, status: val ? 'published' : 'draft' })}
                  />
                  <span className="font-bold">{editingItem?.status === 'published' ? 'Published' : 'Draft'}</span>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full bg-brand-green hover:bg-emerald-700 text-white font-bold h-10 mt-2">
              {saving ? 'Saving...' : 'Save Testimonial'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

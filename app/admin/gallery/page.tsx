'use client';

import * as React from 'react';
import { GalleryItem } from '@/types';
import { 
  getGalleryItems, 
  createGalleryItem, 
  deleteGalleryItem, 
  uploadFileToSupabase 
} from '@/lib/supabase/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Trash2, 
  Upload, 
  X, 
  Sparkles, 
  Image as ImageIcon 
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AdminGalleryPage() {
  const [items, setItems] = React.useState<GalleryItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Add Item Modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    category: 'Designer Bags',
    image_url: '',
    is_featured: false,
    status: 'published' as 'published' | 'draft'
  });

  const loadGallery = React.useCallback(async () => {
    try {
      const data = await getGalleryItems();
      setItems(data);
    } catch (err) {
      toast.error('Failed to fetch gallery items');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    getGalleryItems().then((data) => {
      if (active) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    toast.info('Uploading showcase image...');
    const url = await uploadFileToSupabase(file, 'gallery-images');
    if (url) {
      setFormData(prev => ({ ...prev, image_url: url }));
      toast.success('Image uploaded successfully');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) {
      toast.error('Title and Image are required');
      return;
    }

    setIsSaving(true);
    try {
      const newItem = await createGalleryItem({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image_url: formData.image_url,
        is_featured: formData.is_featured,
        status: formData.status
      });

      if (newItem) {
        toast.success('Added showcase image to gallery');
        setIsModalOpen(false);
        loadGallery();
      } else {
        toast.error('Failed to save gallery item');
      }
    } catch (err) {
      toast.error('Error saving gallery item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Remove "${title}" from gallery?`)) {
      const ok = await deleteGalleryItem(id);
      if (ok) {
        toast.success('Item deleted');
        setItems(prev => prev.filter(i => i.id !== id));
      } else {
        toast.error('Failed to delete item');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-charcoal">Gallery & Portfolio Showcase</h1>
          <p className="text-sm text-muted-foreground">Manage photographs of completed custom bag supply and logo printing projects</p>
        </div>
        <Button 
          onClick={() => {
            setFormData({
              title: '',
              description: '',
              category: 'Designer Bags',
              image_url: '',
              is_featured: false,
              status: 'published'
            });
            setIsModalOpen(true);
          }}
          className="bg-brand-green text-white hover:bg-brand-green/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Showcase Image
        </Button>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="p-12 text-center text-muted-foreground animate-pulse">Loading gallery from Supabase...</div>
      ) : items.length === 0 ? (
        <div className="p-12 bg-white rounded-xl border border-border text-center text-muted-foreground">
          No gallery items found. Click &quot;Add Showcase Image&quot; to upload your first project photo.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-border shadow-xs overflow-hidden flex flex-col group">
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <Image 
                  src={item.image_url} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                {item.is_featured && (
                  <span className="absolute top-3 left-3 bg-brand-gold text-brand-charcoal font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Sparkles className="h-3 w-3" /> Featured
                  </span>
                )}
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="absolute top-3 right-3 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-xs"
                  title="Delete item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-2">
                    {item.category || 'General'}
                  </span>
                  <h3 className="font-bold text-brand-charcoal text-base">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-slate-50">
              <h2 className="font-heading text-lg font-bold text-brand-charcoal">Add Showcase Image</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="g-title">Project Title *</Label>
                <Input 
                  id="g-title" 
                  value={formData.title} 
                  onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Luxury Foil Stamped Boutique Bag" 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="g-cat">Category</Label>
                <select 
                  id="g-cat"
                  value={formData.category} 
                  onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                  className="w-full h-10 px-3 py-2 rounded-md border border-input text-sm"
                >
                  <option value="Paper Bags">Paper Bags</option>
                  <option value="Kraft Bags">Kraft Bags</option>
                  <option value="Non-Woven Bags">Non-Woven Bags</option>
                  <option value="Designer Bags">Designer Bags</option>
                  <option value="Gift Bags">Gift Bags</option>
                  <option value="Customized Bags">Customized Bags</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="g-desc">Description</Label>
                <Textarea 
                  id="g-desc" 
                  rows={2}
                  value={formData.description} 
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Details on client, finish, printing specs..." 
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <Label>Showcase Image *</Label>
                {formData.image_url ? (
                  <div className="relative h-40 rounded-lg overflow-hidden border border-slate-200">
                    <Image src={formData.image_url} alt="Preview" fill className="object-cover" referrerPolicy="no-referrer" />
                    <button 
                      type="button" 
                      onClick={() => setFormData(p => ({ ...p, image_url: '' }))}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="h-32 border-2 border-dashed border-slate-300 hover:border-brand-green rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50">
                    <Upload className="h-6 w-6 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-600 font-semibold">Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="g-feat"
                  checked={formData.is_featured} 
                  onChange={(e) => setFormData(p => ({ ...p, is_featured: e.target.checked }))} 
                  className="rounded border-slate-300 text-brand-green"
                />
                <Label htmlFor="g-feat" className="cursor-pointer text-xs font-semibold">Feature on Homepage Showcase</Label>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="bg-brand-green text-white hover:bg-brand-green/90">
                  {isSaving ? 'Uploading...' : 'Save Showcase Photo'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

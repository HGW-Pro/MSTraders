'use client';

import * as React from 'react';
import Image from 'next/image';
import { 
  FolderKanban, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  Eye, 
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getCategories, saveCategory, deleteCategory, uploadFile } from '@/lib/db/services';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Partial<Category> | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);

  const loadCategories = React.useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    getCategories().then((data) => {
      if (isMounted) {
        setCategories(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      image_url: '/images/categories/paper-bags.svg',
      display_order: categories.length + 1,
      is_active: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) {
      toast.error('Please enter a category name');
      return;
    }

    setSaving(true);
    try {
      const slug = editingCategory.slug || editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const saved = await saveCategory({
        ...editingCategory,
        slug
      });

      if (saved) {
        toast.success(`Category "${saved.name}" saved!`);
        setShowModal(false);
        setEditingCategory(null);
        loadCategories();
      } else {
        toast.error('Failed to save category');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string, slug?: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    const success = await deleteCategory(id, slug);
    if (success) {
      toast.success(`Category "${name}" deleted`);
      loadCategories();
    } else {
      toast.error('Could not delete category');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const publicUrl = await uploadFile(file, 'category-images');
      if (publicUrl) {
        setEditingCategory(prev => ({ ...prev, image_url: publicUrl }));
        toast.success('Category image uploaded');
      } else {
        toast.error('Upload failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green block mb-1">
            Taxonomy & Catalog Management
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-charcoal">
            Bag Categories Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create, update, reorder, or feature carry bag categories across paper bags, W-cut, D-cut, gift bags, and envelopes.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="bg-brand-green hover:bg-emerald-700 text-white font-bold h-11 px-6 shadow-xs">
          <Plus className="h-4 w-4 mr-2" /> Create New Category
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Loading Categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white border border-border rounded-2xl overflow-hidden shadow-xs space-y-4 flex flex-col justify-between p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    Order #{cat.display_order || 1}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border",
                    cat.is_active ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-slate-100 text-slate-500 border-slate-300"
                  )}>
                    {cat.is_active ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <Image 
                    src={cat.image_url || '/images/categories/paper-bags.svg'} 
                    alt={cat.name} 
                    fill 
                    className="object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-brand-charcoal">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(cat)} className="flex-1 text-xs font-bold">
                  <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit Category
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(cat.id, cat.name, cat.slug)} className="text-xs font-bold text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              {editingCategory?.id ? 'Edit Category' : 'Create Bag Category'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="space-y-1">
              <Label htmlFor="catName">Category Name *</Label>
              <Input 
                id="catName" 
                placeholder="e.g. Luxury Gift Bags" 
                value={editingCategory?.name || ''} 
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} 
                required 
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="catSlug">URL Slug (Auto-generated if empty)</Label>
              <Input 
                id="catSlug" 
                placeholder="e.g. luxury-gift-bags" 
                value={editingCategory?.slug || ''} 
                onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })} 
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="catDesc">Description</Label>
              <Textarea 
                id="catDesc" 
                rows={2}
                placeholder="Brief summary of bag type & usage..." 
                value={editingCategory?.description || ''} 
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} 
              />
            </div>

            <div className="space-y-2">
              <Label>Category Image</Label>
              <div className="flex items-center gap-3">
                <Input 
                  placeholder="https://..." 
                  value={editingCategory?.image_url || ''} 
                  onChange={(e) => setEditingCategory({ ...editingCategory, image_url: e.target.value })} 
                />
                <Label htmlFor="catImgUpload" className="cursor-pointer">
                  <div className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 px-3 py-2 rounded-md font-bold text-[11px] whitespace-nowrap">
                    {uploadingImage ? '...' : 'Upload'}
                  </div>
                  <input id="catImgUpload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <Label htmlFor="catOrder">Display Order</Label>
                <Input 
                  id="catOrder" 
                  type="number" 
                  value={editingCategory?.display_order || 1} 
                  onChange={(e) => setEditingCategory({ ...editingCategory, display_order: parseInt(e.target.value) || 1 })} 
                />
              </div>

              <div className="space-y-1">
                <Label>Publish Status</Label>
                <div className="flex items-center gap-2 pt-1.5">
                  <Switch 
                    checked={editingCategory?.is_active ?? true}
                    onCheckedChange={(val) => setEditingCategory({ ...editingCategory, is_active: val })}
                  />
                  <span className="font-bold">{editingCategory?.is_active ? 'Active' : 'Draft'}</span>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full bg-brand-green hover:bg-emerald-700 text-white font-bold h-10 mt-2">
              {saving ? 'Saving...' : 'Save Category'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

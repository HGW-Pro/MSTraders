'use client';

import * as React from 'react';
import { GalleryItem } from '@/types';
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  restoreDefaultGalleryItems,
  uploadFileToSupabase,
  DEFAULT_GALLERY_ITEMS
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
  RotateCcw,
  AlertTriangle,
  Edit2,
  CheckCircle2,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AdminGalleryPage() {
  const [items, setItems] = React.useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [uploadingId, setUploadingId] = React.useState<string | null>(null);

  // Deletion Modal State
  const [itemToDelete, setItemToDelete] = React.useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Edit / Add Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<GalleryItem | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    category: 'Customized Bags',
    image_url: '',
    is_featured: false,
    status: 'published' as 'published' | 'draft' | 'archived',
    display_order: 1
  });

  const fileInputRefs = React.useRef<{ [key: string]: HTMLInputElement | null }>({});

  const loadGallery = React.useCallback(async () => {
    try {
      const data = await getGalleryItems();
      if (data && data.length > 0) {
        setItems(data);
      } else {
        restoreDefaultGalleryItems();
        setItems(DEFAULT_GALLERY_ITEMS);
      }
    } catch (err) {
      console.warn('Could not refresh gallery items:', err);
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getGalleryItems();
        if (active) {
          if (data && data.length > 0) {
            setItems(data);
          } else {
            restoreDefaultGalleryItems();
            setItems(DEFAULT_GALLERY_ITEMS);
          }
        }
      } catch (e) {
        console.warn('Initial gallery load warning:', e);
      }
    })();
    return () => { active = false; };
  }, []);

  // Quick 1-click upload directly onto an individual card
  const handleDirectCardUpload = async (item: GalleryItem, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setUploadingId(item.id);
    toast.info(`Uploading image for "${item.title}"...`);
    try {
      const url = await uploadFileToSupabase(file, 'gallery-images');
      if (url) {
        const updated = await updateGalleryItem(item.id, { image_url: url });
        if (updated) {
          setItems(prev => prev.map(i => i.id === item.id ? { ...i, image_url: url } : i));
          toast.success(`Photo updated for "${item.title}"!`);
        }
      } else {
        toast.error('Could not upload image. Please try again.');
      }
    } catch (err) {
      toast.error('Error uploading image');
    } finally {
      setUploadingId(null);
      if (e.target) e.target.value = '';
    }
  };

  // Upload inside the Modal
  const handleModalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    toast.info('Uploading image...');
    const url = await uploadFileToSupabase(file, 'gallery-images');
    if (url) {
      setFormData(prev => ({ ...prev, image_url: url }));
      toast.success('Image uploaded successfully');
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      category: 'Customized Bags',
      image_url: '',
      is_featured: false,
      status: 'published',
      display_order: items.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category || 'Customized Bags',
      image_url: item.image_url,
      is_featured: item.is_featured,
      status: item.status,
      display_order: item.display_order || 1
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) {
      toast.error('Title and Image are required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        // Update existing item
        const updated = await updateGalleryItem(editingItem.id, {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image_url: formData.image_url,
          is_featured: formData.is_featured,
          status: formData.status,
          display_order: Number(formData.display_order) || 1
        });

        if (updated) {
          toast.success(`Updated "${formData.title}"`);
          setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
          setIsModalOpen(false);
        } else {
          toast.error('Failed to update gallery item');
        }
      } else {
        // Add new item
        const newItem = await createGalleryItem({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image_url: formData.image_url,
          is_featured: formData.is_featured,
          status: formData.status,
          display_order: Number(formData.display_order) || (items.length + 1)
        });

        if (newItem) {
          toast.success('Added showcase item to gallery');
          setIsModalOpen(false);
          loadGallery();
        } else {
          toast.error('Failed to save gallery item');
        }
      }
    } catch (err) {
      toast.error('Error saving gallery item');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const ok = await deleteGalleryItem(itemToDelete.id, itemToDelete.image_url);
      if (ok) {
        toast.success(`Deleted "${itemToDelete.title}"`);
        setItems(prev => prev.filter(i => i.id !== itemToDelete.id));
        setItemToDelete(null);
      } else {
        toast.error('Could not delete item. Please try again.');
      }
    } catch (err) {
      toast.error('An error occurred while deleting the gallery item.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestoreDefaults = async () => {
    restoreDefaultGalleryItems();
    setSearchQuery('');
    setSelectedCategory('All');
    setItems(DEFAULT_GALLERY_ITEMS);
    toast.success('Restored all 21 default showcase catalog items');
    await loadGallery();
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Kraft Bags', 'W-Cut Bags', 'D-Cut Bags', 'Non-Woven Bags', 'Designer Bags', 'Customized Bags', 'Paper Bags'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-charcoal">Gallery & Portfolio Showcase</h1>
          <p className="text-sm text-muted-foreground">
            Manage photographs of completed bag supply, client printing, and packaging projects ({items.length} items)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestoreDefaults}
            className="text-xs text-slate-600 border-slate-300 hover:bg-slate-100"
            title="Restore all 21 items from WhatsApp catalog"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Restore 21 Catalog Items
          </Button>
          <Button
            onClick={handleOpenAddModal}
            className="bg-brand-green text-white hover:bg-brand-green/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Showcase Image
          </Button>
        </div>
      </div>

      {/* Upload Helper Guide Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-emerald-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-green text-white flex items-center justify-center shrink-0 shadow-xs">
            <Upload className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-brand-charcoal">
              All 21 gallery items from your catalog are configured and ready!
            </p>
            <p className="text-xs text-emerald-800">
              Click <strong className="font-semibold text-emerald-900">&quot;Upload Photo&quot;</strong> on any card to select and attach your photo from your device.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-brand-green bg-white px-3 py-1 rounded-full border border-emerald-300 shrink-0">
          {items.filter(i => !i.image_url.endsWith('.svg')).length} of {items.length} Photos Uploaded
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description, or client..."
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="h-4 w-4 text-slate-400 shrink-0 hidden sm:inline" />
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-colors font-medium ${
                selectedCategory === cat
                  ? 'bg-brand-green text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="p-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
          <p className="text-sm">Loading gallery showcase items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 bg-white rounded-xl border border-border text-center space-y-3">
          <p className="text-muted-foreground">No gallery items match your current filter.</p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} variant="outline" size="sm">
              Clear Filters
            </Button>
            <Button onClick={handleRestoreDefaults} variant="outline" size="sm">
              <RotateCcw className="mr-2 h-4 w-4" /> Restore 21 Catalog Items
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => {
            const hasCustomPhoto = !item.image_url.endsWith('.svg');
            const isCurrentlyUploading = uploadingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-border shadow-xs overflow-hidden flex flex-col group relative transition-all duration-200 hover:shadow-md"
              >
                {/* Image Display Area */}
                <div className="relative h-60 bg-slate-100 overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    unoptimized={Boolean(item.image_url?.startsWith('data:') || item.image_url?.endsWith('.svg'))}
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <span className="bg-black/75 text-white font-bold text-[11px] px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs">
                      #{item.display_order || idx + 1}
                    </span>
                    {item.is_featured && (
                      <span className="bg-brand-gold text-brand-charcoal font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <Sparkles className="h-3 w-3" /> Featured
                      </span>
                    )}
                    {hasCustomPhoto ? (
                      <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="h-3 w-3" /> Photo Uploaded
                      </span>
                    ) : (
                      <span className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                        Needs Photo
                      </span>
                    )}
                  </div>

                  {/* Action Buttons Overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="bg-white/95 text-slate-700 hover:text-brand-green p-2 rounded-full shadow-md cursor-pointer transition-colors"
                      title="Edit Item Details"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      className="bg-red-600/90 text-white hover:bg-red-700 p-2 rounded-full shadow-md cursor-pointer transition-colors"
                      title={`Delete "${item.title}"`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Hidden Direct File Input for this item */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { fileInputRefs.current[item.id] = el; }}
                    onChange={(e) => handleDirectCardUpload(item, e)}
                    className="hidden"
                  />

                  {/* Uploading Overlay */}
                  {isCurrentlyUploading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 z-20">
                      <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
                      <span className="text-xs font-semibold">Uploading photo...</span>
                    </div>
                  )}
                </div>

                {/* Card Content & Quick Action */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                        {item.category || 'Customized Bags'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Order: {item.display_order || idx + 1}
                      </span>
                    </div>

                    <h3 className="font-bold text-brand-charcoal text-base leading-snug">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Primary Quick Action Button */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRefs.current[item.id]?.click()}
                      disabled={isCurrentlyUploading}
                      className="w-full text-xs font-semibold bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-brand-green transition-colors"
                    >
                      <Upload className="mr-1.5 h-3.5 w-3.5 text-brand-green" />
                      {hasCustomPhoto ? 'Replace Photo' : 'Upload Photo'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditModal(item)}
                      className="px-2.5 text-xs text-slate-500 hover:text-brand-charcoal"
                      title="Edit text, category, or order"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-heading text-lg font-bold text-slate-900">Delete Gallery Item?</h3>
                <p className="text-sm text-slate-600">
                  Are you sure you want to remove <span className="font-semibold text-slate-800">&quot;{itemToDelete.title}&quot;</span> from the gallery showcase?
                </p>
                <p className="text-xs text-slate-400">
                  This photo will be removed from both this admin panel and your public portfolio page.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDeleting}
                  onClick={() => setItemToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Item'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 my-8">
            <div className="p-6 border-b border-border flex items-center justify-between bg-slate-50">
              <h2 className="font-heading text-lg font-bold text-brand-charcoal">
                {editingItem ? 'Edit Gallery Item' : 'Add Showcase Image'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1.5">
                <Label htmlFor="g-title">Project / Bag Title *</Label>
                <Input
                  id="g-title"
                  value={formData.title}
                  onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Rajputi Saafe Luxury Maroon Paper Bag"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="g-cat">Category</Label>
                  <select
                    id="g-cat"
                    value={formData.category}
                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                    className="w-full h-10 px-3 py-2 rounded-md border border-input text-sm bg-white"
                  >
                    <option value="Kraft Bags">Kraft Bags</option>
                    <option value="W-Cut Bags">W-Cut Bags</option>
                    <option value="D-Cut Bags">D-Cut Bags</option>
                    <option value="Non-Woven Bags">Non-Woven Bags</option>
                    <option value="Designer Bags">Designer Bags</option>
                    <option value="Customized Bags">Customized Bags</option>
                    <option value="Paper Bags">Paper Bags</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="g-order">Display Sequence</Label>
                  <Input
                    id="g-order"
                    type="number"
                    min={1}
                    value={formData.display_order}
                    onChange={(e) => setFormData(p => ({ ...p, display_order: parseInt(e.target.value) || 1 }))}
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="g-desc">Description / Specs</Label>
                <Textarea
                  id="g-desc"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Details on client, finish, color, handles, printing specs..."
                />
              </div>

              {/* Image Upload Area */}
              <div className="space-y-2">
                <Label>Showcase Photograph *</Label>
                {formData.image_url ? (
                  <div className="relative h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <Image
                      src={formData.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      unoptimized={Boolean(formData.image_url?.startsWith('data:') || formData.image_url?.endsWith('.svg'))}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="bg-white text-brand-charcoal text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md cursor-pointer hover:bg-slate-100 flex items-center gap-1.5">
                        <Upload className="h-3.5 w-3.5 text-brand-green" /> Change Image
                        <input type="file" accept="image/*" onChange={handleModalFileUpload} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, image_url: '' }))}
                        className="bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md hover:bg-red-700 flex items-center gap-1.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="h-36 border-2 border-dashed border-slate-300 hover:border-brand-green rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 p-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                      <Upload className="h-5 w-5" />
                    </div>
                    <span className="text-sm text-slate-700 font-semibold">Click to upload photo</span>
                    <span className="text-xs text-slate-400 mt-0.5">Supports PNG, JPG, WebP, SVG</span>
                    <input type="file" accept="image/*" onChange={handleModalFileUpload} className="hidden" />
                  </label>
                )}

                <div className="pt-1">
                  <span className="text-[11px] text-slate-400">Or paste image URL:</span>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData(p => ({ ...p, image_url: e.target.value }))}
                    placeholder="https://..."
                    className="mt-1 text-xs h-8"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="g-feat"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(p => ({ ...p, is_featured: e.target.checked }))}
                  className="rounded border-slate-300 text-brand-green"
                />
                <Label htmlFor="g-feat" className="cursor-pointer text-xs font-semibold">
                  Feature on Homepage Showcase (Top Highlights)
                </Label>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="bg-brand-green text-white hover:bg-brand-green/90">
                  {isSaving ? 'Saving...' : editingItem ? 'Save Changes' : 'Save Showcase Photo'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

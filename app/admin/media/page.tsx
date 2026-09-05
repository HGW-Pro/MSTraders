'use client';

import * as React from 'react';
import Image from 'next/image';
import { 
  FolderGit2, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Plus, 
  Tag, 
  FileImage,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getMediaItems, saveMediaItem, deleteMediaItem, uploadFileToSupabase } from '@/lib/supabase/services';
import { MediaItem } from '@/types';
import { cn } from '@/lib/utils';
import { DatabaseSetupRunner } from '@/components/database-setup-runner';

const MEDIA_CATEGORIES = ['ALL', 'Logo', 'Homepage', 'Products', 'Gallery', 'Industries', 'About'];

export default function AdminMediaLibraryPage() {
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [uploadFile, setUploadFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState('');
  const [altText, setAltText] = React.useState('');
  const [category, setCategory] = React.useState<'Logo' | 'Homepage' | 'Products' | 'Gallery' | 'Industries' | 'About'>('Homepage');
  const [uploading, setUploading] = React.useState(false);

  const loadMedia = React.useCallback(async () => {
    try {
      const data = await getMediaItems(selectedCategory);
      setItems(data);
    } catch (err) {
      toast.error('Failed to load media assets');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  React.useEffect(() => {
    let isMounted = true;
    getMediaItems(selectedCategory).then((data) => {
      if (isMounted) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [selectedCategory]);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Image URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error('Please select an image file to upload');
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadFileToSupabase(uploadFile, 'media');
      if (!publicUrl) throw new Error('Could not upload file');

      const newMedia = await saveMediaItem({
        title: title || uploadFile.name,
        alt_text: altText || title || uploadFile.name,
        url: publicUrl,
        category: category,
        size_bytes: uploadFile.size
      });

      if (newMedia) {
        toast.success('Media uploaded and metadata saved');
        setShowUploadModal(false);
        setUploadFile(null);
        setTitle('');
        setAltText('');
        loadMedia();
      } else {
        toast.error('Failed to save media metadata');
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    const success = await deleteMediaItem(id);
    if (success) {
      toast.success('Media asset deleted');
      loadMedia();
    } else {
      toast.error('Could not delete media asset');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.alt_text || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green block mb-1">
            Digital Asset Management
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-charcoal">
            Media Library & Supabase Storage
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Upload, categorize, preview, and manage images for products, homepage CMS, gallery, and brand logos.
          </p>
        </div>

        <Button 
          onClick={() => setShowUploadModal(true)} 
          className="bg-brand-green hover:bg-emerald-700 text-white font-bold h-11 px-6 shadow-xs"
        >
          <Upload className="h-4 w-4 mr-2" /> Upload New Asset
        </Button>
      </div>

      {/* Database & Storage Provisioning Runner */}
      <DatabaseSetupRunner />

      {/* Filters Bar */}
      <div className="bg-white border border-border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {MEDIA_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                selectedCategory === cat
                  ? "bg-brand-green text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search media..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Loading Media Library...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <FileImage className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="font-heading text-lg font-bold text-brand-charcoal">No Media Assets Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Upload product photos, homepage hero banners, brand logos, or gallery assets to Supabase Storage.
          </p>
          <Button onClick={() => setShowUploadModal(true)} className="bg-brand-green hover:bg-emerald-700 text-white font-bold text-xs mt-2">
            Upload First Asset
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white border border-border rounded-xl overflow-hidden shadow-xs group flex flex-col justify-between">
              <div className="relative aspect-square bg-slate-100 border-b border-border overflow-hidden">
                <Image 
                  src={item.url} 
                  alt={item.alt_text || item.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                  {item.category}
                </span>
              </div>

              <div className="p-3 space-y-2">
                <p className="font-bold text-xs text-brand-charcoal truncate" title={item.title}>
                  {item.title}
                </p>

                <div className="flex items-center gap-1.5 pt-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCopyUrl(item.url, item.id)} 
                    className="flex-1 text-[11px] font-bold h-7 px-2"
                  >
                    {copiedId === item.id ? <Check className="h-3 w-3 text-emerald-600 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    {copiedId === item.id ? 'Copied' : 'Copy Link'}
                  </Button>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(item.id)} 
                    className="text-[11px] font-bold h-7 px-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">Upload Asset to Supabase</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <Label htmlFor="mediaCategory">Asset Category *</Label>
              <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Logo">Logo</SelectItem>
                  <SelectItem value="Homepage">Homepage</SelectItem>
                  <SelectItem value="Products">Products</SelectItem>
                  <SelectItem value="Gallery">Gallery</SelectItem>
                  <SelectItem value="Industries">Industries</SelectItem>
                  <SelectItem value="About">About</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="mediaFile">Image File *</Label>
              <Input 
                id="mediaFile" 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setUploadFile(f);
                    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
                  }
                }} 
                required 
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="mediaTitle">Title / Reference Name *</Label>
              <Input 
                id="mediaTitle" 
                placeholder="e.g. Kraft Paper Bag Banner" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="mediaAlt">Alt Text (For Accessibility & SEO)</Label>
              <Input 
                id="mediaAlt" 
                placeholder="e.g. Customized kraft paper carry bag wholesale" 
                value={altText} 
                onChange={(e) => setAltText(e.target.value)} 
              />
            </div>

            <Button type="submit" disabled={uploading} className="w-full bg-brand-green hover:bg-emerald-700 text-white font-bold h-10 mt-2">
              {uploading ? 'Uploading to Supabase Storage...' : 'Upload & Save Asset'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

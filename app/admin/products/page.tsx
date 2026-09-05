'use client';

import * as React from 'react';
import { Product } from '@/types';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getCategories, 
  uploadFileToSupabase 
} from '@/lib/supabase/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  X, 
  CheckCircle2, 
  Tag, 
  Eye,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { getPricing, formatInr } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | 'published' | 'draft' | 'archived'>('all');

  // Dialog State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Form State
  const [formData, setFormData] = React.useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    sale_price: '',
    category: 'kraft-bags',
    sku: '',
    material: '',
    moq: '500',
    is_featured: false,
    is_customizable: true,
    status: 'published' as 'published' | 'draft' | 'archived',
    images: [] as string[],
    sizes: 'Small, Medium, Large',
    colors: 'Natural Brown, White',
    handles: 'Twisted Paper, Flat Paper',
    printing_options: 'Single Color Screen Print, Offset Print'
  });

  // Pure fetch - no state - so the initial-mount effect and the manual
  // refresh can share it without setting state synchronously in an effect.
  const fetchCatalog = React.useCallback(async () => {
    const [prods, cats] = await Promise.all([
      getProducts({ status: 'all' }),
      getCategories()
    ]);
    return { prods, cats: cats.map(c => ({ name: c.name, slug: c.slug })) };
  }, []);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const { prods, cats } = await fetchCatalog();
      setProducts(prods);
      setCategories(cats);
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [fetchCatalog]);

  React.useEffect(() => {
    let active = true;
    fetchCatalog()
      .then(({ prods, cats }) => {
        if (!active) return;
        setProducts(prods);
        setCategories(cats);
      })
      .catch(() => { if (active) toast.error('Failed to fetch products'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [fetchCatalog]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      sale_price: '',
      category: categories[0]?.slug || 'kraft-bags',
      sku: `MST-SKU-${Math.floor(100 + Math.random() * 900)}`,
      material: '120 GSM Virgin Kraft Paper',
      moq: '500',
      is_featured: false,
      is_customizable: true,
      status: 'published',
      images: ['/images/products/kraft-twisted-handle-bags.svg'],
      sizes: 'Small (8x10x4"), Medium (10x13x5"), Large (16x12x6")',
      colors: 'Natural Brown, White',
      handles: 'Twisted Paper, Ribbon',
      printing_options: 'Screen Print, Foil Stamping'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price ? String(product.price) : '',
      sale_price: product.sale_price ? String(product.sale_price) : '',
      category: product.category,
      sku: product.sku || '',
      material: product.material || '',
      moq: product.moq ? String(product.moq) : '500',
      is_featured: product.is_featured,
      is_customizable: product.is_customizable,
      status: product.status,
      images: product.images && product.images.length > 0 ? product.images : ['/images/products/kraft-twisted-handle-bags.svg'],
      sizes: product.sizes ? product.sizes.join(', ') : '',
      colors: product.colors ? product.colors.join(', ') : '',
      handles: product.handles ? product.handles.join(', ') : '',
      printing_options: product.printing_options ? product.printing_options.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingProduct ? prev.slug : generatedSlug
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    toast.info(`Uploading ${files.length} image(s)...`);
    const newImageUrls: string[] = [];

    for (const file of files) {
      try {
        const url = await uploadFileToSupabase(file, 'product-images');
        if (url) newImageUrls.push(url);
      } catch (err: any) {
        toast.error(err?.message || `Failed to upload ${file.name}`);
      }
    }

    if (newImageUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImageUrls]
      }));
      toast.success(`${newImageUrls.length} image(s) uploaded to storage`);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast.error('Product Name and Category are required');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Product> = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description.trim() || null,
        price: formData.price ? parseFloat(formData.price) : null,
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        category: formData.category,
        sku: formData.sku.trim() || null,
        material: formData.material.trim() || null,
        moq: formData.moq ? parseInt(formData.moq, 10) : 100,
        is_featured: formData.is_featured,
        is_customizable: formData.is_customizable,
        status: formData.status,
        images: formData.images.length > 0 ? formData.images : ['/images/products/kraft-twisted-handle-bags.svg'],
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
        handles: formData.handles ? formData.handles.split(',').map(h => h.trim()).filter(Boolean) : [],
        printing_options: formData.printing_options ? formData.printing_options.split(',').map(p => p.trim()).filter(Boolean) : []
      };

      if (editingProduct) {
        // Seed rows carry a non-uuid id; updateProduct persists them by slug.
        const success = await updateProduct(editingProduct.id, { ...payload, slug: payload.slug });
        if (success) {
          toast.success('Product saved successfully in Supabase');
          setIsModalOpen(false);
          loadData();
        } else {
          toast.error('Failed to save product');
        }
      } else {
        const created = await createProduct(payload);
        if (created) {
          toast.success('New product created in Supabase catalog');
          setIsModalOpen(false);
          loadData();
        } else {
          toast.error('Failed to create product');
        }
      }
    } catch (err: any) {
      toast.error('An error occurred while saving product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string, slug?: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const ok = await deleteProduct(id, slug);
      if (ok) {
        toast.success(`Deleted ${name}`);
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        toast.error('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.material?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-charcoal">Products Catalog</h1>
          <p className="text-sm text-muted-foreground">Manage inventory, custom options, prices, and high-res imagery</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-brand-green text-white hover:bg-brand-green/90 shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-border rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by product name, SKU, material..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Category:</span>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-green w-full md:w-48"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap ml-2">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
            className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-green w-full md:w-36"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-border rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground animate-pulse">Loading catalog from Supabase...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No products found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-semibold">Product</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Price / Rate</th>
                  <th className="px-6 py-3 font-semibold">MOQ</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={`hover:bg-slate-50/60 transition-colors ${product.status === 'archived' ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                          {product.images && product.images[0] ? (
                            <Image 
                              src={product.images[0]} 
                              alt={product.name} 
                              fill 
                              className="object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-slate-400 absolute inset-0 m-auto" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-brand-charcoal flex items-center gap-2">
                            {product.name}
                            {product.is_featured && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                <Sparkles className="h-3 w-3 mr-0.5 text-amber-600" /> Featured
                              </span>
                            )}
                            {product.status !== 'published' && (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                product.status === 'archived'
                                  ? 'bg-slate-200 text-slate-600'
                                  : 'bg-sky-100 text-sky-800'
                              }`}>
                                {product.status}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                            <span>SKU: {product.sku || 'N/A'}</span>
                            <span>•</span>
                            <span>{product.material || 'Standard'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 capitalize">
                      {product.category.replace(/-/g, ' ')}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {getPricing(product).effective !== null ? (
                        <div>
                          <span className="text-brand-charcoal font-bold">{formatInr(getPricing(product).effective)}</span>
                          {getPricing(product).compareAt !== null && (
                            <span className="text-xs text-muted-foreground line-through ml-1.5">{formatInr(getPricing(product).compareAt)}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          Quote Only
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {product.moq || 100} units
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        product.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                        product.status === 'draft' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenEdit(product)}
                        className="h-8 px-2.5 text-xs"
                      >
                        <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(product.id, product.name, product.slug)}
                        className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-slate-50">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prod-name">Product Name *</Label>
                  <Input 
                    id="prod-name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Premium Kraft Paper Bag"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prod-category">Category *</Label>
                  <select 
                    id="prod-category"
                    value={formData.category}
                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-green"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prod-price">Unit Price (₹) (Leave blank for Quote Only)</Label>
                  <Input 
                    id="prod-price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
                    placeholder="18.00"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prod-sale-price">Sale Price (₹)</Label>
                  <Input 
                    id="prod-sale-price"
                    type="number"
                    step="0.01"
                    value={formData.sale_price}
                    onChange={(e) => setFormData(p => ({ ...p, sale_price: e.target.value }))}
                    placeholder="15.00"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prod-moq">Minimum Order Qty (MOQ)</Label>
                  <Input 
                    id="prod-moq"
                    type="number"
                    value={formData.moq}
                    onChange={(e) => setFormData(p => ({ ...p, moq: e.target.value }))}
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prod-sku">SKU Code</Label>
                  <Input 
                    id="prod-sku"
                    value={formData.sku}
                    onChange={(e) => setFormData(p => ({ ...p, sku: e.target.value }))}
                    placeholder="MST-KB-001"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prod-material">Material Specification / GSM</Label>
                  <Input 
                    id="prod-material"
                    value={formData.material}
                    onChange={(e) => setFormData(p => ({ ...p, material: e.target.value }))}
                    placeholder="120 GSM Virgin Kraft Paper"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prod-desc">Product Description</Label>
                <Textarea 
                  id="prod-desc"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Detailed description of materials, durability, and print capability..."
                />
              </div>

              {/* Multi-Image Upload */}
              <div className="space-y-2">
                <Label>Product Gallery Images</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.images.map((imgUrl, i) => (
                    <div key={i} className="relative h-24 rounded-lg overflow-hidden border border-slate-200 group">
                      <Image src={imgUrl} alt={`Product ${i}`} fill className="object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  <label className="h-24 border-2 border-dashed border-slate-300 hover:border-brand-green rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-emerald-50/50">
                    <Upload className="h-5 w-5 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-600 font-medium">Upload Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Custom Options Specs */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Customizable Product Variants (Comma-separated)</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Available Sizes</Label>
                    <Input 
                      value={formData.sizes} 
                      onChange={(e) => setFormData(p => ({ ...p, sizes: e.target.value }))}
                      placeholder="Small (8x10), Medium (10x13), Large"
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Colors Available</Label>
                    <Input 
                      value={formData.colors} 
                      onChange={(e) => setFormData(p => ({ ...p, colors: e.target.value }))}
                      placeholder="Natural Brown, Black, White"
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Handle Options</Label>
                    <Input 
                      value={formData.handles} 
                      onChange={(e) => setFormData(p => ({ ...p, handles: e.target.value }))}
                      placeholder="Twisted Paper, D-Cut, Rope"
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Printing Techniques</Label>
                    <Input 
                      value={formData.printing_options} 
                      onChange={(e) => setFormData(p => ({ ...p, printing_options: e.target.value }))}
                      placeholder="Screen Print, Foil Stamping, Offset"
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Checkboxes & Status */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                    <input 
                      type="checkbox" 
                      checked={formData.is_featured} 
                      onChange={(e) => setFormData(p => ({ ...p, is_featured: e.target.checked }))}
                      className="rounded border-slate-300 text-brand-green focus:ring-brand-green"
                    />
                    Feature on Homepage
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                    <input 
                      type="checkbox" 
                      checked={formData.is_customizable} 
                      onChange={(e) => setFormData(p => ({ ...p, is_customizable: e.target.checked }))}
                      className="rounded border-slate-300 text-brand-green focus:ring-brand-green"
                    />
                    Allow Customization Requests
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="prod-status" className="text-xs">Status:</Label>
                  <select 
                    id="prod-status"
                    value={formData.status}
                    onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as any }))}
                    className="h-9 px-2 rounded-md border border-input text-xs font-semibold bg-background"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-brand-green text-white hover:bg-brand-green/90"
                >
                  {isSaving ? 'Saving to Database...' : editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

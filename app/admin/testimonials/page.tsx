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
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  RefreshCw,
  Eye,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  getTestimonials, 
  saveTestimonial, 
  updateTestimonialStatus, 
  deleteTestimonial 
} from '@/lib/supabase/services';
import { Testimonial } from '@/types';
import { cn } from '@/lib/utils';

export default function AdminTestimonialsPage() {
  const [items, setItems] = React.useState<Testimonial[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'all' | 'pending' | 'published' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [ratingFilter, setRatingFilter] = React.useState<string>('all');
  
  // Create / Edit modal state
  const [showModal, setShowModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Partial<Testimonial> | null>(null);
  const [saving, setSaving] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTestimonials(false); // get all statuses
      setItems(data);
    } catch (err) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Status counts for tabs and dashboard
  const counts = React.useMemo(() => {
    return {
      all: items.length,
      pending: items.filter(i => i.status === 'pending' || i.status === 'draft').length,
      published: items.filter(i => i.status === 'published' || i.status === 'approved').length,
      rejected: items.filter(i => i.status === 'rejected').length,
    };
  }, [items]);

  const avgRating = React.useMemo(() => {
    const published = items.filter(i => i.status === 'published' || i.status === 'approved');
    if (published.length === 0) return '5.0';
    return (published.reduce((acc, curr) => acc + (curr.rating || 5), 0) / published.length).toFixed(1);
  }, [items]);

  // Filter items based on active tab, search, and rating filter
  const filteredItems = React.useMemo(() => {
    return items.filter(item => {
      // Tab filter
      if (activeTab === 'pending' && !(item.status === 'pending' || item.status === 'draft')) return false;
      if (activeTab === 'published' && !(item.status === 'published' || item.status === 'approved')) return false;
      if (activeTab === 'rejected' && item.status !== 'rejected') return false;

      // Rating filter
      if (ratingFilter !== 'all' && item.rating !== parseInt(ratingFilter)) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (item.customer_name || item.name || '').toLowerCase();
        const company = (item.business_name || item.company || '').toLowerCase();
        const content = (item.review || item.content || '').toLowerCase();
        const city = (item.city || '').toLowerCase();
        return name.includes(q) || company.includes(q) || content.includes(q) || city.includes(q);
      }

      return true;
    });
  }, [items, activeTab, ratingFilter, searchQuery]);

  // Quick moderation action: Approve
  const handleApprove = async (id: string, name: string) => {
    const success = await updateTestimonialStatus(id, 'published');
    if (success) {
      toast.success(`Review by "${name}" approved & published live to homepage!`);
      // Update local state instantly
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'published' } : i));
    } else {
      toast.error('Failed to approve testimonial');
    }
  };

  // Quick moderation action: Reject
  const handleReject = async (id: string, name: string) => {
    const success = await updateTestimonialStatus(id, 'rejected');
    if (success) {
      toast.info(`Review by "${name}" marked as rejected`);
      // Update local state instantly
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'rejected' } : i));
    } else {
      toast.error('Failed to reject testimonial');
    }
  };

  const handleOpenCreate = () => {
    setEditingItem({
      name: '',
      company: '',
      role: 'Store Owner',
      city: 'Ujjain',
      content: '',
      rating: 5,
      status: 'published',
      display_order: items.length + 1
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem({
      ...item,
      name: item.customer_name || item.name,
      company: item.business_name || item.company,
      content: item.review || item.content
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.content) {
      toast.error('Please enter client name and testimonial review');
      return;
    }

    setSaving(true);
    try {
      const saved = await saveTestimonial(editingItem);
      if (saved) {
        toast.success('Testimonial saved successfully');
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
    if (!confirm(`Are you sure you want to permanently delete review by "${name}"?`)) return;
    const success = await deleteTestimonial(id);
    if (success) {
      toast.success('Testimonial deleted');
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      toast.error('Could not delete testimonial');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green block mb-1">
            Social Proof & Quality Feedback
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-charcoal">
            Testimonials & Client Feedback Moderation
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review user-submitted client testimonials, approve high-trust wholesale reviews, or reject spam submissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} className="h-10 text-xs font-bold">
            <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5", loading && "animate-spin")} /> Refresh
          </Button>
          <Button onClick={handleOpenCreate} className="bg-brand-green hover:bg-emerald-700 text-white font-bold h-10 px-4 text-xs shadow-xs">
            <Plus className="h-4 w-4 mr-1.5" /> Add Testimonial
          </Button>
        </div>
      </div>

      {/* METRICS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Submissions</span>
          <div className="flex items-center justify-between">
            <span className="font-heading text-2xl font-extrabold text-brand-charcoal">{counts.all}</span>
            <MessageSquareQuote className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-[10px] text-slate-500">All wholesale feedback received</p>
        </div>

        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Awaiting Moderation</span>
          <div className="flex items-center justify-between">
            <span className="font-heading text-2xl font-extrabold text-amber-900">{counts.pending}</span>
            <Clock className="h-5 w-5 text-amber-600 animate-pulse" />
          </div>
          <p className="text-[10px] text-amber-700 font-medium">Pending admin approval</p>
        </div>

        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Live on Homepage</span>
          <div className="flex items-center justify-between">
            <span className="font-heading text-2xl font-extrabold text-emerald-900">{counts.published}</span>
            <CheckCircle2 className="h-5 w-5 text-brand-green" />
          </div>
          <p className="text-[10px] text-emerald-700 font-medium">Approved & publicly visible</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Live Average Rating</span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-2xl font-extrabold text-brand-charcoal">{avgRating}</span>
              <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
            </div>
            <Sparkles className="h-5 w-5 text-brand-gold" />
          </div>
          <p className="text-[10px] text-slate-500">Across approved reviews</p>
        </div>
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                activeTab === 'all' ? "bg-white text-brand-charcoal shadow-2xs" : "text-slate-600 hover:text-slate-900"
              )}
            >
              <span>All Reviews</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-[10px]">{counts.all}</span>
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                activeTab === 'pending' ? "bg-amber-500 text-white shadow-2xs" : "text-amber-800 hover:bg-amber-100/60"
              )}
            >
              <span>Pending Review</span>
              {counts.pending > 0 && (
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-extrabold",
                  activeTab === 'pending' ? "bg-white text-amber-800" : "bg-amber-200 text-amber-900"
                )}>
                  {counts.pending}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('published')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                activeTab === 'published' ? "bg-brand-green text-white shadow-2xs" : "text-emerald-800 hover:bg-emerald-100/60"
              )}
            >
              <span>Approved & Live</span>
              <span className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px]",
                activeTab === 'published' ? "bg-white/30 text-white" : "bg-emerald-200 text-emerald-900"
              )}>
                {counts.published}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('rejected')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                activeTab === 'rejected' ? "bg-red-600 text-white shadow-2xs" : "text-red-800 hover:bg-red-100/60"
              )}
            >
              <span>Rejected</span>
              <span className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px]",
                activeTab === 'rejected' ? "bg-white/30 text-white" : "bg-red-200 text-red-900"
              )}>
                {counts.rejected}
              </span>
            </button>
          </div>

          {/* Search & Rating Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search name, store, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-9 rounded-xl bg-slate-50 border-slate-200"
              />
            </div>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-32 text-xs h-9 rounded-xl bg-slate-50 border-slate-200">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Ratings</SelectItem>
                <SelectItem value="5" className="text-xs">5 Stars ★</SelectItem>
                <SelectItem value="4" className="text-xs">4 Stars ★</SelectItem>
                <SelectItem value="3" className="text-xs">3 Stars ★</SelectItem>
                <SelectItem value="2" className="text-xs">2 Stars ★</SelectItem>
                <SelectItem value="1" className="text-xs">1 Star ★</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* FEEDBACK / TESTIMONIALS CARDS */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Loading Testimonials...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <MessageSquareQuote className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="font-heading text-lg font-bold text-brand-charcoal">No Testimonials Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {activeTab === 'pending' 
              ? 'Great news! All submitted reviews have been moderated.' 
              : activeTab === 'published'
              ? 'No reviews are currently published. Approve incoming feedback or add one manually.'
              : 'No matching feedback submissions found for your filter criteria.'}
          </p>
          <Button onClick={handleOpenCreate} className="bg-brand-green hover:bg-emerald-700 text-white font-bold text-xs mt-2">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Manual Review
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((t) => {
            const isPending = t.status === 'pending' || t.status === 'draft';
            const isPublished = t.status === 'published' || t.status === 'approved';
            const isRejected = t.status === 'rejected';

            return (
              <div 
                key={t.id} 
                className={cn(
                  "bg-white border rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between transition-all",
                  isPending ? "border-amber-300 bg-amber-50/20 ring-1 ring-amber-200" : "border-slate-200"
                )}
              >
                <div className="space-y-3">
                  {/* Top Bar: Stars + Status Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("h-3.5 w-3.5", i < (t.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-1">({t.rating || 5}/5)</span>
                    </div>

                    <span className={cn(
                      "text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1",
                      isPublished && "bg-emerald-50 text-emerald-800 border-emerald-300",
                      isPending && "bg-amber-100 text-amber-900 border-amber-300 animate-pulse",
                      isRejected && "bg-red-50 text-red-800 border-red-300"
                    )}>
                      {isPending && <Clock className="h-3 w-3" />}
                      {isPublished && <Check className="h-3 w-3" />}
                      {isRejected && <X className="h-3 w-3" />}
                      <span>{t.status}</span>
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-slate-800 italic leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    &ldquo;{t.content || t.review}&rdquo;
                  </p>

                  {/* Product purchased tag if present */}
                  {t.product_purchased && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-600">
                      <Package className="h-3.5 w-3.5 text-brand-green shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">{t.product_purchased}</span>
                    </div>
                  )}

                  {/* Client Details */}
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-brand-charcoal">{t.customer_name || t.name}</p>
                      {t.created_at && (
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>

                    {(t.business_name || t.company || t.role || t.city) && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 flex-wrap">
                        {t.business_name || t.company ? (
                          <span className="font-semibold text-slate-700">{t.business_name || t.company}</span>
                        ) : null}
                        {t.role && <span>• {t.role}</span>}
                        {t.city && <span className="text-brand-green font-medium">({t.city})</span>}
                      </p>
                    )}

                    {/* Optional verification contact info */}
                    {(t.phone || t.email) && (
                      <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-500">
                        {t.phone && (
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="h-2.5 w-2.5" /> {t.phone}
                          </span>
                        )}
                        {t.email && (
                          <span className="flex items-center gap-1 truncate max-w-[150px]">
                            <Mail className="h-2.5 w-2.5" /> {t.email}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* MODERATION ACTION CONTROLS */}
                <div className="pt-3 border-t border-border/80 space-y-2">
                  {/* Primary Moderation Quick Buttons */}
                  <div className="flex items-center gap-2">
                    {!isPublished && (
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(t.id, t.customer_name || t.name || 'Client')}
                        className="flex-1 bg-brand-green hover:bg-emerald-700 text-white font-bold text-xs h-8 shadow-xs"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" /> Approve & Publish
                      </Button>
                    )}

                    {isPublished && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReject(t.id, t.customer_name || t.name || 'Client')}
                        className="flex-1 text-xs font-bold text-amber-700 border-amber-200 hover:bg-amber-50 h-8"
                      >
                        <X className="h-3.5 w-3.5 mr-1" /> Unpublish / Reject
                      </Button>
                    )}

                    {!isRejected && isPending && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReject(t.id, t.customer_name || t.name || 'Client')}
                        className="text-xs font-bold text-red-600 border-red-200 hover:bg-red-50 h-8 px-2.5"
                        title="Reject Review"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  {/* Secondary Edit / Delete */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleOpenEdit(t)} 
                      className="text-slate-600 hover:text-brand-green text-xs font-semibold h-7 px-2"
                    >
                      <Edit2 className="h-3 w-3 mr-1" /> Edit Specs
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(t.id, t.customer_name || t.name || 'Client')} 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs font-semibold h-7 px-2"
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT TESTIMONIAL MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              {editingItem?.id ? 'Edit Testimonial & Review' : 'Add Client Review'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure feedback copy, rating, store designation, and publication status.
            </DialogDescription>
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
                className="text-xs h-9 rounded-xl"
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
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tRole">Role / Title</Label>
                <Input 
                  id="tRole" 
                  placeholder="e.g. Managing Partner" 
                  value={editingItem?.role || ''} 
                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })} 
                  className="text-xs h-9 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="tCity">City / Location</Label>
                <Input 
                  id="tCity" 
                  placeholder="e.g. Ujjain" 
                  value={editingItem?.city || ''} 
                  onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })} 
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tProduct">Product Purchased</Label>
                <Input 
                  id="tProduct" 
                  placeholder="e.g. W-Cut Vest Bags" 
                  value={editingItem?.product_purchased || ''} 
                  onChange={(e) => setEditingItem({ ...editingItem, product_purchased: e.target.value })} 
                  className="text-xs h-9 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="tContent">Testimonial Review Copy *</Label>
              <Textarea 
                id="tContent" 
                rows={3}
                placeholder="Client feedback regarding bag GSM, flexo printing, wholesale delivery..." 
                value={editingItem?.content || ''} 
                onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })} 
                required 
                className="text-xs rounded-xl resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="tRating">Star Rating (1-5)</Label>
                <Select 
                  value={String(editingItem?.rating || 5)} 
                  onValueChange={(val) => setEditingItem({ ...editingItem, rating: parseInt(val) || 5 })}
                >
                  <SelectTrigger id="tRating" className="text-xs h-9 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5" className="text-xs">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                    <SelectItem value="4" className="text-xs">⭐⭐⭐⭐ 4 Stars</SelectItem>
                    <SelectItem value="3" className="text-xs">⭐⭐⭐ 3 Stars</SelectItem>
                    <SelectItem value="2" className="text-xs">⭐⭐ 2 Stars</SelectItem>
                    <SelectItem value="1" className="text-xs">⭐ 1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="tStatus">Moderation Status</Label>
                <Select 
                  value={editingItem?.status || 'published'} 
                  onValueChange={(val: any) => setEditingItem({ ...editingItem, status: val })}
                >
                  <SelectTrigger id="tStatus" className="text-xs h-9 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published" className="text-xs font-bold text-emerald-800">Published / Live</SelectItem>
                    <SelectItem value="pending" className="text-xs font-bold text-amber-800">Pending Review</SelectItem>
                    <SelectItem value="rejected" className="text-xs font-bold text-red-800">Rejected</SelectItem>
                    <SelectItem value="draft" className="text-xs">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full bg-brand-green hover:bg-emerald-700 text-white font-bold h-10 rounded-xl mt-2 text-xs">
              {saving ? 'Saving...' : 'Save & Update Testimonial'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


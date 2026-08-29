'use client';

import * as React from 'react';
import { Quote, QuoteStatus } from '@/types';
import { getQuotes, updateQuoteStatus } from '@/lib/supabase/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  FileText, 
  Eye, 
  Send, 
  CheckCircle2, 
  Clock, 
  X, 
  Download, 
  Paperclip, 
  PhoneCall, 
  MessageSquare,
  IndianRupee,
  Building2,
  Mail,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');

  // Selected Quote Detail Modal
  const [selectedQuote, setSelectedQuote] = React.useState<Quote | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Quote editing fields
  const [quoteAmount, setQuoteAmount] = React.useState<string>('0');
  const [shippingAmount, setShippingAmount] = React.useState<string>('0');
  const [taxAmount, setTaxAmount] = React.useState<string>('0');
  const [quoteNotes, setQuoteNotes] = React.useState<string>('');
  const [quoteStatus, setQuoteStatus] = React.useState<QuoteStatus>('NEW');

  const loadQuotes = React.useCallback(async () => {
    try {
      const data = await getQuotes(statusFilter);
      setQuotes(data);
    } catch (err) {
      toast.error('Failed to load quotes from Supabase');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  React.useEffect(() => {
    let active = true;
    getQuotes(statusFilter).then((data) => {
      if (active) {
        setQuotes(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [statusFilter]);

  const handleOpenDetail = (quote: Quote) => {
    setSelectedQuote(quote);
    setQuoteAmount(quote.amount ? String(quote.amount) : '0');
    setShippingAmount(quote.shipping_amount ? String(quote.shipping_amount) : '0');
    setTaxAmount(quote.tax_amount ? String(quote.tax_amount) : '0');
    setQuoteNotes(quote.notes || '');
    setQuoteStatus(quote.status);
  };

  const handleSaveQuoteUpdate = async () => {
    if (!selectedQuote) return;

    setIsUpdating(true);
    try {
      const amt = parseFloat(quoteAmount) || 0;
      const ship = parseFloat(shippingAmount) || 0;
      const tax = parseFloat(taxAmount) || 0;
      const total = amt + ship + tax;

      const success = await updateQuoteStatus(selectedQuote.id, {
        status: quoteStatus,
        amount: amt,
        shipping_amount: ship,
        tax_amount: tax,
        total_amount: total,
        notes: quoteNotes
      });

      if (success) {
        toast.success(`Quote ${selectedQuote.quote_number} updated successfully`);
        setSelectedQuote(null);
        loadQuotes();
      } else {
        toast.error('Failed to update quote');
      }
    } catch (err) {
      toast.error('Error updating quote');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch = 
      q.quote_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.phone.includes(searchQuery) ||
      (q.business_name && q.business_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">NEW</span>;
      case 'CONTACTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">CONTACTED</span>;
      case 'REVIEWING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">REVIEWING</span>;
      case 'QUOTE_SENT':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">QUOTE SENT</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">APPROVED</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">REJECTED</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-white">COMPLETED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-charcoal">Quotes Management</h1>
          <p className="text-sm text-muted-foreground">Manage custom bag inquiries, issue formal pricing, and review artwork attachments</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-border rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by quote #, name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Filter Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-green w-full md:w-48"
          >
            <option value="ALL">All Quotes</option>
            <option value="NEW">New Inquiries</option>
            <option value="CONTACTED">Contacted</option>
            <option value="REVIEWING">Reviewing Specs</option>
            <option value="QUOTE_SENT">Quote Sent</option>
            <option value="APPROVED">Approved / Confirmed</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white border border-border rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground animate-pulse">Fetching quote inquiries from Supabase...</div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No quote inquiries found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-semibold">Quote #</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Bag Type & Quantity</th>
                  <th className="px-6 py-3 font-semibold">Submitted Date</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-charcoal font-mono">
                      {quote.quote_number}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-800">{quote.customer_name}</div>
                        <div className="text-xs text-muted-foreground">{quote.business_name || quote.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 capitalize">{quote.bag_type.replace(/-/g, ' ')}</div>
                      <div className="text-xs text-brand-green font-bold">{quote.quantity.toLocaleString()} units</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(quote.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(quote.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        size="sm" 
                        onClick={() => handleOpenDetail(quote)}
                        className="bg-brand-charcoal text-white hover:bg-slate-800 h-8 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> View & Quote
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-slate-900 text-white">
              <div>
                <div className="text-xs font-mono text-brand-gold uppercase tracking-wider font-semibold">
                  Quote Specification File
                </div>
                <h2 className="font-heading text-xl font-bold flex items-center gap-2 mt-0.5">
                  {selectedQuote.quote_number}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedQuote(null)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer Profile Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Customer Name:</span>
                  <span className="text-slate-900 font-bold text-sm">{selectedQuote.customer_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Company / Business Name:</span>
                  <span className="text-slate-900 font-semibold text-sm">{selectedQuote.business_name || 'Individual Inquiry'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Email Address:</span>
                  <a href={`mailto:${selectedQuote.email}`} className="text-brand-green font-semibold hover:underline">
                    {selectedQuote.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Phone / WhatsApp:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-slate-800">{selectedQuote.phone}</span>
                    <a 
                      href={`https://wa.me/${selectedQuote.whatsapp || selectedQuote.phone}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-700"
                    >
                      WhatsApp Chat
                    </a>
                  </div>
                </div>
                {selectedQuote.city && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 font-medium block">Location / City:</span>
                    <span className="text-slate-800 font-medium">{selectedQuote.city}</span>
                  </div>
                )}
              </div>

              {/* Bag Requirements Breakdown */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-brand-charcoal uppercase tracking-wider">Required Technical Specifications</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block">Bag Type</span>
                    <span className="font-bold text-slate-900 capitalize text-sm">{selectedQuote.bag_type.replace(/-/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Quantity</span>
                    <span className="font-bold text-brand-green text-sm">{selectedQuote.quantity.toLocaleString()} units</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Material / GSM</span>
                    <span className="font-semibold text-slate-900">{selectedQuote.material || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Handle Type</span>
                    <span className="font-semibold text-slate-900">{selectedQuote.handle_type || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Printing Option</span>
                    <span className="font-semibold text-slate-900">{selectedQuote.printing || 'Custom Print'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Dimensions / Size</span>
                    <span className="font-semibold text-slate-900">{selectedQuote.size || 'Custom Size'}</span>
                  </div>
                </div>
              </div>

              {/* Attachments & Files */}
              {selectedQuote.attachments && selectedQuote.attachments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Paperclip className="h-4 w-4 text-brand-green" /> Customer Artwork / Spec Attachments
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedQuote.attachments.map((attUrl, idx) => (
                      <a 
                        key={idx}
                        href={attUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5 text-brand-green" />
                        <span>View Attachment #{idx + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial Quoting Form */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                  <IndianRupee className="h-4 w-4 text-emerald-700" /> Commercial Quotation Builder
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-slate-700 font-semibold">Production Amount (₹)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={quoteAmount}
                      onChange={(e) => setQuoteAmount(e.target.value)}
                      className="mt-1 font-bold bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-700 font-semibold">Shipping / Logistics (₹)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={shippingAmount}
                      onChange={(e) => setShippingAmount(e.target.value)}
                      className="mt-1 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-700 font-semibold">GST / Tax (₹)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={taxAmount}
                      onChange={(e) => setTaxAmount(e.target.value)}
                      className="mt-1 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase">Calculated Total Quote Amount:</span>
                  <span className="text-lg font-extrabold text-brand-green">
                    ₹{((parseFloat(quoteAmount) || 0) + (parseFloat(shippingAmount) || 0) + (parseFloat(taxAmount) || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Status Update & Internal Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="q-status" className="font-bold">Inquiry Pipeline Status</Label>
                  <select 
                    id="q-status"
                    value={quoteStatus}
                    onChange={(e) => setQuoteStatus(e.target.value as QuoteStatus)}
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  >
                    <option value="NEW">NEW - Newly Received</option>
                    <option value="CONTACTED">CONTACTED - Customer Spoken To</option>
                    <option value="REVIEWING">REVIEWING - Engineering Specs</option>
                    <option value="QUOTE_SENT">QUOTE SENT - Pricing Issued</option>
                    <option value="APPROVED">APPROVED - Order Confirmed</option>
                    <option value="REJECTED">REJECTED - Declined / Cancelled</option>
                    <option value="COMPLETED">COMPLETED - Order Delivered</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="q-notes" className="font-bold">Internal Staff Notes</Label>
                  <Textarea 
                    id="q-notes"
                    rows={2}
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    placeholder="Enter production notes, lead time commitments..."
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-slate-50 flex items-center justify-between">
              <Button variant="outline" onClick={() => setSelectedQuote(null)}>
                Close
              </Button>

              <Button 
                onClick={handleSaveQuoteUpdate}
                disabled={isUpdating}
                className="bg-brand-green text-white hover:bg-brand-green/90 font-semibold"
              >
                {isUpdating ? 'Saving Changes...' : 'Save & Update Quote'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

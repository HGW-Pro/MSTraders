'use client';

import * as React from 'react';
import Link from 'next/link';
import { Quote, QuoteStatus } from '@/types';
import { getQuotes, updateQuoteStatus, convertQuoteToOrder } from '@/lib/supabase/services';
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
  MapPin,
  Share2,
  Copy,
  ExternalLink,
  ShoppingCart
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
  const [unitPrice, setUnitPrice] = React.useState<string>('0');
  const [subtotalAmount, setSubtotalAmount] = React.useState<string>('0');
  const [customizationCharges, setCustomizationCharges] = React.useState<string>('0');
  const [deliveryCharges, setDeliveryCharges] = React.useState<string>('0');
  const [discountAmount, setDiscountAmount] = React.useState<string>('0');
  const [taxAmount, setTaxAmount] = React.useState<string>('0');
  const [totalAmount, setTotalAmount] = React.useState<string>('0');
  const [validUntilDate, setValidUntilDate] = React.useState<string>('');
  const [adminNotes, setAdminNotes] = React.useState<string>('');
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
    const qty = quote.quantity || 1;
    const sub = quote.subtotal || quote.amount || 0;
    const uPrice = quote.unit_price || (sub > 0 ? sub / qty : 0);
    
    setUnitPrice(String(uPrice));
    setSubtotalAmount(String(sub));
    setCustomizationCharges(String(quote.customization_charges || 0));
    setDeliveryCharges(String(quote.delivery_charges || quote.shipping_amount || 0));
    setDiscountAmount(String(quote.discount || 0));
    setTaxAmount(String(quote.tax_amount || 0));
    setTotalAmount(String(quote.total_amount || quote.amount || 0));
    setValidUntilDate(quote.valid_until ? quote.valid_until.slice(0, 10) : '');
    setAdminNotes(quote.admin_notes || quote.notes || '');
    setQuoteStatus(quote.status);
  };

  const handleRecalculateTotal = (
    uP: string, sub: string, cust: string, del: string, disc: string, tx: string, qty: number
  ) => {
    const unitP = parseFloat(uP) || 0;
    const subT = parseFloat(sub) || (unitP * qty);
    const cCharges = parseFloat(cust) || 0;
    const dCharges = parseFloat(del) || 0;
    const dAmount = parseFloat(disc) || 0;
    const tAmount = parseFloat(tx) || 0;

    const computedTotal = subT + cCharges + dCharges + tAmount - dAmount;
    setTotalAmount(String(Math.max(0, computedTotal)));
  };

  const handleSaveQuoteUpdate = async () => {
    if (!selectedQuote) return;

    setIsUpdating(true);
    try {
      const uPrice = parseFloat(unitPrice) || 0;
      const sub = parseFloat(subtotalAmount) || (uPrice * selectedQuote.quantity);
      const cust = parseFloat(customizationCharges) || 0;
      const del = parseFloat(deliveryCharges) || 0;
      const disc = parseFloat(discountAmount) || 0;
      const tax = parseFloat(taxAmount) || 0;
      const tot = parseFloat(totalAmount) || (sub + cust + del + tax - disc);

      const success = await updateQuoteStatus(selectedQuote.id, {
        status: quoteStatus,
        unit_price: uPrice,
        subtotal: sub,
        customization_charges: cust,
        delivery_charges: del,
        discount: disc,
        tax_amount: tax,
        total_amount: tot,
        amount: sub,
        shipping_amount: del,
        valid_until: validUntilDate ? new Date(validUntilDate).toISOString() : null,
        admin_notes: adminNotes,
        notes: adminNotes
      });

      if (success) {
        toast.success(`Quote ${selectedQuote.quote_number} updated & saved`);
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

  const handleConvertToOrder = async () => {
    if (!selectedQuote) return;
    if (!confirm(`Convert Quote ${selectedQuote.quote_number} directly to a confirmed Order?`)) return;

    setIsUpdating(true);
    try {
      const order = await convertQuoteToOrder(selectedQuote.id, {
        payment_method: 'Quotation Billing',
        delivery_notes: 'Converted by Admin from Quotes Panel'
      });

      if (order) {
        toast.success(`Order ${order.order_number} created successfully!`);
        setSelectedQuote(null);
        loadQuotes();
      } else {
        toast.error('Failed to convert quote to order.');
      }
    } catch (err) {
      toast.error('Error converting quote to order');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyLink = () => {
    if (!selectedQuote) return;
    const link = `${window.location.origin}/quotes/${selectedQuote.id}`;
    navigator.clipboard.writeText(link);
    toast.success('Customer Quotation link copied to clipboard!');
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
      case 'SUBMITTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">NEW</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">UNDER REVIEW</span>;
      case 'QUOTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">QUOTE SENT</span>;
      case 'CHANGES_REQUESTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">REVISION REQUESTED</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">APPROVED</span>;
      case 'CONVERTED_TO_ORDER':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white">CONVERTED TO ORDER</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">REJECTED</span>;
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

              {/* Customer Share & Action Links */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Share2 className="h-4 w-4 text-brand-green" /> Customer Link:
                  <span className="font-mono text-[11px] text-slate-600 underline">/quotes/{selectedQuote.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleCopyLink} className="h-7 text-[11px] bg-white">
                    <Copy className="h-3 w-3 mr-1" /> Copy Link
                  </Button>
                  <Button size="sm" variant="outline" asChild className="h-7 text-[11px] bg-white">
                    <Link href={`/quotes/${selectedQuote.id}`} target="_blank">
                      <ExternalLink className="h-3 w-3 mr-1" /> Open Portal
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Financial Quoting Form */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                    <IndianRupee className="h-4 w-4 text-emerald-700" /> Commercial Quotation Builder
                  </h3>
                  <span className="text-xs text-emerald-700 font-semibold">Qty: {selectedQuote.quantity} units</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-[11px] text-slate-700 font-semibold">Unit Price (₹)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={unitPrice}
                      onChange={(e) => {
                        setUnitPrice(e.target.value);
                        handleRecalculateTotal(e.target.value, subtotalAmount, customizationCharges, deliveryCharges, discountAmount, taxAmount, selectedQuote.quantity);
                      }}
                      className="mt-1 font-bold bg-white text-xs h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-slate-700 font-semibold">Subtotal (₹)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={subtotalAmount}
                      onChange={(e) => {
                        setSubtotalAmount(e.target.value);
                        handleRecalculateTotal(unitPrice, e.target.value, customizationCharges, deliveryCharges, discountAmount, taxAmount, selectedQuote.quantity);
                      }}
                      className="mt-1 bg-white text-xs h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-slate-700 font-semibold">Custom Print Setup (₹)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={customizationCharges}
                      onChange={(e) => {
                        setCustomizationCharges(e.target.value);
                        handleRecalculateTotal(unitPrice, subtotalAmount, e.target.value, deliveryCharges, discountAmount, taxAmount, selectedQuote.quantity);
                      }}
                      className="mt-1 bg-white text-xs h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-slate-700 font-semibold">Delivery Charge (₹)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={deliveryCharges}
                      onChange={(e) => {
                        setDeliveryCharges(e.target.value);
                        handleRecalculateTotal(unitPrice, subtotalAmount, customizationCharges, e.target.value, discountAmount, taxAmount, selectedQuote.quantity);
                      }}
                      className="mt-1 bg-white text-xs h-9"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px] text-slate-700 font-semibold">Special Discount (₹)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={discountAmount}
                      onChange={(e) => {
                        setDiscountAmount(e.target.value);
                        handleRecalculateTotal(unitPrice, subtotalAmount, customizationCharges, deliveryCharges, e.target.value, taxAmount, selectedQuote.quantity);
                      }}
                      className="mt-1 bg-white text-xs h-9 text-emerald-800 font-semibold"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px] text-slate-700 font-semibold">GST / Tax Amount (₹)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={taxAmount}
                      onChange={(e) => {
                        setTaxAmount(e.target.value);
                        handleRecalculateTotal(unitPrice, subtotalAmount, customizationCharges, deliveryCharges, discountAmount, e.target.value, selectedQuote.quantity);
                      }}
                      className="mt-1 bg-white text-xs h-9"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px] text-slate-700 font-semibold">Total Price (₹)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      className="mt-1 bg-white font-bold text-brand-green text-xs h-9"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px] text-slate-700 font-semibold">Quote Valid Until</Label>
                    <Input 
                      type="date"
                      value={validUntilDate}
                      onChange={(e) => setValidUntilDate(e.target.value)}
                      className="mt-1 bg-white text-xs h-9"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase">Calculated Grand Total Amount:</span>
                  <span className="text-lg font-extrabold text-brand-green font-mono">
                    ₹{Number(totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Status Update & Internal Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="q-status" className="font-bold text-xs">Inquiry Pipeline Status</Label>
                  <select 
                    id="q-status"
                    value={quoteStatus}
                    onChange={(e) => setQuoteStatus(e.target.value as QuoteStatus)}
                    className="w-full h-9 px-3 py-1.5 rounded-md border border-input bg-background text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  >
                    <option value="NEW">NEW - Newly Received</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW - Reviewing Specs</option>
                    <option value="QUOTED">QUOTED - Official Price Issued</option>
                    <option value="CHANGES_REQUESTED">CHANGES_REQUESTED - Customer Requested Edits</option>
                    <option value="APPROVED">APPROVED - Approved by Customer</option>
                    <option value="CONVERTED_TO_ORDER">CONVERTED_TO_ORDER - Order Generated</option>
                    <option value="REJECTED">REJECTED - Declined / Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="q-notes" className="font-bold text-xs">Admin Commitment & Notes for Customer</Label>
                  <Textarea 
                    id="q-notes"
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Enter fulfillment commitments, lead-time notes, sample instructions..."
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-slate-50 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedQuote(null)}>
                  Close
                </Button>
                {selectedQuote.status !== 'CONVERTED_TO_ORDER' && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleConvertToOrder}
                    disabled={isUpdating}
                    className="border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-bold text-xs"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1 text-emerald-700" /> Convert to Order
                  </Button>
                )}
              </div>

              <Button 
                onClick={handleSaveQuoteUpdate}
                disabled={isUpdating}
                className="bg-brand-green text-white hover:bg-brand-green/90 font-semibold text-xs h-9 px-5"
              >
                {isUpdating ? 'Saving Changes...' : 'Save & Publish Quote'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

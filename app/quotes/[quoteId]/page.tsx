'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Quote, BusinessSettings } from '@/types';
import { getQuoteById, getQuoteByNumber, updateQuoteStatus, convertQuoteToOrder, getSettings } from '@/lib/db/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Printer, 
  ArrowLeft, 
  Building2, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  PackageCheck, 
  FileText,
  Truck,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerQuoteViewPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.quoteId as string;

  const [quote, setQuote] = React.useState<Quote | null>(null);
  const [settings, setSettingsData] = React.useState<BusinessSettings | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Search input for guest quote lookup if no direct ID
  const [searchQuoteNum, setSearchQuoteNum] = React.useState('');
  const [searchPhone, setSearchPhone] = React.useState('');
  const [lookupError, setLookupError] = React.useState('');

  // Change request modal/form state
  const [showChangeModal, setShowChangeModal] = React.useState(false);
  const [changeNotes, setChangeNotes] = React.useState('');

  // Approval modal state
  const [showApproveModal, setShowApproveModal] = React.useState(false);
  const [deliveryNotes, setDeliveryNotes] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('Pay on Delivery / Pickup');

  const fetchQuoteData = React.useCallback(async () => {
    if (!rawId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let data = await getQuoteById(rawId);
      if (!data) {
        // Try looking up by quote_number
        data = await getQuoteByNumber(rawId);
      }
      setQuote(data);
      const bizSettings = await getSettings();
      setSettingsData(bizSettings);
    } catch (err) {
      toast.error('Failed to load quotation details');
    } finally {
      setLoading(false);
    }
  }, [rawId]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuoteData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchQuoteData]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuoteNum.trim()) {
      toast.error('Please enter a Quote Number');
      return;
    }
    setLoading(true);
    setLookupError('');
    try {
      const q = await getQuoteByNumber(searchQuoteNum.trim());
      if (q) {
        setQuote(q);
        const bizSettings = await getSettings();
        setSettingsData(bizSettings);
      } else {
        setLookupError('No quote found matching this quote number.');
      }
    } catch (err) {
      setLookupError('Quote lookup failed. Please verify the quote reference number.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveQuote = async () => {
    if (!quote) return;
    setIsSubmitting(true);
    try {
      const order = await convertQuoteToOrder(quote.id, {
        payment_method: paymentMethod,
        delivery_notes: deliveryNotes,
        customer_notes: 'Approved by customer via Web Quotation Portal'
      });

      if (order) {
        toast.success('Quotation Approved! Your wholesale order has been confirmed.');
        setShowApproveModal(false);
        // Refresh quote status
        await fetchQuoteData();
      } else {
        toast.error('Failed to convert quote to order. Please contact support.');
      }
    } catch (err) {
      toast.error('An error occurred during approval.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote || !changeNotes.trim()) {
      toast.error('Please describe the changes required');
      return;
    }
    setIsSubmitting(true);
    try {
      const success = await updateQuoteStatus(quote.id, {
        status: 'CHANGES_REQUESTED',
        customer_notes: changeNotes.trim()
      });

      if (success) {
        toast.success('Change request sent to MS TRADERS team!');
        setShowChangeModal(false);
        setChangeNotes('');
        await fetchQuoteData();
      } else {
        toast.error('Failed to send change request');
      }
    } catch (err) {
      toast.error('Error submitting change request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!quote) return;
    if (!confirm('Are you sure you wish to decline this quote?')) return;
    setIsSubmitting(true);
    try {
      const success = await updateQuoteStatus(quote.id, {
        status: 'REJECTED'
      });
      if (success) {
        toast.info('Quote declined.');
        await fetchQuoteData();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">Retrieving official quotation record...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
          <FileText className="h-12 w-12 text-brand-green mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-slate-900 mb-2">Quotation Portal</h1>
          <p className="text-xs text-slate-500 mb-6">
            Enter your formal Quote Number (e.g. MST-QT-20260829-5821) to view specifications, pricing breakdown, and approve your order.
          </p>

          <form onSubmit={handleLookup} className="space-y-4 text-left">
            <div>
              <Label htmlFor="qnum" className="text-xs font-bold text-slate-700">Quote Reference Number</Label>
              <Input 
                id="qnum" 
                placeholder="MST-QT-XXXX..." 
                value={searchQuoteNum}
                onChange={(e) => setSearchQuoteNum(e.target.value)}
                className="mt-1"
              />
            </div>
            {lookupError && (
              <p className="text-xs text-red-600 font-medium">{lookupError}</p>
            )}
            <Button type="submit" className="w-full bg-brand-green text-white hover:bg-emerald-700 font-bold">
              View Formal Quotation
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
            Need help locating your quote? <br />
            Contact MS TRADERS Desk on <a href="https://wa.me/919131268724" target="_blank" rel="noreferrer" className="text-brand-green font-bold hover:underline">+91 91312 68724</a>
          </div>
        </div>
      </div>
    );
  }

  // Calculate status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'CONVERTED_TO_ORDER':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> APPROVED & CONFIRMED</span>;
      case 'QUOTED':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">OFFICIAL QUOTE PUBLISHED</span>;
      case 'CHANGES_REQUESTED':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">REVISION REQUESTED</span>;
      case 'REJECTED':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-200"><XCircle className="h-3.5 w-3.5" /> DECLINED</span>;
      case 'NEW':
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
      default:
        return <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">UNDER ADMIN REVIEW</span>;
    }
  };

  const isPricingAvailable = (quote.total_amount ?? 0) > 0 || (quote.unit_price ?? 0) > 0;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Action Header for Screen View */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <Link href="/shop" className="text-xs font-semibold text-slate-600 hover:text-brand-green flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Product Catalog
          </Link>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.print()}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold"
            >
              <Printer className="h-4 w-4 mr-1.5 text-slate-600" /> Print / Save PDF
            </Button>
            <Button 
              variant="outline"
              size="sm"
              asChild
              className="border-emerald-200 text-emerald-800 hover:bg-emerald-50 text-xs font-bold"
            >
              <a 
                href={`https://wa.me/919131268724?text=${encodeURIComponent(`Hi MS TRADERS, regarding Quote ${quote.quote_number} for ${quote.bag_type}:`)}`} 
                target="_blank" 
                rel="noreferrer"
              >
                WhatsApp Inquiry
              </a>
            </Button>
          </div>
        </div>

        {/* Official Quotation Printable Sheet */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10 print:shadow-none print:border-none print:p-0">
          
          {/* Header Banner */}
          <div className="border-b border-slate-200 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-brand-green text-white font-bold text-xs tracking-widest px-2.5 py-0.5 rounded">MS TRADERS</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Wholesale & Retail Bag Supplier</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">Commercial Price Quotation</h1>
              <p className="text-xs text-slate-500 mt-1">
                57 Kalalseri, Behind Power House, Dabri Pitha, Ujjain (M.P) 456006 <br />
                Ph: +91 91312 68724 / +91 90094 46352 | Email: contact@mstradersujjain.com
              </p>
            </div>

            <div className="sm:text-right space-y-1.5">
              <div>{getStatusBadge(quote.status)}</div>
              <div className="text-sm font-bold text-slate-900 mt-2">Quote #: <span className="font-mono text-brand-green">{quote.quote_number}</span></div>
              <div className="text-xs text-slate-500">Date: {new Date(quote.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              {quote.valid_until && (
                <div className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                  Valid Until: {new Date(quote.valid_until).toLocaleDateString('en-IN')}
                </div>
              )}
            </div>
          </div>

          {/* Client & Shipping Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-brand-green" /> Customer Details
              </h2>
              <div className="text-sm font-bold text-slate-900">{quote.customer_name}</div>
              {quote.business_name && (
                <div className="text-xs font-semibold text-slate-700">{quote.business_name}</div>
              )}
              <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                <Phone className="h-3 w-3 text-slate-400" /> {quote.phone} {quote.whatsapp ? `(WA: ${quote.whatsapp})` : ''}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">{quote.email}</div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand-green" /> Delivery Destination
              </h2>
              <div className="text-xs text-slate-800 font-medium leading-relaxed">
                {quote.delivery_address || quote.city || 'Ujjain (M.P) / Store Dispatch'}
              </div>
              <div className="text-xs text-slate-500 mt-2 font-medium">
                Delivery Method: <span className="text-slate-800 font-bold">MS TRADERS Direct Transport / Local Dispatch</span>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-brand-green" /> Bag Specifications & Order Parameters
            </h2>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Bag Type / Category</th>
                    <th className="p-3">Required Quantity</th>
                    <th className="p-3">Material & Paper GSM</th>
                    <th className="p-3">Handle Type</th>
                    <th className="p-3">Custom Printing</th>
                    <th className="p-3">Dimensions / Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  <tr>
                    <td className="p-3 font-bold text-brand-green">{quote.bag_type}</td>
                    <td className="p-3 font-bold text-slate-900">{quote.quantity.toLocaleString('en-IN')} Units</td>
                    <td className="p-3">{quote.material || 'Standard Kraft / Non-Woven'}</td>
                    <td className="p-3">{quote.handle_type || 'Standard D-Cut / Cut Handle'}</td>
                    <td className="p-3 font-semibold text-slate-900">{quote.printing || 'Custom Logo Print'}</td>
                    <td className="p-3">{quote.size || 'Custom Size'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {quote.notes && (
              <div className="mt-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700">
                <span className="font-bold text-slate-900">Customer Notes:</span> {quote.notes}
              </div>
            )}
          </div>

          {/* Pricing & Financial Breakdown */}
          {isPricingAvailable ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
              <h2 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-green" /> Financial Pricing Breakdown
              </h2>

              <div className="space-y-2.5 text-xs">
                {quote.unit_price ? (
                  <div className="flex justify-between text-slate-700">
                    <span>Base Price per Unit ({quote.quantity} units)</span>
                    <span className="font-mono font-medium">₹{Number(quote.unit_price).toFixed(2)} / unit</span>
                  </div>
                ) : null}

                <div className="flex justify-between text-slate-700">
                  <span>Subtotal (Base Order Value)</span>
                  <span className="font-mono font-semibold">₹{Number(quote.subtotal || quote.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                {(quote.customization_charges ?? 0) > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span>Custom Logo Printing / Block Setup Charge</span>
                    <span className="font-mono">₹{Number(quote.customization_charges).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-700">
                  <span>Local Transport / Internal Delivery Charge</span>
                  <span className="font-mono">
                    {(quote.delivery_charges ?? quote.shipping_amount ?? 0) === 0 
                      ? <span className="text-emerald-700 font-bold">FREE / INCLUDED</span> 
                      : `₹${Number(quote.delivery_charges ?? quote.shipping_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                    }
                  </span>
                </div>

                {(quote.discount ?? 0) > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Bulk Supplier Discount</span>
                    <span className="font-mono">- ₹{Number(quote.discount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                {(quote.tax_amount ?? 0) > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Applicable GST / Tax</span>
                    <span className="font-mono">₹{Number(quote.tax_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                  <span className="text-base text-brand-charcoal">Grand Total (Inclusive of all charges)</span>
                  <span className="text-xl font-mono text-brand-green">
                    ₹{Number(quote.total_amount || quote.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-amber-900 text-xs">
              <span className="font-bold">Quotation Status Notice:</span> MS TRADERS team is calculating the wholesale pricing and custom print setup costs for your requested dimensions. You will receive an updated pricing breakdown shortly.
            </div>
          )}

          {/* Admin Notes & Terms */}
          {quote.admin_notes && (
            <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
              <span className="font-bold block text-sm mb-1 text-emerald-950">Message & Lead-Time Commitment from MS TRADERS:</span>
              <p className="whitespace-pre-wrap leading-relaxed">{quote.admin_notes}</p>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-6 space-y-1">
            <p className="font-bold text-slate-700 uppercase tracking-wider">Terms & Conditions of Supply:</p>
            <p>1. Prices quoted are valid for 15 days from issue date.</p>
            <p>2. Custom logo print setup requires customer proofing approval prior to bulk production.</p>
            <p>3. Delivery executed via MS TRADERS local transport or direct warehouse pickup in Ujjain.</p>
          </div>

        </div>

        {/* Customer Interactive Action Bar */}
        {quote.status !== 'CONVERTED_TO_ORDER' && quote.status !== 'REJECTED' && (
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
            <div>
              <h3 className="font-heading text-lg font-bold text-brand-gold">Ready to approve this quotation?</h3>
              <p className="text-xs text-slate-300 mt-1">
                Approve to confirm your order directly with MS TRADERS or request custom quantity/specification adjustments.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                onClick={() => setShowChangeModal(true)}
                className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold flex-1 md:flex-none"
              >
                <MessageSquare className="h-4 w-4 mr-1.5" /> Request Changes
              </Button>

              <Button 
                variant="destructive"
                onClick={handleDecline}
                className="bg-rose-950 text-rose-300 hover:bg-rose-900 text-xs font-bold border border-rose-800 flex-1 md:flex-none"
              >
                Decline
              </Button>

              <Button 
                onClick={() => setShowApproveModal(true)}
                disabled={!isPricingAvailable || isSubmitting}
                className="bg-brand-green text-white hover:bg-emerald-600 text-xs font-bold px-6 h-10 shadow-md flex-1 md:flex-none"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" /> Approve & Confirm Order
              </Button>
            </div>
          </div>
        )}

        {/* Converted Order Notice Banner */}
        {quote.status === 'CONVERTED_TO_ORDER' && (
          <div className="bg-emerald-900 text-white rounded-2xl p-6 border border-emerald-700 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <div>
              <h3 className="font-heading text-lg font-bold text-brand-gold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Quotation Approved & Order Placed!
              </h3>
              <p className="text-xs text-emerald-100 mt-1">
                This quotation has been officially converted into a confirmed wholesale order.
              </p>
            </div>
            {quote.order_id && (
              <Button asChild className="bg-white text-emerald-900 hover:bg-emerald-100 font-bold text-xs">
                <Link href="/track-order">Track Order Status</Link>
              </Button>
            )}
          </div>
        )}

      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl">
            <h3 className="font-heading text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Approve Quotation & Confirm Order
            </h3>
            <p className="text-xs text-slate-600">
              You are approving Quote <span className="font-mono font-bold text-brand-green">{quote.quote_number}</span> for a total value of <span className="font-bold text-slate-900">₹{Number(quote.total_amount || quote.amount || 0).toLocaleString('en-IN')}</span>.
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="pmethod" className="text-xs font-bold text-slate-700">Preferred Payment Term</Label>
                <select 
                  id="pmethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 bg-white"
                >
                  <option value="Pay on Local Delivery / Pickup">Cash / UPI on Local Delivery or Warehouse Pickup</option>
                  <option value="Direct Bank Transfer / NEFT">Direct Bank Transfer / NEFT / RTGS</option>
                  <option value="Store Credit / Credit Invoice">Established Business Invoice (Existing Clients)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="dnotes" className="text-xs font-bold text-slate-700">Delivery Instructions (Optional)</Label>
                <Textarea 
                  id="dnotes"
                  rows={2}
                  placeholder="e.g. Please deliver to back gate entrance before 4:00 PM..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowApproveModal(false)}
                disabled={isSubmitting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleApproveQuote}
                disabled={isSubmitting}
                className="bg-brand-green text-white hover:bg-emerald-700 font-bold text-xs px-5"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Order'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleRequestChanges} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-heading text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Request Specification / Quantity Changes
            </h3>
            <p className="text-xs text-slate-600">
              Let MS TRADERS team know what modifications you need for Quote <span className="font-mono font-bold text-brand-green">{quote.quote_number}</span>.
            </p>

            <div>
              <Label htmlFor="cnotes" className="text-xs font-bold text-slate-700">Requested Changes</Label>
              <Textarea 
                id="cnotes"
                rows={4}
                required
                placeholder="e.g. Please increase quantity to 5,000 units and update handle color to dark green..."
                value={changeNotes}
                onChange={(e) => setChangeNotes(e.target.value)}
                className="mt-1 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setShowChangeModal(false)}
                disabled={isSubmitting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                size="sm" 
                disabled={isSubmitting}
                className="bg-brand-green text-white hover:bg-emerald-700 font-bold text-xs px-5"
              >
                {isSubmitting ? 'Sending...' : 'Submit Change Request'}
              </Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

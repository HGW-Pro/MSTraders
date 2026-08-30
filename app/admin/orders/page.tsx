'use client';

import * as React from 'react';
import { Order, OrderStatus } from '@/types';
import { getOrders, updateOrderFulfillmentDetails } from '@/lib/supabase/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  ShoppingBag, 
  Eye, 
  MapPin, 
  PhoneCall, 
  Mail, 
  X, 
  Truck, 
  CheckCircle2, 
  PackageCheck,
  IndianRupee,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');

  // Modal State
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [newStatus, setNewStatus] = React.useState<OrderStatus>('PENDING');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = React.useState('');
  const [courierPartner, setCourierPartner] = React.useState('');
  const [trackingNumber, setTrackingNumber] = React.useState('');
  const [trackingUrl, setTrackingUrl] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);

  const loadOrders = React.useCallback(async () => {
    try {
      const data = await getOrders(statusFilter);
      setOrders(data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  React.useEffect(() => {
    let active = true;
    getOrders(statusFilter).then((data) => {
      if (active) {
        setOrders(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [statusFilter]);

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setExpectedDeliveryDate(order.expected_delivery_date || '');
    setCourierPartner(order.courier_partner || '');
    setTrackingNumber(order.tracking_number || '');
    setTrackingUrl(order.tracking_url || '');
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const ok = await updateOrderFulfillmentDetails(selectedOrder.id, {
        status: newStatus,
        expected_delivery_date: expectedDeliveryDate,
        courier_partner: courierPartner,
        tracking_number: trackingNumber,
        tracking_url: trackingUrl
      });

      if (ok) {
        toast.success(`Order ${selectedOrder.order_number} fulfillment & status updated successfully`);
        setSelectedOrder(null);
        loadOrders();
      } else {
        toast.error('Failed to update order fulfillment details');
      }
    } catch (err) {
      toast.error('Error updating order');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);

    return matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">PENDING</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">CONFIRMED</span>;
      case 'PREPARING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">PREPARING</span>;
      case 'READY_FOR_DELIVERY':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">READY FOR DISPATCH</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">OUT FOR DELIVERY</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">DELIVERED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-charcoal">Customer Orders</h1>
          <p className="text-sm text-muted-foreground">Manage purchase orders and local delivery fulfillment</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-border rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by order #, name, email, phone..."
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
            <option value="ALL">All Orders</option>
            <option value="PENDING">Pending Approval</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing Goods</option>
            <option value="READY_FOR_DELIVERY">Ready for Delivery</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-border rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground animate-pulse">Fetching orders from Supabase...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No order requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order #</th>
                  <th className="px-6 py-3 font-semibold">Customer Details</th>
                  <th className="px-6 py-3 font-semibold">Order Total</th>
                  <th className="px-6 py-3 font-semibold">Order Date</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-charcoal font-mono">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-800">{order.customer_name}</div>
                        <div className="text-xs text-muted-foreground">{order.company_name || order.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-brand-green">
                      ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        size="sm" 
                        onClick={() => handleOpenDetail(order)}
                        className="bg-brand-charcoal text-white hover:bg-slate-800 h-8 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> View Order
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-slate-900 text-white">
              <div>
                <div className="text-xs font-mono text-brand-gold uppercase tracking-wider font-semibold">
                  Order Manifest & Invoice
                </div>
                <h2 className="font-heading text-xl font-bold flex items-center gap-2 mt-0.5">
                  {selectedOrder.order_number}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <h4 className="font-bold text-slate-800 text-sm mb-2">Customer Profile</h4>
                  <p><span className="text-slate-500">Name:</span> <strong className="text-slate-900">{selectedOrder.customer_name}</strong></p>
                  <p><span className="text-slate-500">Company:</span> <strong className="text-slate-900">{selectedOrder.company_name || 'Individual'}</strong></p>
                  <p><span className="text-slate-500">Email:</span> <strong className="text-brand-green">{selectedOrder.email}</strong></p>
                  <p><span className="text-slate-500">Phone:</span> <strong className="text-slate-900">{selectedOrder.phone}</strong></p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <h4 className="font-bold text-slate-800 text-sm mb-2">Shipping Destination</h4>
                  {selectedOrder.shipping_address ? (
                    typeof selectedOrder.shipping_address === 'string' ? (
                      <p className="text-slate-800 font-medium">{selectedOrder.shipping_address}</p>
                    ) : (
                      <div className="text-slate-800 leading-relaxed">
                        <p className="font-semibold">{selectedOrder.shipping_address.firstName} {selectedOrder.shipping_address.lastName}</p>
                        <p>{selectedOrder.shipping_address.address} {selectedOrder.shipping_address.apartment}</p>
                        <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.postalCode}</p>
                        <p className="mt-1 font-mono text-slate-600">Phone: {selectedOrder.shipping_address.phone}</p>
                      </div>
                    )
                  ) : (
                    <p className="text-slate-500">Standard business delivery address</p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Ordered Products</h3>
                <div className="border border-border rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 border-b border-border font-semibold text-slate-600">
                      <tr>
                        <th className="p-3">Item Description</th>
                        <th className="p-3">Unit Price</th>
                        <th className="p-3">Qty</th>
                        <th className="p-3 text-right">Total Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedOrder.order_items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-semibold text-slate-800">
                            {item.product_name}
                            {item.variant_details && (
                              <div className="text-[10px] text-muted-foreground font-normal">
                                {Object.entries(item.variant_details).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                              </div>
                            )}
                          </td>
                          <td className="p-3">₹{item.unit_price}</td>
                          <td className="p-3 font-bold text-brand-green">{item.quantity}</td>
                          <td className="p-3 text-right font-bold text-slate-900">₹{item.total_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Totals Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-end gap-1.5 text-xs">
                <div className="w-full max-w-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Fee:</span>
                    <span>₹{selectedOrder.shipping_fee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST Tax (18%):</span>
                    <span>₹{selectedOrder.tax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-brand-green pt-2 border-t border-slate-300">
                    <span>Grand Total:</span>
                    <span>₹{selectedOrder.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Fulfillment & Logistics Controls */}
              <div className="p-5 bg-slate-100 rounded-2xl border border-slate-300 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Truck className="h-4 w-4 text-brand-green" /> Fulfillment & Logistics Tracking Desk
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Updates live tracking timeline</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Order Status */}
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs text-slate-800">Fulfillment Order Status</Label>
                    <select 
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                      className="w-full h-10 px-3 py-2 rounded-md border border-input bg-white text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                    >
                      <option value="PENDING">PENDING - Order Placed</option>
                      <option value="CONFIRMED">CONFIRMED - Order Accepted</option>
                      <option value="PREPARING">PREPARING - Custom Bag Printing & Manufacturing</option>
                      <option value="READY_FOR_DELIVERY">READY FOR DELIVERY - Quality Inspected & Packed</option>
                      <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY - Handed over to Logistics Carrier</option>
                      <option value="DELIVERED">DELIVERED - Shipment Delivered to Customer</option>
                      <option value="CANCELLED">CANCELLED - Order Voided</option>
                    </select>
                  </div>

                  {/* Expected Delivery Date */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="font-bold text-xs text-slate-800 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-brand-green" /> Expected Delivery Date
                      </Label>
                      <div className="flex gap-1 text-[10px]">
                        <button 
                          type="button" 
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() + 3);
                            setExpectedDeliveryDate(d.toISOString().split('T')[0]);
                          }} 
                          className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded font-medium text-slate-700"
                        >
                          +3 Days
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() + 7);
                            setExpectedDeliveryDate(d.toISOString().split('T')[0]);
                          }} 
                          className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded font-medium text-slate-700"
                        >
                          +7 Days
                        </button>
                      </div>
                    </div>
                    <Input 
                      type="date"
                      value={expectedDeliveryDate}
                      onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                      className="bg-white font-semibold text-slate-900"
                    />
                  </div>

                  {/* Courier Partner */}
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs text-slate-800">Courier / Transport Partner</Label>
                    <Input 
                      placeholder="e.g. V-Express / Delhivery / In-House Dispatch"
                      value={courierPartner}
                      onChange={(e) => setCourierPartner(e.target.value)}
                      className="bg-white"
                    />
                  </div>

                  {/* Tracking / Waybill Number */}
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs text-slate-800">Tracking / AWB Number</Label>
                    <Input 
                      placeholder="e.g. AWB-9876543210"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Tracking Link URL */}
                <div className="space-y-1.5">
                  <Label className="font-bold text-xs text-slate-800 flex items-center gap-1">
                    <ExternalLink className="h-3.5 w-3.5 text-brand-green" /> Direct Courier Tracking Web Link (Optional)
                  </Label>
                  <Input 
                    placeholder="e.g. https://www.vexpress.in/track?awb=9876543210"
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-slate-50 flex items-center justify-between">
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>

              <Button 
                onClick={handleSaveStatus}
                disabled={isUpdating}
                className="bg-brand-green text-white hover:bg-brand-green/90 font-semibold"
              >
                {isUpdating ? 'Updating Status...' : 'Save Order Status'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

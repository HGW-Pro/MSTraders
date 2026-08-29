'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  ShoppingBag, 
  FileText, 
  MapPin, 
  LogOut, 
  Building2, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  Eye, 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { 
  getUserProfile, 
  updateUserProfile, 
  getCustomerOrders, 
  getCustomerQuotes, 
  getCustomerAddresses, 
  saveCustomerAddress, 
  deleteCustomerAddress 
} from '@/lib/supabase/services';
import { Order, Quote, CustomerAddress, UserProfile } from '@/types';
import { cn } from '@/lib/utils';

export default function CustomerAccountPage() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  
  // Auth Form State
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [businessName, setBusinessName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [authLoading, setAuthLoading] = React.useState(false);

  // Authenticated Dashboard State
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [addresses, setAddresses] = React.useState<CustomerAddress[]>([]);
  const [activeTab, setActiveTab] = React.useState('orders');

  // Modals
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [selectedQuote, setSelectedQuote] = React.useState<Quote | null>(null);
  const [showAddressModal, setShowAddressModal] = React.useState(false);

  // Profile Edit State
  const [editProfile, setEditProfile] = React.useState({
    full_name: '',
    business_name: '',
    phone: '',
    city: ''
  });
  const [savingProfile, setSavingProfile] = React.useState(false);

  // New Address Form State
  const [addressForm, setAddressForm] = React.useState({
    title: 'Primary Office',
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: 'Madhya Pradesh',
    pincode: '',
    is_default: false
  });
  const [savingAddress, setSavingAddress] = React.useState(false);

  // Load Session & Customer Data
  const loadCustomerData = React.useCallback(async (user: any) => {
    try {
      setLoading(true);
      const [usrProfile, usrOrders, usrQuotes, usrAddresses] = await Promise.all([
        getUserProfile(user.id),
        getCustomerOrders(user.email || '', user.id),
        getCustomerQuotes(user.email || '', user.id),
        getCustomerAddresses(user.id)
      ]);

      setProfile(usrProfile);
      setOrders(usrOrders);
      setQuotes(usrQuotes);
      setAddresses(usrAddresses);

      if (usrProfile) {
        setEditProfile({
          full_name: usrProfile.full_name || '',
          business_name: usrProfile.business_name || '',
          phone: usrProfile.phone || '',
          city: usrProfile.city || ''
        });
      }
    } catch (err) {
      console.error('Error loading customer details:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        if (session?.user) {
          setSessionUser(session.user);
          loadCustomerData(session.user);
        } else {
          setLoading(false);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        if (session?.user) {
          setSessionUser(session.user);
          loadCustomerData(session.user);
        } else {
          setSessionUser(null);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadCustomerData]);

  // Handle Login / Registration
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (authMode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Signed in successfully');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              business_name: businessName,
              phone: phone
            }
          }
        });
        if (error) throw error;
        
        if (data.user) {
          // Initialize user profile in table
          await updateUserProfile(data.user.id, {
            email: email,
            full_name: fullName,
            business_name: businessName,
            phone: phone,
            role: 'customer'
          });
        }

        toast.success('Account created successfully! You are now logged in.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out');
      setSessionUser(null);
    } catch (err) {
      toast.error('Sign out error');
    }
  };

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUser) return;
    setSavingProfile(true);

    const success = await updateUserProfile(sessionUser.id, {
      ...editProfile,
      email: sessionUser.email
    });

    if (success) {
      toast.success('Profile updated successfully');
      loadCustomerData(sessionUser);
    } else {
      toast.error('Failed to update profile');
    }
    setSavingProfile(false);
  };

  const handleSaveAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUser) return;
    setSavingAddress(true);

    const result = await saveCustomerAddress(sessionUser.id, addressForm);
    if (result) {
      toast.success('Address saved to account');
      setShowAddressModal(false);
      loadCustomerData(sessionUser);
    } else {
      toast.error('Failed to save address');
    }
    setSavingAddress(false);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!sessionUser) return;
    const success = await deleteCustomerAddress(addressId, sessionUser.id);
    if (success) {
      toast.success('Address removed');
      loadCustomerData(sessionUser);
    } else {
      toast.error('Could not remove address');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Loading Customer Account...</p>
        </div>
      </div>
    );
  }

  // --- UNAUTHENTICATED VIEW ---
  if (!sessionUser) {
    return (
      <div className="bg-background min-h-screen py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-2 block">
              Customer Portal
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-brand-charcoal mb-2">
              My Account
            </h1>
            <p className="text-muted-foreground text-xs">
              Sign in or create an optional account to save your orders, custom quotes, and delivery addresses.
            </p>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs font-bold">
              <button 
                className={cn(
                  "flex-1 py-2 rounded-lg transition-all text-center",
                  authMode === 'signin' ? "bg-white text-brand-charcoal shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                )}
                onClick={() => setAuthMode('signin')}
              >
                Sign In
              </button>
              <button 
                className={cn(
                  "flex-1 py-2 rounded-lg transition-all text-center",
                  authMode === 'signup' ? "bg-white text-brand-charcoal shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                )}
                onClick={() => setAuthMode('signup')}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs">Full Name *</Label>
                    <Input 
                      id="fullName" 
                      placeholder="e.g. Ramesh Kumar" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="businessName" className="text-xs">Business / Store Name</Label>
                    <Input 
                      id="businessName" 
                      placeholder="e.g. Ujjain Garment Boutique" 
                      value={businessName} 
                      onChange={(e) => setBusinessName(e.target.value)} 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      placeholder="+91 91312 68724" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      required
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email Address *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs">Password *</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                />
              </div>

              <Button type="submit" disabled={authLoading} className="w-full bg-brand-green hover:bg-emerald-700 text-white font-bold h-11">
                {authLoading ? 'Authenticating...' : authMode === 'signin' ? 'Sign In to Account' : 'Register Customer Account'}
              </Button>
            </form>

            {/* Guest Order Tracking CTA */}
            <div className="mt-8 pt-6 border-t border-border text-center space-y-2">
              <p className="text-xs text-muted-foreground">Placed an order as a guest?</p>
              <Button asChild variant="outline" className="w-full text-xs font-bold border-slate-300">
                <Link href="/track-order" className="flex items-center justify-center gap-2">
                  <Search className="h-3.5 w-3.5 text-brand-green" /> Track Order Without Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED CUSTOMER DASHBOARD ---
  return (
    <div className="bg-background min-h-screen py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Profile Banner */}
        <div className="bg-brand-charcoal text-white rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand-green text-white flex items-center justify-center font-bold text-2xl shadow-inner border border-white/20">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : sessionUser.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold block">
                Authenticated Customer Account
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold">
                {profile?.full_name || sessionUser.email}
              </h1>
              {profile?.business_name && (
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="h-3.5 w-3.5 text-brand-gold" /> {profile.business_name}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" size="sm" asChild className="border-white/20 text-white hover:bg-white/10 hover:text-white font-bold text-xs flex-1 md:flex-none">
              <Link href="/track-order">Guest Track Order</Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleSignOut} className="font-bold text-xs flex-1 md:flex-none">
              <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-border p-1 rounded-2xl w-full flex overflow-x-auto justify-start sm:justify-center">
            <TabsTrigger value="orders" className="flex items-center gap-2 text-xs font-bold py-2.5 px-4 rounded-xl">
              <ShoppingBag className="h-4 w-4" /> My Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-2 text-xs font-bold py-2.5 px-4 rounded-xl">
              <FileText className="h-4 w-4" /> Custom Quotes ({quotes.length})
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2 text-xs font-bold py-2.5 px-4 rounded-xl">
              <MapPin className="h-4 w-4" /> Saved Addresses ({addresses.length})
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 text-xs font-bold py-2.5 px-4 rounded-xl">
              <User className="h-4 w-4" /> Account Profile
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: ORDERS */}
          <TabsContent value="orders">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-brand-charcoal">Wholesale Order History</h2>
                <span className="text-xs text-muted-foreground">{orders.length} orders found</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl space-y-3">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No Orders Placed Yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    When you order paper bags or W-cut/D-cut non-woven carry bags, your orders will appear here.
                  </p>
                  <Button asChild className="bg-brand-green hover:bg-emerald-700 text-white font-bold text-xs mt-2">
                    <Link href="/shop">Browse Bag Catalog</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div 
                      key={ord.id} 
                      className="p-4 border border-border rounded-xl hover:border-brand-green/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-heading font-bold text-brand-charcoal text-base">{ord.order_number}</span>
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            ord.status === 'DELIVERED' && "bg-emerald-50 text-emerald-800 border-emerald-300",
                            ord.status === 'SHIPPED' && "bg-blue-50 text-blue-800 border-blue-300",
                            ord.status === 'PROCESSING' && "bg-amber-50 text-amber-800 border-amber-300",
                            ord.status === 'PENDING' && "bg-slate-100 text-slate-800 border-slate-300",
                            ord.status === 'CANCELLED' && "bg-red-50 text-red-800 border-red-300"
                          )}>
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Placed on {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {ord.order_items?.length || 0} items
                        </p>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="font-extrabold text-brand-green text-sm">₹{(ord.total || 0).toLocaleString('en-IN')}</span>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(ord)} className="text-xs font-bold">
                          <Eye className="h-3.5 w-3.5 mr-1.5" /> View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: QUOTES */}
          <TabsContent value="quotes">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-brand-charcoal">My Custom Quote Requests</h2>
                <Button asChild size="sm" className="bg-brand-green hover:bg-emerald-700 text-white font-bold text-xs">
                  <Link href="/customize">+ New Quote Request</Link>
                </Button>
              </div>

              {quotes.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl space-y-3">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No Quote Requests Submitted</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Submit customized bag dimensions, GSM specifications, and logo prints for wholesale quotes.
                  </p>
                  <Button asChild className="bg-brand-green hover:bg-emerald-700 text-white font-bold text-xs mt-2">
                    <Link href="/customize">Request Custom Quote</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {quotes.map((q) => (
                    <div 
                      key={q.id} 
                      className="p-4 border border-border rounded-xl hover:border-brand-green/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-heading font-bold text-brand-charcoal text-base">{q.quote_number}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-300">
                            {q.status}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-700 mt-1">
                          {q.bag_type} • {q.quantity.toLocaleString('en-IN')} units
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Submitted {new Date(q.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>

                      <Button variant="outline" size="sm" onClick={() => setSelectedQuote(q)} className="text-xs font-bold">
                        <Eye className="h-3.5 w-3.5 mr-1.5" /> View Quote
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 3: ADDRESSES */}
          <TabsContent value="addresses">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-brand-charcoal">Saved Delivery Addresses</h2>
                <Button size="sm" onClick={() => setShowAddressModal(true)} className="bg-brand-green hover:bg-emerald-700 text-white font-bold text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Address
                </Button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl space-y-3">
                  <MapPin className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No Saved Addresses</p>
                  <p className="text-xs text-muted-foreground">Save your store or factory address for faster bulk checkout.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-4 border border-border rounded-xl space-y-2 relative bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-brand-green uppercase tracking-wider">{addr.title}</span>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="font-bold text-brand-charcoal text-sm">{addr.full_name}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {addr.address}<br />
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-xs text-slate-700 font-medium pt-1">Phone: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 4: PROFILE */}
          <TabsContent value="profile">
            <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
              <h2 className="font-heading text-lg font-bold text-brand-charcoal">Business & Contact Profile</h2>

              <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="profName">Full Contact Name</Label>
                  <Input 
                    id="profName" 
                    value={editProfile.full_name} 
                    onChange={(e) => setEditProfile({ ...editProfile, full_name: e.target.value })} 
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profBiz">Business / Store Name</Label>
                  <Input 
                    id="profBiz" 
                    value={editProfile.business_name} 
                    onChange={(e) => setEditProfile({ ...editProfile, business_name: e.target.value })} 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="profPhone">Phone Number</Label>
                    <Input 
                      id="profPhone" 
                      value={editProfile.phone} 
                      onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })} 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="profCity">City</Label>
                    <Input 
                      id="profCity" 
                      value={editProfile.city} 
                      onChange={(e) => setEditProfile({ ...editProfile, city: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={savingProfile} className="bg-brand-green hover:bg-emerald-700 text-white font-bold text-xs h-10 px-6">
                    {savingProfile ? 'Saving Changes...' : 'Update Account Profile'}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>

        {/* ORDER DETAILS MODAL */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl font-bold flex items-center justify-between">
                <span>Order #{selectedOrder?.order_number}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-normal">
                  {selectedOrder?.status}
                </span>
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6 text-xs">
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-muted-foreground block">Customer Name</span>
                    <span className="font-bold text-brand-charcoal">{selectedOrder.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Date</span>
                    <span className="font-bold text-brand-charcoal">
                      {new Date(selectedOrder.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-brand-charcoal mb-2">Order Items</h4>
                  <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
                    {selectedOrder.order_items?.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">{item.product_name}</p>
                          <p className="text-muted-foreground">{item.quantity} units x ₹{item.unit_price}</p>
                        </div>
                        <span className="font-bold text-brand-green">₹{item.total_price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center font-bold text-sm border-t border-border">
                  <span>Total Amount</span>
                  <span className="text-brand-green text-base">₹{(selectedOrder.total || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* QUOTE DETAILS MODAL */}
        <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl font-bold">
                Quote #{selectedQuote?.quote_number}
              </DialogTitle>
            </DialogHeader>

            {selectedQuote && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-muted-foreground block">Bag Category</span>
                      <span className="font-bold text-brand-charcoal">{selectedQuote.bag_type}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Requested Quantity</span>
                      <span className="font-bold text-brand-charcoal">{selectedQuote.quantity} units</span>
                    </div>
                  </div>
                  {selectedQuote.material && (
                    <div>
                      <span className="text-muted-foreground block">Material / GSM</span>
                      <span className="font-semibold text-slate-800">{selectedQuote.material}</span>
                    </div>
                  )}
                  {selectedQuote.printing && (
                    <div>
                      <span className="text-muted-foreground block">Printing Specification</span>
                      <span className="font-semibold text-slate-800">{selectedQuote.printing}</span>
                    </div>
                  )}
                </div>

                {selectedQuote.attachments && selectedQuote.attachments.length > 0 && (
                  <div>
                    <h4 className="font-bold text-brand-charcoal mb-2">Uploaded Artwork Attachments</h4>
                    <div className="space-y-1">
                      {selectedQuote.attachments.map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline block truncate">
                          Attachment #{idx + 1}: {url}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ADD ADDRESS MODAL */}
        <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg font-bold">Add Delivery Address</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveAddressSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <Label htmlFor="addrTitle">Address Title (e.g. Main Shop / Warehouse)</Label>
                <Input 
                  id="addrTitle" 
                  value={addressForm.title} 
                  onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })} 
                  required 
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="addrName">Full Name</Label>
                <Input 
                  id="addrName" 
                  value={addressForm.full_name} 
                  onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })} 
                  required 
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="addrPhone">Phone Number</Label>
                <Input 
                  id="addrPhone" 
                  value={addressForm.phone} 
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} 
                  required 
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="addrStreet">Street Address</Label>
                <Input 
                  id="addrStreet" 
                  value={addressForm.address} 
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="addrCity">City</Label>
                  <Input 
                    id="addrCity" 
                    value={addressForm.city} 
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="addrPin">Pincode</Label>
                  <Input 
                    id="addrPin" 
                    value={addressForm.pincode} 
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <Button type="submit" disabled={savingAddress} className="w-full bg-brand-green hover:bg-emerald-700 text-white font-bold h-10 mt-2">
                {savingAddress ? 'Saving Address...' : 'Save Address'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

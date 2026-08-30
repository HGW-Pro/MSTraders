'use client';

import * as React from 'react';
import { BusinessSettings } from '@/types';
import { getSettings, updateSettings } from '@/lib/supabase/services';
import { useSettings } from '@/components/settings-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  PhoneCall, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Clock, 
  Globe, 
  Save, 
  CheckCircle2,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [settings, setSettingsData] = React.useState<BusinessSettings>({
    business_name: 'MS TRADERS',
    tagline: 'Wholesale & Retail Bag Supplier in Ujjain (M.P)',
    phone: '+91 91312 68724 / +91 90094 46352',
    whatsapp: '919131268724',
    email: 'contact@mstradersujjain.com',
    address: '57 Kalalseri, Behind Power House, Dabri Pitha',
    city: 'Ujjain',
    state: 'Madhya Pradesh',
    pincode: '456006',
    business_hours: 'Mon - Sat: 9:30 AM - 8:30 PM',
    social_facebook: '',
    social_instagram: '',
    social_linkedin: '',
    footer_about: 'MS TRADERS is a premier wholesale & retail supplier of customized paper bags, W-cut & D-cut non-woven bags, designer gift bags, envelopes, and eco-friendly packaging in Ujjain (M.P).',
    seo_title: 'MS TRADERS - Wholesale & Retail Paper Bags & Non-Woven Bags in Ujjain',
    seo_description: 'Official wholesale & retail supplier of paper bags, non-woven W-cut and D-cut bags, customized printed bags, designer gift bags, and envelope pouches in Ujjain (M.P).',
    courier_integration_enabled: false,
    online_payment_enabled: false,
    cod_enabled: false,
    customer_accounts_enabled: true
  });

  const loadCurrentSettings = React.useCallback(async () => {
    try {
      const data = await getSettings();
      setSettingsData(data);
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    getSettings().then((data) => {
      if (active) {
        setSettingsData(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const handleChange = (key: keyof BusinessSettings, value: string) => {
    setSettingsData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const success = await updateSettings(settings);
      if (success) {
        toast.success('Business settings updated in Supabase');
        await refreshSettings();
      } else {
        toast.error('Failed to save settings');
      }
    } catch (err) {
      toast.error('An error occurred while saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground animate-pulse">Loading settings from Supabase...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-charcoal">Business Profile & Store Settings</h1>
        <p className="text-sm text-muted-foreground">Manage official contact information, WhatsApp numbers, address details, and global website branding</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Identity */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-base text-brand-charcoal flex items-center gap-2 border-b border-border pb-3">
            <Building2 className="h-5 w-5 text-brand-green" /> Company Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="s-name">Business Legal / Trade Name *</Label>
              <Input 
                id="s-name" 
                value={settings.business_name} 
                onChange={(e) => handleChange('business_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-tagline">Company Tagline / Subtitle</Label>
              <Input 
                id="s-tagline" 
                value={settings.tagline} 
                onChange={(e) => handleChange('tagline', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="s-footer">Footer Brand Summary Copy</Label>
            <Textarea 
              id="s-footer" 
              rows={2}
              value={settings.footer_about || ''} 
              onChange={(e) => handleChange('footer_about', e.target.value)}
            />
          </div>
        </div>

        {/* Contact Numbers & Channels */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-base text-brand-charcoal flex items-center gap-2 border-b border-border pb-3">
            <PhoneCall className="h-5 w-5 text-brand-green" /> Direct Customer Contact Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="s-phone">Official Phone Number *</Label>
              <Input 
                id="s-phone" 
                value={settings.phone} 
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-wa">WhatsApp Number (For Direct Inquiry Buttons) *</Label>
              <Input 
                id="s-wa" 
                value={settings.whatsapp} 
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="919876543210 (include country code without +)"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-email">Official Support Email Address *</Label>
              <Input 
                id="s-email" 
                type="email"
                value={settings.email} 
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="info@mstradersbags.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-hours">Operating / Factory Working Hours</Label>
              <Input 
                id="s-hours" 
                value={settings.business_hours} 
                onChange={(e) => handleChange('business_hours', e.target.value)}
                placeholder="Mon - Sat: 9:00 AM - 7:00 PM"
              />
            </div>
          </div>
        </div>

        {/* Physical Manufacturing Address */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-base text-brand-charcoal flex items-center gap-2 border-b border-border pb-3">
            <MapPin className="h-5 w-5 text-brand-green" /> Factory & Head Office Location
          </h2>

          <div className="space-y-1.5">
            <Label htmlFor="s-addr">Street Address / Industrial Plot No.</Label>
            <Input 
              id="s-addr" 
              value={settings.address} 
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="s-city">City</Label>
              <Input 
                id="s-city" 
                value={settings.city} 
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-state">State</Label>
              <Input 
                id="s-state" 
                value={settings.state} 
                onChange={(e) => handleChange('state', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-pin">Pincode</Label>
              <Input 
                id="s-pin" 
                value={settings.pincode} 
                onChange={(e) => handleChange('pincode', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Social & SEO */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-base text-brand-charcoal flex items-center gap-2 border-b border-border pb-3">
            <Share2 className="h-5 w-5 text-brand-green" /> Social Channels & SEO Metadata
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="s-insta">Instagram URL</Label>
              <Input 
                id="s-insta" 
                value={settings.social_instagram || ''} 
                onChange={(e) => handleChange('social_instagram', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-fb">Facebook URL</Label>
              <Input 
                id="s-fb" 
                value={settings.social_facebook || ''} 
                onChange={(e) => handleChange('social_facebook', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-li">LinkedIn URL</Label>
              <Input 
                id="s-li" 
                value={settings.social_linkedin || ''} 
                onChange={(e) => handleChange('social_linkedin', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <Label htmlFor="s-seo-t">Default Page Title (SEO)</Label>
            <Input 
              id="s-seo-t" 
              value={settings.seo_title || ''} 
              onChange={(e) => handleChange('seo_title', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="s-seo-d">Default Meta Description (SEO)</Label>
            <Textarea 
              id="s-seo-d" 
              rows={2}
              value={settings.seo_description || ''} 
              onChange={(e) => handleChange('seo_description', e.target.value)}
            />
          </div>
        </div>

        {/* Feature Flags & System Integrations */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-base text-brand-charcoal flex items-center gap-2 border-b border-border pb-3">
            <Globe className="h-5 w-5 text-brand-green" /> Application Feature Flags & Integrations
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Toggle optional integrations and customer features. MS TRADERS operates primarily with direct internal delivery and offline/invoice quotation billing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <Label className="font-bold text-sm text-slate-900">Courier Integration (Shiprocket)</Label>
                <p className="text-xs text-slate-500">Enable automated external courier API tracking & booking</p>
              </div>
              <input 
                type="checkbox"
                checked={settings.courier_integration_enabled ?? false}
                onChange={(e) => setSettingsData(prev => ({ ...prev, courier_integration_enabled: e.target.checked }))}
                className="h-5 w-5 accent-brand-green rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <Label className="font-bold text-sm text-slate-900">Online Payment Gateway</Label>
                <p className="text-xs text-slate-500">Enable credit card / netbanking checkout gateway</p>
              </div>
              <input 
                type="checkbox"
                checked={settings.online_payment_enabled ?? false}
                onChange={(e) => setSettingsData(prev => ({ ...prev, online_payment_enabled: e.target.checked }))}
                className="h-5 w-5 accent-brand-green rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <Label className="font-bold text-sm text-slate-900">Cash On Delivery (COD)</Label>
                <p className="text-xs text-slate-500">Enable Cash on Delivery option during checkout</p>
              </div>
              <input 
                type="checkbox"
                checked={settings.cod_enabled ?? false}
                onChange={(e) => setSettingsData(prev => ({ ...prev, cod_enabled: e.target.checked }))}
                className="h-5 w-5 accent-brand-green rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <Label className="font-bold text-sm text-slate-900">Customer Accounts Portal</Label>
                <p className="text-xs text-slate-500">Allow customers to register accounts and track order history</p>
              </div>
              <input 
                type="checkbox"
                checked={settings.customer_accounts_enabled ?? true}
                onChange={(e) => setSettingsData(prev => ({ ...prev, customer_accounts_enabled: e.target.checked }))}
                className="h-5 w-5 accent-brand-green rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={isSaving}
            className="bg-brand-green text-white hover:bg-brand-green/90 h-11 px-8 text-base font-semibold shadow-md"
          >
            <Save className="mr-2 h-5 w-5" />
            {isSaving ? 'Saving Changes...' : 'Save Settings to Supabase'}
          </Button>
        </div>
      </form>
    </div>
  );
}

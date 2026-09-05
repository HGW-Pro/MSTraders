'use client';

import * as React from 'react';
import Image from 'next/image';
import { 
  LayoutTemplate, 
  Save, 
  Upload, 
  Trash2, 
  Eye, 
  Sparkles, 
  Layers, 
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { getHomepageSections, updateHomepageSection, uploadFile } from '@/lib/db/services';
import { HomepageSection } from '@/types';
import { cn } from '@/lib/utils';

const SECTION_KEYS = [
  { key: 'hero', name: 'Hero Banner' },
  { key: 'categories', name: 'Categories Showcase' },
  { key: 'customization', name: 'Customization Section' },
  { key: 'industries', name: 'Industries Section' },
  { key: 'process', name: 'How It Works (Process)' },
  { key: 'why_us', name: 'Why Choose Us' },
  { key: 'our_work', name: 'Our Work Gallery' },
  { key: 'testimonials', name: 'Client Testimonials' },
  { key: 'final_cta', name: 'Final Call To Action' }
];

export default function AdminHomepageContentPage() {
  const [sections, setSections] = React.useState<Record<string, HomepageSection>>({});
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('hero');
  const [savingKey, setSavingKey] = React.useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = React.useState(false);

  const loadSections = React.useCallback(async () => {
    try {
      const data = await getHomepageSections();
      setSections(data);
    } catch (err) {
      toast.error('Failed to load homepage sections');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    getHomepageSections().then((data) => {
      if (isMounted) {
        setSections(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const handleFieldChange = (key: string, field: string, value: any) => {
    setSections((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const handleSaveSection = async (key: string) => {
    setSavingKey(key);
    const sectionData = sections[key];
    if (!sectionData) return;

    const success = await updateHomepageSection(key, sectionData);
    if (success) {
      toast.success(`Homepage section "${key}" saved successfully!`);
    } else {
      toast.error(`Failed to save section "${key}".`);
    }
    setSavingKey(null);
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const publicUrl = await uploadFile(file, 'hero-images');
      if (publicUrl) {
        handleFieldChange('hero', 'image_url', publicUrl);
        toast.success('Hero image uploaded');
      } else {
        toast.error('Upload failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Loading CMS Config...</p>
        </div>
      </div>
    );
  }

  const currentSection = sections[activeTab] || {
    id: activeTab,
    section_key: activeTab as any,
    title: '',
    subtitle: '',
    description: '',
    enabled: true,
    display_order: 1
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green block mb-1">
            Storefront CMS Editor
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-charcoal">
            Homepage Content & Hero Image Editor
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Edit text copy, hero imagery, CTA links, and visibility toggles for each section of your homepage.
          </p>
        </div>

        <Button 
          onClick={() => handleSaveSection(activeTab)} 
          disabled={savingKey === activeTab}
          className="bg-brand-green hover:bg-emerald-700 text-white font-bold h-11 px-6 shadow-xs"
        >
          <Save className="h-4 w-4 mr-2" />
          {savingKey === activeTab ? 'Saving Section...' : 'Save Current Section'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="bg-white border border-border rounded-2xl p-4 shadow-xs h-fit space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 py-2">
            Homepage Sections
          </p>
          {SECTION_KEYS.map((sec) => {
            const secData = sections[sec.key];
            const isEnabled = secData ? secData.enabled : true;
            const isActive = activeTab === sec.key;

            return (
              <button
                key={sec.key}
                onClick={() => setActiveTab(sec.key)}
                className={cn(
                  "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all",
                  isActive 
                    ? "bg-brand-green text-white shadow-xs" 
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <span>{sec.name}</span>
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  isEnabled ? (isActive ? "bg-white" : "bg-emerald-500") : "bg-slate-300"
                )} />
              </button>
            );
          })}
        </div>

        {/* Editor Panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                  {SECTION_KEYS.find(s => s.key === activeTab)?.name} Config
                </h2>
                <p className="text-xs text-muted-foreground">Section key: {activeTab}</p>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Section Enabled</span>
                <Switch 
                  checked={currentSection.enabled}
                  onCheckedChange={(val) => handleFieldChange(activeTab, 'enabled', val)}
                />
              </div>
            </div>

            {/* HERO SPECIAL EDITING PANEL */}
            {activeTab === 'hero' && (
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
                <h3 className="font-heading text-base font-bold text-brand-charcoal flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-brand-green" /> Editable Hero Image
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Upload or replace the main hero banner shown on your homepage. The image is stored securely in cloud storage.
                    </p>

                    <div className="flex items-center gap-3">
                      <Label htmlFor="heroImageUpload" className="cursor-pointer">
                        <div className="bg-brand-green text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                          <Upload className="h-4 w-4" />
                          {uploadingImage ? 'Uploading...' : 'Upload New Hero Image'}
                        </div>
                        <input 
                          id="heroImageUpload" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleHeroImageUpload}
                          disabled={uploadingImage}
                        />
                      </Label>

                      {currentSection.image_url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleFieldChange('hero', 'image_url', '')} 
                          className="text-xs font-bold text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove Image
                        </Button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="heroAlt" className="text-xs">Image Alt Text (SEO)</Label>
                      <Input 
                        id="heroAlt" 
                        placeholder="e.g. MS TRADERS wholesale paper bags showcase" 
                        value={currentSection.metadata?.alt_text || ''} 
                        onChange={(e) => handleFieldChange('hero', 'metadata', { ...currentSection.metadata, alt_text: e.target.value })} 
                      />
                    </div>
                  </div>

                  {/* Preview box */}
                  <div className="border border-border rounded-xl overflow-hidden bg-white shadow-xs p-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Hero Image Preview</p>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      {currentSection.image_url ? (
                        <Image 
                          src={currentSection.image_url} 
                          alt={currentSection.metadata?.alt_text || 'Hero Banner'} 
                          fill 
                          className="object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-muted-foreground italic">
                          No Hero Image Set
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* COMMON SECTION FIELDS */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="secSubtitle" className="text-xs">Section Eyebrow / Subtitle</Label>
                  <Input 
                    id="secSubtitle" 
                    placeholder="e.g. WHOLESALE & RETAIL PACKAGING" 
                    value={currentSection.subtitle || ''} 
                    onChange={(e) => handleFieldChange(activeTab, 'subtitle', e.target.value)} 
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="secOrder" className="text-xs">Display Order</Label>
                  <Input 
                    id="secOrder" 
                    type="number" 
                    value={currentSection.display_order || 1} 
                    onChange={(e) => handleFieldChange(activeTab, 'display_order', parseInt(e.target.value) || 1)} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="secTitle" className="text-xs">Section Main Heading</Label>
                <Input 
                  id="secTitle" 
                  placeholder="e.g. Customized Paper Bags & Non-Woven Carry Bags" 
                  value={currentSection.title || ''} 
                  onChange={(e) => handleFieldChange(activeTab, 'title', e.target.value)} 
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="secDesc" className="text-xs">Section Description Copy</Label>
                <Textarea 
                  id="secDesc" 
                  rows={3}
                  placeholder="Enter detailed description paragraph..." 
                  value={currentSection.description || ''} 
                  onChange={(e) => handleFieldChange(activeTab, 'description', e.target.value)} 
                />
              </div>

              {/* CTA FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="space-y-1.5">
                  <Label htmlFor="priCtaText" className="text-xs">Primary CTA Button Label</Label>
                  <Input 
                    id="priCtaText" 
                    placeholder="e.g. GET CUSTOM QUOTE" 
                    value={currentSection.primary_cta_text || ''} 
                    onChange={(e) => handleFieldChange(activeTab, 'primary_cta_text', e.target.value)} 
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="priCtaLink" className="text-xs">Primary CTA Button Link</Label>
                  <Input 
                    id="priCtaLink" 
                    placeholder="e.g. /customize" 
                    value={currentSection.primary_cta_link || ''} 
                    onChange={(e) => handleFieldChange(activeTab, 'primary_cta_link', e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="secCtaText" className="text-xs">Secondary CTA Button Label</Label>
                  <Input 
                    id="secCtaText" 
                    placeholder="e.g. EXPLORE CATALOG" 
                    value={currentSection.secondary_cta_text || ''} 
                    onChange={(e) => handleFieldChange(activeTab, 'secondary_cta_text', e.target.value)} 
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="secCtaLink" className="text-xs">Secondary CTA Button Link</Label>
                  <Input 
                    id="secCtaLink" 
                    placeholder="e.g. /shop" 
                    value={currentSection.secondary_cta_link || ''} 
                    onChange={(e) => handleFieldChange(activeTab, 'secondary_cta_link', e.target.value)} 
                  />
                </div>
              </div>

              {activeTab !== 'hero' && (
                <div className="space-y-1.5 pt-2">
                  <Label htmlFor="secImage" className="text-xs">Section Background / Banner Image URL</Label>
                  <Input 
                    id="secImage" 
                    placeholder="https://..." 
                    value={currentSection.image_url || ''} 
                    onChange={(e) => handleFieldChange(activeTab, 'image_url', e.target.value)} 
                  />
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button 
                onClick={() => handleSaveSection(activeTab)} 
                disabled={savingKey === activeTab}
                className="bg-brand-green hover:bg-emerald-700 text-white font-bold h-11 px-8 shadow-xs"
              >
                <Save className="h-4 w-4 mr-2" />
                {savingKey === activeTab ? 'Saving Changes...' : 'Save Section'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

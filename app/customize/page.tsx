'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Upload, FileText, ChevronRight, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { createQuote, uploadFileToSupabase } from '@/lib/supabase/services';
import { useSettings } from '@/components/settings-provider';

const STEPS = [
  'SELECT BAG TYPE',
  'REQUIREMENTS',
  'UPLOAD DESIGN',
  'CUSTOMER DETAILS',
  'REVIEW'
];

function CustomizeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProduct = searchParams?.get('product') || '';
  const { settings } = useSettings();

  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [quoteRef, setQuoteRef] = React.useState('');

  const [formData, setFormData] = React.useState({
    bagType: initialProduct || 'paper-bags',
    quantity: '1000',
    width: '',
    height: '',
    gusset: '',
    material: 'kraft-brown',
    color: '',
    handleType: 'twisted',
    printing: 'single',
    fullName: '',
    businessName: '',
    phone: '',
    whatsapp: '',
    email: '',
    city: '',
    state: '',
    pincode: '',
    message: '',
  });

  const [file, setFile] = React.useState<File | null>(null);

  const handleNext = () => {
    // Validate required fields before step advancement
    if (currentStep === 0 && !formData.bagType) {
      toast.error('Please select a bag category');
      return;
    }
    if (currentStep === 1 && (!formData.quantity || parseInt(formData.quantity, 10) < 50)) {
      toast.error('Please specify a valid quantity (minimum 50 units)');
      return;
    }
    if (currentStep === 3) {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
        toast.error('Name, Email, and Phone are required fields');
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      toast.success('Artwork file selected');
    }
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('Please complete contact details');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let attachmentUrl: string | null = null;
      if (file) {
        toast.info('Uploading artwork file...');
        attachmentUrl = await uploadFileToSupabase(file, 'quote-attachments');
      }

      const dimensionsStr = (formData.width && formData.height) 
        ? `${formData.width}W x ${formData.height}H ${formData.gusset ? `x ${formData.gusset}G` : ''}`
        : 'Standard Custom Sizing';

      const createdQuote = await createQuote({
        customer_name: formData.fullName,
        business_name: formData.businessName || undefined,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        city: formData.city || undefined,
        bag_type: formData.bagType,
        quantity: parseInt(formData.quantity, 10) || 500,
        material: formData.material,
        printing: formData.printing,
        handle_type: formData.handleType,
        size: dimensionsStr,
        requirements: {
          dimensions: dimensionsStr,
          color_preference: formData.color || 'Standard',
          state: formData.state,
          pincode: formData.pincode
        },
        attachments: attachmentUrl ? [attachmentUrl] : [],
        notes: formData.message || undefined
      });

      if (createdQuote) {
        setQuoteRef(createdQuote.quote_number);
        setIsSuccess(true);
        toast.success('Custom quote request submitted!');
      } else {
        toast.error('Submission failed. Please try again or contact us directly.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-background min-h-screen pt-24 pb-32">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-12 w-12 text-brand-green" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-charcoal mb-4">
            YOUR REQUEST HAS BEEN RECEIVED.
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for reaching out to MS TRADERS. Our technical team is reviewing your bag specifications and artwork.
          </p>
          <div className="bg-white border border-border p-6 rounded-xl mb-12 shadow-xs">
             <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-bold">Your Official Reference Number</p>
             <p className="text-3xl font-extrabold text-brand-charcoal font-mono tracking-wider">{quoteRef}</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold" asChild>
               <a 
                href={`https://wa.me/${settings.whatsapp}?text=Hi%20MS%20TRADERS,%20I%20just%20submitted%20a%20quote%20request.%20Reference:%20${quoteRef}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
               >
                 <MessageSquare className="h-5 w-5" />
                 <span>Chat on WhatsApp</span>
               </a>
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/shop')}>
               Continue Browsing Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-charcoal mb-3">Request a Custom Bag Quote</h1>
          <p className="text-muted-foreground">Specify your exact dimensions, material GSM, handle style, and logo artwork for wholesale pricing.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full -z-10" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-green rounded-full -z-10 transition-all duration-500 ease-in-out" 
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} 
            />
            
            {STEPS.map((step, index) => (
              <div key={step} className="flex flex-col items-center gap-2 bg-background px-1 sm:px-2">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
                  ${index <= currentStep 
                    ? 'border-brand-green bg-brand-green text-white' 
                    : 'border-border bg-background text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </div>
                <span className="hidden md:block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {step}
                </span>
              </div>
            ))}
          </div>
          <p className="md:hidden text-center mt-3 text-xs font-bold text-brand-green uppercase tracking-wider">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
          </p>
        </div>

        <div className="bg-white border border-border/60 rounded-2xl p-6 md:p-10 shadow-xs">
          {/* STEP 1: BAG TYPE */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal border-b pb-4">1. Select Bag Category</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'paper-bags', name: 'Paper & Kraft Bags', desc: 'Brown & white virgin kraft paper carry bags' },
                  { id: 'non-woven-bags', name: 'Non-Woven Bags', desc: 'Durable D-Cut and W-Cut reusable fabric bags' },
                  { id: 'designer-bags', name: 'Luxury Designer & Gift Bags', desc: 'Laminated boutique packaging with ribbon handles' },
                  { id: 'customized-bags', name: 'Tailor-made Custom Packaging', desc: 'Specialized dimensions, foil stamping & custom GSM' }
                ].map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleSelectChange('bagType', type.id)}
                    className={`p-6 border-2 rounded-xl text-left transition-all ${
                      formData.bagType === type.id 
                        ? 'border-brand-green bg-brand-green/5 ring-1 ring-brand-green' 
                        : 'border-border hover:border-brand-green/50'
                    }`}
                  >
                    <div className="font-bold text-brand-charcoal text-base">{type.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: REQUIREMENTS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal border-b pb-4">2. Technical Specifications</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Required Quantity (Units) *</Label>
                  <Input id="quantity" name="quantity" type="number" placeholder="1000" value={formData.quantity} onChange={handleChange} required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="material">Material / Fabric Grade</Label>
                  <Select value={formData.material} onValueChange={(val) => handleSelectChange('material', val)}>
                    <SelectTrigger id="material">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="120 GSM Natural Virgin Kraft">120 GSM Natural Virgin Kraft</SelectItem>
                      <SelectItem value="150 GSM White Kraft Paper">150 GSM White Kraft Paper</SelectItem>
                      <SelectItem value="210 GSM Laminated Art Card">210 GSM Laminated Art Card</SelectItem>
                      <SelectItem value="70 GSM Spunbond Non-Woven">70 GSM Spunbond Non-Woven</SelectItem>
                      <SelectItem value="80 GSM Heavy Non-Woven">80 GSM Heavy Non-Woven</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Required Dimensions (Inches)</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Input name="width" placeholder="Width (W)" value={formData.width} onChange={handleChange} />
                    <Input name="height" placeholder="Height (H)" value={formData.height} onChange={handleChange} />
                    <Input name="gusset" placeholder="Gusset/Depth (G)" value={formData.gusset} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="printing">Printing & Finishing</Label>
                  <Select value={formData.printing} onValueChange={(val) => handleSelectChange('printing', val)}>
                    <SelectTrigger id="printing">
                      <SelectValue placeholder="Select printing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Color Screen Print</SelectItem>
                      <SelectItem value="multi">Multi-Color Offset Printing</SelectItem>
                      <SelectItem value="foil">Gold / Silver Foil Stamping</SelectItem>
                      <SelectItem value="uv">Spot UV & Embossing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handleType">Handle Style</Label>
                  <Select value={formData.handleType} onValueChange={(val) => handleSelectChange('handleType', val)}>
                    <SelectTrigger id="handleType">
                      <SelectValue placeholder="Select handle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twisted">Twisted Paper Cord</SelectItem>
                      <SelectItem value="flat">Flat Paper Handle</SelectItem>
                      <SelectItem value="rope">Braided Cotton Rope</SelectItem>
                      <SelectItem value="ribbon">Satin Ribbon</SelectItem>
                      <SelectItem value="dcut">D-Cut Die Punch</SelectItem>
                      <SelectItem value="wcut">W-Cut Grocery Vest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: UPLOAD */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal border-b pb-4">3. Upload Logo or Artwork File</h2>
              
              <div className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-200">
                  <Upload className="h-8 w-8 text-brand-green" />
                </div>
                <h3 className="font-bold text-lg text-brand-charcoal mb-1">Attach Artwork or Spec Sheet</h3>
                <p className="text-muted-foreground text-xs mb-6 max-w-sm">
                  Attach vector logo (.AI, .PDF, .CDR, .EPS) or reference photo of desired bag style (Max 10MB).
                </p>
                <div className="relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.ai,.eps,.cdr"
                  />
                  <Button variant="outline" className="font-semibold">Select File From Device</Button>
                </div>
              </div>

              {file && (
                <div className="flex items-center gap-4 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
                  <FileText className="h-8 w-8 text-brand-green shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-800 truncate">{file.name}</div>
                    <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-red-600 hover:text-red-700">Remove</Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: CUSTOMER DETAILS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
               <h2 className="font-heading text-xl font-bold text-brand-charcoal border-b pb-4">4. Contact & Business Details</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" name="fullName" placeholder="Rahul Sharma" value={formData.fullName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Company / Brand Name</Label>
                    <Input id="businessName" name="businessName" placeholder="Taj Retail Pvt Ltd" value={formData.businessName} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" placeholder="rahul@example.com" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input id="whatsapp" name="whatsapp" type="tel" placeholder="919876543210" value={formData.whatsapp} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City / Delivery Location</Label>
                    <Input id="city" name="city" placeholder="Mumbai / Delhi / Ahmedabad" value={formData.city} onChange={handleChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="message">Specific Manufacturing Instructions</Label>
                    <Textarea id="message" name="message" placeholder="Mention target delivery date, gusset details, or special requests..." value={formData.message} onChange={handleChange} />
                  </div>
               </div>
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal border-b pb-4">5. Final Review Before Submission</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-base text-brand-charcoal">Bag Specifications</h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-bold text-slate-800 capitalize">{formData.bagType.replace(/-/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-bold text-brand-green">{formData.quantity} units</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-muted-foreground">Material:</span>
                      <span className="font-semibold text-slate-800">{formData.material}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-muted-foreground">Printing:</span>
                      <span className="font-semibold text-slate-800 capitalize">{formData.printing}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-muted-foreground">Artwork File:</span>
                      <span className="font-semibold text-slate-800">{file ? file.name : 'None attached'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-base text-brand-charcoal">Contact Details</h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-muted-foreground">Full Name:</span>
                      <span className="font-bold text-slate-800">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-muted-foreground">Company:</span>
                      <span className="font-semibold text-slate-800">{formData.businessName || 'Individual'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-semibold text-brand-green">{formData.email}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-semibold text-slate-800">{formData.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 pt-6 border-t border-border">
            <Button 
              type="button"
              variant="outline" 
              onClick={handlePrev} 
              disabled={currentStep === 0 || isSubmitting}
            >
              Back
            </Button>
            
            {currentStep < STEPS.length - 1 ? (
              <Button type="button" onClick={handleNext} className="bg-brand-green text-white hover:bg-brand-green/90">
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="button"
                onClick={handleSubmit} 
                disabled={isSubmitting || !formData.fullName || !formData.email || !formData.phone}
                className="bg-brand-gold text-brand-charcoal hover:bg-amber-400 font-bold px-8 shadow-sm"
              >
                {isSubmitting ? 'Submitting to Supabase...' : 'Submit Custom Quote Request'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomizePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen pt-24 pb-32 flex items-center justify-center">Loading form...</div>}>
      <CustomizeForm />
    </React.Suspense>
  );
}

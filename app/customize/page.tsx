'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Upload, FileText, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

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
  const initialProduct = searchParams.get('product');
  
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [quoteRef, setQuoteRef] = React.useState('');

  const [formData, setFormData] = React.useState({
    bagType: initialProduct || '',
    quantity: '',
    width: '',
    height: '',
    gusset: '',
    material: '',
    color: '',
    handleType: '',
    printing: '',
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
    // Basic validation per step could be added here
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
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call to save quote
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const refNumber = `MST-QT-${Math.floor(100000 + Math.random() * 900000)}`;
      setQuoteRef(refNumber);
      setIsSuccess(true);
      toast.success('Quote request submitted successfully!');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
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
          <h1 className="font-heading text-4xl font-bold text-brand-charcoal mb-4">
            YOUR REQUEST HAS BEEN RECEIVED.
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you. Our team will review your requirements and contact you shortly with a personalized quote.
          </p>
          <div className="bg-white border border-border p-6 rounded-xl mb-12 shadow-sm">
             <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Your Reference Number</p>
             <p className="text-3xl font-bold text-brand-charcoal font-mono">{quoteRef}</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
               <a href={`https://wa.me/910000000000?text=Hi, I just submitted a quote request. Reference: ${quoteRef}`}>
                 Chat on WhatsApp
               </a>
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/shop')}>
               Continue Browsing
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
          <h1 className="font-heading text-4xl font-bold text-brand-charcoal mb-4">Request a Custom Quote</h1>
          <p className="text-muted-foreground">Share your requirements and we will get back to you with the best pricing.</p>
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
              <div key={step} className="flex flex-col items-center gap-2 bg-background px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                  ${index <= currentStep 
                    ? 'border-brand-green bg-brand-green text-white' 
                    : 'border-border bg-background text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </div>
                <span className="hidden md:block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-border/60 rounded-2xl p-6 md:p-10 shadow-sm">
          {/* STEP 1: BAG TYPE */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="font-heading text-2xl font-bold text-brand-charcoal border-b pb-4">Select Bag Type</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'premium-kraft-paper-bag', name: 'Paper & Kraft Bags' },
                  { id: 'standard-non-woven-d-cut', name: 'Non-Woven Bags' },
                  { id: 'designer-bags', name: 'Designer & Gift Bags' },
                  { id: 'other', name: 'Other / Not Sure' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => handleSelectChange('bagType', type.id)}
                    className={`p-6 border-2 rounded-xl text-left transition-all ${
                      formData.bagType === type.id 
                        ? 'border-brand-green bg-brand-green/5' 
                        : 'border-border hover:border-brand-green/50'
                    }`}
                  >
                    <div className="font-semibold text-brand-charcoal text-lg">{type.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: REQUIREMENTS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="font-heading text-2xl font-bold text-brand-charcoal border-b pb-4">Bag Specifications</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity Required *</Label>
                  <Input id="quantity" name="quantity" type="number" placeholder="e.g. 1000" value={formData.quantity} onChange={handleChange} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="material">Preferred Material</Label>
                  <Select value={formData.material} onValueChange={(val) => handleSelectChange('material', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kraft-brown">Brown Kraft Paper</SelectItem>
                      <SelectItem value="kraft-white">White Kraft Paper</SelectItem>
                      <SelectItem value="art-paper">Art Paper / Laminated</SelectItem>
                      <SelectItem value="non-woven">Non-Woven Fabric</SelectItem>
                      <SelectItem value="not-sure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Dimensions (in inches)</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Input name="width" placeholder="Width" value={formData.width} onChange={handleChange} />
                    <Input name="height" placeholder="Height" value={formData.height} onChange={handleChange} />
                    <Input name="gusset" placeholder="Gusset (Depth)" value={formData.gusset} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="printing">Printing Requirements</Label>
                  <Select value={formData.printing} onValueChange={(val) => handleSelectChange('printing', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select printing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Printing (Plain)</SelectItem>
                      <SelectItem value="single">Single Color</SelectItem>
                      <SelectItem value="multi">Multi Color</SelectItem>
                      <SelectItem value="foil">Gold/Silver Foil Stamping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handleType">Handle Type</Label>
                  <Select value={formData.handleType} onValueChange={(val) => handleSelectChange('handleType', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select handle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twisted">Twisted Paper</SelectItem>
                      <SelectItem value="flat">Flat Paper</SelectItem>
                      <SelectItem value="rope">Cotton Rope</SelectItem>
                      <SelectItem value="ribbon">Ribbon</SelectItem>
                      <SelectItem value="dcut">D-Cut (Punch)</SelectItem>
                      <SelectItem value="wcut">W-Cut (Grocery)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: UPLOAD */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="font-heading text-2xl font-bold text-brand-charcoal border-b pb-4">Upload Design or Logo</h2>
              
              <div className="border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-brand-green" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Upload your artwork</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                  Attach your logo, design file, or a reference image of what you're looking for. (Max 10MB)
                </p>
                <div className="relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.ai,.eps,.cdr"
                  />
                  <Button variant="outline">Select File</Button>
                </div>
              </div>

              {file && (
                <div className="flex items-center gap-4 bg-brand-cream p-4 rounded-lg border border-border">
                  <FileText className="h-8 w-8 text-brand-green" />
                  <div className="flex-1">
                    <div className="font-medium text-sm truncate max-w-[200px] sm:max-w-xs">{file.name}</div>
                    <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-red-500 hover:text-red-600">Remove</Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: CUSTOMER DETAILS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
               <h2 className="font-heading text-2xl font-bold text-brand-charcoal border-b pb-4">Contact Details</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business/Company Name *</Label>
                    <Input id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number (Optional)</Label>
                    <Input id="whatsapp" name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="message">Additional Notes</Label>
                    <Textarea id="message" name="message" placeholder="Any specific requirements or questions..." value={formData.message} onChange={handleChange} />
                  </div>
               </div>
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="font-heading text-2xl font-bold text-brand-charcoal border-b pb-4">Review Your Request</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Product Requirements</h3>
                  <div className="bg-brand-cream/50 rounded-lg p-4 space-y-3 text-sm">
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Bag Category:</span>
                      <span className="font-medium capitalize">{formData.bagType || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{formData.quantity || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span className="font-medium">
                        {formData.width && formData.height 
                          ? `${formData.width}W x ${formData.height}H ${formData.gusset ? `x ${formData.gusset}G` : ''}` 
                          : 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Printing:</span>
                      <span className="font-medium capitalize">{formData.printing || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-muted-foreground">Artwork:</span>
                      <span className="font-medium">{file ? file.name : 'None attached'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Contact Info</h3>
                  <div className="bg-brand-cream/50 rounded-lg p-4 space-y-3 text-sm">
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Business:</span>
                      <span className="font-medium">{formData.businessName}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 pt-6 border-t border-border">
            <Button 
              variant="outline" 
              onClick={handlePrev} 
              disabled={currentStep === 0 || isSubmitting}
            >
              Back
            </Button>
            
            {currentStep < STEPS.length - 1 ? (
              <Button onClick={handleNext} disabled={currentStep === 0 && !formData.bagType}>
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !formData.fullName || !formData.email || !formData.phone}
                className="bg-brand-gold text-brand-charcoal hover:bg-brand-gold/90"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
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
    <React.Suspense fallback={<div className="min-h-screen pt-24 pb-32 flex items-center justify-center">Loading...</div>}>
      <CustomizeForm />
    </React.Suspense>
  );
}

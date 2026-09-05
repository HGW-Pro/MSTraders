'use client';

import * as React from 'react';
import { 
  Star, 
  MessageSquarePlus, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Quote, 
  Send,
  Loader2,
  BadgeCheck,
  HeartHandshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { submitClientFeedback } from '@/lib/db/services';
import { Testimonial, HomepageSection } from '@/types';
import { cn } from '@/lib/utils';

interface ClientFeedbackSectionProps {
  testimonials: Testimonial[];
  sectionConfig?: HomepageSection;
  onFeedbackSubmitted?: () => void;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  5: '⭐⭐⭐⭐⭐ 5.0 - Exceptional Quality & Service',
  4: '⭐⭐⭐⭐ 4.0 - Great Experience & Reliable Quality',
  3: '⭐⭐⭐ 3.0 - Good & Satisfactory Packaging',
  2: '⭐⭐ 2.0 - Fair / Needs Specific Improvements',
  1: '⭐ 1.0 - Dissatisfied with Order'
};

const BAG_CATEGORIES = [
  'Non-Woven W-Cut Vest Bags',
  'Non-Woven D-Cut Bags',
  'Non-Woven Box / 3D Bags',
  'Luxury Kraft / White Paper Bags',
  'Boutique Laminated Gift Bags',
  'Loop Handle Grocery Bags',
  'Custom Multicolored Flexo Bags',
  'General Wholesale Packaging'
];

export function ClientFeedbackSection({ 
  testimonials, 
  sectionConfig, 
  onFeedbackSubmitted 
}: ClientFeedbackSectionProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Form state
  const [rating, setRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const [name, setName] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [role, setRole] = React.useState('');
  const [city, setCity] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [productPurchased, setProductPurchased] = React.useState('');
  const [review, setReview] = React.useState('');

  const resetForm = () => {
    setRating(5);
    setHoverRating(null);
    setName('');
    setCompany('');
    setRole('');
    setCity('');
    setPhone('');
    setEmail('');
    setProductPurchased('');
    setReview('');
    setIsSuccess(false);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!review.trim() || review.trim().length < 10) {
      toast.error('Please provide a brief feedback comment (at least 10 characters)');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitClientFeedback({
        customer_name: name,
        business_name: company,
        role: role || 'Store Owner',
        city: city || 'Ujjain & MP',
        phone,
        email,
        product_purchased: productPurchased,
        rating,
        review
      });

      if (res.success) {
        setIsSuccess(true);
        toast.success('Thank you! Your feedback has been submitted.');
        if (onFeedbackSubmitted) onFeedbackSubmitted();
      } else {
        toast.error(res.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error sending feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const activeRatingDisplay = hoverRating || rating;

  // Calculate average rating if testimonials exist
  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : '5.0';

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-b border-border/80 relative overflow-hidden">
      {/* Subtle Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-24 left-10 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-10 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200/80 pb-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{sectionConfig?.subtitle || 'GENUINE CLIENT VOICES'}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-charcoal tracking-tight">
              {sectionConfig?.title || 'Client Feedback & Reviews'}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {sectionConfig?.description || 'Read honest reviews from wholesale merchants, boutique owners, and retail enterprises who rely on MS TRADERS carry bags.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {testimonials.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-amber-400" />
                </div>
                <span className="font-heading font-extrabold text-brand-charcoal text-sm">{avgRating} / 5</span>
                <span className="text-xs text-muted-foreground">({testimonials.length} {testimonials.length === 1 ? 'review' : 'reviews'})</span>
              </div>
            )}

            <Button 
              onClick={handleOpenModal}
              className="bg-brand-green hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm h-11 px-5 rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span>Share Your Feedback</span>
            </Button>
          </div>
        </div>

        {/* Testimonials Display Grid or Invitation State */}
        {testimonials.length === 0 ? (
          /* Empty / Invitation State when all default reviews are removed & awaiting user submissions */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 text-center shadow-xs max-w-3xl mx-auto relative overflow-hidden">
            <div className="w-16 h-16 bg-emerald-50 text-brand-green rounded-2xl flex items-center justify-center mx-auto mb-5 ring-8 ring-emerald-50/50">
              <HeartHandshake className="h-8 w-8 stroke-[1.75]" />
            </div>

            <h3 className="font-heading text-2xl font-bold text-brand-charcoal mb-3">
              Partnered with MS TRADERS for Your Packaging?
            </h3>
            <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
              We take pride in our zero-compromise bag GSM, precision cylinder printing, and wholesale reliability. 
              Be among the first to share your experience and guide fellow businesses in Ujjain & Madhya Pradesh!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-8 text-left">
              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
                <p className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-brand-green" /> 100% Genuine
                </p>
                <p className="text-[11px] text-muted-foreground">Moderated reviews from real bulk buyers.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
                <p className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-400" /> Star Ratings
                </p>
                <p className="text-[11px] text-muted-foreground">Rate print clarity, GSM, and delivery.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
                <p className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-brand-green" /> Verified Wall
                </p>
                <p className="text-[11px] text-muted-foreground">Featured directly on our homepage.</p>
              </div>
            </div>

            <Button 
              onClick={handleOpenModal} 
              size="lg"
              className="bg-brand-green hover:bg-emerald-700 text-white font-bold px-8 h-12 rounded-xl shadow-xs"
            >
              <MessageSquarePlus className="h-4 w-4 mr-2" /> Write the First Review
            </Button>
          </div>
        ) : (
          /* Approved Testimonials List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div 
                key={t.id} 
                className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative"
              >
                <div className="space-y-4">
                  {/* Card Header: Rating + Verified Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "h-4 w-4 transition-transform group-hover:scale-105", 
                            i < (t.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          )} 
                        />
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <BadgeCheck className="h-3.5 w-3.5 text-brand-green" />
                      <span>Verified Client</span>
                    </span>
                  </div>

                  {/* Testimonial Quote */}
                  <div className="relative">
                    <Quote className="h-6 w-6 text-brand-green/20 absolute -top-1 -left-1 rotate-180" />
                    <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed pl-5 italic">
                      &ldquo;{t.content || t.review}&rdquo;
                    </p>
                  </div>

                  {/* Product Tag if provided */}
                  {t.product_purchased && (
                    <div className="inline-block px-2.5 py-1 bg-slate-100 border border-slate-200/80 rounded-lg text-[10px] font-medium text-slate-700">
                      Packaging: <span className="font-bold text-slate-900">{t.product_purchased}</span>
                    </div>
                  )}
                </div>

                {/* Author Info */}
                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-cream/80 border border-brand-green/20 flex items-center justify-center font-heading font-extrabold text-brand-green text-xs shadow-2xs">
                      {(t.customer_name || t.name || 'C').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-brand-charcoal">
                        {t.customer_name || t.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        {t.business_name || t.company ? (
                          <>
                            <Building2 className="h-3 w-3 text-slate-400" />
                            <span>{t.business_name || t.company}</span>
                          </>
                        ) : (
                          <span>{t.role || 'Wholesale Client'}</span>
                        )}
                        {t.city && <span className="text-slate-400">• {t.city}</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FEEDBACK SUBMISSION MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-6 sm:p-8">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-brand-green rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/60">
                <CheckCircle2 className="h-10 w-10 text-brand-green" />
              </div>

              <div className="space-y-2">
                <DialogTitle className="font-heading text-2xl font-bold text-brand-charcoal">
                  Thank You for Your Feedback!
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Your testimonial has been received. To ensure authenticity across our wholesale portal, our administration team will review and approve it shortly.
                </DialogDescription>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5 text-slate-700">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-brand-green" /> What happens next?
                </p>
                <p className="text-slate-600 text-[11px]">
                  Our team reviews all client submissions to maintain genuine business feedback. Once approved, your review will appear live on the MS TRADERS homepage.
                </p>
              </div>

              <Button 
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-brand-green hover:bg-emerald-700 text-white font-bold h-11 rounded-xl text-sm"
              >
                Close & Return
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <DialogHeader className="text-left space-y-1 border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-green uppercase tracking-wider">
                  <MessageSquarePlus className="h-3.5 w-3.5" />
                  <span>Client Experience Desk</span>
                </div>
                <DialogTitle className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">
                  Share Your Feedback
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Your feedback helps us maintain premium manufacturing standards and assist fellow merchants.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* 1. STAR RATING SELECTOR */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                  <Label className="text-xs font-bold text-brand-charcoal block">
                    How would you rate your overall experience with MS TRADERS? *
                  </Label>
                  
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const isFilled = starVal <= (hoverRating !== null ? hoverRating : rating);
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 text-slate-300 hover:scale-125 transition-transform focus:outline-none"
                          aria-label={`Rate ${starVal} stars`}
                        >
                          <Star 
                            className={cn(
                              "h-7 w-7 transition-colors",
                              isFilled ? "fill-amber-400 text-amber-400" : "text-slate-300"
                            )} 
                          />
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[11px] font-bold text-emerald-800 pt-0.5">
                    {RATING_DESCRIPTIONS[activeRatingDisplay]}
                  </p>
                </div>

                {/* 2. CLIENT BASIC DETAILS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="fb-name" className="font-bold text-slate-800">
                      Your Full Name *
                    </Label>
                    <Input 
                      id="fb-name"
                      placeholder="e.g. Ramesh Patel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="text-xs h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="fb-company" className="font-bold text-slate-800">
                      Business / Store Name
                    </Label>
                    <Input 
                      id="fb-company"
                      placeholder="e.g. Patel Sarees & Boutique"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="text-xs h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="fb-role" className="font-bold text-slate-800">
                      Designation / Role
                    </Label>
                    <Input 
                      id="fb-role"
                      placeholder="e.g. Proprietor / Store Manager"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="text-xs h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="fb-city" className="font-bold text-slate-800">
                      City / Location
                    </Label>
                    <Input 
                      id="fb-city"
                      placeholder="e.g. Ujjain / Indore"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="text-xs h-10 rounded-xl"
                    />
                  </div>
                </div>

                {/* 3. PRODUCT / BAG TYPE ORDERED */}
                <div className="space-y-1.5">
                  <Label htmlFor="fb-product" className="font-bold text-slate-800">
                    Product / Bag Type Purchased
                  </Label>
                  <Select value={productPurchased} onValueChange={setProductPurchased}>
                    <SelectTrigger id="fb-product" className="text-xs h-10 rounded-xl">
                      <SelectValue placeholder="Select bag variety you ordered..." />
                    </SelectTrigger>
                    <SelectContent>
                      {BAG_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-xs">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. DETAILED REVIEW COMMENTS */}
                <div className="space-y-1.5">
                  <Label htmlFor="fb-review" className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Your Review & Comments *</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Min 10 characters</span>
                  </Label>
                  <Textarea 
                    id="fb-review"
                    rows={4}
                    placeholder="Tell us about the bag GSM quality, handle durability, printing clarity, pricing, or on-time delivery..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                    className="text-xs rounded-xl resize-none"
                  />
                </div>

                {/* 5. CONTACT INFO (OPTIONAL) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <Label htmlFor="fb-phone" className="text-[11px] text-muted-foreground">
                      Phone Number (Optional - for order verification)
                    </Label>
                    <Input 
                      id="fb-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="text-xs h-9 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="fb-email" className="text-[11px] text-muted-foreground">
                      Email Address (Optional)
                    </Label>
                    <Input 
                      id="fb-email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-xs h-9 rounded-xl"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON & NOTICE */}
                <div className="pt-2 space-y-2">
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-brand-green hover:bg-emerald-700 text-white font-bold h-11 rounded-xl shadow-xs text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Submitting Testimonial...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Feedback for Approval</span>
                      </>
                    )}
                  </Button>

                  <p className="text-[10px] text-center text-muted-foreground">
                    Reviews are reviewed by MS TRADERS admin before being published publicly to prevent spam.
                  </p>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

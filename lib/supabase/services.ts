import { supabase } from './client';
import { 
  Product, 
  Category, 
  Quote, 
  Order, 
  GalleryItem, 
  BusinessSettings, 
  Industry, 
  UserProfile,
  CustomerAddress,
  HomepageSection,
  Testimonial,
  MediaItem,
  AppNotification,
  QuoteStatus,
  OrderStatus 
} from '@/types';

// DEFAULT BUSINESS SETTINGS
export const DEFAULT_SETTINGS: BusinessSettings = {
  business_name: 'MS TRADERS',
  tagline: 'Wholesale & Retail Supplier of Paper Bags, Non-Woven Bags, Customized Bags, Designer Gift Bags & Envelopes',
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
  customer_accounts_enabled: true,
  enable_direct_cart_checkout: false,
  require_account_for_quotes: true
};

// DEFAULT CATEGORIES
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Paper Bags', slug: 'paper-bags', description: 'High-quality customized paper bags for retail, gifting, and corporate branding.', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', display_order: 1 },
  { id: 'cat-2', name: 'Kraft Bags', slug: 'kraft-bags', description: 'Eco-friendly brown and white kraft paper bags with twisted or flat handles.', image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80', display_order: 2 },
  { id: 'cat-3', name: 'Non-Woven Bags', slug: 'non-woven-bags', description: 'Durable, reusable non-woven fabric bags for everyday shopping and retail.', image_url: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=800&q=80', display_order: 3 },
  { id: 'cat-4', name: 'W-Cut Bags', slug: 'w-cut-bags', description: 'Grocery and supermarket bags with ergonomic W-cut handles.', image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80', display_order: 4 },
  { id: 'cat-5', name: 'D-Cut Bags', slug: 'd-cut-bags', description: 'Sleek D-cut handle bags for apparel stores, exhibitions, and pharmacies.', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', display_order: 5 },
  { id: 'cat-6', name: 'Designer Bags', slug: 'designer-bags', description: 'Luxury laminated boutique bags with foil stamping and velvet or rope handles.', image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', display_order: 6 },
  { id: 'cat-7', name: 'Gift Bags', slug: 'gift-bags', description: 'Festive and corporate gift packaging bags with custom prints.', image_url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80', display_order: 7 },
  { id: 'cat-8', name: 'Customized Bags', slug: 'customized-bags', description: 'Tailor-made bags engineered to your exact dimension, GSM, handle, and printing specs.', image_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80', display_order: 8 },
  { id: 'cat-9', name: 'Envelopes', slug: 'envelopes', description: 'Heavy paper envelope pouches for documents, boutique items, and gifts.', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', display_order: 9 },
];

// DEFAULT SEED PRODUCTS FOR FIRST-TIME SUPABASE INITIALIZATION
export const INITIAL_PRODUCTS: Partial<Product>[] = [
  {
    name: 'Premium Kraft Paper Bag',
    slug: 'premium-kraft-paper-bag',
    description: 'High-quality twisted handle kraft paper bag made from premium virgin kraft paper. Durable, eco-friendly, and ideal for upscale retail stores and boutiques.',
    price: 18,
    sale_price: 15,
    category: 'kraft-bags',
    sku: 'MST-KB-001',
    material: '120 GSM Natural Virgin Kraft Paper',
    moq: 500,
    is_featured: true,
    is_customizable: true,
    status: 'published',
    images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'],
    sizes: ['Small (8x10x4")', 'Medium (10x13x5")', 'Large (16x12x6")'],
    colors: ['Natural Brown', 'Bleached White'],
    handles: ['Twisted Paper', 'Flat Cotton Ribbon'],
    printing_options: ['Single Color Screen Print', 'Multi-Color Offset', 'Foil Stamping']
  },
  {
    name: 'Luxury Boutique Designer Bag',
    slug: 'luxury-boutique-designer-bag',
    description: 'Elegant matte laminated art paper bag featuring reinforced cardboard base, cotton rope handles, and spot UV printing. Perfect for fashion apparel and luxury gifts.',
    price: 45,
    sale_price: null,
    category: 'designer-bags',
    sku: 'MST-DB-002',
    material: '210 GSM Imported Art Card',
    moq: 250,
    is_featured: true,
    is_customizable: true,
    status: 'published',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'],
    sizes: ['Small (7x9x3")', 'Medium (11x14x4.5")', 'Large (15x18x6")'],
    colors: ['Jet Black', 'Ivory White', 'Royal Blue', 'Emerald Green'],
    handles: ['Braided Cotton Rope', 'Satin Ribbon'],
    printing_options: ['Gold Foil Stamping', 'Spot UV', 'Full Color CMYK Offset']
  },
  {
    name: 'Standard Non-Woven D-Cut Bag',
    slug: 'standard-non-woven-d-cut-bag',
    description: 'Cost-effective, highly durable reusable bag for everyday retail, trade shows, and pharmacies. Heavy heat-seal seams ensure high load capacity.',
    price: 8,
    sale_price: 6.5,
    category: 'non-woven-bags',
    sku: 'MST-NW-003',
    material: '70 GSM Spunbond Non-Woven Fabric',
    moq: 1000,
    is_featured: true,
    is_customizable: true,
    status: 'published',
    images: ['https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=800&q=80'],
    sizes: ['10x14 inch', '12x16 inch', '14x19 inch'],
    colors: ['Bright Red', 'Navy Blue', 'Forest Green', 'Black', 'White'],
    handles: ['Built-in D-Cut'],
    printing_options: ['Screen Printing', 'Rotogravure']
  },
  {
    name: 'Eco Supermarket W-Cut Bag',
    slug: 'eco-supermarket-w-cut-bag',
    description: 'Sturdy grocery carry bag with side gussets and ergonomic W-cut vest handles, engineered specifically for supermarkets and department stores.',
    price: 10,
    sale_price: null,
    category: 'w-cut-bags',
    sku: 'MST-WC-004',
    material: '80 GSM Recycled Non-Woven',
    moq: 2000,
    is_featured: false,
    is_customizable: true,
    status: 'published',
    images: ['https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80'],
    sizes: ['13x16+4 inch', '16x20+5 inch'],
    colors: ['Off White', 'Yellow', 'Sky Blue'],
    handles: ['W-Cut Vest Handle'],
    printing_options: ['Flexographic Print']
  },
  {
    name: 'Festive Custom Gift Bag',
    slug: 'festive-custom-gift-bag',
    description: 'Premium gift bag with glossy finish and custom hot-stamped patterns, perfect for weddings, corporate gifting, and festive celebrations.',
    price: 32,
    sale_price: 28,
    category: 'gift-bags',
    sku: 'MST-GB-005',
    material: '180 GSM Glossy Coated Paper',
    moq: 300,
    is_featured: true,
    is_customizable: true,
    status: 'published',
    images: ['https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80'],
    sizes: ['8x10x3.5"', '10x12x4"', '12x15x5"'],
    colors: ['Crimson Red', 'Metallic Gold', 'Deep Purple'],
    handles: ['Silk Ribbon', 'Twisted Cotton Cord'],
    printing_options: ['Embossed Gold Foil', 'Glitter Finish']
  }
];

// DEFAULT INDUSTRIES
export const DEFAULT_INDUSTRIES: Industry[] = [
  {
    id: 'ind-1',
    slug: 'hotels',
    title: 'Hotels & Hospitality',
    short_description: 'Luxury laundry bags, amenity bags, and guest gift bags tailored for premium hotels and resorts.',
    full_description: 'Deliver an unforgettable guest experience with custom branded paper and cloth bags. Designed with subtle elegance, high GSM cardstock, and foil-stamped logos for luxury hotels, boutique stays, and spa resorts.',
    recommended_bags: ['Luxury Boutique Designer Bag', 'Premium Kraft Paper Bag', 'Festive Custom Gift Bag'],
    features: ['High GSM Laminated Cardstock', 'Rope & Ribbon Handles', 'Foil Stamping & Spot UV', 'Water-resistant Finishes'],
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    display_order: 1,
    status: 'published'
  },
  {
    id: 'ind-2',
    slug: 'restaurants',
    title: 'Restaurants & Food Delivery',
    short_description: 'Grease-resistant take-away food bags, bakery pouches, and sturdy delivery bags.',
    full_description: 'Sturdy, wide-bottom food packaging bags crafted to hold containers without tipping. Grease-resistant liners and ventilated virgin kraft paper maintain food freshness and cleanliness.',
    recommended_bags: ['Premium Kraft Paper Bag', 'Eco Supermarket W-Cut Bag'],
    features: ['Wide Gussets for Flat Placement', 'Reinforced Square Bottom', 'Custom Logo Printing', 'Multiple Size Options'],
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    display_order: 2,
    status: 'published'
  },
  {
    id: 'ind-3',
    slug: 'clothing',
    title: 'Apparel & Fashion Boutiques',
    short_description: 'Chic, durable paper bags with custom branding that elevate your retail brand image.',
    full_description: 'Apparel retailers rely on MS TRADERS for high-impact bag packaging that turns every customer into a walking brand ambassador. Customizable in matte, gloss, and textured finishes.',
    recommended_bags: ['Luxury Boutique Designer Bag', 'Standard Non-Woven D-Cut Bag', 'Premium Kraft Paper Bag'],
    features: ['Vibrant Multi-color Offset Printing', 'Custom Sizing for Garments', 'Reinforced Top & Bottom Inserts', 'Eco-friendly Recyclable Inks'],
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    display_order: 3,
    status: 'published'
  },
  {
    id: 'ind-4',
    slug: 'retail',
    title: 'Supermarkets & General Retail',
    short_description: 'High-volume W-Cut and D-Cut bags for daily retail operations.',
    full_description: 'Engineered for durability and high-speed distribution. Our W-cut non-woven and kraft paper bags offer maximum tear resistance for department stores and hypermarkets.',
    recommended_bags: ['Eco Supermarket W-Cut Bag', 'Standard Non-Woven D-Cut Bag'],
    features: ['High Bulk Discounts', 'Standardized Sizing', 'High Speed Flexo Printing', 'Ergonomic Handles'],
    image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    display_order: 4,
    status: 'published'
  },
  {
    id: 'ind-5',
    slug: 'medical-pharma',
    title: 'Medical & Pharmacies',
    short_description: 'Hygienic, compact bags with secure die-cut handles for pharmaceuticals and health clinics.',
    full_description: 'Clean, opaque non-woven D-cut bags and paper pouches ensuring patient privacy, hygiene, and rapid packaging at counter checkouts.',
    recommended_bags: ['Standard Non-Woven D-Cut Bag', 'Premium Kraft Paper Bag'],
    features: ['Opaque High-Density Material', 'Hygienic Dust-Free Production', 'Compact Sizes Available', 'Clear RX & Usage Printing'],
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    display_order: 5,
    status: 'published'
  },
  {
    id: 'ind-6',
    slug: 'corporate',
    title: 'Corporate & Offices',
    short_description: 'Sleek corporate gifting bags, document carry bags, and conference gift kits.',
    full_description: 'Make a strong impression on clients and employees during corporate events, onboarding kits, and annual conferences with crisp, professionally printed gift bags.',
    recommended_bags: ['Festive Custom Gift Bag', 'Luxury Boutique Designer Bag'],
    features: ['Precision Logo Reproduction', 'Refined Textured Papers', 'Custom Ribbon Closures', 'Matching Gift Tags'],
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    display_order: 6,
    status: 'published'
  },
  {
    id: 'ind-7',
    slug: 'events',
    title: 'Events & Trade Exhibitions',
    short_description: 'Lightweight, vibrant carry bags designed for trade shows and promotional expos.',
    full_description: 'Ensure your promotional materials stand out. Our exhibition bags are spacious, tear-resistant, and comfortable to carry all day across busy expo floors.',
    recommended_bags: ['Standard Non-Woven D-Cut Bag', 'Premium Kraft Paper Bag'],
    features: ['Double Stitch & Heat Seal Options', 'High Visual Visibility', 'Comfort-Grip Cutouts', 'Quick Production Turnaround'],
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    display_order: 7,
    status: 'published'
  }
];

// --- SETTINGS SERVICE ---
export async function getSettings(): Promise<BusinessSettings> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value');

    if (error || !data || data.length === 0) {
      return DEFAULT_SETTINGS;
    }

    const settingsObj: any = { ...DEFAULT_SETTINGS };
    data.forEach((item) => {
      if (item.value) {
        settingsObj[item.key] = item.value;
      }
    });

    return settingsObj as BusinessSettings;
  } catch (err) {
    console.warn('Using default settings fallback:', err);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(newSettings: Partial<BusinessSettings>): Promise<boolean> {
  try {
    const updates = Object.entries(newSettings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('settings')
      .upsert(updates, { onConflict: 'key' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating settings in Supabase:', err);
    return false;
  }
}

// --- PRODUCTS SERVICE ---
export async function getProducts(options?: {
  category?: string;
  status?: string;
  featuredOnly?: boolean;
  search?: string;
}): Promise<Product[]> {
  try {
    let query = supabase.from('products').select('*');

    if (options?.status) {
      query = query.eq('status', options.status);
    } else {
      // By default public queries published products
      query = query.eq('status', 'published');
    }

    if (options?.category && options.category !== 'all') {
      query = query.eq('category', options.category);
    }

    if (options?.featuredOnly) {
      query = query.eq('is_featured', true);
    }

    if (options?.search) {
      query = query.ilike('name', `%${options.search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Seed fallback products if database table is empty for standard viewing
      return INITIAL_PRODUCTS.map((p, idx) => ({
        id: `seed-${idx + 1}`,
        created_at: new Date().toISOString(),
        name: p.name!,
        slug: p.slug!,
        description: p.description || null,
        price: p.price ?? null,
        sale_price: p.sale_price ?? null,
        category: p.category!,
        sku: p.sku || null,
        material: p.material || null,
        moq: p.moq || 100,
        is_featured: p.is_featured ?? false,
        is_customizable: p.is_customizable ?? true,
        status: p.status as 'published',
        images: p.images || [],
        sizes: p.sizes || [],
        colors: p.colors || [],
        handles: p.handles || [],
        printing_options: p.printing_options || []
      }));
    }

    return data as Product[];
  } catch (err) {
    console.warn('Error fetching products from Supabase, using initial catalog:', err);
    return INITIAL_PRODUCTS as Product[];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const foundInInitial = INITIAL_PRODUCTS.find((p) => p.slug === slug);
      if (foundInInitial) {
        return {
          id: 'seed-p',
          created_at: new Date().toISOString(),
          name: foundInInitial.name!,
          slug: foundInInitial.slug!,
          description: foundInInitial.description || null,
          price: foundInInitial.price ?? null,
          sale_price: foundInInitial.sale_price ?? null,
          category: foundInInitial.category!,
          sku: foundInInitial.sku || null,
          material: foundInInitial.material || null,
          moq: foundInInitial.moq || 100,
          is_featured: foundInInitial.is_featured ?? false,
          is_customizable: foundInInitial.is_customizable ?? true,
          status: 'published',
          images: foundInInitial.images || [],
          sizes: foundInInitial.sizes || [],
          colors: foundInInitial.colors || [],
          handles: foundInInitial.handles || [],
          printing_options: foundInInitial.printing_options || []
        };
      }
      return null;
    }

    return data as Product;
  } catch (err) {
    return null;
  }
}

export async function createProduct(product: Partial<Product>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  } catch (err) {
    console.error('Error creating product in Supabase:', err);
    return null;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating product in Supabase:', err);
    return false;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting product in Supabase:', err);
    return false;
  }
}

// --- CATEGORIES SERVICE ---
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_CATEGORIES;
    }

    return data as Category[];
  } catch (err) {
    return DEFAULT_CATEGORIES;
  }
}

// --- QUOTES SERVICE ---
export async function createQuote(quoteData: {
  customer_id?: string;
  customer_name: string;
  business_name?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  city?: string;
  bag_type: string;
  quantity: number;
  material?: string;
  printing?: string;
  handle_type?: string;
  size?: string;
  requirements?: Record<string, any>;
  attachments?: string[];
  notes?: string;
}): Promise<Quote | null> {
  try {
    // Generate unique quote number: QT-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const quote_number = `MST-QT-${dateStr}-${randomSuffix}`;

    const newQuote = {
      quote_number,
      customer_id: quoteData.customer_id || null,
      customer_name: quoteData.customer_name,
      business_name: quoteData.business_name || null,
      email: quoteData.email,
      phone: quoteData.phone,
      whatsapp: quoteData.whatsapp || quoteData.phone,
      city: quoteData.city || null,
      bag_type: quoteData.bag_type,
      quantity: quoteData.quantity,
      material: quoteData.material || null,
      printing: quoteData.printing || null,
      handle_type: quoteData.handle_type || null,
      size: quoteData.size || null,
      requirements: quoteData.requirements || {},
      attachments: quoteData.attachments || [],
      notes: quoteData.notes || null,
      status: 'NEW' as QuoteStatus,
      amount: 0,
      shipping_amount: 0,
      tax_amount: 0,
      total_amount: 0
    };

    const { data, error } = await supabase
      .from('quotes')
      .insert([newQuote])
      .select()
      .single();

    if (error) {
      console.error('Supabase quote insert error:', error);
      return null;
    }

    // Auto-create initial Notification for Customer
    await createNotification({
      user_id: quoteData.customer_id || null,
      email: quoteData.email,
      recipient_role: 'customer',
      title: `Quotation Request Logged (${quote_number})`,
      message: `Your request for ${quoteData.bag_type.replace(/-/g, ' ').toUpperCase()} (${quoteData.quantity.toLocaleString('en-IN')} units) was received. MS TRADERS desk is preparing custom pricing.`,
      type: 'QUOTE_RECEIVED',
      link: `/quotes/${quote_number}`
    });

    // Auto-create Notification for Admin desk
    await createNotification({
      user_id: null,
      email: 'admin@mstraders.com',
      recipient_role: 'admin',
      for_admin: true,
      title: `New Quote Request (#${quote_number})`,
      message: `${quoteData.customer_name} submitted a new quote request for ${quoteData.quantity.toLocaleString('en-IN')} units of ${quoteData.bag_type.replace(/-/g, ' ')}.`,
      type: 'QUOTE_RECEIVED',
      link: `/admin/quotes`
    });

    return data as Quote;
  } catch (err) {
    console.error('Error submitting quote:', err);
    return null;
  }
}

export async function getQuotes(statusFilter?: string): Promise<Quote[]> {
  try {
    let query = supabase.from('quotes').select('*').order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'ALL') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as Quote[];
  } catch (err) {
    return [];
  }
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as Quote;
  } catch (err) {
    return null;
  }
}

export async function getQuoteByNumber(quoteNumber: string): Promise<Quote | null> {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('quote_number', quoteNumber.trim().toUpperCase())
      .single();

    if (error || !data) return null;
    return data as Quote;
  } catch (err) {
    return null;
  }
}

export async function updateQuoteStatus(
  id: string, 
  updates: Partial<Quote>
): Promise<boolean> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let quoteQuery = supabase.from('quotes').select('id, quote_number, email, customer_id, total_amount');
    
    if (isUuid) {
      quoteQuery = quoteQuery.eq('id', id);
    } else {
      quoteQuery = quoteQuery.eq('quote_number', id.trim().toUpperCase());
    }

    const { data: quoteRecord } = await quoteQuery.maybeSingle();

    const targetEmail = quoteRecord?.email || updates.email;
    let customerId = quoteRecord?.customer_id || updates.customer_id;

    if (!customerId && targetEmail) {
      const { data: profile } = await supabase.from('profiles').select('id').ilike('email', targetEmail.trim()).maybeSingle();
      if (profile) customerId = profile.id;
    }

    // Clean payload keys to prevent invalid Postgres column errors
    const allowedKeys = [
      'status', 'customer_id', 'customer_name', 'business_name', 'email', 'phone', 
      'whatsapp', 'city', 'delivery_address', 'bag_type', 'quantity', 'material', 
      'printing', 'handle_type', 'size', 'requirements', 'attachments', 'unit_price', 
      'subtotal', 'customization_charges', 'delivery_charges', 'discount', 'tax_amount', 
      'total_amount', 'valid_until', 'notes', 'admin_notes', 'customer_notes', 'order_id'
    ];

    const cleanUpdates: Record<string, any> = {};
    if (customerId) cleanUpdates.customer_id = customerId;

    Object.keys(updates).forEach((key) => {
      if (allowedKeys.includes(key) && (updates as any)[key] !== undefined) {
        cleanUpdates[key] = (updates as any)[key];
      }
    });

    let updateQuery = supabase.from('quotes').update(cleanUpdates);
    if (quoteRecord?.id) {
      updateQuery = updateQuery.eq('id', quoteRecord.id);
    } else if (isUuid) {
      updateQuery = updateQuery.eq('id', id);
    } else {
      updateQuery = updateQuery.eq('quote_number', id.trim().toUpperCase());
    }

    const { error } = await updateQuery;
    if (error) {
      console.error('Supabase updateQuoteStatus error:', error);
      
      // Fallback A: Handle Check Constraint Violation (e.g. quotes_status_check constraint error 23514)
      if (error.code === '23514' || (error.message && error.message.toLowerCase().includes('check constraint'))) {
        console.warn('Status check constraint violation (23514). Retrying quote update without strict status value...');
        const safeUpdates: Record<string, any> = { ...cleanUpdates };
        delete safeUpdates.status; // Remove unaccepted status value
        
        if (cleanUpdates.customer_notes || cleanUpdates.admin_notes) {
          safeUpdates.notes = cleanUpdates.customer_notes || cleanUpdates.admin_notes;
        }

        let retryQuery = supabase.from('quotes').update(safeUpdates);
        if (quoteRecord?.id) {
          retryQuery = retryQuery.eq('id', quoteRecord.id);
        } else if (isUuid) {
          retryQuery = retryQuery.eq('id', id);
        } else {
          retryQuery = retryQuery.eq('quote_number', id.trim().toUpperCase());
        }

        const { error: retryErr } = await retryQuery;
        if (retryErr) {
          console.error('Retry without status failed:', retryErr);
          // If retry also failed due to column missing (42703), try minimal fallback
          const minimalUpdates: Record<string, any> = {};
          if (cleanUpdates.customer_notes || cleanUpdates.admin_notes || cleanUpdates.notes) {
            minimalUpdates.notes = cleanUpdates.customer_notes || cleanUpdates.admin_notes || cleanUpdates.notes;
          }
          let minQuery = supabase.from('quotes').update(minimalUpdates);
          if (quoteRecord?.id) minQuery = minQuery.eq('id', quoteRecord.id);
          else if (isUuid) minQuery = minQuery.eq('id', id);
          else minQuery = minQuery.eq('quote_number', id.trim().toUpperCase());
          await minQuery;
        }
      } 
      // Fallback B: Handle Column Missing (42703)
      else if (error.code === '42703' || (error.message && error.message.toLowerCase().includes('column'))) {
        console.warn('Column missing in Supabase DB (42703). Executing fallback update with basic fields...');
        const fallbackUpdates: Record<string, any> = {};
        if (cleanUpdates.status) fallbackUpdates.status = cleanUpdates.status;
        if (cleanUpdates.customer_notes || cleanUpdates.admin_notes) {
          fallbackUpdates.notes = cleanUpdates.customer_notes || cleanUpdates.admin_notes;
        }

        let fallbackQuery = supabase.from('quotes').update(fallbackUpdates);
        if (quoteRecord?.id) {
          fallbackQuery = fallbackQuery.eq('id', quoteRecord.id);
        } else if (isUuid) {
          fallbackQuery = fallbackQuery.eq('id', id);
        } else {
          fallbackQuery = fallbackQuery.eq('quote_number', id.trim().toUpperCase());
        }

        const { error: fallbackErr } = await fallbackQuery;
        if (fallbackErr) {
          console.error('Fallback quote update error:', fallbackErr);
          // Try minimal update on notes column only
          const minUpdates: Record<string, any> = {};
          if (cleanUpdates.customer_notes || cleanUpdates.admin_notes || cleanUpdates.notes) {
            minUpdates.notes = cleanUpdates.customer_notes || cleanUpdates.admin_notes || cleanUpdates.notes;
          }
          let minQuery = supabase.from('quotes').update(minUpdates);
          if (quoteRecord?.id) minQuery = minQuery.eq('id', quoteRecord.id);
          else if (isUuid) minQuery = minQuery.eq('id', id);
          else minQuery = minQuery.eq('quote_number', id.trim().toUpperCase());
          await minQuery;
        }
      } else {
        throw error;
      }
    }

    // Send Notification Trigger
    const qNum = quoteRecord?.quote_number || id;
    if (cleanUpdates.status || cleanUpdates.total_amount !== undefined) {
      let notifTitle = `Quotation Updated (#${qNum})`;
      let notifMsg = `Quotation #${qNum} status changed to ${cleanUpdates.status || 'Updated'}.`;

      if (cleanUpdates.status === 'QUOTED' || (cleanUpdates.total_amount && cleanUpdates.total_amount > 0)) {
        notifTitle = `Official Quotation Ready (#${qNum})`;
        notifMsg = `MS TRADERS issued your formal quotation #${qNum} for ₹${(cleanUpdates.total_amount || 0).toLocaleString('en-IN')}. Click to review & approve.`;
      } else if (cleanUpdates.status === 'CHANGES_REQUESTED') {
        notifTitle = `Revision Request Received (#${qNum})`;
        notifMsg = `Your requested changes for quote #${qNum} were logged with MS TRADERS desk.`;
      } else if (cleanUpdates.status === 'APPROVED') {
        notifTitle = `Quotation Approved (#${qNum})`;
        notifMsg = `Quotation #${qNum} approved! Your order is being processed for manufacturing.`;
      }

      await createNotification({
        user_id: customerId || null,
        email: targetEmail || null,
        recipient_role: 'customer',
        title: notifTitle,
        message: notifMsg,
        type: cleanUpdates.status === 'QUOTED' ? 'QUOTE_RECEIVED' : 'QUOTE_UPDATED',
        link: `/quotes/${qNum}`
      });

      // If customer requested changes or approved, notify Admin desk as well
      if (cleanUpdates.status === 'CHANGES_REQUESTED') {
        await createNotification({
          user_id: null,
          email: 'admin@mstraders.com',
          recipient_role: 'admin',
          for_admin: true,
          title: `Revision Requested on Quote #${qNum}`,
          message: `Customer requested changes: "${cleanUpdates.customer_notes || cleanUpdates.notes || 'Specification updates'}"`,
          type: 'QUOTE_CHANGES_REQUESTED',
          link: `/admin/quotes`
        });
      } else if (cleanUpdates.status === 'APPROVED') {
        await createNotification({
          user_id: null,
          email: 'admin@mstraders.com',
          recipient_role: 'admin',
          for_admin: true,
          title: `Quote Approved by Customer (#${qNum})`,
          message: `Customer approved quotation #${qNum}. Order ready for production processing.`,
          type: 'QUOTE_APPROVED',
          link: `/admin/orders`
        });
      }
    }

    return true;
  } catch (err) {
    console.error('Error updating quote status:', err);
    return false;
  }
}

export async function convertQuoteToOrder(
  quoteId: string, 
  customOptions?: { 
    payment_method?: string; 
    delivery_notes?: string;
    customer_notes?: string;
  }
): Promise<Order | null> {
  try {
    const quote = await getQuoteById(quoteId);
    if (!quote) throw new Error('Quote not found');

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const order_number = `MST-ORD-${dateStr}-${randomSuffix}`;

    const subtotal = quote.subtotal || quote.amount || 0;
    const delivery_fee = quote.delivery_charges || quote.shipping_amount || 0;
    const tax = quote.tax_amount || 0;
    const total = quote.total_amount || (subtotal + delivery_fee + tax);

    const shippingAddress = {
      firstName: quote.customer_name.split(' ')[0] || quote.customer_name,
      lastName: quote.customer_name.split(' ').slice(1).join(' ') || '',
      company: quote.business_name || '',
      address: quote.delivery_address || 'Customer Location',
      city: quote.city || 'Ujjain',
      state: 'Madhya Pradesh',
      postalCode: '456006',
      phone: quote.phone
    };

    const newOrder = {
      order_number,
      quote_id: quote.id,
      customer_id: quote.customer_id || null,
      customer_name: quote.customer_name,
      company_name: quote.business_name || null,
      email: quote.email,
      phone: quote.phone,
      shipping_address: shippingAddress,
      status: 'CONFIRMED' as OrderStatus,
      payment_method: customOptions?.payment_method || 'Invoice / Pay on Delivery',
      payment_status: 'PENDING',
      subtotal,
      customization_charges: quote.customization_charges || 0,
      delivery_charges: delivery_fee,
      discount: quote.discount || 0,
      tax,
      shipping_fee: delivery_fee,
      total,
      delivery_method: 'INTERNAL_DELIVERY',
      delivery_notes: customOptions?.delivery_notes || quote.notes || null,
      notes: `Converted from Quote ${quote.quote_number}${customOptions?.customer_notes ? ` | Customer Note: ${customOptions.customer_notes}` : ''}`
    };

    let orderData: any = null;

    const { data: firstTryData, error: orderErr } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (orderErr) {
      console.warn('First order insert attempt failed, trying resilient fallback insert:', orderErr.message);
      
      // Resilient fallback: remove optional columns that might not exist in older Supabase schema cache
      const { 
        payment_method, 
        payment_status, 
        quote_id, 
        customization_charges, 
        delivery_charges, 
        discount, 
        delivery_method, 
        delivery_notes, 
        ...essentialOrder 
      } = newOrder;

      const fallbackNotes = [
        newOrder.notes,
        payment_method ? `Payment Method: ${payment_method}` : null,
        payment_status ? `Payment Status: ${payment_status}` : null,
        quote.quote_number ? `Quote Reference: #${quote.quote_number}` : null,
        delivery_notes ? `Delivery Notes: ${delivery_notes}` : null
      ].filter(Boolean).join(' | ');

      essentialOrder.notes = fallbackNotes;

      const { data: retryData, error: retryErr } = await supabase
        .from('orders')
        .insert([essentialOrder])
        .select()
        .single();

      if (retryErr || !retryData) {
        console.error('Failed to insert order from quote (fallback failed):', retryErr || orderErr);
        return null;
      }

      orderData = retryData;
    } else {
      orderData = firstTryData;
    }

    // Insert order item for the quote
    const itemUnitPrice = quote.unit_price || (total > 0 && quote.quantity > 0 ? total / quote.quantity : 0);
    const orderItem = {
      order_id: orderData.id,
      product_id: 'custom-quote-product',
      product_name: `Custom ${quote.bag_type} (${quote.size || 'Custom Dimensions'})`,
      quantity: quote.quantity,
      unit_price: itemUnitPrice,
      variant_details: {
        material: quote.material || 'Standard Kraft/Non-Woven',
        printing: quote.printing || 'Custom Print',
        handle: quote.handle_type || 'Standard Handle',
        size: quote.size || 'Custom'
      },
      total_price: total
    };

    await supabase.from('order_items').insert([orderItem]);

    // Update Quote Status to CONVERTED_TO_ORDER & set order_id
    await supabase
      .from('quotes')
      .update({
        status: 'CONVERTED_TO_ORDER',
        order_id: orderData.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', quote.id);

    // Auto-create notifications
    await createNotification({
      user_id: quote.customer_id || null,
      email: quote.email,
      recipient_role: 'customer',
      title: `Order Confirmed (#${order_number})`,
      message: `Your quotation #${quote.quote_number} has been converted to Order #${order_number}. Production will begin shortly.`,
      type: 'ORDER_STATUS',
      link: `/account`
    });

    await createNotification({
      user_id: null,
      email: 'admin@mstraders.com',
      recipient_role: 'admin',
      for_admin: true,
      title: `Order Converted from Quote (#${order_number})`,
      message: `Quote #${quote.quote_number} converted into Order #${order_number} for ${quote.customer_name}.`,
      type: 'ORDER_STATUS',
      link: `/admin/orders`
    });

    return orderData as Order;
  } catch (err) {
    console.error('Error converting quote to order:', err);
    return null;
  }
}

// --- ORDERS SERVICE ---
export async function createOrder(orderData: {
  customer_name: string;
  company_name?: string;
  email: string;
  phone: string;
  shipping_address: any;
  payment_method?: string;
  subtotal: number;
  tax: number;
  shipping_fee: number;
  total: number;
  notes?: string;
  items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    variant_details?: any;
    total_price: number;
  }>;
}): Promise<Order | null> {
  try {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const order_number = `MST-ORD-${dateStr}-${randomSuffix}`;

    const newOrder = {
      order_number,
      customer_name: orderData.customer_name,
      company_name: orderData.company_name || null,
      email: orderData.email,
      phone: orderData.phone,
      shipping_address: orderData.shipping_address,
      status: 'PENDING' as OrderStatus,
      payment_method: orderData.payment_method || 'invoice',
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      shipping_fee: orderData.shipping_fee,
      total: orderData.total,
      notes: orderData.notes || null
    };

    let finalOrderRecord: any = null;

    const { data: orderResult, error: orderErr } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (orderErr) {
      // If error is PGRST204 or missing payment_method column in schema cache, retry without payment_method
      if (orderErr.code === 'PGRST204' || orderErr.message?.includes('payment_method')) {
        const { payment_method, ...cleanOrder } = newOrder;
        const paymentNote = `Payment Method: ${orderData.payment_method || 'invoice'}`;
        cleanOrder.notes = cleanOrder.notes ? `${cleanOrder.notes} | ${paymentNote}` : paymentNote;

        const { data: retryData, error: retryErr } = await supabase
          .from('orders')
          .insert([cleanOrder])
          .select()
          .single();

        if (!retryErr && retryData) {
          finalOrderRecord = retryData;
        } else {
          console.warn('Fallback retry order insert error:', retryErr?.message || retryErr);
        }
      } else {
        console.warn('Order insert warning:', orderErr.message || orderErr);
      }
    } else {
      finalOrderRecord = orderResult;
    }

    if (finalOrderRecord) {
      // Insert order items
      const itemsToInsert = orderData.items.map((item) => ({
        order_id: finalOrderRecord.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        variant_details: item.variant_details || {},
        total_price: item.total_price
      }));

      await supabase.from('order_items').insert(itemsToInsert);

      return {
        ...finalOrderRecord,
        order_items: itemsToInsert
      } as Order;
    }

    return null;
  } catch (err) {
    console.error('Error creating order request:', err);
    return null;
  }
}

export async function getOrders(statusFilter?: string): Promise<Order[]> {
  try {
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'ALL') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as Order[];
  } catch (err) {
    return [];
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  return updateOrderFulfillmentDetails(id, { status });
}

export async function updateOrderFulfillmentDetails(
  id: string,
  updates: {
    status?: OrderStatus;
    expected_delivery_date?: string | null;
    courier_partner?: string | null;
    tracking_number?: string | null;
    tracking_url?: string | null;
  }
): Promise<boolean> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // 1. Attempt updating orders table
    let orderQuery = supabase.from('orders').update(updates);
    if (isUuid) {
      orderQuery = orderQuery.eq('id', id);
    } else {
      orderQuery = orderQuery.ilike('order_number', id.trim());
    }

    const { data: updatedOrders, error: orderErr } = await orderQuery.select('*, customer_id, email, order_number');

    if (!orderErr && updatedOrders && updatedOrders.length > 0) {
      const orderRecord = updatedOrders[0];
      if (orderRecord && (orderRecord.email || orderRecord.customer_id)) {
        let notifMsg = `Your order #${orderRecord.order_number} status is now: ${(updates.status || orderRecord.status).replace(/_/g, ' ')}.`;
        if (updates.expected_delivery_date) {
          notifMsg += ` Expected Delivery Date: ${updates.expected_delivery_date}.`;
        }
        if (updates.courier_partner || updates.tracking_number) {
          notifMsg += ` Logistics: ${updates.courier_partner || 'Dispatch Partner'} (AWB: ${updates.tracking_number || 'In Transit'}).`;
        }
        await createNotification({
          user_id: orderRecord.customer_id || null,
          email: orderRecord.email,
          recipient_role: 'customer',
          title: `Order Status & Tracking Updated (#${orderRecord.order_number})`,
          message: notifMsg,
          type: 'ORDER_STATUS',
          link: `/track-order`
        });
      }
      return true;
    }

    // 2. Fallback: Update quotes table if reference is a quotation
    let quoteQuery = supabase.from('quotes').update({
      expected_delivery_date: updates.expected_delivery_date,
      courier_partner: updates.courier_partner,
      tracking_number: updates.tracking_number,
      tracking_url: updates.tracking_url
    });

    if (isUuid) {
      quoteQuery = quoteQuery.eq('id', id);
    } else {
      quoteQuery = quoteQuery.ilike('quote_number', id.trim());
    }

    const { data: updatedQuotes, error: quoteErr } = await quoteQuery.select('*, customer_id, email, quote_number');

    if (!quoteErr && updatedQuotes && updatedQuotes.length > 0) {
      const quoteRecord = updatedQuotes[0];
      if (quoteRecord && (quoteRecord.email || quoteRecord.customer_id)) {
        await createNotification({
          user_id: quoteRecord.customer_id || null,
          email: quoteRecord.email,
          recipient_role: 'customer',
          title: `Expected Delivery Date Set (#${quoteRecord.quote_number})`,
          message: `Expected delivery date set to ${updates.expected_delivery_date || 'TBD'}. Courier: ${updates.courier_partner || 'MS TRADERS Express'}.`,
          type: 'QUOTE_UPDATED',
          link: `/track-order`
        });
      }
      return true;
    }

    return false;
  } catch (err) {
    console.error('Error updating order fulfillment details:', err);
    return false;
  }
}

// --- GALLERY SERVICE ---
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      // Clean fallback gallery items
      return [
        {
          id: 'g-1',
          created_at: new Date().toISOString(),
          title: 'Custom Foil Stamped Boutique Bags',
          description: 'Gold foil stamping on matte black laminated paper bags for Taj Hotels luxury store.',
          image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
          category: 'Designer Bags',
          is_featured: true,
          status: 'published'
        },
        {
          id: 'g-2',
          created_at: new Date().toISOString(),
          title: 'Eco Kraft Grocery Carry Bags',
          description: 'High-strength twisted handle kraft paper bags for organic food chain.',
          image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
          category: 'Kraft Bags',
          is_featured: true,
          status: 'published'
        },
        {
          id: 'g-3',
          created_at: new Date().toISOString(),
          title: 'Reusable Non-Woven Exhibition Bags',
          description: 'Vibrant screen-printed non-woven D-cut bags produced for national trade show.',
          image_url: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=800&q=80',
          category: 'Non-Woven Bags',
          is_featured: false,
          status: 'published'
        }
      ];
    }

    return data as GalleryItem[];
  } catch (err) {
    return [];
  }
}

export async function createGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem | null> {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data as GalleryItem;
  } catch (err) {
    console.error('Error adding gallery item:', err);
    return null;
  }
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    return false;
  }
}

// --- INDUSTRIES SERVICE ---
export async function getIndustries(): Promise<Industry[]> {
  try {
    const { data, error } = await supabase
      .from('industries')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_INDUSTRIES;
    }

    return data as Industry[];
  } catch (err) {
    return DEFAULT_INDUSTRIES;
  }
}

export async function getIndustryBySlug(slug: string): Promise<Industry | null> {
  try {
    const { data, error } = await supabase
      .from('industries')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return DEFAULT_INDUSTRIES.find((ind) => ind.slug === slug) || null;
    }

    return data as Industry;
  } catch (err) {
    return DEFAULT_INDUSTRIES.find((ind) => ind.slug === slug) || null;
  }
}

// --- STORAGE FILE UPLOADS ---
export async function uploadFileToSupabase(
  file: File, 
  bucket: 'product-images' | 'gallery-images' | 'quote-attachments' | 'settings-assets' | 'media' | 'category-images' | 'hero-images'
): Promise<string | null> {
  try {
    // Validate file size (Max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB limit');
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error(`Bucket upload error (${bucket}):`, uploadError.message);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err: any) {
    console.error('Upload error:', err);
    throw err;
  }
}

// --- ORDER TRACKING SERVICE ---
export async function getOrderByNumberAndPhone(orderNumber: string, phone: string): Promise<Order | null> {
  try {
    const cleanNum = orderNumber.trim().toUpperCase();
    const cleanPhoneDigits = phone.replace(/\D/g, '');

    if (!cleanNum) return null;

    // Resilient phone matching helper
    const isPhoneMatch = (targetPhone?: string | null) => {
      if (!cleanPhoneDigits) return true;
      if (!targetPhone) return true;
      const targetDigits = targetPhone.replace(/\D/g, '');
      if (!targetDigits) return true;

      const last10Clean = cleanPhoneDigits.slice(-10);
      const last10Target = targetDigits.slice(-10);

      return (
        targetDigits.endsWith(cleanPhoneDigits) ||
        cleanPhoneDigits.endsWith(targetDigits) ||
        (last10Clean.length >= 7 && last10Clean === last10Target)
      );
    };

    // 1. Search in orders table by order_number
    const { data: orders, error: orderErr } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .ilike('order_number', cleanNum);

    if (!orderErr && orders && orders.length > 0) {
      const matchedOrder = orders.find(ord => 
        isPhoneMatch(ord.phone) || 
        isPhoneMatch(ord.shipping_address?.phone)
      );
      if (matchedOrder) {
        return matchedOrder as Order;
      }
      // If exact order_number match, return first
      return orders[0] as Order;
    }

    // 2. Search in orders table by notes or quote reference
    const { data: ordersByNote } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .ilike('notes', `%${cleanNum}%`);

    if (ordersByNote && ordersByNote.length > 0) {
      const matchedOrder = ordersByNote.find(ord => 
        isPhoneMatch(ord.phone) || 
        isPhoneMatch(ord.shipping_address?.phone)
      );
      if (matchedOrder) {
        return matchedOrder as Order;
      }
    }

    // 3. Search in quotes table by quote_number or ID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanNum);
    let quoteQuery = supabase.from('quotes').select('*');
    if (isUuid) {
      quoteQuery = quoteQuery.eq('id', cleanNum);
    } else {
      quoteQuery = quoteQuery.ilike('quote_number', cleanNum);
    }

    const { data: quotes, error: quoteErr } = await quoteQuery;

    if (!quoteErr && quotes && quotes.length > 0) {
      const matchedQuote = quotes.find(q => isPhoneMatch(q.phone)) || quotes[0];

      if (matchedQuote) {
        // Map quote status to OrderStatus
        let status: OrderStatus = 'PENDING';
        const qStatus = (matchedQuote.status || '').toUpperCase();
        if (qStatus === 'QUOTED') status = 'CONFIRMED';
        else if (qStatus === 'APPROVED' || qStatus === 'IN_PRODUCTION') status = 'PREPARING';
        else if (qStatus === 'READY_FOR_DISPATCH' || qStatus === 'DISPATCHED') status = 'OUT_FOR_DELIVERY';
        else if (qStatus === 'DELIVERED') status = 'DELIVERED';
        else if (qStatus === 'CANCELLED' || qStatus === 'REJECTED') status = 'CANCELLED';

        const subtotal = matchedQuote.subtotal || matchedQuote.amount || 0;
        const total = matchedQuote.total_amount || (subtotal + (matchedQuote.delivery_charges || 0) + (matchedQuote.tax_amount || 0));

        const syntheticOrder: Order = {
          id: matchedQuote.id,
          order_number: matchedQuote.quote_number,
          customer_name: matchedQuote.customer_name || 'Valued Customer',
          company_name: matchedQuote.business_name || null,
          email: matchedQuote.email || '',
          phone: matchedQuote.phone || phone,
          shipping_address: {
            firstName: (matchedQuote.customer_name || 'Customer').split(' ')[0],
            lastName: (matchedQuote.customer_name || '').split(' ').slice(1).join(' ') || '',
            company: matchedQuote.business_name || '',
            address: matchedQuote.delivery_address || matchedQuote.city || 'Standard Address',
            city: matchedQuote.city || '',
            state: 'Madhya Pradesh',
            postalCode: '456006',
            phone: matchedQuote.phone || phone
          },
          status,
          payment_method: 'Custom Quotation Request',
          subtotal,
          tax: matchedQuote.tax_amount || 0,
          shipping_fee: matchedQuote.delivery_charges || 0,
          total,
          notes: matchedQuote.admin_notes || matchedQuote.message || null,
          created_at: matchedQuote.created_at,
          expected_delivery_date: matchedQuote.expected_delivery_date || null,
          courier_partner: matchedQuote.courier_partner || null,
          tracking_number: matchedQuote.tracking_number || null,
          tracking_url: matchedQuote.tracking_url || null,
          order_items: [
            {
              id: matchedQuote.id,
              order_id: matchedQuote.id,
              product_id: matchedQuote.id,
              product_name: `${(matchedQuote.bag_type || 'Custom Bags').replace(/-/g, ' ').toUpperCase()} (${(matchedQuote.quantity || 0).toLocaleString('en-IN')} units)`,
              quantity: matchedQuote.quantity || 1,
              unit_price: matchedQuote.quantity ? Math.round(total / matchedQuote.quantity) : total,
              total_price: total,
              variant_details: {
                material: matchedQuote.material || 'Standard',
                handle: matchedQuote.handle_type || 'Loop Handle',
                color: matchedQuote.gsm ? `${matchedQuote.gsm} GSM` : undefined,
                size: matchedQuote.size || undefined,
                printing: matchedQuote.print_type || undefined
              }
            }
          ]
        };

        return syntheticOrder;
      }
    }

    return null;
  } catch (err) {
    console.error('Error in getOrderByNumberAndPhone:', err);
    return null;
  }
}

// --- CUSTOMER PROFILE & ADDRESS SERVICES ---
export async function checkIsAdmin(userId?: string | null, userEmail?: string | null): Promise<boolean> {
  if (!userId && !userEmail) return false;

  const cleanEmail = (userEmail || '').trim().toLowerCase();
  
  // Dedicated system admin email addresses
  if (cleanEmail === 'admin@mstraders.com' || cleanEmail === 'admin@mstraders.in' || cleanEmail === 'contact@mstradersujjain.com') {
    return true;
  }

  if (userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data?.role === 'admin') {
        return true;
      }
    } catch (err) {
      console.warn('Error checking admin role:', err);
    }
  }

  return false;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return data as UserProfile;
  } catch (err) {
    return null;
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating user profile:', err);
    return false;
  }
}

export async function syncCustomerRecords(userId: string, email: string): Promise<void> {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !userId) return;

    // Auto-link unlinked quotes matching customer email
    await supabase
      .from('quotes')
      .update({ customer_id: userId })
      .ilike('email', cleanEmail)
      .is('customer_id', null);

    // Auto-link unlinked orders matching customer email
    await supabase
      .from('orders')
      .update({ customer_id: userId })
      .ilike('email', cleanEmail)
      .is('customer_id', null);
  } catch (err) {
    console.error('Error syncing customer records:', err);
  }
}

export async function getCustomerOrders(email: string, userId?: string): Promise<Order[]> {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // First try with combined OR query
    if (userId && cleanEmail) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .or(`customer_id.eq.${userId},email.ilike.${cleanEmail}`)
        .order('created_at', { ascending: false });
        
      if (!error && data && data.length > 0) {
        return data as Order[];
      }
    }

    // Fallback query if OR query returned empty or failed
    let query = supabase.from('orders').select('*, order_items(*)');
    if (userId) {
      query = query.eq('customer_id', userId);
    } else if (cleanEmail) {
      query = query.ilike('email', cleanEmail);
    } else {
      return [];
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase fetch customer orders error:', error);
      return [];
    }
    return (data || []) as Order[];
  } catch (err) {
    console.error('Error fetching customer orders:', err);
    return [];
  }
}

export async function getCustomerQuotes(email: string, userId?: string): Promise<Quote[]> {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // First try combined query
    if (userId && cleanEmail) {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .or(`customer_id.eq.${userId},email.ilike.${cleanEmail}`)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Quote[];
      }
    }

    // Fallback query if OR query returned empty or failed
    let query = supabase.from('quotes').select('*');
    if (userId) {
      query = query.eq('customer_id', userId);
    } else if (cleanEmail) {
      query = query.ilike('email', cleanEmail);
    } else {
      return [];
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase fetch customer quotes error:', error);
      return [];
    }
    return (data || []) as Quote[];
  } catch (err) {
    console.error('Error fetching customer quotes:', err);
    return [];
  }
}

export async function getCustomerAddresses(userId: string): Promise<CustomerAddress[]> {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as CustomerAddress[];
  } catch (err) {
    return [];
  }
}

export async function saveCustomerAddress(userId: string, address: Partial<CustomerAddress>): Promise<CustomerAddress | null> {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .upsert([{ ...address, user_id: userId, updated_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    return data as CustomerAddress;
  } catch (err) {
    console.error('Error saving address:', err);
    return null;
  }
}

export async function deleteCustomerAddress(addressId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (err) {
    return false;
  }
}

// --- CATEGORIES CRUD SERVICE ---
export async function saveCategory(category: Partial<Category>): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .upsert([category])
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  } catch (err) {
    console.error('Error saving category:', err);
    return null;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    return false;
  }
}

// --- HOMEPAGE CMS SERVICE ---
export const DEFAULT_HOMEPAGE_SECTIONS: Record<string, HomepageSection> = {
  hero: {
    id: 'sec-hero',
    section_key: 'hero',
    title: 'Customized Paper Bags & Non-Woven Carry Bags',
    subtitle: 'WHOLESALE & RETAIL SUPPLIER IN UJJAIN',
    description: 'Wholesale & retail supplier of high-quality paper bags, W-cut vest bags, D-cut punch bags, luxury laminated boutique gift bags, and envelope pouches in Ujjain.',
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    primary_cta_text: 'GET CUSTOM QUOTE',
    primary_cta_link: '/customize',
    secondary_cta_text: 'EXPLORE CATALOG',
    secondary_cta_link: '/shop',
    enabled: true,
    display_order: 1
  },
  categories: {
    id: 'sec-categories',
    section_key: 'categories',
    title: 'Explore Bag Categories',
    subtitle: 'BROWSE OUR RANGE',
    description: 'From everyday grocery W-cut non-woven carry bags to luxury foil-stamped boutique packaging.',
    enabled: true,
    display_order: 2
  },
  customization: {
    id: 'sec-customization',
    section_key: 'customization',
    title: 'Tailor-Made Wholesale Bag Supply & Custom Printing',
    subtitle: 'CUSTOM BRANDING & PRINTS',
    description: 'Select your preferred paper GSM, handles, multi-color logo printing, and custom dimensions.',
    image_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80',
    primary_cta_text: 'START CUSTOM ORDER',
    primary_cta_link: '/customize',
    enabled: true,
    display_order: 3
  },
  industries: {
    id: 'sec-industries',
    section_key: 'industries',
    title: 'Specialized Packaging For Every Industry',
    subtitle: 'INDUSTRIES WE SERVE',
    description: 'Tailored solutions for supermarkets, retail fashion, hotels, restaurants, and medical establishments.',
    enabled: true,
    display_order: 4
  },
  process: {
    id: 'sec-process',
    section_key: 'process',
    title: 'How Bulk Orders Work',
    subtitle: 'SIMPLE 4-STEP PROCESS',
    description: 'Seamless ordering experience from design request to bulk delivery.',
    enabled: true,
    display_order: 5,
    metadata: {
      steps: [
        { step: '01', title: 'Submit Requirements', desc: 'Specify bag type, dimensions, quantity, and print requirements.' },
        { step: '02', title: 'Instant Formal Quote', desc: 'Receive custom pricing breakdown and artwork proofing.' },
        { step: '03', title: 'Approve & Prepare', desc: 'Custom logo printing and rigorous quality inspection.' },
        { step: '04', title: 'Fast Delivery', desc: 'Secure packaging and dispatch across Ujjain and surrounding regions.' }
      ]
    }
  },
  why_us: {
    id: 'sec-why_us',
    section_key: 'why_us',
    title: 'Why Choose MS TRADERS',
    subtitle: 'OUR PROMISE',
    description: 'Trusted wholesale supplier delivering precision quality and reliable bulk fulfillment.',
    enabled: true,
    display_order: 6,
    metadata: {
      features: [
        { title: 'Wholesale Bulk Supply', desc: 'Competitive bulk tier pricing for retail & commercial clients.' },
        { title: 'Custom Multi-Color Printing', desc: 'Precision flexo, offset, and screen printing with your logo.' },
        { title: 'Durable Quality Standard', desc: 'High tear strength, reinforced handles, and clean seam sealing.' },
        { title: 'On-Time Dispatch', desc: 'Reliable order processing and fulfillment for retail schedules.' }
      ]
    }
  },
  our_work: {
    id: 'sec-our_work',
    section_key: 'our_work',
    title: 'Recent Customized Supply Batches',
    subtitle: 'PORTFOLIO & CRAFTSMANSHIP',
    description: 'Explore custom printed carry bags completed for boutiques, supermarkets, and corporate clients.',
    enabled: true,
    display_order: 7
  },
  testimonials: {
    id: 'sec-testimonials',
    section_key: 'testimonials',
    title: 'What Our Clients Say',
    subtitle: 'CLIENT FEEDBACK',
    description: 'Genuine reviews from business owners, store managers, and event coordinators.',
    enabled: true,
    display_order: 8
  },
  final_cta: {
    id: 'sec-final_cta',
    section_key: 'final_cta',
    title: 'Ready to Upgrade Your Brand Packaging?',
    subtitle: 'BULK WHOLESALE INQUIRIES',
    description: 'Get in touch with MS TRADERS today for custom sample kits and bulk pricing quotes.',
    primary_cta_text: 'REQUEST WHOLESALE QUOTE',
    primary_cta_link: '/customize',
    secondary_cta_text: 'CONTACT SALES DESK',
    secondary_cta_link: '/contact',
    enabled: true,
    display_order: 9
  }
};

export async function getHomepageSections(): Promise<Record<string, HomepageSection>> {
  try {
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_HOMEPAGE_SECTIONS;
    }

    const sections: Record<string, HomepageSection> = { ...DEFAULT_HOMEPAGE_SECTIONS };
    data.forEach((row: any) => {
      if (row.section_key) {
        sections[row.section_key] = {
          ...sections[row.section_key],
          ...row
        };
      }
    });

    return sections;
  } catch (err) {
    return DEFAULT_HOMEPAGE_SECTIONS;
  }
}

export async function updateHomepageSection(sectionKey: string, sectionData: Partial<HomepageSection>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('homepage_sections')
      .upsert([{ section_key: sectionKey, ...sectionData, updated_at: new Date().toISOString() }], { onConflict: 'section_key' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`Error updating homepage section ${sectionKey}:`, err);
    return false;
  }
}

// --- TESTIMONIALS SERVICE ---
export async function getTestimonials(onlyPublished = true): Promise<Testimonial[]> {
  try {
    let query = supabase.from('testimonials').select('*');
    if (onlyPublished) {
      query = query.in('status', ['published', 'approved']).order('display_order', { ascending: true }).order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    const { data, error } = await query;
    if (error || !data) return [];
    
    return data.map((t: any) => ({
      ...t,
      name: t.customer_name || t.name,
      customer_name: t.customer_name || t.name,
      content: t.review || t.content,
      review: t.review || t.content,
      company: t.business_name || t.company,
      business_name: t.business_name || t.company
    })) as Testimonial[];
  } catch (err) {
    return [];
  }
}

export async function submitClientFeedback(feedback: {
  customer_name: string;
  business_name?: string;
  role?: string;
  email?: string;
  phone?: string;
  city?: string;
  product_purchased?: string;
  rating: number;
  review: string;
}): Promise<{ success: boolean; data?: Testimonial; error?: string }> {
  try {
    const payload = {
      customer_name: feedback.customer_name.trim(),
      business_name: feedback.business_name?.trim() || null,
      role: feedback.role?.trim() || 'Store Owner',
      email: feedback.email?.trim() || null,
      phone: feedback.phone?.trim() || null,
      city: feedback.city?.trim() || null,
      product_purchased: feedback.product_purchased?.trim() || null,
      rating: Math.min(5, Math.max(1, Number(feedback.rating) || 5)),
      review: feedback.review.trim(),
      status: 'pending',
      display_order: 99
    };

    const { data, error } = await supabase
      .from('testimonials')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    // Trigger admin notification so store admin sees new review immediately
    try {
      await createNotification({
        title: '⭐ New Client Review Submitted',
        message: `${feedback.customer_name} (${feedback.business_name || 'Client'}) submitted a ${feedback.rating}-star review: "${feedback.review.slice(0, 60)}..."`,
        type: 'SYSTEM',
        recipient_role: 'admin',
        link: '/admin/testimonials'
      });
    } catch (notifErr) {
      console.warn('Could not post admin notification for feedback:', notifErr);
    }

    return {
      success: true,
      data: {
        ...data,
        name: data.customer_name,
        content: data.review,
        company: data.business_name
      } as Testimonial
    };
  } catch (err: any) {
    console.error('Error submitting client feedback:', err);
    return { success: false, error: err.message || 'Failed to submit feedback' };
  }
}

export async function updateTestimonialStatus(
  id: string, 
  status: 'published' | 'approved' | 'rejected' | 'pending' | 'draft'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('testimonials')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating testimonial status:', err);
    return false;
  }
}

export async function saveTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial | null> {
  try {
    const payload = {
      ...testimonial,
      customer_name: testimonial.name || testimonial.customer_name || 'Valued Client',
      review: testimonial.content || testimonial.review || '',
      business_name: testimonial.company || testimonial.business_name || null,
      status: testimonial.status || 'published'
    };

    const { data, error } = await supabase
      .from('testimonials')
      .upsert([payload])
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      name: data.name || data.customer_name,
      content: data.content || data.review,
      company: data.company || data.business_name
    } as Testimonial;
  } catch (err) {
    console.error('Error saving testimonial:', err);
    return null;
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    return false;
  }
}

// --- MEDIA LIBRARY SERVICE ---
export async function getMediaItems(category?: string): Promise<MediaItem[]> {
  try {
    let query = supabase.from('media').select('*').order('created_at', { ascending: false });
    if (category && category !== 'ALL') {
      query = query.eq('category', category);
    }
    const { data, error } = await query;
    if (error || !data) return [];
    return data as MediaItem[];
  } catch (err) {
    return [];
  }
}

export async function saveMediaItem(item: Partial<MediaItem>): Promise<MediaItem | null> {
  try {
    const { data, error } = await supabase
      .from('media')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data as MediaItem;
  } catch (err) {
    console.error('Error saving media item:', err);
    return null;
  }
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    return false;
  }
}

// --- NOTIFICATIONS SERVICE ---
export async function createNotification(notifData: {
  user_id?: string | null;
  email?: string | null;
  recipient_role?: 'customer' | 'admin' | 'all';
  for_admin?: boolean;
  title: string;
  message: string;
  type?: 'QUOTE_RECEIVED' | 'QUOTE_UPDATED' | 'QUOTE_APPROVED' | 'QUOTE_CHANGES_REQUESTED' | 'ORDER_STATUS' | 'SYSTEM';
  link?: string | null;
}): Promise<boolean> {
  try {
    const cleanEmail = notifData.email ? notifData.email.trim().toLowerCase() : null;
    const recipient_role = notifData.for_admin || notifData.recipient_role === 'admin' ? 'admin' : (notifData.recipient_role || 'customer');

    const notifPayload: any = {
      user_id: notifData.user_id || null,
      email: cleanEmail,
      recipient_role,
      title: notifData.title,
      message: notifData.message,
      type: notifData.type || 'QUOTE_UPDATED',
      link: notifData.link || null,
      read: false
    };

    const { error } = await supabase.from('notifications').insert([notifPayload]);

    if (error) {
      console.warn('First notification insert failed, trying fallback insert:', error.message);
      delete notifPayload.recipient_role;
      const { error: fallbackErr } = await supabase.from('notifications').insert([notifPayload]);
      if (fallbackErr) {
        console.error('Notification fallback insert error:', fallbackErr);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error('Error in createNotification:', err);
    return false;
  }
}

export async function getCustomerNotifications(email: string, userId?: string, isAdmin = false): Promise<AppNotification[]> {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();

    // STRICT SECURITY GUARD: If neither userId nor email is provided, return empty array.
    // Anonymous queries must NEVER fetch any unassigned notifications.
    if (!userId && !cleanEmail) {
      return [];
    }

    if (isAdmin) {
      // ADMIN NOTIFICATIONS: Admins see admin desk notifications (recipient_role = 'admin') OR direct notifications.
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId && cleanEmail) {
        query = query.or(`recipient_role.eq.admin,user_id.eq.${userId},email.ilike."${cleanEmail}"`);
      } else if (userId) {
        query = query.or(`recipient_role.eq.admin,user_id.eq.${userId}`);
      } else {
        query = query.or(`recipient_role.eq.admin,email.ilike."${cleanEmail}"`);
      }

      const { data, error } = await query;
      if (!error && data) return data as AppNotification[];

      // Resilient fallback for older schemas
      const { data: fallbackData } = await supabase
        .from('notifications')
        .select('*')
        .or(`email.ilike."${cleanEmail}",user_id.eq.${userId || '00000000-0000-0000-0000-000000000000'}`)
        .order('created_at', { ascending: false });

      return (fallbackData || []) as AppNotification[];
    } else {
      // CUSTOMER NOTIFICATIONS: Regular customers ONLY see notifications explicitly matching user_id or email, AND recipient_role != 'admin'.
      let query = supabase
        .from('notifications')
        .select('*')
        .neq('recipient_role', 'admin') // STRICT SECURITY GUARD
        .order('created_at', { ascending: false });

      if (userId && cleanEmail) {
        query = query.or(`user_id.eq.${userId},email.ilike."${cleanEmail}"`);
      } else if (userId) {
        query = query.eq('user_id', userId);
      } else if (cleanEmail) {
        query = query.ilike('email', cleanEmail);
      }

      const { data, error } = await query;
      if (!error && data) return data as AppNotification[];

      // Fallback filtering if recipient_role column doesn't exist on older schema cache
      let fallbackQuery = supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (userId && cleanEmail) {
        fallbackQuery = fallbackQuery.or(`user_id.eq.${userId},email.ilike."${cleanEmail}"`);
      } else if (userId) {
        fallbackQuery = fallbackQuery.eq('user_id', userId);
      } else if (cleanEmail) {
        fallbackQuery = fallbackQuery.ilike('email', cleanEmail);
      }

      const { data: fallbackData } = await fallbackQuery;
      const filtered = (fallbackData || []).filter((n: any) => {
        const titleLower = (n.title || '').toLowerCase();
        return !titleLower.includes('new quote request') && 
               !titleLower.includes('revision requested') && 
               !titleLower.includes('quote approved by customer');
      });

      return filtered as AppNotification[];
    }
  } catch (err) {
    console.error('Error in getCustomerNotifications:', err);
    return [];
  }
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    return !error;
  } catch (err) {
    return false;
  }
}

export async function markAllNotificationsAsRead(email: string, userId?: string): Promise<boolean> {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();
    let query = supabase.from('notifications').update({ read: true });

    if (userId && cleanEmail) {
      query = query.or(`user_id.eq.${userId},email.ilike."${cleanEmail}"`);
    } else if (userId) {
      query = query.eq('user_id', userId);
    } else if (cleanEmail) {
      query = query.ilike('email', cleanEmail);
    } else {
      return false;
    }

    const { error } = await query;
    return !error;
  } catch (err) {
    return false;
  }
}


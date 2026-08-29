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
  QuoteStatus,
  OrderStatus 
} from '@/types';

// DEFAULT BUSINESS SETTINGS
export const DEFAULT_SETTINGS: BusinessSettings = {
  business_name: 'MS TRADERS',
  tagline: 'Wholesale & Retail Supplier of Paper Bags, Non-Woven Bags, Customized Bags & Designer Bags',
  phone: '+91 91312 68724',
  whatsapp: '919131268724',
  email: 'contact@mstradersujjain.com',
  address: '57, Kalasari, Dabripitha',
  city: 'Ujjain',
  state: 'Madhya Pradesh',
  pincode: '456006',
  business_hours: 'Mon - Sat: 9:30 AM - 8:30 PM',
  social_facebook: 'https://facebook.com',
  social_instagram: 'https://instagram.com',
  social_linkedin: 'https://linkedin.com',
  footer_about: 'MS TRADERS is a premier manufacturer and wholesale/retail supplier of customized paper bags, non-woven D-cut & W-cut bags, designer gift bags, and eco-friendly packaging in Ujjain, M.P.',
  seo_title: 'MS TRADERS - Paper Bags, Non-Woven Bags & Custom Printing Manufacturer in Ujjain',
  seo_description: 'Official manufacturer of eco-friendly brown paper bags, non-woven W-cut and D-cut bags, designer gift bags for weddings & festivals, and custom logo printed bags in Ujjain.'
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
    features: ['Food-grade Safe Materials', 'Wide Gussets for Flat Placement', 'Heavy Load Capacity (Up to 8kg)', 'Thermal & Moisture Resistant Options'],
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
      // Create local fallback object with quote_number if offline
      return {
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...newQuote,
        status: 'NEW'
      } as Quote;
    }

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

export async function updateQuoteStatus(
  id: string, 
  updates: {
    status?: QuoteStatus;
    amount?: number;
    shipping_amount?: number;
    tax_amount?: number;
    total_amount?: number;
    notes?: string;
  }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('quotes')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating quote:', err);
    return false;
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

    const { data: orderResult, error: orderErr } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (orderErr) {
      console.error('Order insert error:', orderErr);
      return {
        id: `local-ord-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...newOrder,
        order_items: orderData.items.map((it, idx) => ({
          id: `item-${idx}`,
          ...it
        }))
      } as Order;
    }

    // Insert order items
    const itemsToInsert = orderData.items.map((item) => ({
      order_id: orderResult.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      variant_details: item.variant_details || {},
      total_price: item.total_price
    }));

    await supabase.from('order_items').insert(itemsToInsert);

    return {
      ...orderResult,
      order_items: itemsToInsert
    } as Order;
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
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
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
  bucket: 'product-images' | 'gallery-images' | 'quote-attachments' | 'settings-assets'
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
      console.warn(`Bucket upload notice (${bucket}):`, uploadError.message);
      // Fallback object URL if bucket hasn't been provisioned yet in user's remote Supabase instance
      return URL.createObjectURL(file);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err: any) {
    console.error('Upload error:', err);
    return URL.createObjectURL(file);
  }
}

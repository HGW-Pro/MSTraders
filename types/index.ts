export interface Product {
  id: string;
  created_at: string;
  updated_at?: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  sale_price: number | null;
  category_id?: string | null;
  category: string;
  sku: string | null;
  material: string | null;
  moq: number | null;
  is_featured: boolean;
  is_customizable: boolean;
  status: 'published' | 'draft' | 'archived';
  images: string[];
  sizes: string[];
  colors: string[];
  handles: string[];
  printing_options: string[];
  seo_title?: string | null;
  seo_description?: string | null;
}

export interface Category {
  id: string;
  created_at?: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order?: number;
  is_active?: boolean;
}

export type QuoteStatus = 
  | 'DRAFT' 
  | 'NEW'
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'QUOTED' 
  | 'CUSTOMER_VIEWED' 
  | 'CHANGES_REQUESTED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'EXPIRED' 
  | 'CONVERTED_TO_ORDER';

export interface Quote {
  id: string;
  created_at: string;
  updated_at?: string;
  quote_number: string;
  access_token?: string | null;
  customer_id?: string | null;
  customer_name: string;
  business_name?: string | null;
  email: string;
  phone: string;
  whatsapp?: string | null;
  city?: string | null;
  delivery_address?: string | null;
  status: QuoteStatus;
  bag_type: string;
  quantity: number;
  material?: string | null;
  printing?: string | null;
  handle_type?: string | null;
  size?: string | null;
  requirements: Record<string, any>;
  attachments: string[];
  unit_price?: number | null;
  subtotal?: number | null;
  customization_charges?: number | null;
  delivery_charges?: number | null;
  discount?: number | null;
  tax_amount?: number | null;
  total_amount?: number | null;
  valid_until?: string | null;
  notes?: string | null;
  admin_notes?: string | null;
  customer_notes?: string | null;
  order_id?: string | null;
  amount?: number | null;
  shipping_amount?: number | null;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'READY_FOR_DELIVERY' 
  | 'OUT_FOR_DELIVERY' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  variant_details?: {
    size?: string;
    handle?: string;
    color?: string;
    material?: string;
    printing?: string;
  };
  total_price: number;
}

export interface Order {
  id: string;
  created_at: string;
  updated_at?: string;
  order_number: string;
  quote_id?: string | null;
  customer_id?: string | null;
  customer_name: string;
  company_name?: string | null;
  email: string;
  phone: string;
  shipping_address: ShippingAddress | string;
  status: OrderStatus;
  payment_method?: string | null;
  payment_status?: 'PENDING' | 'PAID' | 'COLLECTED' | 'FAILED' | 'REFUNDED';
  subtotal: number;
  customization_charges?: number;
  delivery_charges?: number;
  discount?: number;
  tax: number;
  shipping_fee: number;
  total: number;
  delivery_method?: 'LOCAL_DELIVERY' | 'INTERNAL_DELIVERY' | 'CUSTOMER_PICKUP' | 'OTHER';
  delivery_notes?: string | null;
  notes?: string | null;
  order_items?: OrderItem[];
}

export interface GalleryItem {
  id: string;
  created_at: string;
  title: string;
  description?: string | null;
  image_url: string;
  category?: string | null;
  is_featured: boolean;
  status: 'published' | 'draft' | 'archived';
  display_order?: number;
}

export interface BusinessSettings {
  business_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  business_hours: string;
  social_facebook?: string;
  social_instagram?: string;
  social_linkedin?: string;
  footer_about?: string;
  seo_title?: string;
  seo_description?: string;
  logo_url?: string;
  courier_integration_enabled?: boolean;
  online_payment_enabled?: boolean;
  cod_enabled?: boolean;
  customer_accounts_enabled?: boolean;
}

export interface Industry {
  id: string;
  created_at?: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  recommended_bags: string[];
  features: string[];
  image_url?: string;
  display_order?: number;
  status: 'published' | 'draft' | 'archived';
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  business_name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  city?: string | null;
  address?: string | null;
  role: 'customer' | 'admin';
  created_at?: string;
}

export interface CustomerAddress {
  id: string;
  user_id: string;
  title: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at?: string;
}

export interface HomepageSection {
  id: string;
  section_key: 'hero' | 'categories' | 'customization' | 'industries' | 'process' | 'why_us' | 'our_work' | 'testimonials' | 'final_cta';
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  image_url?: string | null;
  primary_cta_text?: string | null;
  primary_cta_link?: string | null;
  secondary_cta_text?: string | null;
  secondary_cta_link?: string | null;
  enabled: boolean;
  display_order: number;
  metadata?: Record<string, any> | null;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  customer_name?: string;
  name?: string;
  business_name?: string | null;
  company?: string | null;
  role?: string | null;
  rating: number;
  review?: string;
  content?: string;
  photo_url?: string | null;
  display_order: number;
  status: 'published' | 'draft';
  created_at?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  alt_text?: string | null;
  url: string;
  category: 'Logo' | 'Homepage' | 'Products' | 'Gallery' | 'Industries' | 'About';
  size_bytes?: number | null;
  created_at?: string;
}


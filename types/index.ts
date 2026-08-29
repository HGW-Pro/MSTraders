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
}

export type QuoteStatus = 'NEW' | 'CONTACTED' | 'REVIEWING' | 'QUOTE_SENT' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface Quote {
  id: string;
  created_at: string;
  updated_at?: string;
  quote_number: string;
  customer_id?: string | null;
  customer_name: string;
  business_name: string | null;
  email: string;
  phone: string;
  whatsapp?: string | null;
  city?: string | null;
  status: QuoteStatus;
  bag_type: string;
  quantity: number;
  material?: string | null;
  printing?: string | null;
  handle_type?: string | null;
  size?: string | null;
  requirements: Record<string, any>;
  attachments: string[];
  notes?: string | null;
  amount?: number | null;
  shipping_amount?: number | null;
  tax_amount?: number | null;
  total_amount?: number | null;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'READY_TO_SHIP' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

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
  };
  total_price: number;
}

export interface Order {
  id: string;
  created_at: string;
  updated_at?: string;
  order_number: string;
  customer_id?: string | null;
  customer_name: string;
  company_name?: string | null;
  email: string;
  phone: string;
  shipping_address: ShippingAddress;
  status: OrderStatus;
  payment_method?: string | null;
  subtotal: number;
  tax: number;
  shipping_fee: number;
  total: number;
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

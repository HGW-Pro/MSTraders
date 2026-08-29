export interface Product {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  sale_price: number | null;
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
}

export interface Quote {
  id: string;
  created_at: string;
  quote_number: string;
  customer_name: string;
  business_name: string | null;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'reviewing' | 'quote_sent' | 'approved' | 'rejected' | 'completed';
  bag_type: string;
  quantity: number;
  requirements: any;
  notes: string | null;
}

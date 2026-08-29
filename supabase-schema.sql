-- MS TRADERS Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PRODUCTS
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  sale_price DECIMAL(10, 2),
  category TEXT NOT NULL,
  sku TEXT,
  material TEXT,
  moq INTEGER,
  is_featured BOOLEAN DEFAULT false,
  is_customizable BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'archived')),
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  handles TEXT[] DEFAULT '{}',
  printing_options TEXT[] DEFAULT '{}'
);

-- QUOTES
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  quote_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  business_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  city TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'reviewing', 'quote_sent', 'approved', 'rejected', 'completed')),
  bag_type TEXT,
  quantity INTEGER,
  requirements JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  amount DECIMAL(10, 2)
);

-- CUSTOMERS (Optional for Auth later)
CREATE TABLE customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  business_name TEXT,
  phone TEXT
);

-- RLS Policies (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Public read access for published products
CREATE POLICY "Public can view published products" 
ON products FOR SELECT 
USING (status = 'published');

-- Admin full access to products (assuming admin has a specific role or using service role)
-- For this prototype, we'll allow anon read, but restrict write to authenticated users
CREATE POLICY "Auth users can manage products" 
ON products FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Anyone can insert a quote
CREATE POLICY "Anyone can insert quotes" 
ON quotes FOR INSERT 
WITH CHECK (true);

-- Only authenticated admins can read/update quotes
CREATE POLICY "Auth users can manage quotes" 
ON quotes FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
BEFORE UPDATE ON quotes
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

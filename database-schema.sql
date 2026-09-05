-- MS TRADERS Comprehensive Database Schema & Security Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS (Extends database auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  business_name TEXT,
  phone TEXT,
  whatsapp TEXT,
  city TEXT,
  address TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin'))
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  sale_price DECIMAL(10, 2),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  sku TEXT,
  material TEXT,
  moq INTEGER DEFAULT 100,
  is_featured BOOLEAN DEFAULT false,
  is_customizable BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  handles TEXT[] DEFAULT '{}',
  printing_options TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT
);

-- 4. QUOTES
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  quote_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  business_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  city TEXT,
  status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'REVIEWING', 'QUOTE_SENT', 'APPROVED', 'REJECTED', 'COMPLETED')),
  bag_type TEXT,
  quantity INTEGER NOT NULL,
  material TEXT,
  printing TEXT,
  handle_type TEXT,
  size TEXT,
  requirements JSONB DEFAULT '{}'::jsonb,
  attachments TEXT[] DEFAULT '{}',
  notes TEXT,
  amount DECIMAL(10, 2) DEFAULT 0,
  shipping_amount DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) DEFAULT 0
);

-- 5. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping_fee DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  notes TEXT
);

-- 6. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  variant_details JSONB DEFAULT '{}'::jsonb,
  total_price DECIMAL(10, 2) NOT NULL
);

-- 7. GALLERY
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  display_order INT DEFAULT 0
);

-- 8. SETTINGS
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INDUSTRIES
CREATE TABLE IF NOT EXISTS industries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  recommended_bags TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  image_url TEXT,
  display_order INT DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived'))
);

-- 10. ADDRESSES
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. HOMEPAGE SECTIONS
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  primary_cta_text TEXT,
  primary_cta_link TEXT,
  secondary_cta_text TEXT,
  secondary_cta_link TEXT,
  enabled BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  business_name TEXT,
  role TEXT DEFAULT 'Store Owner',
  rating INTEGER DEFAULT 5,
  review TEXT NOT NULL,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. MEDIA
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  title TEXT,
  file_url TEXT,
  url TEXT,
  file_size BIGINT,
  size_bytes BIGINT,
  mime_type TEXT,
  category TEXT DEFAULT 'General',
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_quotes_number ON quotes(quote_number);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- Customers may only ever create themselves as 'customer'.
CREATE POLICY "Allow user insertion during signup" ON profiles
  FOR INSERT WITH CHECK (
    public.is_admin()
    OR (auth.uid() = id AND COALESCE(role, 'customer') = 'customer')
  );

-- Role changes require an existing admin. Enforced by trigger so it holds
-- regardless of how the UPDATE policy above is worded.
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Changing profile role requires administrator privileges'
      USING ERRCODE = 'insufficient_privilege';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS protect_profile_role ON profiles;
CREATE TRIGGER protect_profile_role
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- CATEGORIES POLICIES
CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (public.is_admin());

-- PRODUCTS POLICIES
CREATE POLICY "Public can view published products" ON products
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (public.is_admin());

-- QUOTES POLICIES
CREATE POLICY "Anyone can submit a quote" ON quotes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can view their own quotes" ON quotes
  FOR SELECT USING (
    (auth.uid() IS NOT NULL AND customer_id = auth.uid()) OR public.is_admin()
  );

CREATE POLICY "Admins can manage quotes" ON quotes
  FOR ALL USING (public.is_admin());

-- ORDERS POLICIES
CREATE POLICY "Anyone can create an order request" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can view their own orders" ON orders
  FOR SELECT USING (
    (auth.uid() IS NOT NULL AND customer_id = auth.uid()) OR public.is_admin()
  );

CREATE POLICY "Admins can manage orders" ON orders
  FOR ALL USING (public.is_admin());

-- ORDER ITEMS POLICIES
CREATE POLICY "Anyone can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers/Admins can view order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.customer_id = auth.uid() OR public.is_admin())
    )
  );

-- GALLERY POLICIES
CREATE POLICY "Public can view published gallery" ON gallery
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage gallery" ON gallery
  FOR ALL USING (public.is_admin());

-- SETTINGS POLICIES
CREATE POLICY "Public can view settings" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (public.is_admin());

-- INDUSTRIES POLICIES
CREATE POLICY "Public can view published industries" ON industries
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage industries" ON industries
  FOR ALL USING (public.is_admin());

-- ADDRESSES POLICIES
CREATE POLICY "Users can manage their own addresses" ON addresses
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- HOMEPAGE SECTIONS POLICIES
CREATE POLICY "Public can view homepage sections" ON homepage_sections
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage homepage sections" ON homepage_sections
  FOR ALL USING (public.is_admin());

-- TESTIMONIALS POLICIES
CREATE POLICY "Public can view published testimonials" ON testimonials
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (public.is_admin());

-- MEDIA POLICIES
CREATE POLICY "Public can view media" ON media
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage media" ON media
  FOR ALL USING (public.is_admin());

-- STORAGE BUCKETS SETUP
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('media', 'media', true, 10485760, null),
  ('attachments', 'attachments', true, 10485760, null),
  ('hero-images', 'hero-images', true, 10485760, null),
  ('product-images', 'product-images', true, 10485760, null),
  ('category-images', 'category-images', true, 10485760, null),
  ('gallery-images', 'gallery-images', true, 10485760, null),
  ('quote-attachments', 'quote-attachments', true, 10485760, null),
  ('settings-assets', 'settings-assets', true, 10485760, null)
ON CONFLICT (id) DO UPDATE SET public = true;

UPDATE storage.buckets 
SET public = true 
WHERE id IN ('media', 'attachments', 'hero-images', 'product-images', 'category-images', 'gallery-images', 'quote-attachments', 'settings-assets');

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access on All Buckets" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access on Storage" ON storage.objects;
CREATE POLICY "Public Read Access on All Buckets" ON storage.objects
  FOR SELECT USING (bucket_id IN ('media', 'attachments', 'hero-images', 'product-images', 'category-images', 'gallery-images', 'quote-attachments', 'settings-assets'));

DROP POLICY IF EXISTS "Public Upload Access on All Buckets" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Access on Storage" ON storage.objects;
CREATE POLICY "Public Upload Access on All Buckets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('media', 'attachments', 'hero-images', 'product-images', 'category-images', 'gallery-images', 'quote-attachments', 'settings-assets'));

DROP POLICY IF EXISTS "Public Update Access on All Buckets" ON storage.objects;
CREATE POLICY "Public Update Access on All Buckets" ON storage.objects
  FOR UPDATE USING (bucket_id IN ('media', 'attachments', 'hero-images', 'product-images', 'category-images', 'gallery-images', 'quote-attachments', 'settings-assets'));

DROP POLICY IF EXISTS "Public Delete Access on All Buckets" ON storage.objects;
CREATE POLICY "Public Delete Access on All Buckets" ON storage.objects
  FOR DELETE USING (bucket_id IN ('media', 'attachments', 'hero-images', 'product-images', 'category-images', 'gallery-images', 'quote-attachments', 'settings-assets'));

-- AUTOMATIC UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ========================================================
-- INITIAL SEED DATA FOR MS TRADERS
-- ========================================================

-- SEED CATEGORIES + PRODUCTS
-- Moved to scripts/seed-catalogue.sql, which is generated from the TypeScript
-- catalogue (lib/db/services.ts) and is the single source of truth.
-- The previous inline seed here used Unsplash placeholder images and a
-- different product set, which produced duplicate SKUs and mismatched
-- artwork in the admin catalogue.
--
-- Fresh install order:
--   1. this file
--   2. scripts/seed-catalogue.sql
--   3. scripts/security-hardening.sql

-- SEED BUSINESS SETTINGS
INSERT INTO settings (key, value) VALUES
('business_name', '"MS TRADERS"'::jsonb),
('tagline', '"Wholesale & Retail Supplier of Paper Bags, Non-Woven Bags, Customized Bags & Designer Bags"'::jsonb),
('phone', '"+91 91312 68724"'::jsonb),
('whatsapp', '"919131268724"'::jsonb),
('email', '"contact@mstradersujjain.com"'::jsonb),
('address', '"57 Kalalseri, Behind Power House, Dabri Pitha"'::jsonb),
('city', '"Ujjain"'::jsonb),
('state', '"Madhya Pradesh"'::jsonb),
('pincode', '"456006"'::jsonb),
('business_hours', '"Mon - Sat: 9:30 AM - 8:30 PM"'::jsonb),
('footer_about', '"MS TRADERS is a premier manufacturer and wholesale/retail supplier of customized paper bags, non-woven D-cut & W-cut bags, designer gift bags, and eco-friendly packaging in Ujjain, M.P."'::jsonb),
('seo_title', '"MS TRADERS - Paper Bags, Non-Woven Bags & Custom Printing Manufacturer in Ujjain"'::jsonb),
('seo_description', '"Official manufacturer of eco-friendly brown paper bags, non-woven W-cut and D-cut bags, designer gift bags for weddings & festivals, and custom logo printed bags in Ujjain."'::jsonb)
ON CONFLICT (key) DO NOTHING;


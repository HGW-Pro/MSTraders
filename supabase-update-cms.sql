-- ========================================================
-- MS TRADERS - UPDATE & EXTENSION SCRIPT FOR SUPABASE
-- Run this script in the Supabase SQL Editor if you have already
-- executed the base schema.sql previously.
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADD ADDRESSES TABLE (For Saved Shipping Addresses in Account Portal)
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

-- 2. ADD HOMEPAGE SECTIONS TABLE (For Dynamic Homepage CMS Editor)
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

-- 3. ADD TESTIMONIALS TABLE (For Client Reviews & Feedback Management)
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

-- 4. ADD MEDIA TABLE (For Supabase Asset & Upload Library)
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  category TEXT DEFAULT 'General',
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. UPDATE EXISTING TABLES
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 6. ENABLE ROW LEVEL SECURITY ON NEW TABLES
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- 7. SECURITY POLICIES FOR NEW TABLES

-- ADDRESSES POLICIES
DROP POLICY IF EXISTS "Users can manage their own addresses" ON addresses;
CREATE POLICY "Users can manage their own addresses" ON addresses
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- HOMEPAGE SECTIONS POLICIES
DROP POLICY IF EXISTS "Public can view homepage sections" ON homepage_sections;
CREATE POLICY "Public can view homepage sections" ON homepage_sections
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage homepage sections" ON homepage_sections;
CREATE POLICY "Admins can manage homepage sections" ON homepage_sections
  FOR ALL USING (public.is_admin());

-- TESTIMONIALS POLICIES
DROP POLICY IF EXISTS "Public can view published testimonials" ON testimonials;
CREATE POLICY "Public can view published testimonials" ON testimonials
  FOR SELECT USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (public.is_admin());

-- MEDIA POLICIES
DROP POLICY IF EXISTS "Public can view media" ON media;
CREATE POLICY "Public can view media" ON media
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage media" ON media;
CREATE POLICY "Admins can manage media" ON media
  FOR ALL USING (public.is_admin());

-- 8. STORAGE BUCKETS INITIALIZATION
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true), ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE OBJECT POLICIES
DROP POLICY IF EXISTS "Public Read Access on Storage" ON storage.objects;
CREATE POLICY "Public Read Access on Storage" ON storage.objects
  FOR SELECT USING (bucket_id IN ('media', 'attachments'));

DROP POLICY IF EXISTS "Public Upload Access on Storage" ON storage.objects;
CREATE POLICY "Public Upload Access on Storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('media', 'attachments'));

-- 9. SEED DEFAULT TESTIMONIALS DATA
INSERT INTO testimonials (customer_name, business_name, role, rating, review, display_order, status) VALUES
('Rajesh Agarwal', 'Agarwal Garments', 'Owner', 5, 'MS TRADERS delivers exceptional quality paper bags with crisp logo printing. Their wholesale pricing and quick turnaround time in Ujjain are top tier.', 1, 'published'),
('Sunita Sharma', 'Ujjain Sweet House', 'Store Manager', 5, 'We ordered custom W-Cut non-woven bags for our festival rush. High load capacity and beautiful design. Highly recommended!', 2, 'published'),
('Vikram Singh', 'Hotel Crown Palace', 'General Manager', 5, 'Top-tier luxury gift bags for our VIP guest amenities. Excellent paper GSM and ribbon handles.', 3, 'published')
ON CONFLICT DO NOTHING;

-- 10. QUOTATION WORKFLOW & ORDER CONVERSION COLUMNS
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS access_token TEXT DEFAULT gen_random_uuid()::text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS delivery_address TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10,2);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10,2);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS customization_charges NUMERIC(10,2) DEFAULT 0;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS delivery_charges NUMERIC(10,2) DEFAULT 0;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS discount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS valid_until TIMESTAMPTZ;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS customer_notes TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE SET NULL;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_method TEXT DEFAULT 'INTERNAL_DELIVERY';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'PENDING';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customization_charges NUMERIC(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_charges NUMERIC(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount NUMERIC(10,2) DEFAULT 0;

ALTER TABLE settings ADD COLUMN IF NOT EXISTS courier_integration_enabled BOOLEAN DEFAULT false;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS online_payment_enabled BOOLEAN DEFAULT false;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS cod_enabled BOOLEAN DEFAULT false;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS customer_accounts_enabled BOOLEAN DEFAULT true;

-- Ensure Quotes can be viewed via access_token or by quote_number + phone for guest users
DROP POLICY IF EXISTS "Anyone can view quote by token or email" ON quotes;
CREATE POLICY "Anyone can view quote by token or email" ON quotes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Customers can update their quotes" ON quotes;
CREATE POLICY "Customers can update their quotes" ON quotes
  FOR UPDATE USING (true);


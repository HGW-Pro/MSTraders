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

-- 3. ADD TESTIMONIALS TABLE (For Client Reviews & Feedback Moderation)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  business_name TEXT,
  role TEXT DEFAULT 'Store Owner',
  email TEXT,
  phone TEXT,
  city TEXT,
  product_purchased TEXT,
  rating INTEGER DEFAULT 5,
  review TEXT NOT NULL,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist for existing tables
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS product_purchased TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS admin_response TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Drop legacy status check constraint to support full moderation workflow
ALTER TABLE testimonials DROP CONSTRAINT IF EXISTS testimonials_status_check;
ALTER TABLE testimonials ADD CONSTRAINT testimonials_status_check 
  CHECK (status IN ('published', 'approved', 'pending', 'rejected', 'draft'));

-- 4. ADD MEDIA TABLE (For Supabase Asset & Upload Library)
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

-- Ensure all compatible columns exist on media table if created previously
ALTER TABLE media ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS size_bytes BIGINT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS alt_text TEXT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
ALTER TABLE media ADD COLUMN IF NOT EXISTS mime_type TEXT;

-- Synchronize alias columns if any are missing
UPDATE media SET title = name WHERE title IS NULL AND name IS NOT NULL;
UPDATE media SET name = title WHERE name IS NULL AND title IS NOT NULL;
UPDATE media SET url = file_url WHERE url IS NULL AND file_url IS NOT NULL;
UPDATE media SET file_url = url WHERE file_url IS NULL AND url IS NOT NULL;
UPDATE media SET size_bytes = file_size WHERE size_bytes IS NULL AND file_size IS NOT NULL;
UPDATE media SET file_size = size_bytes WHERE file_size IS NULL AND size_bytes IS NOT NULL;

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

-- TESTIMONIALS POLICIES & PERMISSIONS
GRANT ALL ON testimonials TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Public can view published testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public can submit testimonials" ON testimonials;
DROP POLICY IF EXISTS "Enable insert for everyone" ON testimonials;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;

-- 1. Anyone (public/anon) can view published or approved reviews
CREATE POLICY "Public can view published testimonials" ON testimonials
  FOR SELECT USING (status IN ('published', 'approved') OR public.is_admin());

-- 2. Anyone (public/anon) can submit new feedback for moderation
CREATE POLICY "Public can submit testimonials" ON testimonials
  FOR INSERT WITH CHECK (true);

-- 3. Authenticated admins can update, approve, reject, or delete testimonials
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

-- Ensure all buckets are marked public
UPDATE storage.buckets 
SET public = true 
WHERE id IN ('media', 'attachments', 'hero-images', 'product-images', 'category-images', 'gallery-images', 'quote-attachments', 'settings-assets');

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- STORAGE OBJECT POLICIES
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

-- 9. CLEAN UP DEFAULTED TESTIMONIALS (Ensures ONLY genuine approved customer feedback is displayed)
DELETE FROM testimonials WHERE customer_name IN ('Rajesh Agarwal', 'Sunita Sharma', 'Vikram Singh');

-- 10. QUOTATION WORKFLOW & ORDER CONVERSION COLUMNS
-- Remove legacy restrictive status check constraints if present to support full workflow
ALTER TABLE quotes DROP CONSTRAINT IF EXISTS quotes_status_check;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
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
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Invoice';
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
ALTER TABLE settings ADD COLUMN IF NOT EXISTS enable_direct_cart_checkout BOOLEAN DEFAULT false;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS require_account_for_quotes BOOLEAN DEFAULT true;

-- 11. NOTIFICATIONS TABLE & POLICIES
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  recipient_role TEXT DEFAULT 'customer',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'QUOTE_UPDATED',
  link TEXT,
  read BOOLEAN DEFAULT false
);

ALTER TABLE notifications ADD COLUMN IF NOT EXISTS recipient_role TEXT DEFAULT 'customer';

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_email ON notifications(email);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_role ON notifications(recipient_role);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select notifications" ON notifications;
DROP POLICY IF EXISTS "User select notifications" ON notifications;

CREATE POLICY "User select notifications" ON notifications 
FOR SELECT USING (
  public.is_admin() OR 
  (recipient_role = 'admin' AND (auth.jwt() ->> 'email' ILIKE '%admin%')) OR
  (
    (recipient_role IS NULL OR recipient_role != 'admin') AND 
    (
      (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
      (auth.jwt() ->> 'email' IS NOT NULL AND LOWER(email) = LOWER(auth.jwt() ->> 'email'))
    )
  )
);

DROP POLICY IF EXISTS "Public insert notifications" ON notifications;
CREATE POLICY "Public insert notifications" ON notifications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update notifications" ON notifications;
DROP POLICY IF EXISTS "User update notifications" ON notifications;
CREATE POLICY "User update notifications" ON notifications FOR UPDATE USING (
  public.is_admin() OR 
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
  (auth.jwt() ->> 'email' IS NOT NULL AND LOWER(email) = LOWER(auth.jwt() ->> 'email'))
);

-- 12. ROLE-BASED ACCESS CONTROL (RBAC) & ADMIN HELPER FUNCTION
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure RLS Policies for Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
CREATE POLICY "Public can view profiles" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can edit own profile" ON profiles;
CREATE POLICY "Users can edit own profile" ON profiles FOR ALL USING (auth.uid() = id OR public.is_admin());

-- 13. TRACKING DESK PUBLIC READ ACCESS FOR ORDERS & QUOTES
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can view their own orders" ON orders;
CREATE POLICY "Customers can view their own orders" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Customers can view their own quotes" ON quotes;
CREATE POLICY "Customers can view their own quotes" ON quotes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Customers/Admins can view order items" ON order_items;
CREATE POLICY "Customers/Admins can view order items" ON order_items FOR SELECT USING (true);

-- 14. EXPECTED DELIVERY DATE & COURIER LOGISTICS COLUMNS
ALTER TABLE orders ADD COLUMN IF NOT EXISTS expected_delivery_date TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier_partner TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS expected_delivery_date TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS courier_partner TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS tracking_url TEXT;

-- 15. GALLERY SHOWCASE & PORTFOLIO CMS TABLE
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Customized Bags',
  image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Customized Bags';
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 1;
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_items_display_order ON gallery_items(display_order);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

GRANT ALL ON gallery_items TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Public can view gallery items" ON gallery_items;
CREATE POLICY "Public can view gallery items" ON gallery_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage gallery items" ON gallery_items;
CREATE POLICY "Admins can manage gallery items" ON gallery_items
  FOR ALL USING (public.is_admin() OR auth.role() = 'authenticated');

-- Compatibility alias for 'gallery' table/view
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'gallery') AND
     NOT EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'gallery') THEN
    CREATE OR REPLACE VIEW gallery AS SELECT * FROM gallery_items;
    GRANT ALL ON gallery TO anon, authenticated, service_role;
  END IF;
END $$;

-- 16. SUPABASE STORAGE BUCKETS & POLICIES SETUP
-- Creates all required storage buckets for MS Traders image uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('gallery-images', 'gallery-images', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('media', 'media', true, 20971520, NULL),
  ('product-images', 'product-images', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('quote-attachments', 'quote-attachments', true, 31457280, NULL),
  ('category-images', 'category-images', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('hero-images', 'hero-images', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('settings-assets', 'settings-assets', true, 20971520, NULL)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage object policies for public read and uploads
DROP POLICY IF EXISTS "Public storage read policy" ON storage.objects;
CREATE POLICY "Public storage read policy" ON storage.objects
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public storage insert policy" ON storage.objects;
CREATE POLICY "Public storage insert policy" ON storage.objects
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public storage update policy" ON storage.objects;
CREATE POLICY "Public storage update policy" ON storage.objects
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public storage delete policy" ON storage.objects;
CREATE POLICY "Public storage delete policy" ON storage.objects
  FOR DELETE USING (true);



-- ========================================================
-- MS TRADERS - DATABASE UPDATE & EXTENSION SCRIPT
-- Run this script in the database SQL editor if you have already
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

-- 4. ADD MEDIA TABLE (For the Asset & Upload Library)
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
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Compatibility alias for 'gallery' table/view
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'gallery') AND
     NOT EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'gallery') THEN
    CREATE OR REPLACE VIEW gallery AS SELECT * FROM gallery_items;
    GRANT ALL ON gallery TO anon, authenticated, service_role;
  END IF;
END $$;

-- 16. STORAGE BUCKETS & POLICIES SETUP
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

-- Storage object policies
-- REMOVED: the previous four policies here were USING (true) / WITH CHECK
-- (true) for INSERT, UPDATE and DELETE, which made every bucket writable and
-- deletable by anonymous users. The replacement (public read, admin write,
-- public insert only into quote-attachments) lives in the SECURITY
-- HARDENING block at the end of this file and must not be re-loosened here.




-- =====================================================================
-- MS TRADERS - CATALOGUE SEED / RESYNC
-- =====================================================================
-- Idempotent. Safe to run repeatedly in the database SQL editor.
--
-- Why this exists:
--   getProducts()/getCategories() fall back to an in-memory seed catalogue
--   when their tables come back empty. Those seed rows carry ids like
--   'seed-2' and 'cat-3', which are NOT uuids, so any admin write against
--   them failed with: 22P02 invalid input syntax for type uuid.
--   Seeding the tables removes the fallback path entirely.
--
-- Generated from lib/db/services.ts - do not hand-edit; regenerate with
--   node scripts/generate-seed-sql.mjs
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. PRECONDITIONS
-- ---------------------------------------------------------------------
-- The ON CONFLICT (slug) clauses below need a unique index on each slug
-- column. Postgres has no "ADD CONSTRAINT IF NOT EXISTS", so guard it.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'categories_slug_key'
  ) THEN
    ALTER TABLE categories ADD CONSTRAINT categories_slug_key UNIQUE (slug);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_slug_key'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT products_slug_key UNIQUE (slug);
  END IF;
END $$;

-- ---------------------------------------------------------------------
-- 1. CATEGORIES
-- ---------------------------------------------------------------------
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

INSERT INTO categories (name, slug, description, image_url, display_order, is_active) VALUES
  ('Paper Bags', 'paper-bags', 'High-quality customized paper bags for retail, gifting, and corporate branding.', '/images/categories/paper-bags.svg', 1, true),
  ('Kraft Bags', 'kraft-bags', 'Eco-friendly brown and white kraft paper bags with twisted or flat handles.', '/images/categories/kraft-bags.svg', 2, true),
  ('Non-Woven Bags', 'non-woven-bags', 'Durable, reusable non-woven fabric bags for everyday shopping and retail.', '/images/categories/non-woven-bags.svg', 3, true),
  ('W-Cut Bags', 'w-cut-bags', 'Grocery and supermarket bags with ergonomic W-cut handles.', '/images/categories/w-cut-bags.svg', 4, true),
  ('D-Cut Bags', 'd-cut-bags', 'Sleek D-cut handle bags for apparel stores, exhibitions, and pharmacies.', '/images/categories/d-cut-bags.svg', 5, true),
  ('Designer Bags', 'designer-bags', 'Luxury laminated boutique bags with foil stamping and velvet or rope handles.', '/images/categories/designer-bags.svg', 6, true),
  ('Gift Bags', 'gift-bags', 'Festive and corporate gift packaging bags with custom prints.', '/images/categories/gift-bags.svg', 7, true),
  ('Customized Bags', 'customized-bags', 'Tailor-made bags engineered to your exact dimension, GSM, handle, and printing specs.', '/images/categories/customized-bags.svg', 8, true),
  ('Envelopes', 'envelopes', 'Heavy paper envelope pouches for documents, boutique items, and gifts.', '/images/categories/envelopes.svg', 9, true)
ON CONFLICT (slug) DO UPDATE SET
  name          = EXCLUDED.name,
  description   = EXCLUDED.description,
  image_url     = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order,
  is_active     = EXCLUDED.is_active;

-- Any pre-existing row still pointing at the old duplicated artwork is
-- re-pointed at its own dedicated tile.
UPDATE categories SET image_url = '/images/categories/' || slug || '.svg'
WHERE image_url IS NULL
   OR image_url = ''
   OR image_url LIKE '/images/products/%';

-- ---------------------------------------------------------------------
-- 2. PRODUCTS
-- ---------------------------------------------------------------------
INSERT INTO products
  (name, slug, description, price, sale_price, category, sku, material, moq,
   is_featured, is_customizable, status, images, sizes, colors, handles, printing_options) VALUES
  ('White Kraft Paper Bag with Twisted Handle', 'white-kraft-paper-bag-twisted-handle', 'Clean, elegant white kraft shopping bag with durable white twisted paper handles. Ideal for apparel, cosmetics, bakeries, and boutique retail.', 22, 18, 'kraft-bags', 'MST-WK-001', '140 GSM Bleached White Virgin Kraft', 300, true, true, 'published', ARRAY['/images/products/white-kraft-twisted-bag.svg']::TEXT[], ARRAY['Small (8x10x4")', 'Medium (10x13x5")', 'Large (16x12x6")']::TEXT[], ARRAY['Crisp White']::TEXT[], ARRAY['Twisted White Paper']::TEXT[], ARRAY['Screen Printing', 'Offset Printing', 'Foil Stamping']::TEXT[]),
  ('Yellow Non-Woven W-Cut Vest Bag', 'yellow-non-woven-w-cut-vest-bag', 'Vibrant yellow non-woven W-cut vest carry bag engineered for high load capacity in supermarkets, groceries, and retail stores.', 7.5, 6, 'w-cut-bags', 'MST-YW-002', '75 GSM Spunbond Non-Woven Fabric', 1000, true, true, 'published', ARRAY['/images/products/yellow-wcut-nonwoven-bag.svg']::TEXT[], ARRAY['11x14 inch', '13x17 inch', '16x20 inch']::TEXT[], ARRAY['Bright Yellow']::TEXT[], ARRAY['Integrated W-Cut Vest Handle']::TEXT[], ARRAY['Flexo Printing', 'Screen Printing']::TEXT[]),
  ('Ocean Blue Loop Handle Non-Woven Tote Bag', 'ocean-blue-loop-handle-non-woven-tote-bag', 'Royal ocean blue non-woven carry bag with crisp white border piping and soft loop handles. Premium look for exhibitions and boutique shopping.', 16, 14, 'non-woven-bags', 'MST-NW-003', '90 GSM Premium Non-Woven Fabric', 500, true, true, 'published', ARRAY['/images/products/blue-loop-nonwoven-bag.svg']::TEXT[], ARRAY['12x15 inch', '14x17 inch', '16x19 inch']::TEXT[], ARRAY['Ocean Blue & White Piping']::TEXT[], ARRAY['White Soft Loop Handle']::TEXT[], ARRAY['Screen Printing', 'Rotogravure']::TEXT[]),
  ('Designer Ethnic Mandala Gift Bags (Set of 4)', 'designer-ethnic-mandala-gift-bags', 'Set of 4 vibrant ethnic gift bags with gold arc handles and decorative paisley motifs for weddings, festivals, and celebratory gifting.', 65, 55, 'designer-bags', 'MST-DB-004', '250 GSM Premium Textured Art Card', 100, true, true, 'published', ARRAY['/images/products/designer-ethnic-gift-bags.svg']::TEXT[], ARRAY['Small Gift Box', 'Medium Party Bag', 'Large Festive Tote']::TEXT[], ARRAY['Pink', 'Teal', 'Red', 'Emerald Green']::TEXT[], ARRAY['Rigid Arc Molded Handle']::TEXT[], ARRAY['Gold Foil Stamping', 'Embossed Pattern']::TEXT[]),
  ('High-Gloss D-Cut Shopping Bags (Red, White, Black)', 'high-gloss-d-cut-shopping-bags', 'Glossy laminated D-cut die punch bags in bold primary colors. Smooth finish for high-end boutique stores and gift shops.', 24, 20, 'd-cut-bags', 'MST-DC-005', '180 GSM Laminated Coated Art Paper', 500, true, true, 'published', ARRAY['/images/products/glossy-dcut-trio-bags.svg']::TEXT[], ARRAY['10x14 inch', '12x16 inch', '15x18 inch']::TEXT[], ARRAY['High-Gloss Red', 'Bright White', 'Deep Black']::TEXT[], ARRAY['Reinforced D-Cut Handle']::TEXT[], ARRAY['Gloss Lamination', 'UV Spot Stamping']::TEXT[]),
  ('Multi-Color Non-Woven Loop Handle Carry Bags', 'multi-color-non-woven-loop-handle-bags', 'Full rainbow array of non-woven loop handle shopping bags in 8 vibrant hues. Excellent strength and reusable durability.', 12, 10, 'non-woven-bags', 'MST-NW-006', '80 GSM Spunbond Fabric', 1000, true, true, 'published', ARRAY['/images/products/rainbow-loop-bags.svg']::TEXT[], ARRAY['10x12 inch', '12x15 inch', '14x18 inch']::TEXT[], ARRAY['Red', 'Yellow', 'Blue', 'Green', 'Orange', 'Pink', 'Purple', 'White']::TEXT[], ARRAY['Ultrasonic Sealed Loop Handle']::TEXT[], ARRAY['Screen Printing']::TEXT[]),
  ('D-Cut Non-Woven Retail Bags (Yellow, White, Red)', 'd-cut-non-woven-retail-bags', 'Classic D-cut non-woven carry bags in bright retail shades. Heavy duty heat sealed edges for garments and daily retail items.', 8.5, 7, 'd-cut-bags', 'MST-DC-007', '70 GSM Non-Woven Fabric', 1000, false, true, 'published', ARRAY['/images/products/trio-dcut-nonwoven-bags.svg']::TEXT[], ARRAY['10x14 inch', '12x16 inch', '14x19 inch']::TEXT[], ARRAY['Yellow', 'White', 'Red']::TEXT[], ARRAY['D-Cut Punch Handle']::TEXT[], ARRAY['Screen Printing']::TEXT[]),
  ('Brown Kraft Twisted Handle Shopping Bags', 'brown-kraft-twisted-handle-shopping-bags', 'Eco-friendly natural brown kraft paper bags with twisted paper handles. Recyclable, durable, and classic for organic groceries and clothing stores.', 15, 12.5, 'kraft-bags', 'MST-KB-008', '120 GSM Unbleached Natural Kraft', 500, true, true, 'published', ARRAY['/images/products/kraft-twisted-handle-bags.svg']::TEXT[], ARRAY['8x10x4"', '10x13x5"', '13x16x6"']::TEXT[], ARRAY['Natural Brown']::TEXT[], ARRAY['Twisted Paper Rope']::TEXT[], ARRAY['Eco Screen Printing', 'Flexo Printing']::TEXT[]),
  ('Flat Bottom Brown Kraft Grocery & Pharmacy Pouches', 'flat-bottom-brown-kraft-pouches', 'Versatile handleless flat bottom brown kraft paper bags for pharmacies, grocery stores, bakeries, and takeout snacks.', 4.5, 3.5, 'kraft-bags', 'MST-KP-009', '70 GSM Natural Kraft Paper', 2000, false, true, 'published', ARRAY['/images/products/kraft-grocery-pouches.svg']::TEXT[], ARRAY['Small (0.5 kg)', 'Medium (1 kg)', 'Large (2 kg)', 'Extra Large (5 kg)']::TEXT[], ARRAY['Natural Brown']::TEXT[], ARRAY['No Handle / Flat Bottom']::TEXT[], ARRAY['Flexo Ink Printing']::TEXT[]),
  ('Bhanwarlal Bakery & Cakes 365 Custom Paper Pouches', 'bhanwarlal-bakery-custom-paper-pouches', 'Food-grade custom printed paper pouches tailored for bakeries, confectionery, and cloud kitchens.', 6, 5, 'paper-bags', 'MST-BP-010', '80 GSM Food-Grade Greaseproof Paper', 2000, true, true, 'published', ARRAY['/images/products/bhanwarlal-bakery-pouches.svg']::TEXT[], ARRAY['Snack Size', 'Medium Bakery', 'Large Bread Bag']::TEXT[], ARRAY['Custom Printed Brand Artwork']::TEXT[], ARRAY['No Handle / Pinch Bottom']::TEXT[], ARRAY['Food-Grade Ink Offset']::TEXT[]),
  ('Burger & Food Wrapping Greaseproof Sheets', 'burger-food-wrapping-greaseproof-sheets', 'Custom printed greaseproof food wrapping paper sheets ("Awarded as Best in Burger"). Oil-resistant for cafes and fast food joints.', 2.5, 2, 'customized-bags', 'MST-GS-011', '40 GSM Greaseproof Food Wrapping Paper', 5000, false, true, 'published', ARRAY['/images/products/burger-wrapping-sheets.svg']::TEXT[], ARRAY['10x10 inch', '12x12 inch', '14x14 inch']::TEXT[], ARRAY['White with Red/Black Print']::TEXT[], ARRAY['N/A (Sheet Wrapper)']::TEXT[], ARRAY['Food-Grade Ink Printing']::TEXT[]),
  ('Cream White W-Cut Non-Woven Grocery Bag', 'cream-white-w-cut-non-woven-grocery-bag', 'Clean off-white cream non-woven vest bag with side gussets for groceries, daily markets, and retail merchandise.', 7, 5.8, 'w-cut-bags', 'MST-WC-012', '70 GSM Non-Woven Fabric', 1000, false, true, 'published', ARRAY['/images/products/cream-wcut-nonwoven-bag.svg']::TEXT[], ARRAY['11x14 inch', '13x17 inch', '16x20 inch']::TEXT[], ARRAY['Off-White Cream']::TEXT[], ARRAY['W-Cut Vest Handle']::TEXT[], ARRAY['Flexographic Print']::TEXT[]),
  ('Luxury Rajputi Saafe Gold Foil Boutique Bag', 'luxury-rajputi-saafe-gold-foil-boutique-bag', 'Royal maroon art card bag featuring embossed gold foil logo, velvet rope handles, and spot UV for Rajputi Saafe Ujjain.', 48, 42, 'designer-bags', 'MST-DB-013', '230 GSM Imported Matte Art Card', 250, true, true, 'published', ARRAY['/images/products/rajputi-saafe-luxury-bag.svg']::TEXT[], ARRAY['Small (7x9x3")', 'Medium (11x14x4.5")', 'Large (15x18x6")']::TEXT[], ARRAY['Royal Maroon & Gold Foil']::TEXT[], ARRAY['Braided Cotton Rope Handles']::TEXT[], ARRAY['Embossed Gold Foil Stamping', 'Spot UV']::TEXT[]),
  ('Jalsa Clothing Company Custom Printed Paper Bag', 'jalsa-clothing-company-custom-paper-bag', 'Bespoke white kraft paper shopping bag featuring crimson circular branding for Jalsa Clothing Company Ratlam.', 34, 30, 'paper-bags', 'MST-PB-014', '180 GSM Gloss Coated Art Paper', 300, true, true, 'published', ARRAY['/images/products/jalsa-clothing-bag.svg']::TEXT[], ARRAY['10x13x4"', '12x16x5"']::TEXT[], ARRAY['Crisp White & Crimson Red Logo']::TEXT[], ARRAY['White Twisted Paper Cord']::TEXT[], ARRAY['Precision Offset Printing']::TEXT[]),
  ('Fusion Fashion Rose Floral Rida Non-Woven Bag', 'fusion-fashion-rose-floral-rida-bag', 'Non-woven D-cut carry bag customized with delicate rose floral artwork for Fusion Fashion Boutique Indore.', 11, 9.5, 'customized-bags', 'MST-CB-015', '80 GSM Non-Woven Fabric', 500, true, true, 'published', ARRAY['/images/products/fusion-fashion-bag.svg']::TEXT[], ARRAY['12x16 inch', '14x18 inch']::TEXT[], ARRAY['White with Rose Pink Printing']::TEXT[], ARRAY['D-Cut Punch Handle']::TEXT[], ARRAY['Screen Printing']::TEXT[]),
  ('Metallic Rose Gold Non-Woven Tote Bag', 'metallic-rose-gold-non-woven-tote-bag', 'Eye-catching metallic copper / rose gold laminated non-woven tote bag with black loop handles for high-fashion boutique gifts.', 28, 24, 'designer-bags', 'MST-DB-016', '100 GSM Laminated Metallic Non-Woven', 300, true, true, 'published', ARRAY['/images/products/metallic-rosegold-tote-bags.svg']::TEXT[], ARRAY['12x14x4 inch', '14x16x5 inch']::TEXT[], ARRAY['Metallic Rose Gold / Copper']::TEXT[], ARRAY['Black Loop Handle']::TEXT[], ARRAY['Metallic Screen Print']::TEXT[]),
  ('Anytime Sports Branded Non-Woven Bag', 'anytime-sports-branded-non-woven-bag', 'D-cut non-woven bag with bold yellow/black Anytime Sports "Believe in Yourself" logo print for activewear and sports retail.', 10, 8.5, 'customized-bags', 'MST-CB-017', '75 GSM Spunbond Fabric', 500, false, true, 'published', ARRAY['/images/products/anytime-sports-bag.svg']::TEXT[], ARRAY['12x16 inch', '15x19 inch']::TEXT[], ARRAY['White with Yellow & Black Print']::TEXT[], ARRAY['D-Cut Punch Handle']::TEXT[], ARRAY['Screen Printing']::TEXT[]),
  ('Shamim Store Wholesale Custom Printed Bag', 'shamim-store-wholesale-custom-printed-bag', 'Vibrant red D-cut bag with white circular Shamim Store branding for wholesale garment merchants in Ujjain.', 9.5, 8, 'customized-bags', 'MST-CB-018', '75 GSM Non-Woven Fabric', 500, false, true, 'published', ARRAY['/images/products/shamim-store-bag.svg']::TEXT[], ARRAY['12x16 inch', '14x18 inch']::TEXT[], ARRAY['Bright Red & White Print']::TEXT[], ARRAY['D-Cut Punch Handle']::TEXT[], ARRAY['Screen Printing']::TEXT[]),
  ('Shahzada Fashion World Garment Loop Bag', 'shahzada-fashion-world-garment-loop-bag', 'Yellow non-woven loop bag with royal blue crown logo print for Shahzada Fashion World readymade clothing.', 14, 12, 'customized-bags', 'MST-CB-019', '85 GSM Non-Woven Fabric', 500, true, true, 'published', ARRAY['/images/products/shahzada-fashion-bag.svg']::TEXT[], ARRAY['13x17x4 inch', '16x20x5 inch']::TEXT[], ARRAY['Golden Yellow & Royal Blue Print']::TEXT[], ARRAY['Blue Loop Handle']::TEXT[], ARRAY['Screen Printing']::TEXT[]),
  ('Prem Prakash Saree House Traditional Pink Bag', 'prem-prakash-saree-house-pink-bag', 'Hot pink non-woven bag with traditional golden arch frame printing for Prem Prakash Saree House Ujjain.', 13, 11, 'customized-bags', 'MST-CB-020', '80 GSM Heavy Non-Woven Fabric', 500, true, true, 'published', ARRAY['/images/products/prem-prakash-saree-bag.svg']::TEXT[], ARRAY['14x18 inch', '16x20 inch']::TEXT[], ARRAY['Magenta Pink & Gold Print']::TEXT[], ARRAY['D-Cut Punch Handle']::TEXT[], ARRAY['Screen Printing']::TEXT[]),
  ('Panchmeva Prasadi Mahakal Devotional Bag', 'panchmeva-prasadi-mahakal-devotional-bag', 'White D-cut bag with red Mahakaleshwar devotional print for Panchmeva Prasadi Ujjain.', 9, 7.5, 'customized-bags', 'MST-CB-021', '75 GSM Non-Woven Fabric', 500, true, true, 'published', ARRAY['/images/products/panchmeva-prasadi-bag.svg']::TEXT[], ARRAY['10x14 inch', '12x16 inch']::TEXT[], ARRAY['White with Red Devotional Art']::TEXT[], ARRAY['D-Cut Punch Handle']::TEXT[], ARRAY['Screen Printing']::TEXT[]),
  ('A To Z Readymade Garments Floral Loop Bag', 'atoz-readymade-garments-floral-loop-bag', 'Light pink non-woven loop bag with dark pink floral ring typography for A To Z Readymade Garments.', 13.5, 11.5, 'customized-bags', 'MST-CB-022', '80 GSM Non-Woven Fabric', 500, true, true, 'published', ARRAY['/images/products/atoz-garments-bag.svg']::TEXT[], ARRAY['13x17 inch', '15x19 inch']::TEXT[], ARRAY['Soft Pink with Magenta Print']::TEXT[], ARRAY['Dark Pink Loop Handle']::TEXT[], ARRAY['Screen Printing']::TEXT[])
ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  description      = EXCLUDED.description,
  category         = EXCLUDED.category,
  material         = EXCLUDED.material,
  images           = EXCLUDED.images,
  sizes            = EXCLUDED.sizes,
  colors           = EXCLUDED.colors,
  handles          = EXCLUDED.handles,
  printing_options = EXCLUDED.printing_options,
  updated_at       = NOW();

-- Link products to their category row where the FK is still empty.
UPDATE products p SET category_id = c.id
FROM categories c
WHERE p.category = c.slug AND p.category_id IS NULL;

-- ---------------------------------------------------------------------
-- 3. VERIFY
-- ---------------------------------------------------------------------
-- Expect 9 categories and 22 products, and zero unlinked rows.
SELECT
  (SELECT COUNT(*) FROM categories)                          AS categories,
  (SELECT COUNT(*) FROM products)                            AS products,
  (SELECT COUNT(*) FROM products WHERE category_id IS NULL)  AS products_without_category;


-- =====================================================================
-- MS TRADERS - SECURITY HARDENING + CATALOGUE CLEANUP
-- =====================================================================
-- Idempotent. Safe to run repeatedly in the database SQL editor.
-- Run AFTER the catalogue seed block above.
--
-- The app talks to the database with the public anon key from the browser and
-- middleware.ts is a pass-through, so Row Level Security is the ONLY
-- server-side boundary. This block closes four holes in it and fixes the
-- data problems visible in the admin catalogue.
-- =====================================================================


-- ---------------------------------------------------------------------
-- A. PRIVILEGE ESCALATION: any user could make themselves admin
-- ---------------------------------------------------------------------
-- "Users can update their own profile" had USING (auth.uid() = id) and no
-- WITH CHECK / column restriction. Any signed-up customer could run
--   db.from('profiles').update({ role: 'admin' }).eq('id', myId)
-- from the browser console; is_admin() then returned true and every
-- admin-gated policy in the database opened up.
--
-- Fix 1: a trigger that refuses role changes unless the caller is already
-- an admin. This is the real guard - it holds regardless of policy text.
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

-- Fix 2: also stop a new user inserting themselves as admin at signup.
DROP POLICY IF EXISTS "Allow user insertion during signup" ON profiles;
CREATE POLICY "Allow user insertion during signup" ON profiles
  FOR INSERT WITH CHECK (
    public.is_admin()
    OR (auth.uid() = id AND COALESCE(role, 'customer') = 'customer')
  );

-- Fix 3: restate the update policy with a WITH CHECK so the row must still
-- belong to the caller after the update (prevents re-pointing id).
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());


-- ---------------------------------------------------------------------
-- B. STORAGE: every bucket was world-writable
-- ---------------------------------------------------------------------
-- The last four storage policies in this file were USING (true) /
-- WITH CHECK (true) for INSERT, UPDATE and DELETE. Anyone on the internet,
-- unauthenticated, could upload arbitrary files (malware hosting, storage
-- bill abuse), overwrite every product image, or delete them all.
--
-- New model:
--   read    -> public, all buckets (the site needs it)
--   insert  -> admins anywhere; anyone into quote-attachments only
--              (customers attach artwork on /customize)
--   update  -> admins only
--   delete  -> admins only
DROP POLICY IF EXISTS "Public storage read policy"        ON storage.objects;
DROP POLICY IF EXISTS "Public storage insert policy"      ON storage.objects;
DROP POLICY IF EXISTS "Public storage update policy"      ON storage.objects;
DROP POLICY IF EXISTS "Public storage delete policy"      ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access on All Buckets"   ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Access on All Buckets" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access on All Buckets" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access on All Buckets" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access on Storage"       ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Access on Storage"     ON storage.objects;

DROP POLICY IF EXISTS "storage: public read" ON storage.objects;
CREATE POLICY "storage: public read" ON storage.objects
  FOR SELECT USING (
    bucket_id IN ('media', 'attachments', 'hero-images', 'product-images',
                  'category-images', 'gallery-images', 'quote-attachments',
                  'settings-assets')
  );

DROP POLICY IF EXISTS "storage: admin insert, public quote attachments" ON storage.objects;
CREATE POLICY "storage: admin insert, public quote attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    public.is_admin()
    OR bucket_id = 'quote-attachments'
  );

DROP POLICY IF EXISTS "storage: admin update" ON storage.objects;
CREATE POLICY "storage: admin update" ON storage.objects
  FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "storage: admin delete" ON storage.objects;
CREATE POLICY "storage: admin delete" ON storage.objects
  FOR DELETE USING (public.is_admin());

-- Customer uploads should be images or PDFs, not executables. Applies at
-- the bucket level so it holds even if a policy is later loosened.
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'application/pdf'
]
WHERE id = 'quote-attachments';


-- ---------------------------------------------------------------------
-- C. NOTIFICATIONS: admin inbox readable via a vanity email
-- ---------------------------------------------------------------------
-- The SELECT policy granted admin notifications to any JWT whose email
-- matched ILIKE '%admin%'. Registering as badmin@gmail.com was enough.
DROP POLICY IF EXISTS "User select notifications" ON notifications;
CREATE POLICY "User select notifications" ON notifications
  FOR SELECT USING (
    public.is_admin()
    OR (
      (recipient_role IS NULL OR recipient_role <> 'admin')
      AND (
        (auth.uid() IS NOT NULL AND user_id = auth.uid())
        OR (auth.jwt() ->> 'email' IS NOT NULL
            AND LOWER(email) = LOWER(auth.jwt() ->> 'email'))
      )
    )
  );


-- ---------------------------------------------------------------------
-- D. GALLERY: any logged-in customer could edit the portfolio
-- ---------------------------------------------------------------------
-- "Admins can manage gallery items" was  is_admin() OR role='authenticated'.
DROP POLICY IF EXISTS "Admins can manage gallery items" ON gallery_items;
CREATE POLICY "Admins can manage gallery items" ON gallery_items
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ---------------------------------------------------------------------
-- E. CATALOGUE: duplicate SKUs
-- ---------------------------------------------------------------------
-- MST-NW-003 was on two products. Nothing prevented it: products.sku has
-- no uniqueness. Dedupe by suffixing every duplicate except the oldest,
-- then add a partial unique index (NULL skus stay allowed).
WITH ranked AS (
  SELECT id, sku,
         ROW_NUMBER() OVER (PARTITION BY sku ORDER BY created_at, id) AS rn
  FROM products
  WHERE sku IS NOT NULL AND sku <> ''
)
UPDATE products p
SET sku = ranked.sku || '-' || ranked.rn
FROM ranked
WHERE p.id = ranked.id AND ranked.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS products_sku_unique
  ON products (sku) WHERE sku IS NOT NULL AND sku <> '';


-- ---------------------------------------------------------------------
-- F. CATALOGUE: the 5 legacy demo products from database-schema.sql
-- ---------------------------------------------------------------------
-- The original schema file seeded five generic placeholders with Unsplash
-- URLs. They overlap the real catalogue and were showing the same stock
-- kraft-bag artwork for a W-cut bag, a gift bag and a D-cut bag.
--
-- They are ARCHIVED, not deleted, so any historical order_items rows that
-- reference them stay valid. Their images are re-pointed at the correct
-- local artwork so they render sensibly if you ever un-archive them.
UPDATE products SET images = ARRAY['/images/products/kraft-twisted-handle-bags.svg'], status = 'archived'
  WHERE slug = 'premium-kraft-paper-bag';
UPDATE products SET images = ARRAY['/images/products/rajputi-saafe-luxury-bag.svg'],   status = 'archived'
  WHERE slug = 'luxury-boutique-designer-bag';
UPDATE products SET images = ARRAY['/images/products/trio-dcut-nonwoven-bags.svg'],    status = 'archived'
  WHERE slug = 'standard-non-woven-d-cut-bag';
UPDATE products SET images = ARRAY['/images/products/cream-wcut-nonwoven-bag.svg'],    status = 'archived'
  WHERE slug = 'eco-supermarket-w-cut-bag';
UPDATE products SET images = ARRAY['/images/products/designer-ethnic-gift-bags.svg'],  status = 'archived'
  WHERE slug = 'festive-custom-gift-bag';

-- The Gift Bags category was left with no live product. The mandala set is
-- a gift-bag product by name and design, so it moves there.
UPDATE products SET category = 'gift-bags'
  WHERE slug = 'designer-ethnic-mandala-gift-bags';
UPDATE products p SET category_id = c.id
  FROM categories c WHERE p.category = c.slug AND p.slug = 'designer-ethnic-mandala-gift-bags';


-- ---------------------------------------------------------------------
-- H. INDUSTRIES: recommended_bags named the archived legacy products
-- ---------------------------------------------------------------------
-- Not rendered anywhere yet, but keep the stored data pointing at products
-- that actually exist in the live catalogue.
UPDATE industries SET recommended_bags = array_replace(recommended_bags, 'Luxury Rajputi Saafe Boutique Bag', 'Luxury Rajputi Saafe Gold Foil Boutique Bag');
UPDATE industries SET recommended_bags = array_replace(recommended_bags, 'Premium Kraft Paper Bag',           'Brown Kraft Twisted Handle Shopping Bags');
UPDATE industries SET recommended_bags = array_replace(recommended_bags, 'Jalsa Clothing Custom Paper Bag',   'Jalsa Clothing Company Custom Printed Paper Bag');
UPDATE industries SET recommended_bags = array_replace(recommended_bags, 'Eco Supermarket W-Cut Bag',         'Cream White W-Cut Non-Woven Grocery Bag');
UPDATE industries SET recommended_bags = array_replace(recommended_bags, 'Standard Non-Woven D-Cut Bag',      'D-Cut Non-Woven Retail Bags (Yellow, White, Red)');


-- ---------------------------------------------------------------------
-- G. VERIFY
-- ---------------------------------------------------------------------
SELECT 'duplicate skus'            AS check_name, COUNT(*)::TEXT AS value
  FROM (SELECT sku FROM products WHERE sku IS NOT NULL GROUP BY sku HAVING COUNT(*) > 1) d
UNION ALL
SELECT 'published products',        COUNT(*)::TEXT FROM products WHERE status = 'published'
UNION ALL
SELECT 'archived legacy products',  COUNT(*)::TEXT FROM products WHERE status = 'archived'
UNION ALL
SELECT 'categories with no live product',
       COALESCE(STRING_AGG(c.slug, ', '), 'none')
  FROM categories c
  WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.category = c.slug AND p.status = 'published')
UNION ALL
SELECT 'role-guard trigger present',
       (SELECT COUNT(*) FROM pg_trigger WHERE tgname = 'protect_profile_role')::TEXT
UNION ALL
SELECT 'world-writable storage policies',
       (SELECT COUNT(*) FROM pg_policies
         WHERE schemaname = 'storage' AND tablename = 'objects'
           AND cmd IN ('INSERT','UPDATE','DELETE')
           AND (COALESCE(qual,'') = 'true' OR COALESCE(with_check,'') = 'true'))::TEXT;
-- Expected: 0 duplicate skus, 22 published, 5 archived, only 'envelopes'
-- without a live product, trigger present = 1, world-writable = 0.


-- =====================================================================
-- MS TRADERS - SENTENCE-CASE THE CMS HOMEPAGE COPY
-- =====================================================================
-- Idempotent. Safe to run repeatedly in the database SQL editor.
--
-- Why this is needed:
--   Homepage headings, eyebrows and button labels are stored in the
--   `homepage_sections` table and edited from Admin > Homepage CMS. The
--   code-level defaults were changed to sentence case, but saved rows
--   override those defaults, so the live site kept rendering shouted
--   copy like "WHOLESALE & RETAIL SUPPLIER IN UJJAIN".
--
--   This updates only rows that still hold the old all-caps strings, so
--   any wording you have since customised is left alone.
-- =====================================================================

UPDATE homepage_sections SET subtitle = 'Wholesale & retail supplier in Ujjain'
  WHERE subtitle = 'WHOLESALE & RETAIL SUPPLIER IN UJJAIN';
UPDATE homepage_sections SET subtitle = 'Our range'
  WHERE subtitle = 'BROWSE OUR RANGE';
UPDATE homepage_sections SET subtitle = 'Custom branding & prints'
  WHERE subtitle = 'CUSTOM BRANDING & PRINTS';
UPDATE homepage_sections SET subtitle = 'Industries we serve'
  WHERE subtitle = 'INDUSTRIES WE SERVE';
UPDATE homepage_sections SET subtitle = 'How it works'
  WHERE subtitle IN ('SIMPLE 4-STEP PROCESS', 'HOW BULK ORDERS WORK');
UPDATE homepage_sections SET subtitle = 'Our promise'
  WHERE subtitle IN ('OUR PROMISE', 'OUR PROMISE TO YOU');
UPDATE homepage_sections SET subtitle = 'Portfolio & craftsmanship'
  WHERE subtitle = 'PORTFOLIO & CRAFTSMANSHIP';
UPDATE homepage_sections SET subtitle = 'Client feedback'
  WHERE subtitle = 'CLIENT FEEDBACK';
UPDATE homepage_sections SET subtitle = 'Bulk wholesale enquiries'
  WHERE subtitle = 'BULK WHOLESALE INQUIRIES';

UPDATE homepage_sections SET title = 'Built to carry your brand'
  WHERE title = 'TRUST • QUALITY • VALUE';
UPDATE homepage_sections SET title = 'Simple, transparent, fast'
  WHERE title = 'SIMPLE. TRANSPARENT. FAST.';
UPDATE homepage_sections SET title = 'Put your brand on it'
  WHERE title = 'PUT YOUR BRAND ON IT.';
UPDATE homepage_sections SET title = 'Bags that carry your brand'
  WHERE title = 'BAGS THAT CARRY YOUR BRAND.';
UPDATE homepage_sections SET title = 'Find the right bag for your business'
  WHERE title = 'FIND THE RIGHT BAG FOR YOUR BUSINESS';
UPDATE homepage_sections SET title = 'Made for your business'
  WHERE title = 'MADE FOR YOUR BUSINESS';

UPDATE homepage_sections SET primary_cta_text = 'Get a custom quote'
  WHERE primary_cta_text = 'GET CUSTOM QUOTE';
UPDATE homepage_sections SET primary_cta_text = 'Start a custom order'
  WHERE primary_cta_text = 'START CUSTOM ORDER';
UPDATE homepage_sections SET primary_cta_text = 'Design your custom bag'
  WHERE primary_cta_text = 'CREATE YOUR CUSTOM BAG';
UPDATE homepage_sections SET primary_cta_text = 'Request a wholesale quote'
  WHERE primary_cta_text = 'REQUEST WHOLESALE QUOTE';
UPDATE homepage_sections SET secondary_cta_text = 'Browse the catalogue'
  WHERE secondary_cta_text = 'EXPLORE CATALOG';
UPDATE homepage_sections SET secondary_cta_text = 'Contact the sales desk'
  WHERE secondary_cta_text = 'CONTACT SALES DESK';

-- ---------------------------------------------------------------------
-- VERIFY - should return no rows once the copy is updated.
-- ---------------------------------------------------------------------
SELECT section_key, title, subtitle, primary_cta_text, secondary_cta_text
FROM homepage_sections
WHERE title              = UPPER(title)              AND title              ~ '[A-Z]{4}'
   OR subtitle           = UPPER(subtitle)           AND subtitle           ~ '[A-Z]{4}'
   OR primary_cta_text   = UPPER(primary_cta_text)   AND primary_cta_text   ~ '[A-Z]{4}'
   OR secondary_cta_text = UPPER(secondary_cta_text) AND secondary_cta_text ~ '[A-Z]{4}';


-- =====================================================================
-- MS TRADERS - SEPARATE PORTFOLIO WORK FROM THE SELLABLE CATALOGUE
-- =====================================================================
-- Idempotent. Safe to run repeatedly in the database SQL editor.
--
-- Why:
--   Half the shop (11 of 22 products) was work produced for named clients
--   -- Bhanwarlal Bakery, Jalsa Clothing, Rajputi Saafe, Shamim Store and
--   others. A shopper cannot order another business's branded packaging,
--   so those listings promised something the product could not deliver,
--   and they buried the stock lines that ARE orderable.
--
--   The shop now lists what MS Traders manufactures, sold on
--   specification. The client work is already published in the gallery
--   and shown on /our-work, where it works as proof rather than stock.
--
--   These rows are ARCHIVED, never deleted, so any order_items or quotes
--   that reference them stay valid and the admin can restore any of them
--   from Products > Status at any time.
-- =====================================================================

UPDATE products
SET status = 'archived', updated_at = NOW()
WHERE slug IN (
  'bhanwarlal-bakery-custom-paper-pouches',
  'burger-food-wrapping-greaseproof-sheets',
  'luxury-rajputi-saafe-gold-foil-boutique-bag',
  'jalsa-clothing-company-custom-paper-bag',
  'fusion-fashion-rose-floral-rida-bag',
  'anytime-sports-branded-non-woven-bag',
  'shamim-store-wholesale-custom-printed-bag',
  'shahzada-fashion-world-garment-loop-bag',
  'prem-prakash-saree-house-pink-bag',
  'panchmeva-prasadi-mahakal-devotional-bag',
  'atoz-readymade-garments-floral-loop-bag'
)
AND status <> 'archived';

-- Make sure the corresponding portfolio pieces are actually visible on
-- /our-work, since they are now the only place this work is shown.
UPDATE gallery_items
SET status = 'published'
WHERE status IS DISTINCT FROM 'published'
  AND image_url IN (
    '/images/products/bhanwarlal-bakery-pouches.svg',
    '/images/products/burger-wrapping-sheets.svg',
    '/images/products/rajputi-saafe-luxury-bag.svg',
    '/images/products/jalsa-clothing-bag.svg',
    '/images/products/fusion-fashion-bag.svg',
    '/images/products/anytime-sports-bag.svg',
    '/images/products/shamim-store-bag.svg',
    '/images/products/shahzada-fashion-bag.svg',
    '/images/products/prem-prakash-saree-bag.svg',
    '/images/products/panchmeva-prasadi-bag.svg',
    '/images/products/atoz-garments-bag.svg'
  );


-- ---------------------------------------------------------------------
-- Replacement stock lines
-- ---------------------------------------------------------------------
-- Archiving the client work left Paper Bags, Customized Bags and Envelopes
-- with nothing sellable, so those category tiles led to an empty shop.
-- These are generic base products, quote-priced (price NULL renders as
-- "Bulk Custom Quote") rather than carrying invented rates.
INSERT INTO products
  (name, slug, description, price, sale_price, category, sku, material, moq,
   is_featured, is_customizable, status, images, sizes, colors, handles, printing_options) VALUES
  ('Custom Printed Paper Carry Bag', 'custom-printed-paper-carry-bag', 'Our standard printed paper carry bag, made to your dimensions and artwork. Choose GSM, handle type and print method; we quote on your size and quantity.', NULL, NULL, 'paper-bags', 'MST-PB-100', '150-200 GSM Coated Art Paper or Virgin Kraft', 300, false, true, 'published', ARRAY['/images/categories/paper-bags.svg']::TEXT[], ARRAY['8x10x4 inch', '10x13x5 inch', '13x16x6 inch', 'Made to your size']::TEXT[], ARRAY['White', 'Natural Brown', 'Full-colour printed']::TEXT[], ARRAY['Twisted Paper', 'Flat Paper', 'Cotton Rope']::TEXT[], ARRAY['Screen Printing', 'Offset Printing', 'Foil Stamping']::TEXT[]),
  ('Fully Custom Bag To Your Specification', 'fully-custom-bag-to-specification', 'Built entirely to your brief: any bag type, dimension, GSM, handle and print. Send your artwork and quantity and we will quote and produce it.', NULL, NULL, 'customized-bags', 'MST-CB-100', 'Paper or non-woven, specified per order', 500, true, true, 'published', ARRAY['/images/categories/customized-bags.svg']::TEXT[], ARRAY['Made to your size']::TEXT[], ARRAY['Any colour to your artwork']::TEXT[], ARRAY['D-Cut', 'W-Cut Vest', 'Loop', 'Twisted Paper', 'Rope']::TEXT[], ARRAY['Screen Printing', 'Offset Printing', 'Flexo Printing', 'Foil Stamping']::TEXT[]),
  ('Kraft Paper Envelope Pouch', 'kraft-paper-envelope-pouch', 'Heavy kraft paper envelope pouches for documents, boutique items and gifting. Plain or printed, in stock sizes or made to your dimensions.', NULL, NULL, 'envelopes', 'MST-EN-100', '120-150 GSM Kraft Paper', 500, false, true, 'published', ARRAY['/images/categories/envelopes.svg']::TEXT[], ARRAY['A5', 'A4', 'Made to your size']::TEXT[], ARRAY['Natural Brown', 'White']::TEXT[], ARRAY['No Handle / Flap Seal']::TEXT[], ARRAY['Screen Printing', 'Offset Printing']::TEXT[])
ON CONFLICT (slug) DO NOTHING;

UPDATE products p SET category_id = c.id
FROM categories c
WHERE p.category = c.slug AND p.category_id IS NULL;

-- ---------------------------------------------------------------------
-- VERIFY
-- ---------------------------------------------------------------------
-- Expect: 11 sellable products, 11 archived, and no published product
-- whose name carries a client's business name.
SELECT 'sellable products'  AS check_name, COUNT(*)::TEXT AS value
  FROM products WHERE status = 'published'
UNION ALL
SELECT 'archived (portfolio + legacy)', COUNT(*)::TEXT
  FROM products WHERE status = 'archived'
UNION ALL
SELECT 'client names still in the shop',
       COALESCE(STRING_AGG(name, '; '), 'none')
  FROM products
  WHERE status = 'published'
    AND (name ILIKE '%bhanwarlal%' OR name ILIKE '%jalsa%' OR name ILIKE '%rajputi%'
      OR name ILIKE '%shamim%'     OR name ILIKE '%shahzada%' OR name ILIKE '%prem prakash%'
      OR name ILIKE '%panchmeva%'  OR name ILIKE '%anytime sports%' OR name ILIKE '%fusion fashion%'
      OR name ILIKE '%a to z%')
UNION ALL
SELECT 'categories with no sellable product',
       COALESCE(STRING_AGG(c.slug, ', '), 'none')
  FROM categories c
  WHERE NOT EXISTS (
    SELECT 1 FROM products p WHERE p.category = c.slug AND p.status = 'published'
  );


-- =====================================================================
-- MS TRADERS - ALIGN CATEGORY AND PRODUCT NAMING
-- =====================================================================
-- Idempotent. Safe to run repeatedly in the database SQL editor.
--
-- Problem this fixes:
--   The nine categories mix four different axes - material (Paper, Kraft,
--   Non-Woven), handle type (W-Cut, D-Cut), purpose (Designer, Gift,
--   Customized) and product form (Envelopes). Most products therefore
--   belong to several at once, and their names said so while their
--   category said something else: "Yellow Non-Woven W-Cut Vest Bag" sat
--   in W-Cut, "Metallic Rose Gold Non-Woven Tote" sat in Designer.
--
--   The visible harm was that filters lied. Clicking "Non-Woven Bags"
--   returned 2 products when the catalogue held 5 non-woven items.
--
--   Fix: category stays the primary shelf, and material becomes its own
--   attribute, so "show me everything non-woven" works regardless of
--   which shelf a product sits on. Product names are rewritten to lead
--   with their category so the name and the shelf agree.
--
--   Slugs are deliberately unchanged, so existing links, order history
--   and quotes keep working.
-- =====================================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS material_type TEXT;

-- ---------------------------------------------------------------------
-- 1. MATERIAL, INDEPENDENT OF CATEGORY
-- ---------------------------------------------------------------------
UPDATE products SET material_type = 'kraft' WHERE slug IN (
  'white-kraft-paper-bag-twisted-handle',
  'brown-kraft-twisted-handle-shopping-bags',
  'flat-bottom-brown-kraft-pouches',
  'kraft-paper-envelope-pouch'
);
UPDATE products SET material_type = 'paper' WHERE slug IN (
  'custom-printed-paper-carry-bag',
  'high-gloss-d-cut-shopping-bags',
  'designer-ethnic-mandala-gift-bags',
  'bhanwarlal-bakery-custom-paper-pouches',
  'burger-food-wrapping-greaseproof-sheets',
  'luxury-rajputi-saafe-gold-foil-boutique-bag',
  'jalsa-clothing-company-custom-paper-bag'
);
UPDATE products SET material_type = 'non-woven' WHERE slug IN (
  'ocean-blue-loop-handle-non-woven-tote-bag',
  'multi-color-non-woven-loop-handle-bags',
  'yellow-non-woven-w-cut-vest-bag',
  'cream-white-w-cut-non-woven-grocery-bag',
  'd-cut-non-woven-retail-bags',
  'metallic-rose-gold-non-woven-tote-bag',
  'fusion-fashion-rose-floral-rida-bag',
  'anytime-sports-branded-non-woven-bag',
  'shamim-store-wholesale-custom-printed-bag',
  'shahzada-fashion-world-garment-loop-bag',
  'prem-prakash-saree-house-pink-bag',
  'panchmeva-prasadi-mahakal-devotional-bag',
  'atoz-readymade-garments-floral-loop-bag'
);
UPDATE products SET material_type = 'mixed'
  WHERE slug = 'fully-custom-bag-to-specification';

-- ---------------------------------------------------------------------
-- 2. PUT THE TWO MISFILED PRODUCTS ON THE RIGHT SHELF
-- ---------------------------------------------------------------------
-- The Mandala set is a gift product by name and design; it was in
-- Designer, which also left Gift Bags empty on a fresh install.
UPDATE products SET category = 'gift-bags'
  WHERE slug = 'designer-ethnic-mandala-gift-bags' AND category <> 'gift-bags';

-- Flat-bottom pouches are pouches, not carry bags. Envelopes becomes
-- "Pouches & Envelopes" below to hold them.
UPDATE products SET category = 'envelopes'
  WHERE slug = 'flat-bottom-brown-kraft-pouches' AND category <> 'envelopes';

UPDATE categories
SET name = 'Pouches & Envelopes',
    description = 'Flat-bottom kraft pouches and paper envelope sleeves for groceries, pharmacy, documents and gifting.'
WHERE slug = 'envelopes' AND name <> 'Pouches & Envelopes';

-- ---------------------------------------------------------------------
-- 3. NAMES LEAD WITH THEIR CATEGORY
-- ---------------------------------------------------------------------
UPDATE products SET name = 'Kraft Twisted Handle Bag (White)'
  WHERE slug = 'white-kraft-paper-bag-twisted-handle';
UPDATE products SET name = 'Kraft Twisted Handle Bag (Natural Brown)'
  WHERE slug = 'brown-kraft-twisted-handle-shopping-bags';
UPDATE products SET name = 'Kraft Flat Bottom Pouches (Grocery & Pharmacy)'
  WHERE slug = 'flat-bottom-brown-kraft-pouches';
UPDATE products SET name = 'Non-Woven Loop Handle Tote (Ocean Blue)'
  WHERE slug = 'ocean-blue-loop-handle-non-woven-tote-bag';
UPDATE products SET name = 'Non-Woven Loop Handle Bags (Multi-Colour)'
  WHERE slug = 'multi-color-non-woven-loop-handle-bags';
UPDATE products SET name = 'W-Cut Vest Bag (Yellow Non-Woven)'
  WHERE slug = 'yellow-non-woven-w-cut-vest-bag';
UPDATE products SET name = 'W-Cut Grocery Bag (Cream Non-Woven)'
  WHERE slug = 'cream-white-w-cut-non-woven-grocery-bag';
UPDATE products SET name = 'D-Cut Shopping Bags (High-Gloss Trio)'
  WHERE slug = 'high-gloss-d-cut-shopping-bags';
UPDATE products SET name = 'D-Cut Retail Bags (Non-Woven Trio)'
  WHERE slug = 'd-cut-non-woven-retail-bags';
UPDATE products SET name = 'Designer Metallic Tote Bag (Rose Gold)'
  WHERE slug = 'metallic-rose-gold-non-woven-tote-bag';
UPDATE products SET name = 'Ethnic Mandala Gift Bags (Set of 4)'
  WHERE slug = 'designer-ethnic-mandala-gift-bags';

UPDATE products p SET category_id = c.id
FROM categories c
WHERE p.category = c.slug AND p.category_id IS DISTINCT FROM c.id;

-- ---------------------------------------------------------------------
-- 4. VERIFY
-- ---------------------------------------------------------------------
-- Expect: no sellable product missing a material, no empty category, and
-- the non-woven count reported as 5 rather than the 2 the old category
-- filter could see.
SELECT 'sellable products' AS check_name, COUNT(*)::TEXT AS value
  FROM products WHERE status = 'published'
UNION ALL
SELECT 'sellable with no material set',
       COALESCE(STRING_AGG(name, '; '), 'none')
  FROM products WHERE status = 'published' AND material_type IS NULL
UNION ALL
SELECT 'non-woven products (any category)', COUNT(*)::TEXT
  FROM products WHERE status = 'published' AND material_type = 'non-woven'
UNION ALL
SELECT 'categories with no sellable product',
       COALESCE(STRING_AGG(c.slug, ', '), 'none')
  FROM categories c
  WHERE NOT EXISTS (
    SELECT 1 FROM products p WHERE p.category = c.slug AND p.status = 'published'
  );

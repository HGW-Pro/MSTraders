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

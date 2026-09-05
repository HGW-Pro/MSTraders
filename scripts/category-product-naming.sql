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

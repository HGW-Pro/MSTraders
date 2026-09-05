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

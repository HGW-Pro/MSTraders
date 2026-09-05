-- =====================================================================
-- MS TRADERS - CATALOGUE SEED / RESYNC
-- =====================================================================
-- Idempotent. Safe to run repeatedly in the Supabase SQL Editor.
--
-- Why this exists:
--   getProducts()/getCategories() fall back to an in-memory seed catalogue
--   when their tables come back empty. Those seed rows carry ids like
--   'seed-2' and 'cat-3', which are NOT uuids, so any admin write against
--   them failed with: 22P02 invalid input syntax for type uuid.
--   Seeding the tables removes the fallback path entirely.
--
-- Generated from lib/supabase/services.ts - do not hand-edit; regenerate with
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

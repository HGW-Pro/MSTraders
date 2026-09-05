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

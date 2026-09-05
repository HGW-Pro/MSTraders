import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync('lib/db/services.ts', 'utf8');

function grab(name) {
  const start = src.indexOf(`export const ${name}`);
  // skip past the type annotation (`Category[] = [`) to the real array literal
  const eq = src.indexOf(' = ', start);
  const open = src.indexOf('[', eq);
  let depth = 0, i = open;
  for (; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') { depth--; if (depth === 0) break; }
  }
  return src.slice(open, i + 1);
}

const cats = eval(grab('DEFAULT_CATEGORIES'));
const prods = eval(grab('INITIAL_PRODUCTS'));

const q = (v) => v === null || v === undefined ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`;
const arr = (a) => !a || a.length === 0 ? `'{}'` : `ARRAY[${a.map(q).join(', ')}]::TEXT[]`;
const num = (v) => v === null || v === undefined ? 'NULL' : v;
const bool = (v) => v ? 'true' : 'false';

let out = `-- =====================================================================
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
ALTER TABLE products   ADD COLUMN IF NOT EXISTS material_type TEXT;

INSERT INTO categories (name, slug, description, image_url, display_order, is_active) VALUES
`;

out += cats.map(c =>
  `  (${q(c.name)}, ${q(c.slug)}, ${q(c.description)}, ${q(c.image_url)}, ${num(c.display_order)}, ${bool(c.is_active !== false)})`
).join(',\n');

out += `
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
  (name, slug, description, price, sale_price, category, sku, material, material_type, moq,
   is_featured, is_customizable, status, images, sizes, colors, handles, printing_options) VALUES
`;

out += prods.map(p =>
  `  (${q(p.name)}, ${q(p.slug)}, ${q(p.description)}, ${num(p.price ?? null)}, ${num(p.sale_price ?? null)}, ` +
  `${q(p.category)}, ${q(p.sku ?? null)}, ${q(p.material ?? null)}, ${q(p.material_type ?? null)}, ${num(p.moq ?? 100)}, ` +
  `${bool(p.is_featured)}, ${bool(p.is_customizable !== false)}, ${q(p.status || 'published')}, ` +
  `${arr(p.images)}, ${arr(p.sizes)}, ${arr(p.colors)}, ${arr(p.handles)}, ${arr(p.printing_options)})`
).join(',\n');

out += `
ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  material_type    = EXCLUDED.material_type,
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
-- Expect ${cats.length} categories and ${prods.length} products, and zero unlinked rows.
SELECT
  (SELECT COUNT(*) FROM categories)                          AS categories,
  (SELECT COUNT(*) FROM products)                            AS products,
  (SELECT COUNT(*) FROM products WHERE category_id IS NULL)  AS products_without_category;
`;

writeFileSync('scripts/seed-catalogue.sql', out);
console.log(`Wrote scripts/seed-catalogue.sql - ${cats.length} categories, ${prods.length} products.`);

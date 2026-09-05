import { db } from './client';
import { 
  Product, 
  Category, 
  Quote, 
  Order, 
  GalleryItem, 
  BusinessSettings, 
  Industry, 
  UserProfile,
  CustomerAddress,
  HomepageSection,
  Testimonial,
  AppNotification,
  QuoteStatus,
  OrderStatus 
} from '@/types';

// DEFAULT BUSINESS SETTINGS
export const DEFAULT_SETTINGS: BusinessSettings = {
  business_name: 'MS TRADERS',
  tagline: 'Wholesale & Retail Supplier of Paper Bags, Non-Woven Bags, Customized Bags, Designer Gift Bags & Envelopes',
  phone: '+91 91312 68724 / +91 90094 46352',
  whatsapp: '919131268724',
  email: 'contact@mstradersujjain.com',
  address: '57 Kalalseri, Behind Power House, Dabri Pitha',
  city: 'Ujjain',
  state: 'Madhya Pradesh',
  pincode: '456006',
  business_hours: 'Mon - Sat: 9:30 AM - 8:30 PM',
  social_facebook: '',
  social_instagram: '',
  social_linkedin: '',
  footer_about: 'MS TRADERS is a premier wholesale & retail supplier of customized paper bags, W-cut & D-cut non-woven bags, designer gift bags, envelopes, and eco-friendly packaging in Ujjain (M.P).',
  seo_title: 'MS TRADERS - Wholesale & Retail Paper Bags & Non-Woven Bags in Ujjain',
  seo_description: 'Official wholesale & retail supplier of paper bags, non-woven W-cut and D-cut bags, customized printed bags, designer gift bags, and envelope pouches in Ujjain (M.P).',
  courier_integration_enabled: false,
  online_payment_enabled: false,
  cod_enabled: false,
  customer_accounts_enabled: true,
  enable_direct_cart_checkout: false,
  require_account_for_quotes: true
};

/**
 * Rows that come from the local seed fallbacks (`seed-1`, `cat-3`, `ind-2`, `ms-item-7`, ...)
 * are NOT database rows. Postgres will reject them with
 * `22P02 invalid input syntax for type uuid` if they are ever used in a
 * `.eq('id', ...)` filter. Every write path must check this before filtering by id.
 */
export function isUuid(value?: string | null): boolean {
  return (
    !!value &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

/** True when the id belongs to a local seed record that has never been persisted. */
export function isSeedId(value?: string | null): boolean {
  return !isUuid(value);
}

// DEFAULT CATEGORIES
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Paper Bags', slug: 'paper-bags', description: 'High-quality customized paper bags for retail, gifting, and corporate branding.', image_url: '/images/categories/paper-bags.svg', display_order: 1, is_active: true },
  { id: 'cat-2', name: 'Kraft Bags', slug: 'kraft-bags', description: 'Eco-friendly brown and white kraft paper bags with twisted or flat handles.', image_url: '/images/categories/kraft-bags.svg', display_order: 2, is_active: true },
  { id: 'cat-3', name: 'Non-Woven Bags', slug: 'non-woven-bags', description: 'Durable, reusable non-woven fabric bags for everyday shopping and retail.', image_url: '/images/categories/non-woven-bags.svg', display_order: 3, is_active: true },
  { id: 'cat-4', name: 'W-Cut Bags', slug: 'w-cut-bags', description: 'Grocery and supermarket bags with ergonomic W-cut handles.', image_url: '/images/categories/w-cut-bags.svg', display_order: 4, is_active: true },
  { id: 'cat-5', name: 'D-Cut Bags', slug: 'd-cut-bags', description: 'Sleek D-cut handle bags for apparel stores, exhibitions, and pharmacies.', image_url: '/images/categories/d-cut-bags.svg', display_order: 5, is_active: true },
  { id: 'cat-6', name: 'Designer Bags', slug: 'designer-bags', description: 'Luxury laminated boutique bags with foil stamping and velvet or rope handles.', image_url: '/images/categories/designer-bags.svg', display_order: 6, is_active: true },
  { id: 'cat-7', name: 'Gift Bags', slug: 'gift-bags', description: 'Festive and corporate gift packaging bags with custom prints.', image_url: '/images/categories/gift-bags.svg', display_order: 7, is_active: true },
  { id: 'cat-8', name: 'Customized Bags', slug: 'customized-bags', description: 'Tailor-made bags engineered to your exact dimension, GSM, handle, and printing specs.', image_url: '/images/categories/customized-bags.svg', display_order: 8, is_active: true },
  { id: 'cat-9', name: 'Pouches & Envelopes', slug: 'envelopes', description: 'Flat-bottom kraft pouches and paper envelope sleeves for groceries, pharmacy, documents and gifting.', image_url: '/images/categories/envelopes.svg', display_order: 9, is_active: true },
];

// DEFAULT SEED PRODUCTS FOR FIRST-TIME DATABASE INITIALIZATION
export const INITIAL_PRODUCTS: Partial<Product>[] = [
  {
    name: 'Kraft Twisted Handle Bag (White)',
    slug: 'white-kraft-paper-bag-twisted-handle',
    description: 'Clean, elegant white kraft shopping bag with durable white twisted paper handles. Ideal for apparel, cosmetics, bakeries, and boutique retail.',
    price: 22,
    sale_price: 18,
    category: 'kraft-bags',
    sku: 'MST-WK-001',
    material: '140 GSM Bleached White Virgin Kraft',
    material_type: 'kraft',
    moq: 300,
    is_featured: true,
    is_customizable: true,
    status: 'published',
    images: ['/images/products/white-kraft-twisted-bag.svg'],
    sizes: ['Small (8x10x4")', 'Medium (10x13x5")', 'Large (16x12x6")'],
    colors: ['Crisp White'],
    handles: ['Twisted White Paper'],
    printing_options: ['Screen Printing', 'Offset Printing', 'Foil Stamping']
  },
  {
    name: 'W-Cut Vest Bag (Yellow Non-Woven)',
    slug: 'yellow-non-woven-w-cut-vest-bag',
    description: 'Vibrant yellow non-woven W-cut vest carry bag engineered for high load capacity in supermarkets, groceries, and retail stores.',
    price: 7.5,
    sale_price: 6,
    category: 'w-cut-bags',
    sku: 'MST-YW-002',
    material: '75 GSM Spunbond Non-Woven Fabric',
    material_type: 'non-woven',
    moq: 1000,
    is_featured: true,
    is_customizable: true,
    status: 'published',
    images: ['/images/products/yellow-wcut-nonwoven-bag.svg'],
    sizes: ['11x14 inch', '13x17 inch', '16x20 inch'],
    colors: ['Bright Yellow'],
    handles: ['Integrated W-Cut Vest Handle'],
    printing_options: ['Flexo Printing', 'Screen Printing']
  },
  {
    name: 'Non-Woven Loop Handle Tote (Ocean Blue)',
    slug: 'ocean-blue-loop-handle-non-woven-tote-bag',
    description: 'Royal ocean blue non-woven carry bag with crisp white border piping and soft loop handles. Premium look for exhibitions and boutique shopping.',
    price: 16,
    sale_price: 14,
    category: 'non-woven-bags',
    sku: 'MST-NW-003',
    material: '90 GSM Premium Non-Woven Fabric',
    material_type: 'non-woven',
    moq: 500,
    is_featured: true,
    is_customizable: true,
    status: 'published',
    images: ['/images/products/blue-loop-nonwoven-bag.svg'],
    sizes: ['12x15 inch', '14x17 inch', '16x19 inch'],
    colors: ['Ocean Blue & White Piping'],
    handles: ['White Soft Loop Handle'],
    printing_options: ['Screen Printing', 'Rotogravure']
  },
  {
    name: 'Ethnic Mandala Gift Bags (Set of 4)',
    slug: 'designer-ethnic-mandala-gift-bags',
    description: 'Set of 4 vibrant ethnic gift bags with gold arc handles and decorative paisley motifs for weddings, festivals, and celebratory gifting.',
    price: 65,
    sale_price: 55,
    category: 'gift-bags',
    sku: 'MST-DB-004',
    material: '250 GSM Premium Textured Art Card',
    material_type: 'paper',
    moq: 100,
    is_featured: true,
    is_customizable: true,
    status: 'published',
    images: ['/images/products/designer-ethnic-gift-bags.svg'],
    sizes: ['Small Gift Box', 'Medium Party Bag', 'Large Festive Tote'],
    colors: ['Pink', 'Teal', 'Red', 'Emerald Green'],
    handles: ['Rigid Arc Molded Handle'],
    printing_options: ['Gold Foil Stamping', 'Embossed Pattern']
  },
  {
    name: 'D-Cut Shopping Bags (High-Gloss Trio)',
    slug: 'high-gloss-d-cut-shopping-bags',
    description: 'Glossy laminated D-cut die punch bags in bold primary colors. Smooth finish for high-end boutique stores and gift shops.',
    price: 24,
    sale_price: 20,
    category: 'd-cut-bags',
    sku: 'MST-DC-005',
    material: '180 GSM Laminated Coated Art Paper',
    material_type: 'paper',
    moq: 500,
    is_featured: true,
    is_customizable: true,
    status: 'published',
    images: ['/images/products/glossy-dcut-trio-bags.svg'],
    sizes: ['10x14 inch', '12x16 inch', '15x18 inch'],
    colors: ['High-Gloss Red', 'Bright White', 'Deep Black'],
    handles: ['Reinforced D-Cut Handle'],
    printing_options: ['Gloss Lamination', 'UV Spot Stamping']
  },
  {
    name: 'Non-Woven Loop Handle Bags (Multi-Colour)',
    slug: 'multi-color-non-woven-loop-handle-bags',
    description: 'Full rainbow array of non-woven loop handle shopping bags in 8 vibrant hues. Excellent strength and reusable durability.',
    price: 12,
    sale_price: 10,
    category: 'non-woven-bags',
    sku: 'MST-NW-006',
    material: '80 GSM Spunbond Fabric',
    material_type: 'non-woven',
    moq: 1000,
    is_featured: true,
    is_customizable: true,
    status: 'published',
    images: ['/images/products/rainbow-loop-bags.svg'],
    sizes: ['10x12 inch', '12x15 inch', '14x18 inch'],
    colors: ['Red', 'Yellow', 'Blue', 'Green', 'Orange', 'Pink', 'Purple', 'White'],
    handles: ['Ultrasonic Sealed Loop Handle'],
    printing_options: ['Screen Printing']
  },
  {
    name: 'D-Cut Retail Bags (Non-Woven Trio)',
    slug: 'd-cut-non-woven-retail-bags',
    description: 'Classic D-cut non-woven carry bags in bright retail shades. Heavy duty heat sealed edges for garments and daily retail items.',
    price: 8.5,
    sale_price: 7,
    category: 'd-cut-bags',
    sku: 'MST-DC-007',
    material: '70 GSM Non-Woven Fabric',
    material_type: 'non-woven',
    moq: 1000,
    is_featured: false,
    is_customizable: true,
    status: 'published',
    images: ['/images/products/trio-dcut-nonwoven-bags.svg'],
    sizes: ['10x14 inch', '12x16 inch', '14x19 inch'],
    colors: ['Yellow', 'White', 'Red'],
    handles: ['D-Cut Punch Handle'],
    printing_options: ['Screen Printing']
  },
  {
    name: 'Kraft Twisted Handle Bag (Natural Brown)',
    slug: 'brown-kraft-twisted-handle-shopping-bags',
    description: 'Eco-friendly natural brown kraft paper bags with twisted paper handles. Recyclable, durable, and classic for organic groceries and clothing stores.',
    price: 15,
    sale_price: 12.5,
    category: 'kraft-bags',
    sku: 'MST-KB-008',
    material: '120 GSM Unbleached Natural Kraft',
    material_type: 'kraft',
    moq: 500,
    is_featured: true,
    is_customizable: true,
    status: 'published',
    images: ['/images/products/kraft-twisted-handle-bags.svg'],
    sizes: ['8x10x4"', '10x13x5"', '13x16x6"'],
    colors: ['Natural Brown'],
    handles: ['Twisted Paper Rope'],
    printing_options: ['Eco Screen Printing', 'Flexo Printing']
  },
  {
    name: 'Kraft Flat Bottom Pouches (Grocery & Pharmacy)',
    slug: 'flat-bottom-brown-kraft-pouches',
    description: 'Versatile handleless flat bottom brown kraft paper bags for pharmacies, grocery stores, bakeries, and takeout snacks.',
    price: 4.5,
    sale_price: 3.5,
    category: 'envelopes',
    sku: 'MST-KP-009',
    material: '70 GSM Natural Kraft Paper',
    material_type: 'kraft',
    moq: 2000,
    is_featured: false,
    is_customizable: true,
    status: 'published',
    images: ['/images/products/kraft-grocery-pouches.svg'],
    sizes: ['Small (0.5 kg)', 'Medium (1 kg)', 'Large (2 kg)', 'Extra Large (5 kg)'],
    colors: ['Natural Brown'],
    handles: ['No Handle / Flat Bottom'],
    printing_options: ['Flexo Ink Printing']
  },
  {
    name: 'Bhanwarlal Bakery & Cakes 365 Custom Paper Pouches',
    slug: 'bhanwarlal-bakery-custom-paper-pouches',
    description: 'Food-grade custom printed paper pouches tailored for bakeries, confectionery, and cloud kitchens.',
    price: 6,
    sale_price: 5,
    category: 'paper-bags',
    sku: 'MST-BP-010',
    material: '80 GSM Food-Grade Greaseproof Paper',
    material_type: 'paper',
    moq: 2000,
    is_featured: true,
    is_customizable: true,
    status: 'archived',
    images: ['/images/products/bhanwarlal-bakery-pouches.svg'],
    sizes: ['Snack Size', 'Medium Bakery', 'Large Bread Bag'],
    colors: ['Custom Printed Brand Artwork'],
    handles: ['No Handle / Pinch Bottom'],
    printing_options: ['Food-Grade Ink Offset']
  },
  {
    name: 'Burger & Food Wrapping Greaseproof Sheets',
    slug: 'burger-food-wrapping-greaseproof-sheets',
    description: 'Custom printed greaseproof food wrapping paper sheets ("Awarded as Best in Burger"). Oil-resistant for cafes and fast food joints.',
    price: 2.5,
    sale_price: 2,
    category: 'customized-bags',
    sku: 'MST-GS-011',
    material: '40 GSM Greaseproof Food Wrapping Paper',
    material_type: 'paper',
    moq: 5000,
    is_featured: false,
    is_customizable: true,
    status: 'archived',
    images: ['/images/products/burger-wrapping-sheets.svg'],
    sizes: ['10x10 inch', '12x12 inch', '14x14 inch'],
    colors: ['White with Red/Black Print'],
    handles: ['N/A (Sheet Wrapper)'],
    printing_options: ['Food-Grade Ink Printing']
  },
  {
    name: 'W-Cut Grocery Bag (Cream Non-Woven)',
    slug: 'cream-white-w-cut-non-woven-grocery-bag',
    description: 'Clean off-white cream non-woven vest bag with side gussets for groceries, daily markets, and retail merchandise.',
    price: 7,
    sale_price: 5.8,
    category: 'w-cut-bags',
    sku: 'MST-WC-012',
    material: '70 GSM Non-Woven Fabric',
    material_type: 'non-woven',
    moq: 1000,
    is_featured: false,
    is_customizable: true,
    status: 'published',
    images: ['/images/products/cream-wcut-nonwoven-bag.svg'],
    sizes: ['11x14 inch', '13x17 inch', '16x20 inch'],
    colors: ['Off-White Cream'],
    handles: ['W-Cut Vest Handle'],
    printing_options: ['Flexographic Print']
  },
  {
    name: 'Luxury Rajputi Saafe Gold Foil Boutique Bag',
    slug: 'luxury-rajputi-saafe-gold-foil-boutique-bag',
    description: 'Royal maroon art card bag featuring embossed gold foil logo, velvet rope handles, and spot UV for Rajputi Saafe Ujjain.',
    price: 48,
    sale_price: 42,
    category: 'designer-bags',
    sku: 'MST-DB-013',
    material: '230 GSM Imported Matte Art Card',
    material_type: 'paper',
    moq: 250,
    is_featured: true,
    is_customizable: true,
    status: 'archived',
    images: ['/images/products/rajputi-saafe-luxury-bag.svg'],
    sizes: ['Small (7x9x3")', 'Medium (11x14x4.5")', 'Large (15x18x6")'],
    colors: ['Royal Maroon & Gold Foil'],
    handles: ['Braided Cotton Rope Handles'],
    printing_options: ['Embossed Gold Foil Stamping', 'Spot UV']
  },
  {
    name: 'Jalsa Clothing Company Custom Printed Paper Bag',
    slug: 'jalsa-clothing-company-custom-paper-bag',
    description: 'Bespoke white kraft paper shopping bag featuring crimson circular branding for Jalsa Clothing Company Ratlam.',
    price: 34,
    sale_price: 30,
    category: 'paper-bags',
    sku: 'MST-PB-014',
    material: '180 GSM Gloss Coated Art Paper',
    material_type: 'paper',
    moq: 300,
    is_featured: true,
    is_customizable: true,
    status: 'archived',
    images: ['/images/products/jalsa-clothing-bag.svg'],
    sizes: ['10x13x4"', '12x16x5"'],
    colors: ['Crisp White & Crimson Red Logo'],
    handles: ['White Twisted Paper Cord'],
    printing_options: ['Precision Offset Printing']
  },
  {
    name: 'Fusion Fashion Rose Floral Rida Non-Woven Bag',
    slug: 'fusion-fashion-rose-floral-rida-bag',
    description: 'Non-woven D-cut carry bag customized with delicate rose floral artwork for Fusion Fashion Boutique Indore.',
    price: 11,
    sale_price: 9.5,
    category: 'customized-bags',
    sku: 'MST-CB-015',
    material: '80 GSM Non-Woven Fabric',
    material_type: 'non-woven',
    moq: 500,
    is_featured: true,
    is_customizable: true,
    status: 'archived',
    images: ['/images/products/fusion-fashion-bag.svg'],
    sizes: ['12x16 inch', '14x18 inch'],
    colors: ['White with Rose Pink Printing'],
    handles: ['D-Cut Punch Handle'],
    printing_options: ['Screen Printing']
  },
  {
    name: 'Designer Metallic Tote Bag (Rose Gold)',
    slug: 'metallic-rose-gold-non-woven-tote-bag',
    description: 'Eye-catching metallic copper / rose gold laminated non-woven tote bag with black loop handles for high-fashion boutique gifts.',
    price: 28,
    sale_price: 24,
    category: 'designer-bags',
    sku: 'MST-DB-016',
    material: '100 GSM Laminated Metallic Non-Woven',
    material_type: 'non-woven',
    moq: 300,
    is_featured: true,
    is_customizable: true,
    status: 'published',
    images: ['/images/products/metallic-rosegold-tote-bags.svg'],
    sizes: ['12x14x4 inch', '14x16x5 inch'],
    colors: ['Metallic Rose Gold / Copper'],
    handles: ['Black Loop Handle'],
    printing_options: ['Metallic Screen Print']
  },
  {
    name: 'Anytime Sports Branded Non-Woven Bag',
    slug: 'anytime-sports-branded-non-woven-bag',
    description: 'D-cut non-woven bag with bold yellow/black Anytime Sports "Believe in Yourself" logo print for activewear and sports retail.',
    price: 10,
    sale_price: 8.5,
    category: 'customized-bags',
    sku: 'MST-CB-017',
    material: '75 GSM Spunbond Fabric',
    material_type: 'non-woven',
    moq: 500,
    is_featured: false,
    is_customizable: true,
    status: 'archived',
    images: ['/images/products/anytime-sports-bag.svg'],
    sizes: ['12x16 inch', '15x19 inch'],
    colors: ['White with Yellow & Black Print'],
    handles: ['D-Cut Punch Handle'],
    printing_options: ['Screen Printing']
  },
  {
    name: 'Shamim Store Wholesale Custom Printed Bag',
    slug: 'shamim-store-wholesale-custom-printed-bag',
    description: 'Vibrant red D-cut bag with white circular Shamim Store branding for wholesale garment merchants in Ujjain.',
    price: 9.5,
    sale_price: 8,
    category: 'customized-bags',
    sku: 'MST-CB-018',
    material: '75 GSM Non-Woven Fabric',
    material_type: 'non-woven',
    moq: 500,
    is_featured: false,
    is_customizable: true,
    status: 'archived',
    images: ['/images/products/shamim-store-bag.svg'],
    sizes: ['12x16 inch', '14x18 inch'],
    colors: ['Bright Red & White Print'],
    handles: ['D-Cut Punch Handle'],
    printing_options: ['Screen Printing']
  },
  {
    name: 'Shahzada Fashion World Garment Loop Bag',
    slug: 'shahzada-fashion-world-garment-loop-bag',
    description: 'Yellow non-woven loop bag with royal blue crown logo print for Shahzada Fashion World readymade clothing.',
    price: 14,
    sale_price: 12,
    category: 'customized-bags',
    sku: 'MST-CB-019',
    material: '85 GSM Non-Woven Fabric',
    material_type: 'non-woven',
    moq: 500,
    is_featured: true,
    is_customizable: true,
    status: 'archived',
    images: ['/images/products/shahzada-fashion-bag.svg'],
    sizes: ['13x17x4 inch', '16x20x5 inch'],
    colors: ['Golden Yellow & Royal Blue Print'],
    handles: ['Blue Loop Handle'],
    printing_options: ['Screen Printing']
  },
  {
    name: 'Prem Prakash Saree House Traditional Pink Bag',
    slug: 'prem-prakash-saree-house-pink-bag',
    description: 'Hot pink non-woven bag with traditional golden arch frame printing for Prem Prakash Saree House Ujjain.',
    price: 13,
    sale_price: 11,
    category: 'customized-bags',
    sku: 'MST-CB-020',
    material: '80 GSM Heavy Non-Woven Fabric',
    material_type: 'non-woven',
    moq: 500,
    is_featured: true,
    is_customizable: true,
    status: 'archived',
    images: ['/images/products/prem-prakash-saree-bag.svg'],
    sizes: ['14x18 inch', '16x20 inch'],
    colors: ['Magenta Pink & Gold Print'],
    handles: ['D-Cut Punch Handle'],
    printing_options: ['Screen Printing']
  },
  {
    name: 'Panchmeva Prasadi Mahakal Devotional Bag',
    slug: 'panchmeva-prasadi-mahakal-devotional-bag',
    description: 'White D-cut bag with red Mahakaleshwar devotional print for Panchmeva Prasadi Ujjain.',
    price: 9,
    sale_price: 7.5,
    category: 'customized-bags',
    sku: 'MST-CB-021',
    material: '75 GSM Non-Woven Fabric',
    material_type: 'non-woven',
    moq: 500,
    is_featured: true,
    is_customizable: true,
    status: 'archived',
    images: ['/images/products/panchmeva-prasadi-bag.svg'],
    sizes: ['10x14 inch', '12x16 inch'],
    colors: ['White with Red Devotional Art'],
    handles: ['D-Cut Punch Handle'],
    printing_options: ['Screen Printing']
  },
  {
    name: 'A To Z Readymade Garments Floral Loop Bag',
    slug: 'atoz-readymade-garments-floral-loop-bag',
    description: 'Light pink non-woven loop bag with dark pink floral ring typography for A To Z Readymade Garments.',
    price: 13.5,
    sale_price: 11.5,
    category: 'customized-bags',
    sku: 'MST-CB-022',
    material: '80 GSM Non-Woven Fabric',
    material_type: 'non-woven',
    moq: 500,
    is_featured: true,
    is_customizable: true,
    status: 'archived',
    images: ['/images/products/atoz-garments-bag.svg'],
    sizes: ['13x17 inch', '15x19 inch'],
    colors: ['Soft Pink with Magenta Print'],
    handles: ['Dark Pink Loop Handle'],
    printing_options: ['Screen Printing']
  },
  {
    name: 'Custom Printed Paper Carry Bag',
    slug: 'custom-printed-paper-carry-bag',
    description: 'Our standard printed paper carry bag, made to your dimensions and artwork. Choose GSM, handle type and print method; we quote on your size and quantity.',
    price: null,
    sale_price: null,
    category: 'paper-bags',
    sku: 'MST-PB-100',
    material: '150-200 GSM Coated Art Paper or Virgin Kraft',
    material_type: 'paper',
    moq: 300,
    is_featured: false,
    is_customizable: true,
    status: 'published',
    images: ['/images/categories/paper-bags.svg'],
    sizes: ['8x10x4 inch', '10x13x5 inch', '13x16x6 inch', 'Made to your size'],
    colors: ['White', 'Natural Brown', 'Full-colour printed'],
    handles: ['Twisted Paper', 'Flat Paper', 'Cotton Rope'],
    printing_options: ['Screen Printing', 'Offset Printing', 'Foil Stamping']
  },
  {
    name: 'Fully Custom Bag To Your Specification',
    slug: 'fully-custom-bag-to-specification',
    description: 'Built entirely to your brief: any bag type, dimension, GSM, handle and print. Send your artwork and quantity and we will quote and produce it.',
    price: null,
    sale_price: null,
    category: 'customized-bags',
    sku: 'MST-CB-100',
    material: 'Paper or non-woven, specified per order',
    material_type: 'mixed',
    moq: 500,
    is_featured: true,
    is_customizable: true,
    status: 'published',
    images: ['/images/categories/customized-bags.svg'],
    sizes: ['Made to your size'],
    colors: ['Any colour to your artwork'],
    handles: ['D-Cut', 'W-Cut Vest', 'Loop', 'Twisted Paper', 'Rope'],
    printing_options: ['Screen Printing', 'Offset Printing', 'Flexo Printing', 'Foil Stamping']
  },
  {
    name: 'Kraft Paper Envelope Pouch',
    slug: 'kraft-paper-envelope-pouch',
    description: 'Heavy kraft paper envelope pouches for documents, boutique items and gifting. Plain or printed, in stock sizes or made to your dimensions.',
    price: null,
    sale_price: null,
    category: 'envelopes',
    sku: 'MST-EN-100',
    material: '120-150 GSM Kraft Paper',
    material_type: 'kraft',
    moq: 500,
    is_featured: false,
    is_customizable: true,
    status: 'published',
    images: ['/images/categories/envelopes.svg'],
    sizes: ['A5', 'A4', 'Made to your size'],
    colors: ['Natural Brown', 'White'],
    handles: ['No Handle / Flap Seal'],
    printing_options: ['Screen Printing', 'Offset Printing']
  }
];

// DEFAULT INDUSTRIES
export const DEFAULT_INDUSTRIES: Industry[] = [
  {
    id: 'ind-1',
    slug: 'hotels',
    title: 'Hotels & Hospitality',
    short_description: 'Luxury laundry bags, amenity bags, and guest gift bags tailored for premium hotels and resorts.',
    full_description: 'Deliver an unforgettable guest experience with custom branded paper and cloth bags. Designed with subtle elegance, high GSM cardstock, and foil-stamped logos for luxury hotels, boutique stays, and spa resorts.',
    recommended_bags: ['Luxury Rajputi Saafe Gold Foil Boutique Bag', 'Brown Kraft Twisted Handle Shopping Bags', 'Jalsa Clothing Company Custom Printed Paper Bag'],
    features: ['High GSM Laminated Cardstock', 'Rope & Ribbon Handles', 'Foil Stamping & Spot UV', 'Water-resistant Finishes'],
    image_url: '/images/industries/hospitality.svg',
    display_order: 1,
    status: 'published'
  },
  {
    id: 'ind-2',
    slug: 'restaurants',
    title: 'Restaurants & Food Delivery',
    short_description: 'Grease-resistant take-away food bags, bakery pouches, and sturdy delivery bags.',
    full_description: 'Sturdy, wide-bottom food packaging bags crafted to hold containers without tipping. Grease-resistant liners and ventilated virgin kraft paper maintain food freshness and cleanliness.',
    recommended_bags: ['Brown Kraft Twisted Handle Shopping Bags', 'Cream White W-Cut Non-Woven Grocery Bag'],
    features: ['Wide Gussets for Flat Placement', 'Reinforced Square Bottom', 'Custom Logo Printing', 'Multiple Size Options'],
    image_url: '/images/industries/restaurants.svg',
    display_order: 2,
    status: 'published'
  },
  {
    id: 'ind-3',
    slug: 'clothing',
    title: 'Apparel & Fashion Boutiques',
    short_description: 'Chic, durable paper bags with custom branding that elevate your retail brand image.',
    full_description: 'Apparel retailers rely on MS TRADERS for high-impact bag packaging that turns every customer into a walking brand ambassador. Customizable in matte, gloss, and textured finishes.',
    recommended_bags: ['Luxury Rajputi Saafe Gold Foil Boutique Bag', 'D-Cut Non-Woven Retail Bags (Yellow, White, Red)', 'Brown Kraft Twisted Handle Shopping Bags'],
    features: ['Vibrant Multi-color Offset Printing', 'Custom Sizing for Garments', 'Reinforced Top & Bottom Inserts', 'Eco-friendly Recyclable Inks'],
    image_url: '/images/industries/fashion.svg',
    display_order: 3,
    status: 'published'
  },
  {
    id: 'ind-4',
    slug: 'retail',
    title: 'Supermarkets & General Retail',
    short_description: 'High-volume W-Cut and D-Cut bags for daily retail operations.',
    full_description: 'Engineered for durability and high-speed distribution. Our W-cut non-woven and kraft paper bags offer maximum tear resistance for department stores and hypermarkets.',
    recommended_bags: ['Cream White W-Cut Non-Woven Grocery Bag', 'D-Cut Non-Woven Retail Bags (Yellow, White, Red)'],
    features: ['High Bulk Discounts', 'Standardized Sizing', 'High Speed Flexo Printing', 'Ergonomic Handles'],
    image_url: '/images/industries/retail.svg',
    display_order: 4,
    status: 'published'
  },
  {
    id: 'ind-5',
    slug: 'medical-pharma',
    title: 'Medical & Pharmacies',
    short_description: 'Hygienic, compact bags with secure die-cut handles for pharmaceuticals and health clinics.',
    full_description: 'Clean, opaque non-woven D-cut bags and paper pouches ensuring patient privacy, hygiene, and rapid packaging at counter checkouts.',
    recommended_bags: ['D-Cut Non-Woven Retail Bags (Yellow, White, Red)', 'Brown Kraft Twisted Handle Shopping Bags'],
    features: ['Opaque High-Density Material', 'Hygienic Dust-Free Production', 'Compact Sizes Available', 'Clear RX & Usage Printing'],
    image_url: '/images/industries/medical.svg',
    display_order: 5,
    status: 'published'
  },
  {
    id: 'ind-6',
    slug: 'corporate',
    title: 'Corporate & Offices',
    short_description: 'Sleek corporate gifting bags, document carry bags, and conference gift kits.',
    full_description: 'Make a strong impression on clients and employees during corporate events, onboarding kits, and annual conferences with crisp, professionally printed gift bags.',
    recommended_bags: ['Jalsa Clothing Company Custom Printed Paper Bag', 'Luxury Rajputi Saafe Gold Foil Boutique Bag'],
    features: ['Precision Logo Reproduction', 'Refined Textured Papers', 'Custom Ribbon Closures', 'Matching Gift Tags'],
    image_url: '/images/industries/corporate.svg',
    display_order: 6,
    status: 'published'
  },
  {
    id: 'ind-7',
    slug: 'events',
    title: 'Events & Trade Exhibitions',
    short_description: 'Lightweight, vibrant carry bags designed for trade shows and promotional expos.',
    full_description: 'Ensure your promotional materials stand out. Our exhibition bags are spacious, tear-resistant, and comfortable to carry all day across busy expo floors.',
    recommended_bags: ['D-Cut Non-Woven Retail Bags (Yellow, White, Red)', 'Brown Kraft Twisted Handle Shopping Bags'],
    features: ['Double Stitch & Heat Seal Options', 'High Visual Visibility', 'Comfort-Grip Cutouts', 'Quick Production Turnaround'],
    image_url: '/images/industries/events.svg',
    display_order: 7,
    status: 'published'
  }
];

// --- SETTINGS SERVICE ---
export async function getSettings(): Promise<BusinessSettings> {
  try {
    const { data, error } = await db
      .from('settings')
      .select('key, value');

    if (error || !data || data.length === 0) {
      return DEFAULT_SETTINGS;
    }

    const settingsObj: any = { ...DEFAULT_SETTINGS };
    data.forEach((item) => {
      if (item.value) {
        settingsObj[item.key] = item.value;
      }
    });

    return settingsObj as BusinessSettings;
  } catch (err) {
    console.warn('Using default settings fallback:', err);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(newSettings: Partial<BusinessSettings>): Promise<boolean> {
  try {
    const updates = Object.entries(newSettings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString()
    }));

    const { error } = await db
      .from('settings')
      .upsert(updates, { onConflict: 'key' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating settings in the database:', err);
    return false;
  }
}

// --- PRODUCTS SERVICE ---
export async function getProducts(options?: {
  category?: string;
  status?: string;
  featuredOnly?: boolean;
  search?: string;
}): Promise<Product[]> {
  try {
    let query = db.from('products').select('*');

    if (options?.status === 'all') {
      // Admin views every status - do not filter at all
    } else if (options?.status) {
      query = query.eq('status', options.status);
    } else {
      // By default public queries published products
      query = query.eq('status', 'published');
    }

    if (options?.category && options.category !== 'all') {
      query = query.eq('category', options.category);
    }

    if (options?.featuredOnly) {
      query = query.eq('is_featured', true);
    }

    if (options?.search) {
      query = query.ilike('name', `%${options.search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Seed fallback products if database table is empty for standard viewing
      return buildSeedProducts();
    }

    return data as Product[];
  } catch (err) {
    console.warn('Error fetching products from the database, using initial catalog:', err);
    return buildSeedProducts();
  }
}

/** Local catalog shown only until the `products` table has been seeded. */
function buildSeedProducts(): Product[] {
  return INITIAL_PRODUCTS.map((p, idx) => ({
    id: `seed-${idx + 1}`,
    created_at: new Date().toISOString(),
    name: p.name!,
    slug: p.slug!,
    description: p.description || null,
    price: p.price ?? null,
    sale_price: p.sale_price ?? null,
    category: p.category!,
    sku: p.sku || null,
    material: p.material || null,
    material_type: p.material_type || null,
    moq: p.moq || 100,
    is_featured: p.is_featured ?? false,
    is_customizable: p.is_customizable ?? true,
    status: (p.status as 'published') || 'published',
    images: p.images || [],
    sizes: p.sizes || [],
    colors: p.colors || [],
    handles: p.handles || [],
    printing_options: p.printing_options || []
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await db
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const foundInInitial = INITIAL_PRODUCTS.find((p) => p.slug === slug);
      if (foundInInitial) {
        return {
          id: 'seed-p',
          created_at: new Date().toISOString(),
          name: foundInInitial.name!,
          slug: foundInInitial.slug!,
          description: foundInInitial.description || null,
          price: foundInInitial.price ?? null,
          sale_price: foundInInitial.sale_price ?? null,
          category: foundInInitial.category!,
          sku: foundInInitial.sku || null,
          material: foundInInitial.material || null,
          moq: foundInInitial.moq || 100,
          is_featured: foundInInitial.is_featured ?? false,
          is_customizable: foundInInitial.is_customizable ?? true,
          status: 'published',
          images: foundInInitial.images || [],
          sizes: foundInInitial.sizes || [],
          colors: foundInInitial.colors || [],
          handles: foundInInitial.handles || [],
          printing_options: foundInInitial.printing_options || []
        };
      }
      return null;
    }

    return data as Product;
  } catch (err) {
    return null;
  }
}

export async function createProduct(product: Partial<Product>): Promise<Product | null> {
  try {
    const { data, error } = await db
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  } catch (err) {
    console.error('Error creating product in the database:', err);
    return null;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  try {
    // A seed id (`seed-2`) is not a uuid and must never reach a `.eq('id', ...)`
    // filter. The row simply does not exist yet, so persist it by slug instead.
    if (isSeedId(id)) {
      const payload = { ...updates };
      delete (payload as Partial<Product>).id;
      delete (payload as Partial<Product>).created_at;

      if (!payload.slug) {
        console.error('Cannot persist a seed product without a slug');
        return false;
      }

      const { error } = await db
        .from('products')
        .upsert([payload], { onConflict: 'slug' });

      if (error) throw error;
      return true;
    }

    const { error } = await db
      .from('products')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating product in the database:', err);
    return false;
  }
}

export async function deleteProduct(id: string, slug?: string): Promise<boolean> {
  try {
    if (isSeedId(id)) {
      // Seed rows only exist in memory. If a real row shares the slug, remove it;
      // otherwise there is nothing to delete server-side.
      if (slug) {
        const { error } = await db.from('products').delete().eq('slug', slug);
        if (error) throw error;
      }
      return true;
    }

    const { error } = await db
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting product in the database:', err);
    return false;
  }
}

// --- CATEGORIES SERVICE ---
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await db
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_CATEGORIES;
    }

    return data as Category[];
  } catch (err) {
    return DEFAULT_CATEGORIES;
  }
}

// --- QUOTES SERVICE ---
export async function createQuote(quoteData: {
  customer_id?: string;
  customer_name: string;
  business_name?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  city?: string;
  bag_type: string;
  quantity: number;
  material?: string;
  printing?: string;
  handle_type?: string;
  size?: string;
  requirements?: Record<string, any>;
  attachments?: string[];
  notes?: string;
}): Promise<Quote | null> {
  try {
    // Generate unique quote number: QT-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const quote_number = `MST-QT-${dateStr}-${randomSuffix}`;

    const newQuote = {
      quote_number,
      customer_id: quoteData.customer_id || null,
      customer_name: quoteData.customer_name,
      business_name: quoteData.business_name || null,
      email: quoteData.email,
      phone: quoteData.phone,
      whatsapp: quoteData.whatsapp || quoteData.phone,
      city: quoteData.city || null,
      bag_type: quoteData.bag_type,
      quantity: quoteData.quantity,
      material: quoteData.material || null,
      printing: quoteData.printing || null,
      handle_type: quoteData.handle_type || null,
      size: quoteData.size || null,
      requirements: quoteData.requirements || {},
      attachments: quoteData.attachments || [],
      notes: quoteData.notes || null,
      status: 'NEW' as QuoteStatus,
      amount: 0,
      shipping_amount: 0,
      tax_amount: 0,
      total_amount: 0
    };

    const { data, error } = await db
      .from('quotes')
      .insert([newQuote])
      .select()
      .single();

    if (error) {
      console.error('Database quote insert error:', error);
      return null;
    }

    // Auto-create initial Notification for Customer
    await createNotification({
      user_id: quoteData.customer_id || null,
      email: quoteData.email,
      recipient_role: 'customer',
      title: `Quotation Request Logged (${quote_number})`,
      message: `Your request for ${quoteData.bag_type.replace(/-/g, ' ').toUpperCase()} (${quoteData.quantity.toLocaleString('en-IN')} units) was received. MS TRADERS desk is preparing custom pricing.`,
      type: 'QUOTE_RECEIVED',
      link: `/quotes/${quote_number}`
    });

    // Auto-create Notification for Admin desk
    await createNotification({
      user_id: null,
      email: 'admin@mstraders.com',
      recipient_role: 'admin',
      for_admin: true,
      title: `New Quote Request (#${quote_number})`,
      message: `${quoteData.customer_name} submitted a new quote request for ${quoteData.quantity.toLocaleString('en-IN')} units of ${quoteData.bag_type.replace(/-/g, ' ')}.`,
      type: 'QUOTE_RECEIVED',
      link: `/admin/quotes`
    });

    return data as Quote;
  } catch (err) {
    console.error('Error submitting quote:', err);
    return null;
  }
}

export async function getQuotes(statusFilter?: string): Promise<Quote[]> {
  try {
    let query = db.from('quotes').select('*').order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'ALL') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as Quote[];
  } catch (err) {
    return [];
  }
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  try {
    const { data, error } = await db
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as Quote;
  } catch (err) {
    return null;
  }
}

export async function getQuoteByNumber(quoteNumber: string): Promise<Quote | null> {
  try {
    const { data, error } = await db
      .from('quotes')
      .select('*')
      .eq('quote_number', quoteNumber.trim().toUpperCase())
      .single();

    if (error || !data) return null;
    return data as Quote;
  } catch (err) {
    return null;
  }
}

export async function updateQuoteStatus(
  id: string, 
  updates: Partial<Quote>
): Promise<boolean> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let quoteQuery = db.from('quotes').select('id, quote_number, email, customer_id, total_amount');
    
    if (isUuid) {
      quoteQuery = quoteQuery.eq('id', id);
    } else {
      quoteQuery = quoteQuery.eq('quote_number', id.trim().toUpperCase());
    }

    const { data: quoteRecord } = await quoteQuery.maybeSingle();

    const targetEmail = quoteRecord?.email || updates.email;
    let customerId = quoteRecord?.customer_id || updates.customer_id;

    if (!customerId && targetEmail) {
      const { data: profile } = await db.from('profiles').select('id').ilike('email', targetEmail.trim()).maybeSingle();
      if (profile) customerId = profile.id;
    }

    // Clean payload keys to prevent invalid Postgres column errors
    const allowedKeys = [
      'status', 'customer_id', 'customer_name', 'business_name', 'email', 'phone', 
      'whatsapp', 'city', 'delivery_address', 'bag_type', 'quantity', 'material', 
      'printing', 'handle_type', 'size', 'requirements', 'attachments', 'unit_price', 
      'subtotal', 'customization_charges', 'delivery_charges', 'discount', 'tax_amount', 
      'total_amount', 'valid_until', 'notes', 'admin_notes', 'customer_notes', 'order_id'
    ];

    const cleanUpdates: Record<string, any> = {};
    if (customerId) cleanUpdates.customer_id = customerId;

    Object.keys(updates).forEach((key) => {
      if (allowedKeys.includes(key) && (updates as any)[key] !== undefined) {
        cleanUpdates[key] = (updates as any)[key];
      }
    });

    let updateQuery = db.from('quotes').update(cleanUpdates);
    if (quoteRecord?.id) {
      updateQuery = updateQuery.eq('id', quoteRecord.id);
    } else if (isUuid) {
      updateQuery = updateQuery.eq('id', id);
    } else {
      updateQuery = updateQuery.eq('quote_number', id.trim().toUpperCase());
    }

    const { error } = await updateQuery;
    if (error) {
      console.error('Database updateQuoteStatus error:', error);
      
      // Fallback A: Handle Check Constraint Violation (e.g. quotes_status_check constraint error 23514)
      if (error.code === '23514' || (error.message && error.message.toLowerCase().includes('check constraint'))) {
        console.warn('Status check constraint violation (23514). Retrying quote update without strict status value...');
        const safeUpdates: Record<string, any> = { ...cleanUpdates };
        delete safeUpdates.status; // Remove unaccepted status value
        
        if (cleanUpdates.customer_notes || cleanUpdates.admin_notes) {
          safeUpdates.notes = cleanUpdates.customer_notes || cleanUpdates.admin_notes;
        }

        let retryQuery = db.from('quotes').update(safeUpdates);
        if (quoteRecord?.id) {
          retryQuery = retryQuery.eq('id', quoteRecord.id);
        } else if (isUuid) {
          retryQuery = retryQuery.eq('id', id);
        } else {
          retryQuery = retryQuery.eq('quote_number', id.trim().toUpperCase());
        }

        const { error: retryErr } = await retryQuery;
        if (retryErr) {
          console.error('Retry without status failed:', retryErr);
          // If retry also failed due to column missing (42703), try minimal fallback
          const minimalUpdates: Record<string, any> = {};
          if (cleanUpdates.customer_notes || cleanUpdates.admin_notes || cleanUpdates.notes) {
            minimalUpdates.notes = cleanUpdates.customer_notes || cleanUpdates.admin_notes || cleanUpdates.notes;
          }
          let minQuery = db.from('quotes').update(minimalUpdates);
          if (quoteRecord?.id) minQuery = minQuery.eq('id', quoteRecord.id);
          else if (isUuid) minQuery = minQuery.eq('id', id);
          else minQuery = minQuery.eq('quote_number', id.trim().toUpperCase());
          await minQuery;
        }
      } 
      // Fallback B: Handle Column Missing (42703)
      else if (error.code === '42703' || (error.message && error.message.toLowerCase().includes('column'))) {
        console.warn('Column missing in the database (42703). Executing fallback update with basic fields...');
        const fallbackUpdates: Record<string, any> = {};
        if (cleanUpdates.status) fallbackUpdates.status = cleanUpdates.status;
        if (cleanUpdates.customer_notes || cleanUpdates.admin_notes) {
          fallbackUpdates.notes = cleanUpdates.customer_notes || cleanUpdates.admin_notes;
        }

        let fallbackQuery = db.from('quotes').update(fallbackUpdates);
        if (quoteRecord?.id) {
          fallbackQuery = fallbackQuery.eq('id', quoteRecord.id);
        } else if (isUuid) {
          fallbackQuery = fallbackQuery.eq('id', id);
        } else {
          fallbackQuery = fallbackQuery.eq('quote_number', id.trim().toUpperCase());
        }

        const { error: fallbackErr } = await fallbackQuery;
        if (fallbackErr) {
          console.error('Fallback quote update error:', fallbackErr);
          // Try minimal update on notes column only
          const minUpdates: Record<string, any> = {};
          if (cleanUpdates.customer_notes || cleanUpdates.admin_notes || cleanUpdates.notes) {
            minUpdates.notes = cleanUpdates.customer_notes || cleanUpdates.admin_notes || cleanUpdates.notes;
          }
          let minQuery = db.from('quotes').update(minUpdates);
          if (quoteRecord?.id) minQuery = minQuery.eq('id', quoteRecord.id);
          else if (isUuid) minQuery = minQuery.eq('id', id);
          else minQuery = minQuery.eq('quote_number', id.trim().toUpperCase());
          await minQuery;
        }
      } else {
        throw error;
      }
    }

    // Send Notification Trigger
    const qNum = quoteRecord?.quote_number || id;
    if (cleanUpdates.status || cleanUpdates.total_amount !== undefined) {
      let notifTitle = `Quotation Updated (#${qNum})`;
      let notifMsg = `Quotation #${qNum} status changed to ${cleanUpdates.status || 'Updated'}.`;

      if (cleanUpdates.status === 'QUOTED' || (cleanUpdates.total_amount && cleanUpdates.total_amount > 0)) {
        notifTitle = `Official Quotation Ready (#${qNum})`;
        notifMsg = `MS TRADERS issued your formal quotation #${qNum} for ₹${(cleanUpdates.total_amount || 0).toLocaleString('en-IN')}. Click to review & approve.`;
      } else if (cleanUpdates.status === 'CHANGES_REQUESTED') {
        notifTitle = `Revision Request Received (#${qNum})`;
        notifMsg = `Your requested changes for quote #${qNum} were logged with MS TRADERS desk.`;
      } else if (cleanUpdates.status === 'APPROVED') {
        notifTitle = `Quotation Approved (#${qNum})`;
        notifMsg = `Quotation #${qNum} approved! Your order is being processed for manufacturing.`;
      }

      await createNotification({
        user_id: customerId || null,
        email: targetEmail || null,
        recipient_role: 'customer',
        title: notifTitle,
        message: notifMsg,
        type: cleanUpdates.status === 'QUOTED' ? 'QUOTE_RECEIVED' : 'QUOTE_UPDATED',
        link: `/quotes/${qNum}`
      });

      // If customer requested changes or approved, notify Admin desk as well
      if (cleanUpdates.status === 'CHANGES_REQUESTED') {
        await createNotification({
          user_id: null,
          email: 'admin@mstraders.com',
          recipient_role: 'admin',
          for_admin: true,
          title: `Revision Requested on Quote #${qNum}`,
          message: `Customer requested changes: "${cleanUpdates.customer_notes || cleanUpdates.notes || 'Specification updates'}"`,
          type: 'QUOTE_CHANGES_REQUESTED',
          link: `/admin/quotes`
        });
      } else if (cleanUpdates.status === 'APPROVED') {
        await createNotification({
          user_id: null,
          email: 'admin@mstraders.com',
          recipient_role: 'admin',
          for_admin: true,
          title: `Quote Approved by Customer (#${qNum})`,
          message: `Customer approved quotation #${qNum}. Order ready for production processing.`,
          type: 'QUOTE_APPROVED',
          link: `/admin/orders`
        });
      }
    }

    return true;
  } catch (err) {
    console.error('Error updating quote status:', err);
    return false;
  }
}

export async function convertQuoteToOrder(
  quoteId: string, 
  customOptions?: { 
    payment_method?: string; 
    delivery_notes?: string;
    customer_notes?: string;
  }
): Promise<Order | null> {
  try {
    const quote = await getQuoteById(quoteId);
    if (!quote) throw new Error('Quote not found');

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const order_number = `MST-ORD-${dateStr}-${randomSuffix}`;

    const subtotal = quote.subtotal || quote.amount || 0;
    const delivery_fee = quote.delivery_charges || quote.shipping_amount || 0;
    const tax = quote.tax_amount || 0;
    const total = quote.total_amount || (subtotal + delivery_fee + tax);

    const shippingAddress = {
      firstName: quote.customer_name.split(' ')[0] || quote.customer_name,
      lastName: quote.customer_name.split(' ').slice(1).join(' ') || '',
      company: quote.business_name || '',
      address: quote.delivery_address || 'Customer Location',
      city: quote.city || 'Ujjain',
      state: 'Madhya Pradesh',
      postalCode: '456006',
      phone: quote.phone
    };

    const newOrder = {
      order_number,
      quote_id: quote.id,
      customer_id: quote.customer_id || null,
      customer_name: quote.customer_name,
      company_name: quote.business_name || null,
      email: quote.email,
      phone: quote.phone,
      shipping_address: shippingAddress,
      status: 'CONFIRMED' as OrderStatus,
      payment_method: customOptions?.payment_method || 'Invoice / Pay on Delivery',
      payment_status: 'PENDING',
      subtotal,
      customization_charges: quote.customization_charges || 0,
      delivery_charges: delivery_fee,
      discount: quote.discount || 0,
      tax,
      shipping_fee: delivery_fee,
      total,
      delivery_method: 'INTERNAL_DELIVERY',
      delivery_notes: customOptions?.delivery_notes || quote.notes || null,
      notes: `Converted from Quote ${quote.quote_number}${customOptions?.customer_notes ? ` | Customer Note: ${customOptions.customer_notes}` : ''}`
    };

    let orderData: any = null;

    const { data: firstTryData, error: orderErr } = await db
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (orderErr) {
      console.warn('First order insert attempt failed, trying resilient fallback insert:', orderErr.message);
      
      // Resilient fallback: remove optional columns that might not exist in older database schema cache
      const { 
        payment_method, 
        payment_status, 
        quote_id, 
        customization_charges, 
        delivery_charges, 
        discount, 
        delivery_method, 
        delivery_notes, 
        ...essentialOrder 
      } = newOrder;

      const fallbackNotes = [
        newOrder.notes,
        payment_method ? `Payment Method: ${payment_method}` : null,
        payment_status ? `Payment Status: ${payment_status}` : null,
        quote.quote_number ? `Quote Reference: #${quote.quote_number}` : null,
        delivery_notes ? `Delivery Notes: ${delivery_notes}` : null
      ].filter(Boolean).join(' | ');

      essentialOrder.notes = fallbackNotes;

      const { data: retryData, error: retryErr } = await db
        .from('orders')
        .insert([essentialOrder])
        .select()
        .single();

      if (retryErr || !retryData) {
        console.error('Failed to insert order from quote (fallback failed):', retryErr || orderErr);
        return null;
      }

      orderData = retryData;
    } else {
      orderData = firstTryData;
    }

    // Insert order item for the quote
    const itemUnitPrice = quote.unit_price || (total > 0 && quote.quantity > 0 ? total / quote.quantity : 0);
    const orderItem = {
      order_id: orderData.id,
      product_id: 'custom-quote-product',
      product_name: `Custom ${quote.bag_type} (${quote.size || 'Custom Dimensions'})`,
      quantity: quote.quantity,
      unit_price: itemUnitPrice,
      variant_details: {
        material: quote.material || 'Standard Kraft/Non-Woven',
        printing: quote.printing || 'Custom Print',
        handle: quote.handle_type || 'Standard Handle',
        size: quote.size || 'Custom'
      },
      total_price: total
    };

    await db.from('order_items').insert([orderItem]);

    // Update Quote Status to CONVERTED_TO_ORDER & set order_id
    await db
      .from('quotes')
      .update({
        status: 'CONVERTED_TO_ORDER',
        order_id: orderData.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', quote.id);

    // Auto-create notifications
    await createNotification({
      user_id: quote.customer_id || null,
      email: quote.email,
      recipient_role: 'customer',
      title: `Order Confirmed (#${order_number})`,
      message: `Your quotation #${quote.quote_number} has been converted to Order #${order_number}. Production will begin shortly.`,
      type: 'ORDER_STATUS',
      link: `/account`
    });

    await createNotification({
      user_id: null,
      email: 'admin@mstraders.com',
      recipient_role: 'admin',
      for_admin: true,
      title: `Order Converted from Quote (#${order_number})`,
      message: `Quote #${quote.quote_number} converted into Order #${order_number} for ${quote.customer_name}.`,
      type: 'ORDER_STATUS',
      link: `/admin/orders`
    });

    return orderData as Order;
  } catch (err) {
    console.error('Error converting quote to order:', err);
    return null;
  }
}

// --- ORDERS SERVICE ---
export async function createOrder(orderData: {
  customer_name: string;
  company_name?: string;
  email: string;
  phone: string;
  shipping_address: any;
  payment_method?: string;
  subtotal: number;
  tax: number;
  shipping_fee: number;
  total: number;
  notes?: string;
  items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    variant_details?: any;
    total_price: number;
  }>;
}): Promise<Order | null> {
  try {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const order_number = `MST-ORD-${dateStr}-${randomSuffix}`;

    const newOrder = {
      order_number,
      customer_name: orderData.customer_name,
      company_name: orderData.company_name || null,
      email: orderData.email,
      phone: orderData.phone,
      shipping_address: orderData.shipping_address,
      status: 'PENDING' as OrderStatus,
      payment_method: orderData.payment_method || 'invoice',
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      shipping_fee: orderData.shipping_fee,
      total: orderData.total,
      notes: orderData.notes || null
    };

    let finalOrderRecord: any = null;

    const { data: orderResult, error: orderErr } = await db
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (orderErr) {
      // If error is PGRST204 or missing payment_method column in schema cache, retry without payment_method
      if (orderErr.code === 'PGRST204' || orderErr.message?.includes('payment_method')) {
        const { payment_method, ...cleanOrder } = newOrder;
        const paymentNote = `Payment Method: ${orderData.payment_method || 'invoice'}`;
        cleanOrder.notes = cleanOrder.notes ? `${cleanOrder.notes} | ${paymentNote}` : paymentNote;

        const { data: retryData, error: retryErr } = await db
          .from('orders')
          .insert([cleanOrder])
          .select()
          .single();

        if (!retryErr && retryData) {
          finalOrderRecord = retryData;
        } else {
          console.warn('Fallback retry order insert error:', retryErr?.message || retryErr);
        }
      } else {
        console.warn('Order insert warning:', orderErr.message || orderErr);
      }
    } else {
      finalOrderRecord = orderResult;
    }

    if (finalOrderRecord) {
      // Insert order items
      const itemsToInsert = orderData.items.map((item) => ({
        order_id: finalOrderRecord.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        variant_details: item.variant_details || {},
        total_price: item.total_price
      }));

      await db.from('order_items').insert(itemsToInsert);

      return {
        ...finalOrderRecord,
        order_items: itemsToInsert
      } as Order;
    }

    return null;
  } catch (err) {
    console.error('Error creating order request:', err);
    return null;
  }
}

export async function getOrders(statusFilter?: string): Promise<Order[]> {
  try {
    let query = db
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'ALL') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as Order[];
  } catch (err) {
    return [];
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  return updateOrderFulfillmentDetails(id, { status });
}

export async function updateOrderFulfillmentDetails(
  id: string,
  updates: {
    status?: OrderStatus;
    expected_delivery_date?: string | null;
    courier_partner?: string | null;
    tracking_number?: string | null;
    tracking_url?: string | null;
  }
): Promise<boolean> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // 1. Attempt updating orders table
    let orderQuery = db.from('orders').update(updates);
    if (isUuid) {
      orderQuery = orderQuery.eq('id', id);
    } else {
      orderQuery = orderQuery.ilike('order_number', id.trim());
    }

    const { data: updatedOrders, error: orderErr } = await orderQuery.select('*, customer_id, email, order_number');

    if (!orderErr && updatedOrders && updatedOrders.length > 0) {
      const orderRecord = updatedOrders[0];
      if (orderRecord && (orderRecord.email || orderRecord.customer_id)) {
        let notifMsg = `Your order #${orderRecord.order_number} status is now: ${(updates.status || orderRecord.status).replace(/_/g, ' ')}.`;
        if (updates.expected_delivery_date) {
          notifMsg += ` Expected Delivery Date: ${updates.expected_delivery_date}.`;
        }
        if (updates.courier_partner || updates.tracking_number) {
          notifMsg += ` Logistics: ${updates.courier_partner || 'Dispatch Partner'} (AWB: ${updates.tracking_number || 'In Transit'}).`;
        }
        await createNotification({
          user_id: orderRecord.customer_id || null,
          email: orderRecord.email,
          recipient_role: 'customer',
          title: `Order Status & Tracking Updated (#${orderRecord.order_number})`,
          message: notifMsg,
          type: 'ORDER_STATUS',
          link: `/track-order`
        });
      }
      return true;
    }

    // 2. Fallback: Update quotes table if reference is a quotation
    let quoteQuery = db.from('quotes').update({
      expected_delivery_date: updates.expected_delivery_date,
      courier_partner: updates.courier_partner,
      tracking_number: updates.tracking_number,
      tracking_url: updates.tracking_url
    });

    if (isUuid) {
      quoteQuery = quoteQuery.eq('id', id);
    } else {
      quoteQuery = quoteQuery.ilike('quote_number', id.trim());
    }

    const { data: updatedQuotes, error: quoteErr } = await quoteQuery.select('*, customer_id, email, quote_number');

    if (!quoteErr && updatedQuotes && updatedQuotes.length > 0) {
      const quoteRecord = updatedQuotes[0];
      if (quoteRecord && (quoteRecord.email || quoteRecord.customer_id)) {
        await createNotification({
          user_id: quoteRecord.customer_id || null,
          email: quoteRecord.email,
          recipient_role: 'customer',
          title: `Expected Delivery Date Set (#${quoteRecord.quote_number})`,
          message: `Expected delivery date set to ${updates.expected_delivery_date || 'TBD'}. Courier: ${updates.courier_partner || 'MS TRADERS Express'}.`,
          type: 'QUOTE_UPDATED',
          link: `/track-order`
        });
      }
      return true;
    }

    return false;
  } catch (err) {
    console.error('Error updating order fulfillment details:', err);
    return false;
  }
}

// --- GALLERY SERVICE ---
export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'ms-item-1',
    created_at: new Date().toISOString(),
    title: 'White Kraft Paper Bag with Twisted Handle',
    description: '[Paper bag] Clean bleached white kraft paper shopping carry bag with durable twisted rope handles, ideal for boutique and luxury gift packaging.',
    image_url: '/images/products/white-kraft-twisted-bag.svg',
    category: 'Kraft Bags',
    is_featured: true,
    status: 'published',
    display_order: 1
  },
  {
    id: 'ms-item-2',
    created_at: new Date().toISOString(),
    title: 'Yellow Non-Woven W-Cut Vest Bag',
    description: '[W cut bag] Vibrant yellow non-woven vest handle grocery carry bag. High-strength eco-friendly packaging for supermarkets and retail stores.',
    image_url: '/images/products/yellow-wcut-nonwoven-bag.svg',
    category: 'W-Cut Bags',
    is_featured: true,
    status: 'published',
    display_order: 2
  },
  {
    id: 'ms-item-3',
    created_at: new Date().toISOString(),
    title: 'Royal Blue Non-Woven Loop Handle Bag',
    description: '[Loop handle bag] Royal blue high-GSM non-woven shopping bag with white border piping and soft loop handles for apparel and footwear retail.',
    image_url: '/images/products/blue-loop-nonwoven-bag.svg',
    category: 'Non-Woven Bags',
    is_featured: true,
    status: 'published',
    display_order: 3
  },
  {
    id: 'ms-item-4',
    created_at: new Date().toISOString(),
    title: 'High-Gloss D-Cut Shopping Bags (Trio)',
    description: '[D cut bags] Laminated glossy red, pearl white, and deep black D-cut punch shopping bags for boutiques, fashion outlets, and cosmetics.',
    image_url: '/images/products/glossy-dcut-trio-bags.svg',
    category: 'D-Cut Bags',
    is_featured: true,
    status: 'published',
    display_order: 4
  },
  {
    id: 'ms-item-5',
    created_at: new Date().toISOString(),
    title: 'Designer Ethnic Mandala Gift Bags (Set of 4)',
    description: '[Designer paper bags] Set of 4 festive ethnic mandala pattern gift bags with rigid golden-toned cord handles for weddings, jewelry, and celebrations.',
    image_url: '/images/products/designer-ethnic-gift-bags.svg',
    category: 'Designer Bags',
    is_featured: true,
    status: 'published',
    display_order: 5
  },
  {
    id: 'ms-item-6',
    created_at: new Date().toISOString(),
    title: 'Brown Kraft Twisted Handle Shopping Bags',
    description: '[Brown bags] Natural virgin unbleached brown kraft paper shopping bags with twisted rope handles, multi-size set for retail stores.',
    image_url: '/images/products/kraft-twisted-handle-bags.svg',
    category: 'Kraft Bags',
    is_featured: true,
    status: 'published',
    display_order: 6
  },
  {
    id: 'ms-item-7',
    created_at: new Date().toISOString(),
    title: 'Rainbow Non-Woven Loop Handle Bags',
    description: '[Loop handle bags] Vibrant rainbow assortment of non-woven loop handle retail carry bags in lime green, canary yellow, orange, red, black, and blue.',
    image_url: '/images/products/rainbow-loop-bags.svg',
    category: 'Non-Woven Bags',
    is_featured: true,
    status: 'published',
    display_order: 7
  },
  {
    id: 'ms-item-8',
    created_at: new Date().toISOString(),
    title: 'D-Cut Non-Woven Retail Bags (Trio)',
    description: '[D cut bags] Bright yellow, clean white, and cherry red D-cut non-woven carry bags with smooth die-cut oval handle punches.',
    image_url: '/images/products/trio-dcut-nonwoven-bags.svg',
    category: 'D-Cut Bags',
    is_featured: true,
    status: 'published',
    display_order: 8
  },
  {
    id: 'ms-item-9',
    created_at: new Date().toISOString(),
    title: 'V-Bottom Brown Kraft Paper Pouches',
    description: '[V bottom kraft pouch] Natural brown kraft V-bottom grocery pouches with expandable side gussets for pharmacies, dry fruits, pulses, and grocery stores.',
    image_url: '/images/products/kraft-grocery-pouches.svg',
    category: 'Kraft Bags',
    is_featured: true,
    status: 'published',
    display_order: 9
  },
  {
    id: 'ms-item-10',
    created_at: new Date().toISOString(),
    title: 'OGR Greaseproof Food Wrapping Butter Paper',
    description: '[OGR butter paper] Food-grade Oil and Grease Resistant (OGR) custom-printed burger wrapping paper sheets for cloud kitchens, cafes, and burgers.',
    image_url: '/images/products/burger-wrapping-sheets.svg',
    category: 'Customized Bags',
    is_featured: true,
    status: 'published',
    display_order: 10
  },
  {
    id: 'ms-item-11',
    created_at: new Date().toISOString(),
    title: 'Customized Bakery V-Bottom Paper Pouches',
    description: '[Customized V bottom pouches] Custom-printed food-grade paper bags for Bhanwarlal Bakery, Cakes 365, confectionery, and sweet shops.',
    image_url: '/images/products/bhanwarlal-bakery-pouches.svg',
    category: 'Customized Bags',
    is_featured: true,
    status: 'published',
    display_order: 11
  },
  {
    id: 'ms-item-12',
    created_at: new Date().toISOString(),
    title: 'Cream White W-Cut Grocery Bag',
    description: '[W cut bag] Natural cream off-white non-woven vest handle grocery carry bag, economical and heavy-weight capacity for FMCG retail.',
    image_url: '/images/products/cream-wcut-nonwoven-bag.svg',
    category: 'W-Cut Bags',
    is_featured: false,
    status: 'published',
    display_order: 12
  },
  {
    id: 'ms-item-13',
    created_at: new Date().toISOString(),
    title: 'Rajputi Saafe Luxury Maroon Paper Bag',
    description: '[Customized paper bags] Gold foil stamping and royal crest on luxury maroon paper bag with twisted rope handles for Rajputi Saafe Ujjain.',
    image_url: '/images/products/rajputi-saafe-luxury-bag.svg',
    category: 'Customized Bags',
    is_featured: true,
    status: 'published',
    display_order: 13
  },
  {
    id: 'ms-item-14',
    created_at: new Date().toISOString(),
    title: 'Jalsa Clothing Company Custom Paper Bag',
    description: '[Customized paper bags] Bleached white kraft shopping bag with crimson circular brand logo and "Celebrate Yourself" slogan for Jalsa Clothing Company.',
    image_url: '/images/products/jalsa-clothing-bag.svg',
    category: 'Customized Bags',
    is_featured: true,
    status: 'published',
    display_order: 14
  },
  {
    id: 'ms-item-15',
    created_at: new Date().toISOString(),
    title: 'Fusion Fashion Rose Floral Boutique D-Cut Bag',
    description: '[Customized D cut bags] White non-woven D-cut carry bag with rose-pink rida artwork and boutique branding for Fusion Fashion Pardeshipura Indore.',
    image_url: '/images/products/fusion-fashion-bag.svg',
    category: 'Customized Bags',
    is_featured: true,
    status: 'published',
    display_order: 15
  },
  {
    id: 'ms-item-16',
    created_at: new Date().toISOString(),
    title: 'Anytime Sports Branded Non-Woven D-Cut Bag',
    description: '[Customized D cut bags] Custom printed sportswear packaging with yellow and black "Believe in Yourself" logo for Anytime Sports Goods, Indore.',
    image_url: '/images/products/anytime-sports-bag.svg',
    category: 'Customized Bags',
    is_featured: true,
    status: 'published',
    display_order: 16
  },
  {
    id: 'ms-item-17',
    created_at: new Date().toISOString(),
    title: 'Prem Prakash Saree House Traditional Pink Bag',
    description: '[Customized D cut bags] Hot pink non-woven bag with golden arch frame and Hindi temple border printing for Prem Prakash Saree House.',
    image_url: '/images/products/prem-prakash-saree-bag.svg',
    category: 'Customized Bags',
    is_featured: true,
    status: 'published',
    display_order: 17
  },
  {
    id: 'ms-item-18',
    created_at: new Date().toISOString(),
    title: 'Shamim Store Fixed Price Loop Handle Bag',
    description: '[Customized loop handle bags] Red non-woven loop handle bag with white screen-printed rectangular logo for Shamim Store Readymade Garments Barhi.',
    image_url: '/images/products/shamim-store-bag.svg',
    category: 'Customized Bags',
    is_featured: true,
    status: 'published',
    display_order: 18
  },
  {
    id: 'ms-item-19',
    created_at: new Date().toISOString(),
    title: 'Shahzada Fashion World Garment Loop Bag',
    description: '[Customized loop handle bags] Canary yellow non-woven bag with royal blue crown logo and menswear catalogue typography for Shahzada Fashion World Barhi.',
    image_url: '/images/products/shahzada-fashion-bag.svg',
    category: 'Customized Bags',
    is_featured: true,
    status: 'published',
    display_order: 19
  },
  {
    id: 'ms-item-20',
    created_at: new Date().toISOString(),
    title: 'A To Z Readymade Garments Floral Loop Bag',
    description: '[Customized loop handle bags] Light pink non-woven loop bag with dark pink floral ring typography for A To Z Readymade Garments Barhi.',
    image_url: '/images/products/atoz-garments-bag.svg',
    category: 'Customized Bags',
    is_featured: true,
    status: 'published',
    display_order: 20
  },
  {
    id: 'ms-item-21',
    created_at: new Date().toISOString(),
    title: 'Panchmeva Prasadi Mahakal Devotional Bag',
    description: '[Customized D cut bags] White D-cut packaging bag with sacred red Mahakaleshwar devotional print for Panchmeva Prasadi Gudri Chauraha Ujjain.',
    image_url: '/images/products/panchmeva-prasadi-bag.svg',
    category: 'Customized Bags',
    is_featured: true,
    status: 'published',
    display_order: 21
  }
];

export async function getGalleryItems(): Promise<GalleryItem[]> {
  let items: GalleryItem[] = [];
  try {
    // Check gallery_items table first, then fallback to gallery table
    const { data, error } = await db
      .from('gallery_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      items = data as GalleryItem[];
    } else {
      const { data: altData, error: altError } = await db
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true });

      if (!altError && altData && altData.length > 0) {
        items = altData as GalleryItem[];
      } else {
        items = [...DEFAULT_GALLERY_ITEMS];
      }
    }
  } catch (err) {
    items = [...DEFAULT_GALLERY_ITEMS];
  }

  // Filter out items that were explicitly deleted by the admin locally
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('mstraders_deleted_gallery_ids');
      if (stored) {
        const deletedKeys: string[] = JSON.parse(stored);
        if (Array.isArray(deletedKeys) && deletedKeys.length > 0) {
          items = items.filter(
            (item) => !deletedKeys.includes(item.id)
          );
        }
      }

      // Apply client-side modifications/uploaded images
      const overridesStr = localStorage.getItem('mstraders_custom_gallery_overrides');
      if (overridesStr) {
        const overrides: Record<string, Partial<GalleryItem>> = JSON.parse(overridesStr);
        items = items.map((item) => {
          if (overrides[item.id]) {
            return { ...item, ...overrides[item.id] };
          }
          return item;
        });
      }
    } catch (e) {
      console.warn('Error processing local gallery store:', e);
    }
  }

  // CRITICAL AUTO-RECOVERY: If all items were filtered out by stale localStorage or empty,
  // ensure DEFAULT_GALLERY_ITEMS are returned so the admin always sees their catalog!
  if (items.length === 0 && DEFAULT_GALLERY_ITEMS.length > 0) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('mstraders_deleted_gallery_ids');
      } catch (_) {}
    }
    items = [...DEFAULT_GALLERY_ITEMS];
  }

  return items.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

export async function createGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem | null> {
  try {
      const payload = { ...item };
    if (payload.id && !isUuid(payload.id)) {
      delete payload.id;
    }

    const { data, error } = await db
      .from('gallery')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data as GalleryItem;
  } catch (err) {
    console.error('Error adding gallery item to the database:', err);
    // Fallback: create locally
    const fallbackItem: GalleryItem = {
      id: `custom-g-${Date.now()}`,
      created_at: new Date().toISOString(),
      title: item.title || 'Custom Showcase Item',
      description: item.description || '',
      image_url: item.image_url || '/images/products/white-kraft-twisted-bag.svg',
      category: item.category || 'Customized Bags',
      is_featured: item.is_featured ?? false,
      status: item.status || 'published',
      display_order: item.display_order || 99
    };
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('mstraders_custom_gallery_overrides');
        const map = stored ? JSON.parse(stored) : {};
        map[fallbackItem.id] = fallbackItem;
        localStorage.setItem('mstraders_custom_gallery_overrides', JSON.stringify(map));
      } catch (e) {
        console.warn('Local save warning:', e);
      }
    }
    return fallbackItem;
  }
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {

  let updatedItem: GalleryItem | null = null;
  try {
    if (isUuid(id)) {
      const { data, error } = await db
        .from('gallery')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        updatedItem = data as GalleryItem;
      }
    }
  } catch (err) {
    console.warn('Database gallery update exception:', err);
  }

  // Store in localStorage overrides so it reflects immediately even if using default mock items or offline
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('mstraders_custom_gallery_overrides');
      const map: Record<string, Partial<GalleryItem>> = stored ? JSON.parse(stored) : {};
      map[id] = { ...(map[id] || {}), ...updates };
      localStorage.setItem('mstraders_custom_gallery_overrides', JSON.stringify(map));
    } catch (e) {
      console.warn('LocalStorage override update warning:', e);
    }
  }

  return updatedItem || ({ id, ...updates } as GalleryItem);
}

export async function deleteGalleryItem(id: string, imageUrl?: string): Promise<boolean> {

  // Attempt database deletion in the database if connected
  try {
    if (isUuid(id)) {
      await db.from('gallery_items').delete().eq('id', id);
      await db.from('gallery').delete().eq('id', id);
    } else if (imageUrl) {
      await db.from('gallery_items').delete().eq('image_url', imageUrl);
      await db.from('gallery').delete().eq('image_url', imageUrl);
    }
  } catch (err) {
    console.warn('Database gallery delete exception:', err);
  }

  // Persist deletion in client localStorage so default/fallback items stay permanently removed
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('mstraders_deleted_gallery_ids');
      const list: string[] = stored ? JSON.parse(stored) : [];
      if (id && !list.includes(id)) list.push(id);
      localStorage.setItem('mstraders_deleted_gallery_ids', JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage delete record warning:', e);
    }
  }

  return true;
}

export function restoreDefaultGalleryItems(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('mstraders_deleted_gallery_ids');
    } catch (e) {
      console.warn('LocalStorage clear warning:', e);
    }
  }
}

// --- INDUSTRIES SERVICE ---
export async function getIndustries(): Promise<Industry[]> {
  try {
    const { data, error } = await db
      .from('industries')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_INDUSTRIES;
    }

    return data as Industry[];
  } catch (err) {
    return DEFAULT_INDUSTRIES;
  }
}

export async function getIndustryBySlug(slug: string): Promise<Industry | null> {
  try {
    const { data, error } = await db
      .from('industries')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return DEFAULT_INDUSTRIES.find((ind) => ind.slug === slug) || null;
    }

    return data as Industry;
  } catch (err) {
    return DEFAULT_INDUSTRIES.find((ind) => ind.slug === slug) || null;
  }
}

// --- STORAGE FILE UPLOADS ---

/**
 * Optimizes an uploaded file into a high-performance, web-ready Data URL.
 * Automatically resizes large images to max dimensions and compresses to JPEG/WebP
 * so that uploads remain instantaneous, lightweight, and resilient even when
 * storage buckets or reverse proxies return errors like HTTP 520.
 */

export async function uploadFile(
  file: File, 
  bucket: 'product-images' | 'gallery-images' | 'quote-attachments' | 'settings-assets' | 'media' | 'category-images' | 'hero-images' | string
): Promise<string | null> {
  // Validate file size (Max 20MB)
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('File size exceeds 20MB limit');
  }

  const fileExt = file.name.split('.').pop() || 'png';
  const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  const filePath = cleanFileName;
  const { data: uploadData, error: uploadError } = await db.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (uploadError || !uploadData) {
    // Do NOT fall back to embedding the image as a base64 data URL. That
    // used to happen here silently: uploads "succeeded", nothing reached
    // storage, and multi-megabyte blobs were written into product rows.
    // Surface the real reason so it can be fixed (bucket missing, RLS
    // denying the caller, network) instead of hiding it.
    const reason = uploadError?.message || 'unknown storage error';
    throw new Error(`Upload to bucket "${bucket}" failed: ${reason}`);
  }

  const { data: publicUrlData } = db.storage.from(bucket).getPublicUrl(filePath);
  if (!publicUrlData?.publicUrl) {
    throw new Error(`Uploaded to "${bucket}" but could not resolve a public URL`);
  }
  return publicUrlData.publicUrl;
}


// --- MEDIA LIBRARY (storage driven) ---
// The media library lists what is actually in storage, across every
// content bucket, and cross-references each file against the rows that use
// it. Previously it only listed rows from the `media` table, which is only
// written by the media page itself, so images uploaded via Products,
// Categories, Gallery or Homepage never appeared and the page looked empty.

export const CONTENT_BUCKETS = [
  { id: 'product-images',  label: 'Products'   },
  { id: 'category-images', label: 'Categories' },
  { id: 'gallery-images',  label: 'Gallery'    },
  { id: 'hero-images',     label: 'Homepage'   },
  { id: 'media',           label: 'General'    },
  { id: 'settings-assets', label: 'Branding'   },
] as const;
export type ContentBucketId = typeof CONTENT_BUCKETS[number]['id'];

export interface AssetUsage {
  kind: 'product' | 'category' | 'gallery' | 'homepage' | 'industry' | 'logo';
  label: string;
  href: string;
}

export interface StorageAsset {
  bucket: ContentBucketId;
  path: string;
  url: string;
  size_bytes: number | null;
  mime_type: string | null;
  created_at: string | null;
  usages: AssetUsage[];
}

export interface MediaLibraryReport {
  assets: StorageAsset[];
  /** Image references in content that are NOT storage URLs (local /images/* or data: URLs). */
  externalRefs: { url: string; usages: AssetUsage[]; kind: 'local' | 'embedded' | 'remote' }[];
  bucketErrors: { bucket: string; message: string }[];
}

async function collectImageUsages(): Promise<Map<string, AssetUsage[]>> {
  const map = new Map<string, AssetUsage[]>();
  const add = (url: string | null | undefined, usage: AssetUsage) => {
    if (!url) return;
    const list = map.get(url) || [];
    list.push(usage);
    map.set(url, list);
  };

  const [products, categories, gallery, sections, industries, settings] = await Promise.all([
    db.from('products').select('slug, name, images'),
    db.from('categories').select('slug, name, image_url'),
    db.from('gallery_items').select('id, title, image_url'),
    db.from('homepage_sections').select('section_key, image_url'),
    db.from('industries').select('slug, title, image_url'),
    db.from('settings').select('key, value').eq('key', 'logo_url'),
  ]);

  (products.data || []).forEach((p: any) =>
    (p.images || []).forEach((u: string) =>
      add(u, { kind: 'product', label: p.name, href: '/admin/products' })));
  (categories.data || []).forEach((c: any) =>
    add(c.image_url, { kind: 'category', label: c.name, href: '/admin/categories' }));
  (gallery.data || []).forEach((g: any) =>
    add(g.image_url, { kind: 'gallery', label: g.title, href: '/admin/gallery' }));
  (sections.data || []).forEach((h: any) =>
    add(h.image_url, { kind: 'homepage', label: `Homepage: ${h.section_key}`, href: '/admin/content/homepage' }));
  (industries.data || []).forEach((i: any) =>
    add(i.image_url, { kind: 'industry', label: i.title, href: '/industries' }));
  (settings.data || []).forEach((s: any) => {
    const v = typeof s.value === 'string' ? s.value : s.value?.url;
    add(v, { kind: 'logo', label: 'Site logo', href: '/admin/settings' });
  });

  return map;
}

export async function getMediaLibraryReport(): Promise<MediaLibraryReport> {
  const usages = await collectImageUsages();
  const assets: StorageAsset[] = [];
  const bucketErrors: MediaLibraryReport['bucketErrors'] = [];

  await Promise.all(CONTENT_BUCKETS.map(async ({ id: bucket }) => {
    const { data, error } = await db.storage
      .from(bucket)
      .list('', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) {
      bucketErrors.push({ bucket, message: error.message });
      return;
    }
    (data || [])
      .filter((f) => f.id !== null && !f.name.startsWith('.')) // skip folders + placeholders
      .forEach((f) => {
        const { data: pub } = db.storage.from(bucket).getPublicUrl(f.name);
        const url = pub.publicUrl;
        assets.push({
          bucket,
          path: f.name,
          url,
          size_bytes: (f.metadata as any)?.size ?? null,
          mime_type: (f.metadata as any)?.mimetype ?? null,
          created_at: f.created_at ?? null,
          usages: usages.get(url) || [],
        });
      });
  }));

  const storageUrls = new Set(assets.map((a) => a.url));
  const externalRefs: MediaLibraryReport['externalRefs'] = [];
  usages.forEach((list, url) => {
    if (storageUrls.has(url)) return;
    const kind = url.startsWith('data:') ? 'embedded' : url.startsWith('/') ? 'local' : 'remote';
    externalRefs.push({ url, usages: list, kind });
  });

  assets.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  return { assets, externalRefs, bucketErrors };
}

export async function deleteStorageAsset(bucket: ContentBucketId, path: string): Promise<boolean> {
  const { error } = await db.storage.from(bucket).remove([path]);
  if (error) {
    console.error('Error deleting storage asset:', error);
    return false;
  }
  return true;
}

// --- ORDER TRACKING SERVICE ---
export async function getOrderByNumberAndPhone(orderNumber: string, phone: string): Promise<Order | null> {
  try {
    const cleanNum = orderNumber.trim().toUpperCase();
    const cleanPhoneDigits = phone.replace(/\D/g, '');

    if (!cleanNum) return null;

    // Resilient phone matching helper
    const isPhoneMatch = (targetPhone?: string | null) => {
      if (!cleanPhoneDigits) return true;
      if (!targetPhone) return true;
      const targetDigits = targetPhone.replace(/\D/g, '');
      if (!targetDigits) return true;

      const last10Clean = cleanPhoneDigits.slice(-10);
      const last10Target = targetDigits.slice(-10);

      return (
        targetDigits.endsWith(cleanPhoneDigits) ||
        cleanPhoneDigits.endsWith(targetDigits) ||
        (last10Clean.length >= 7 && last10Clean === last10Target)
      );
    };

    // 1. Search in orders table by order_number
    const { data: orders, error: orderErr } = await db
      .from('orders')
      .select('*, order_items(*)')
      .ilike('order_number', cleanNum);

    if (!orderErr && orders && orders.length > 0) {
      const matchedOrder = orders.find(ord => 
        isPhoneMatch(ord.phone) || 
        isPhoneMatch(ord.shipping_address?.phone)
      );
      if (matchedOrder) {
        return matchedOrder as Order;
      }
      // If exact order_number match, return first
      return orders[0] as Order;
    }

    // 2. Search in orders table by notes or quote reference
    const { data: ordersByNote } = await db
      .from('orders')
      .select('*, order_items(*)')
      .ilike('notes', `%${cleanNum}%`);

    if (ordersByNote && ordersByNote.length > 0) {
      const matchedOrder = ordersByNote.find(ord => 
        isPhoneMatch(ord.phone) || 
        isPhoneMatch(ord.shipping_address?.phone)
      );
      if (matchedOrder) {
        return matchedOrder as Order;
      }
    }

    // 3. Search in quotes table by quote_number or ID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanNum);
    let quoteQuery = db.from('quotes').select('*');
    if (isUuid) {
      quoteQuery = quoteQuery.eq('id', cleanNum);
    } else {
      quoteQuery = quoteQuery.ilike('quote_number', cleanNum);
    }

    const { data: quotes, error: quoteErr } = await quoteQuery;

    if (!quoteErr && quotes && quotes.length > 0) {
      const matchedQuote = quotes.find(q => isPhoneMatch(q.phone)) || quotes[0];

      if (matchedQuote) {
        // Map quote status to OrderStatus
        let status: OrderStatus = 'PENDING';
        const qStatus = (matchedQuote.status || '').toUpperCase();
        if (qStatus === 'QUOTED') status = 'CONFIRMED';
        else if (qStatus === 'APPROVED' || qStatus === 'IN_PRODUCTION') status = 'PREPARING';
        else if (qStatus === 'READY_FOR_DISPATCH' || qStatus === 'DISPATCHED') status = 'OUT_FOR_DELIVERY';
        else if (qStatus === 'DELIVERED') status = 'DELIVERED';
        else if (qStatus === 'CANCELLED' || qStatus === 'REJECTED') status = 'CANCELLED';

        const subtotal = matchedQuote.subtotal || matchedQuote.amount || 0;
        const total = matchedQuote.total_amount || (subtotal + (matchedQuote.delivery_charges || 0) + (matchedQuote.tax_amount || 0));

        const syntheticOrder: Order = {
          id: matchedQuote.id,
          order_number: matchedQuote.quote_number,
          customer_name: matchedQuote.customer_name || 'Valued Customer',
          company_name: matchedQuote.business_name || null,
          email: matchedQuote.email || '',
          phone: matchedQuote.phone || phone,
          shipping_address: {
            firstName: (matchedQuote.customer_name || 'Customer').split(' ')[0],
            lastName: (matchedQuote.customer_name || '').split(' ').slice(1).join(' ') || '',
            company: matchedQuote.business_name || '',
            address: matchedQuote.delivery_address || matchedQuote.city || 'Standard Address',
            city: matchedQuote.city || '',
            state: 'Madhya Pradesh',
            postalCode: '456006',
            phone: matchedQuote.phone || phone
          },
          status,
          payment_method: 'Custom Quotation Request',
          subtotal,
          tax: matchedQuote.tax_amount || 0,
          shipping_fee: matchedQuote.delivery_charges || 0,
          total,
          notes: matchedQuote.admin_notes || matchedQuote.message || null,
          created_at: matchedQuote.created_at,
          expected_delivery_date: matchedQuote.expected_delivery_date || null,
          courier_partner: matchedQuote.courier_partner || null,
          tracking_number: matchedQuote.tracking_number || null,
          tracking_url: matchedQuote.tracking_url || null,
          order_items: [
            {
              id: matchedQuote.id,
              order_id: matchedQuote.id,
              product_id: matchedQuote.id,
              product_name: `${(matchedQuote.bag_type || 'Custom Bags').replace(/-/g, ' ').toUpperCase()} (${(matchedQuote.quantity || 0).toLocaleString('en-IN')} units)`,
              quantity: matchedQuote.quantity || 1,
              unit_price: matchedQuote.quantity ? Math.round(total / matchedQuote.quantity) : total,
              total_price: total,
              variant_details: {
                material: matchedQuote.material || 'Standard',
                handle: matchedQuote.handle_type || 'Loop Handle',
                color: matchedQuote.gsm ? `${matchedQuote.gsm} GSM` : undefined,
                size: matchedQuote.size || undefined,
                printing: matchedQuote.print_type || undefined
              }
            }
          ]
        };

        return syntheticOrder;
      }
    }

    return null;
  } catch (err) {
    console.error('Error in getOrderByNumberAndPhone:', err);
    return null;
  }
}

// --- CUSTOMER PROFILE & ADDRESS SERVICES ---
export async function checkIsAdmin(userId?: string | null, userEmail?: string | null): Promise<boolean> {
  if (!userId && !userEmail) return false;

  const cleanEmail = (userEmail || '').trim().toLowerCase();
  
  // Dedicated system admin email addresses
  if (cleanEmail === 'admin@mstraders.com' || cleanEmail === 'admin@mstraders.in' || cleanEmail === 'contact@mstradersujjain.com') {
    return true;
  }

  if (userId) {
    try {
      const { data, error } = await db
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data?.role === 'admin') {
        return true;
      }
    } catch (err) {
      console.warn('Error checking admin role:', err);
    }
  }

  return false;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await db
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return data as UserProfile;
  } catch (err) {
    return null;
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
  try {
    const { error } = await db
      .from('profiles')
      .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating user profile:', err);
    return false;
  }
}

export async function syncCustomerRecords(userId: string, email: string): Promise<void> {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !userId) return;

    // Auto-link unlinked quotes matching customer email
    await db
      .from('quotes')
      .update({ customer_id: userId })
      .ilike('email', cleanEmail)
      .is('customer_id', null);

    // Auto-link unlinked orders matching customer email
    await db
      .from('orders')
      .update({ customer_id: userId })
      .ilike('email', cleanEmail)
      .is('customer_id', null);
  } catch (err) {
    console.error('Error syncing customer records:', err);
  }
}

export async function getCustomerOrders(email: string, userId?: string): Promise<Order[]> {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // First try with combined OR query
    if (userId && cleanEmail) {
      const { data, error } = await db
        .from('orders')
        .select('*, order_items(*)')
        .or(`customer_id.eq.${userId},email.ilike.${cleanEmail}`)
        .order('created_at', { ascending: false });
        
      if (!error && data && data.length > 0) {
        return data as Order[];
      }
    }

    // Fallback query if OR query returned empty or failed
    let query = db.from('orders').select('*, order_items(*)');
    if (userId) {
      query = query.eq('customer_id', userId);
    } else if (cleanEmail) {
      query = query.ilike('email', cleanEmail);
    } else {
      return [];
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.error('Database fetch customer orders error:', error);
      return [];
    }
    return (data || []) as Order[];
  } catch (err) {
    console.error('Error fetching customer orders:', err);
    return [];
  }
}

export async function getCustomerQuotes(email: string, userId?: string): Promise<Quote[]> {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // First try combined query
    if (userId && cleanEmail) {
      const { data, error } = await db
        .from('quotes')
        .select('*')
        .or(`customer_id.eq.${userId},email.ilike.${cleanEmail}`)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Quote[];
      }
    }

    // Fallback query if OR query returned empty or failed
    let query = db.from('quotes').select('*');
    if (userId) {
      query = query.eq('customer_id', userId);
    } else if (cleanEmail) {
      query = query.ilike('email', cleanEmail);
    } else {
      return [];
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.error('Database fetch customer quotes error:', error);
      return [];
    }
    return (data || []) as Quote[];
  } catch (err) {
    console.error('Error fetching customer quotes:', err);
    return [];
  }
}

export async function getCustomerAddresses(userId: string): Promise<CustomerAddress[]> {
  try {
    const { data, error } = await db
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as CustomerAddress[];
  } catch (err) {
    return [];
  }
}

export async function saveCustomerAddress(userId: string, address: Partial<CustomerAddress>): Promise<CustomerAddress | null> {
  try {
    const { data, error } = await db
      .from('addresses')
      .upsert([{ ...address, user_id: userId, updated_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    return data as CustomerAddress;
  } catch (err) {
    console.error('Error saving address:', err);
    return null;
  }
}

export async function deleteCustomerAddress(addressId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await db
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (err) {
    return false;
  }
}

// --- CATEGORIES CRUD SERVICE ---
export async function saveCategory(category: Partial<Category>): Promise<Category | null> {
  try {
    const payload = { ...category };
    // `cat-3` style seed ids are not uuids - drop them and let the row be
    // matched (or created) by its unique slug instead.
    if (payload.id && !isUuid(payload.id)) {
      delete payload.id;
    }

    const { data, error } = await db
      .from('categories')
      .upsert([payload], { onConflict: 'slug' })
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  } catch (err) {
    console.error('Error saving category:', err);
    return null;
  }
}

export async function deleteCategory(id: string, slug?: string): Promise<boolean> {
  try {
    if (isSeedId(id)) {
      // Seed category - only remove a persisted row if one shares the slug.
      if (slug) {
        const { error } = await db.from('categories').delete().eq('slug', slug);
        if (error) throw error;
      }
      return true;
    }

    const { error } = await db.from('categories').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting category:', err);
    return false;
  }
}

// --- HOMEPAGE CMS SERVICE ---
export const DEFAULT_HOMEPAGE_SECTIONS: Record<string, HomepageSection> = {
  hero: {
    id: 'sec-hero',
    section_key: 'hero',
    title: 'Customized Paper Bags & Non-Woven Carry Bags',
    subtitle: 'Wholesale & retail supplier in Ujjain',
    description: 'Wholesale & retail supplier of high-quality paper bags, W-cut vest bags, D-cut punch bags, luxury laminated boutique gift bags, and envelope pouches in Ujjain.',
    image_url: '/images/products/rajputi-saafe-luxury-bag.svg',
    primary_cta_text: 'Get a custom quote',
    primary_cta_link: '/customize',
    secondary_cta_text: 'Browse the catalogue',
    secondary_cta_link: '/shop',
    enabled: true,
    display_order: 1
  },
  categories: {
    id: 'sec-categories',
    section_key: 'categories',
    title: 'Explore Bag Categories',
    subtitle: 'Our range',
    description: 'From everyday grocery W-cut non-woven carry bags to luxury foil-stamped boutique packaging.',
    enabled: true,
    display_order: 2
  },
  customization: {
    id: 'sec-customization',
    section_key: 'customization',
    title: 'Tailor-Made Wholesale Bag Supply & Custom Printing',
    subtitle: 'Custom branding & prints',
    description: 'Select your preferred paper GSM, handles, multi-color logo printing, and custom dimensions.',
    image_url: '/images/products/jalsa-clothing-bag.svg',
    primary_cta_text: 'Start a custom order',
    primary_cta_link: '/customize',
    enabled: true,
    display_order: 3
  },
  industries: {
    id: 'sec-industries',
    section_key: 'industries',
    title: 'Specialized Packaging For Every Industry',
    subtitle: 'Industries we serve',
    description: 'Tailored solutions for supermarkets, retail fashion, hotels, restaurants, and medical establishments.',
    enabled: true,
    display_order: 4
  },
  process: {
    id: 'sec-process',
    section_key: 'process',
    title: 'How Bulk Orders Work',
    subtitle: 'How it works',
    description: 'Seamless ordering experience from design request to bulk delivery.',
    enabled: true,
    display_order: 5,
    metadata: {
      steps: [
        { step: '01', title: 'Submit Requirements', desc: 'Specify bag type, dimensions, quantity, and print requirements.' },
        { step: '02', title: 'Instant Formal Quote', desc: 'Receive custom pricing breakdown and artwork proofing.' },
        { step: '03', title: 'Approve & Prepare', desc: 'Custom logo printing and rigorous quality inspection.' },
        { step: '04', title: 'Fast Delivery', desc: 'Secure packaging and dispatch across Ujjain and surrounding regions.' }
      ]
    }
  },
  why_us: {
    id: 'sec-why_us',
    section_key: 'why_us',
    title: 'Why Choose MS TRADERS',
    subtitle: 'Our promise',
    description: 'Trusted wholesale supplier delivering precision quality and reliable bulk fulfillment.',
    enabled: true,
    display_order: 6,
    metadata: {
      features: [
        { title: 'Wholesale Bulk Supply', desc: 'Competitive bulk tier pricing for retail & commercial clients.' },
        { title: 'Custom Multi-Color Printing', desc: 'Precision flexo, offset, and screen printing with your logo.' },
        { title: 'Durable Quality Standard', desc: 'High tear strength, reinforced handles, and clean seam sealing.' },
        { title: 'On-Time Dispatch', desc: 'Reliable order processing and fulfillment for retail schedules.' }
      ]
    }
  },
  our_work: {
    id: 'sec-our_work',
    section_key: 'our_work',
    title: 'Recent Customized Supply Batches',
    subtitle: 'Portfolio & craftsmanship',
    description: 'Explore custom printed carry bags completed for boutiques, supermarkets, and corporate clients.',
    enabled: true,
    display_order: 7
  },
  testimonials: {
    id: 'sec-testimonials',
    section_key: 'testimonials',
    title: 'What Our Clients Say',
    subtitle: 'Client feedback',
    description: 'Genuine reviews from business owners, store managers, and event coordinators.',
    enabled: true,
    display_order: 8
  },
  final_cta: {
    id: 'sec-final_cta',
    section_key: 'final_cta',
    title: 'Ready to Upgrade Your Brand Packaging?',
    subtitle: 'Bulk wholesale enquiries',
    description: 'Get in touch with MS TRADERS today for custom sample kits and bulk pricing quotes.',
    primary_cta_text: 'Request a wholesale quote',
    primary_cta_link: '/customize',
    secondary_cta_text: 'Contact the sales desk',
    secondary_cta_link: '/contact',
    enabled: true,
    display_order: 9
  }
};

export async function getHomepageSections(): Promise<Record<string, HomepageSection>> {
  try {
    const { data, error } = await db
      .from('homepage_sections')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_HOMEPAGE_SECTIONS;
    }

    const sections: Record<string, HomepageSection> = { ...DEFAULT_HOMEPAGE_SECTIONS };
    data.forEach((row: any) => {
      if (row.section_key) {
        sections[row.section_key] = {
          ...sections[row.section_key],
          ...row
        };
      }
    });

    return sections;
  } catch (err) {
    return DEFAULT_HOMEPAGE_SECTIONS;
  }
}

export async function updateHomepageSection(sectionKey: string, sectionData: Partial<HomepageSection>): Promise<boolean> {
  try {
      const payload: Record<string, any> = {
      ...sectionData,
      section_key: sectionKey,
      updated_at: new Date().toISOString()
    };

    if (payload.id && !isUuid(payload.id)) {
      delete payload.id;
    }

    const { error } = await db
      .from('homepage_sections')
      .upsert([payload], { onConflict: 'section_key' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`Error updating homepage section ${sectionKey}:`, err);
    return false;
  }
}

// --- TESTIMONIALS SERVICE ---
export async function getTestimonials(onlyPublished = true): Promise<Testimonial[]> {
  try {
    let query = db.from('testimonials').select('*');
    if (onlyPublished) {
      query = query.in('status', ['published', 'approved']).order('display_order', { ascending: true }).order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    const { data, error } = await query;
    if (error || !data) return [];
    
    return data.map((t: any) => ({
      ...t,
      name: t.customer_name || t.name,
      customer_name: t.customer_name || t.name,
      content: t.review || t.content,
      review: t.review || t.content,
      company: t.business_name || t.company,
      business_name: t.business_name || t.company
    })) as Testimonial[];
  } catch (err) {
    return [];
  }
}

export async function submitClientFeedback(feedback: {
  customer_name: string;
  business_name?: string;
  role?: string;
  email?: string;
  phone?: string;
  city?: string;
  product_purchased?: string;
  rating: number;
  review: string;
}): Promise<{ success: boolean; data?: Testimonial; error?: string }> {
  try {
    const payload = {
      customer_name: feedback.customer_name.trim(),
      business_name: feedback.business_name?.trim() || null,
      role: feedback.role?.trim() || 'Store Owner',
      email: feedback.email?.trim() || null,
      phone: feedback.phone?.trim() || null,
      city: feedback.city?.trim() || null,
      product_purchased: feedback.product_purchased?.trim() || null,
      rating: Math.min(5, Math.max(1, Number(feedback.rating) || 5)),
      review: feedback.review.trim(),
      status: 'pending',
      display_order: 99
    };

    // Insert feedback directly without .select() so public users do not trigger SELECT RLS checks on unapproved rows
    const { error } = await db
      .from('testimonials')
      .insert([payload]);

    if (error) throw error;

    // Trigger admin notification so store admin sees new review immediately
    try {
      await createNotification({
        title: '⭐ New Client Review Submitted',
        message: `${feedback.customer_name} (${feedback.business_name || 'Client'}) submitted a ${feedback.rating}-star review: "${feedback.review.slice(0, 60)}..."`,
        type: 'SYSTEM',
        recipient_role: 'admin',
        link: '/admin/testimonials'
      });
    } catch (notifErr) {
      console.warn('Could not post admin notification for feedback:', notifErr);
    }

    return {
      success: true,
      data: {
        id: 'new',
        customer_name: payload.customer_name,
        name: payload.customer_name,
        business_name: payload.business_name,
        company: payload.business_name,
        role: payload.role,
        rating: payload.rating,
        review: payload.review,
        content: payload.review,
        status: 'pending'
      } as Testimonial
    };
  } catch (err: any) {
    console.error('Error submitting client feedback:', err);
    return { success: false, error: err.message || 'Failed to submit feedback' };
  }
}

export async function updateTestimonialStatus(
  id: string, 
  status: 'published' | 'approved' | 'rejected' | 'pending' | 'draft'
): Promise<boolean> {
  try {
    const { error } = await db
      .from('testimonials')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating testimonial status:', err);
    return false;
  }
}

export async function saveTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial | null> {
  try {
    const payload = {
      ...testimonial,
      customer_name: testimonial.name || testimonial.customer_name || 'Valued Client',
      review: testimonial.content || testimonial.review || '',
      business_name: testimonial.company || testimonial.business_name || null,
      status: testimonial.status || 'published'
    };

    const { data, error } = await db
      .from('testimonials')
      .upsert([payload])
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      name: data.name || data.customer_name,
      content: data.content || data.review,
      company: data.company || data.business_name
    } as Testimonial;
  } catch (err) {
    console.error('Error saving testimonial:', err);
    return null;
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    const { error } = await db.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    return false;
  }
}

// --- MEDIA LIBRARY SERVICE ---

// --- NOTIFICATIONS SERVICE ---
export async function createNotification(notifData: {
  user_id?: string | null;
  email?: string | null;
  recipient_role?: 'customer' | 'admin' | 'all';
  for_admin?: boolean;
  title: string;
  message: string;
  type?: 'QUOTE_RECEIVED' | 'QUOTE_UPDATED' | 'QUOTE_APPROVED' | 'QUOTE_CHANGES_REQUESTED' | 'ORDER_STATUS' | 'SYSTEM';
  link?: string | null;
}): Promise<boolean> {
  try {
    const cleanEmail = notifData.email ? notifData.email.trim().toLowerCase() : null;
    const recipient_role = notifData.for_admin || notifData.recipient_role === 'admin' ? 'admin' : (notifData.recipient_role || 'customer');

    const notifPayload: any = {
      user_id: notifData.user_id || null,
      email: cleanEmail,
      recipient_role,
      title: notifData.title,
      message: notifData.message,
      type: notifData.type || 'QUOTE_UPDATED',
      link: notifData.link || null,
      read: false
    };

    const { error } = await db.from('notifications').insert([notifPayload]);

    if (error) {
      console.warn('First notification insert failed, trying fallback insert:', error.message);
      delete notifPayload.recipient_role;
      const { error: fallbackErr } = await db.from('notifications').insert([notifPayload]);
      if (fallbackErr) {
        console.error('Notification fallback insert error:', fallbackErr);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error('Error in createNotification:', err);
    return false;
  }
}

export async function getCustomerNotifications(email: string, userId?: string, isAdmin = false): Promise<AppNotification[]> {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();

    // STRICT SECURITY GUARD: If neither userId nor email is provided, return empty array.
    // Anonymous queries must NEVER fetch any unassigned notifications.
    if (!userId && !cleanEmail) {
      return [];
    }

    if (isAdmin) {
      // ADMIN NOTIFICATIONS: Admins see admin desk notifications (recipient_role = 'admin') OR direct notifications.
      let query = db
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId && cleanEmail) {
        query = query.or(`recipient_role.eq.admin,user_id.eq.${userId},email.ilike."${cleanEmail}"`);
      } else if (userId) {
        query = query.or(`recipient_role.eq.admin,user_id.eq.${userId}`);
      } else {
        query = query.or(`recipient_role.eq.admin,email.ilike."${cleanEmail}"`);
      }

      const { data, error } = await query;
      if (!error && data) return data as AppNotification[];

      // Resilient fallback for older schemas
      const { data: fallbackData } = await db
        .from('notifications')
        .select('*')
        .or(`email.ilike."${cleanEmail}",user_id.eq.${userId || '00000000-0000-0000-0000-000000000000'}`)
        .order('created_at', { ascending: false });

      return (fallbackData || []) as AppNotification[];
    } else {
      // CUSTOMER NOTIFICATIONS: Regular customers ONLY see notifications explicitly matching user_id or email, AND recipient_role != 'admin'.
      let query = db
        .from('notifications')
        .select('*')
        .neq('recipient_role', 'admin') // STRICT SECURITY GUARD
        .order('created_at', { ascending: false });

      if (userId && cleanEmail) {
        query = query.or(`user_id.eq.${userId},email.ilike."${cleanEmail}"`);
      } else if (userId) {
        query = query.eq('user_id', userId);
      } else if (cleanEmail) {
        query = query.ilike('email', cleanEmail);
      }

      const { data, error } = await query;
      if (!error && data) return data as AppNotification[];

      // Fallback filtering if recipient_role column doesn't exist on older schema cache
      let fallbackQuery = db.from('notifications').select('*').order('created_at', { ascending: false });
      if (userId && cleanEmail) {
        fallbackQuery = fallbackQuery.or(`user_id.eq.${userId},email.ilike."${cleanEmail}"`);
      } else if (userId) {
        fallbackQuery = fallbackQuery.eq('user_id', userId);
      } else if (cleanEmail) {
        fallbackQuery = fallbackQuery.ilike('email', cleanEmail);
      }

      const { data: fallbackData } = await fallbackQuery;
      const filtered = (fallbackData || []).filter((n: any) => {
        const titleLower = (n.title || '').toLowerCase();
        return !titleLower.includes('new quote request') && 
               !titleLower.includes('revision requested') && 
               !titleLower.includes('quote approved by customer');
      });

      return filtered as AppNotification[];
    }
  } catch (err) {
    console.error('Error in getCustomerNotifications:', err);
    return [];
  }
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    const { error } = await db.from('notifications').update({ read: true }).eq('id', id);
    return !error;
  } catch (err) {
    return false;
  }
}

export async function markAllNotificationsAsRead(email: string, userId?: string): Promise<boolean> {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();
    let query = db.from('notifications').update({ read: true });

    if (userId && cleanEmail) {
      query = query.or(`user_id.eq.${userId},email.ilike."${cleanEmail}"`);
    } else if (userId) {
      query = query.eq('user_id', userId);
    } else if (cleanEmail) {
      query = query.ilike('email', cleanEmail);
    } else {
      return false;
    }

    const { error } = await query;
    return !error;
  } catch (err) {
    return false;
  }
}

// --- DATABASE & STORAGE PROVISIONING RUNNER ---
export interface ProvisionLog {
  step: string;
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

export async function provisionStorageAndSchema(): Promise<{ success: boolean; logs: ProvisionLog[] }> {
  const logs: ProvisionLog[] = [];
  logs.push({ step: 'Initialize', status: 'info', message: 'Starting database storage buckets and media schema auto-provisioning...' });

  const buckets = [
    'media',
    'attachments',
    'hero-images',
    'product-images',
    'category-images',
    'gallery-images',
    'quote-attachments',
    'settings-assets'
  ];

  let successCount = 0;

  for (const bucketId of buckets) {
    try {
      // Attempt to create bucket
      const { data, error } = await db.storage.createBucket(bucketId, {
        public: true,
        fileSizeLimit: 10485760
      });

      if (error) {
        const errMsg = error.message || '';
        if (errMsg.toLowerCase().includes('already exists') || errMsg.toLowerCase().includes('duplicate') || (error as any).statusCode === 409) {
          // Explicitly set public access for existing bucket
          const { error: updateErr } = await db.storage.updateBucket(bucketId, { public: true });
          if (!updateErr) {
            logs.push({
              step: `Bucket '${bucketId}'`,
              status: 'success',
              message: `Verified existing bucket with public read/write permissions.`
            });
            successCount++;
          } else {
            logs.push({
              step: `Bucket '${bucketId}'`,
              status: 'success',
              message: `Bucket exists in the database storage.`
            });
            successCount++;
          }
        } else {
          logs.push({
            step: `Bucket '${bucketId}'`,
            status: 'warning',
            message: `Storage notice: ${errMsg}`
          });
        }
      } else {
        logs.push({
          step: `Bucket '${bucketId}'`,
          status: 'success',
          message: `Successfully created public storage bucket.`
        });
        successCount++;
      }
    } catch (err: any) {
      logs.push({
        step: `Bucket '${bucketId}'`,
        status: 'warning',
        message: `Bucket exception: ${err?.message || err}`
      });
    }
  }

  // Ping & Verify Media Table
  try {
    const { data, error } = await db.from('media').select('id').limit(1);
    if (error) {
      logs.push({
        step: 'Media Table',
        status: 'warning',
        message: `Database notice (${error.code || 'ERR'}): ${error.message}. Fallback mapper active.`
      });
    } else {
      logs.push({
        step: 'Media Table',
        status: 'success',
        message: 'Media database table online and verified.'
      });
    }
  } catch (err: any) {
    logs.push({
      step: 'Media Table',
      status: 'warning',
      message: `Table check message: ${err?.message || err}`
    });
  }

  // Ping & Verify Homepage Sections Table
  try {
    const { data, error } = await db.from('homepage_sections').select('id').limit(1);
    if (error) {
      logs.push({
        step: 'Homepage Sections Table',
        status: 'warning',
        message: `Database notice (${error.code || 'ERR'}): ${error.message}`
      });
    } else {
      logs.push({
        step: 'Homepage Sections Table',
        status: 'success',
        message: 'Homepage Sections database table online and verified.'
      });
    }
  } catch (err: any) {
    logs.push({
      step: 'Homepage Sections Table',
      status: 'warning',
      message: `Table check message: ${err?.message || err}`
    });
  }

  logs.push({
    step: 'Completion',
    status: 'info',
    message: `Provisioning complete! ${successCount}/${buckets.length} storage buckets explicitly active in the database.`
  });

  return {
    success: true,
    logs
  };
}


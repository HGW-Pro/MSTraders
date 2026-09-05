import fs from 'fs';
import path from 'path';

// Helper to write SVG
function writeSvg(filePath: string, svgContent: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, svgContent.trim());
}

// 1. Rajputi Saafe Ujjain Luxury Maroon Bag
const rajputiLuxuryBag = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4a0d16" />
      <stop offset="50%" stop-color="#67111f" />
      <stop offset="100%" stop-color="#3d0912" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5d77f" />
      <stop offset="50%" stop-color="#d4af37" />
      <stop offset="100%" stop-color="#aa820a" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background Studio Setting -->
  <rect width="800" height="800" fill="#f4ece1"/>
  <rect y="580" width="800" height="220" fill="#e2d2be"/>
  <line x1="0" y1="580" x2="800" y2="580" stroke="#cbb49c" stroke-width="3"/>

  <!-- Bag Body with Shadow -->
  <g filter="url(#shadow)">
    <!-- Rope Handles -->
    <path d="M 310 240 C 310 90, 490 90, 490 240" fill="none" stroke="#2b050c" stroke-width="22" stroke-linecap="round"/>
    <path d="M 310 240 C 310 90, 490 90, 490 240" fill="none" stroke="#841a29" stroke-width="14" stroke-dasharray="10,6" stroke-linecap="round"/>
    
    <!-- Bag Shape -->
    <!-- Left Gusset -->
    <polygon points="170,250 250,220 250,650 170,680" fill="#420a13"/>
    <!-- Damask pattern on left gusset -->
    <path d="M 180 280 Q 210 300 240 280 T 240 340 T 180 340 Z M 180 380 Q 210 400 240 380 T 240 440 T 180 440 Z M 180 480 Q 210 500 240 480 T 240 540 T 180 540 Z M 180 580 Q 210 600 240 580 T 240 640 T 180 640 Z" fill="url(#goldGrad)" opacity="0.35"/>

    <!-- Right Gusset -->
    <polygon points="630,250 550,220 550,650 630,680" fill="#420a13"/>
    <!-- Damask pattern on right gusset -->
    <path d="M 560 280 Q 590 300 620 280 T 620 340 T 560 340 Z M 560 380 Q 590 400 620 380 T 620 440 T 560 440 Z M 560 480 Q 590 500 620 480 T 620 540 T 560 540 Z M 560 580 Q 590 600 620 580 T 620 640 T 560 640 Z" fill="url(#goldGrad)" opacity="0.35"/>

    <!-- Front Face -->
    <polygon points="250,220 550,220 550,650 250,650" fill="url(#bgGrad)"/>
    
    <!-- Gold Eyelets for Handles -->
    <circle cx="310" cy="245" r="14" fill="url(#goldGrad)" stroke="#664d00" stroke-width="2"/>
    <circle cx="310" cy="245" r="7" fill="#1f0307"/>
    <circle cx="490" cy="245" r="14" fill="url(#goldGrad)" stroke="#664d00" stroke-width="2"/>
    <circle cx="490" cy="245" r="7" fill="#1f0307"/>

    <!-- Gold Foil Top Rim Accent -->
    <line x1="250" y1="222" x2="550" y2="222" stroke="url(#goldGrad)" stroke-width="4"/>

    <!-- Central Gold Medallion Logo -->
    <circle cx="400" cy="380" r="85" fill="none" stroke="url(#goldGrad)" stroke-width="4"/>
    <circle cx="400" cy="380" r="78" fill="#500c17" stroke="url(#goldGrad)" stroke-width="1.5"/>

    <!-- Royal Rajput Groom Silhouette -->
    <!-- Royal Turban (Safa) -->
    <path d="M 370 340 C 365 315, 410 295, 435 320 C 445 330, 440 345, 430 355 C 410 360, 380 355, 370 340 Z" fill="#d4263e"/>
    <circle cx="395" cy="325" r="7" fill="url(#goldGrad)"/>
    <!-- Face & Royal Beard -->
    <path d="M 380 345 C 380 375, 420 375, 420 345 Z" fill="#f7d4b2"/>
    <path d="M 380 355 C 385 375, 415 375, 420 355 C 420 378, 380 378, 380 355 Z" fill="#261c18"/>
    <!-- Royal Achkan Sherwani & Necklace -->
    <path d="M 360 410 C 370 380, 430 380, 440 410 Z" fill="#ffffff"/>
    <path d="M 375 390 Q 400 405 425 390" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>
    <path d="M 370 398 Q 400 415 430 398" fill="none" stroke="url(#goldGrad)" stroke-width="2"/>

    <!-- Gold Hindi Typography -->
    <text x="400" y="505" font-family="'Noto Sans Devanagari', 'Cinzel', serif" font-size="34" font-weight="bold" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="2">राजपूती साफे</text>
    
    <!-- Gold Underline Calligraphy flourish -->
    <path d="M 330 518 Q 400 528 470 518 Q 400 522 330 518" fill="url(#goldGrad)"/>

    <!-- Instagram Handle & Phone Numbers -->
    <text x="400" y="555" font-family="sans-serif" font-size="14" font-weight="600" fill="#f8e4a5" text-anchor="middle" letter-spacing="1">@ rajputisaafeujjain7773</text>
    <text x="400" y="580" font-family="sans-serif" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="1">9691869625 || 7999938263</text>
    <text x="400" y="605" font-family="sans-serif" font-size="12" font-weight="600" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="2">UJJAIN (M.P.)</text>
  </g>
</svg>`;

// 2. Jalsa Clothing Company White Kraft Bag
const jalsaBag = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#3c2f23" flood-opacity="0.25"/>
    </filter>
    <linearGradient id="whiteKraft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="80%" stop-color="#f9f7f4" />
      <stop offset="100%" stop-color="#ece8e1" />
    </linearGradient>
  </defs>

  <!-- Wooden Surface Background -->
  <rect width="800" height="800" fill="#e9ddcf"/>
  <rect y="590" width="800" height="210" fill="#cbb79d"/>

  <g filter="url(#softShadow)">
    <!-- Twisted Paper Handles -->
    <path d="M 320 220 C 320 80, 480 80, 480 220" fill="none" stroke="#d5cebe" stroke-width="18" stroke-linecap="round"/>
    <path d="M 320 220 C 320 80, 480 80, 480 220" fill="none" stroke="#f4efe6" stroke-width="12" stroke-dasharray="12,5" stroke-linecap="round"/>

    <!-- Bag Sides / 3D Perspective -->
    <polygon points="210,240 270,200 270,650 210,690" fill="#ded7cb"/>
    <polygon points="270,200 590,200 590,650 270,650" fill="url(#whiteKraft)"/>
    
    <!-- Serrated Top Rim -->
    <line x1="270" y1="200" x2="590" y2="200" stroke="#b5ad9e" stroke-width="3" stroke-dasharray="4,3"/>

    <!-- JALSA Circular Crimson Emblem -->
    <circle cx="430" cy="380" r="105" fill="none" stroke="#96172e" stroke-width="4.5"/>
    <circle cx="430" cy="380" r="97" fill="none" stroke="#96172e" stroke-width="1.5" stroke-dasharray="4,3"/>

    <!-- Arched Text TOP: CLOTHING COMPANY -->
    <path id="circlePathTop" d="M 345 380 A 85 85 0 0 1 515 380" fill="none"/>
    <text font-family="'Cinzel', 'Playfair Display', serif" font-size="13" font-weight="bold" fill="#96172e" letter-spacing="3">
      <textPath href="#circlePathTop" startOffset="50%" text-anchor="middle">CLOTHING COMPANY</textPath>
    </text>

    <!-- Center Motif: Floral Paisley -->
    <path d="M 430 335 C 418 350, 418 360, 430 365 C 442 360, 442 350, 430 335 Z" fill="#96172e"/>
    <path d="M 412 345 C 405 355, 412 365, 422 365" fill="none" stroke="#96172e" stroke-width="2.5"/>
    <path d="M 448 345 C 455 355, 448 365, 438 365" fill="none" stroke="#96172e" stroke-width="2.5"/>

    <!-- Main Bold Brand Name: JALSA -->
    <text x="430" y="420" font-family="'Playfair Display', Georgia, serif" font-size="52" font-style="italic" font-weight="900" fill="#96172e" text-anchor="middle" letter-spacing="1">JALSA</text>

    <!-- Arched Text BOTTOM: CLOTHING COMPANY -->
    <path id="circlePathBottom" d="M 515 385 A 85 85 0 0 1 345 385" fill="none"/>
    <text font-family="'Cinzel', 'Playfair Display', serif" font-size="12" font-weight="bold" fill="#96172e" letter-spacing="3">
      <textPath href="#circlePathBottom" startOffset="50%" text-anchor="middle">CLOTHING COMPANY</textPath>
    </text>

    <!-- Tagline: CELEBRATE YOURSELF -->
    <text x="430" y="525" font-family="sans-serif" font-size="16" font-weight="900" fill="#96172e" text-anchor="middle" letter-spacing="4">CELEBRATE YOURSELF</text>

    <!-- Address & Contact Information -->
    <text x="430" y="565" font-family="sans-serif" font-size="12" font-weight="700" fill="#4a423b" text-anchor="middle">📍 26/626 Rajendra Prasad Marg,</text>
    <text x="430" y="585" font-family="sans-serif" font-size="12" font-weight="700" fill="#4a423b" text-anchor="middle">Do Batti Ratlam, M. P. India</text>
    <text x="430" y="615" font-family="sans-serif" font-size="14" font-weight="800" fill="#96172e" text-anchor="middle">📞 9343310385</text>
  </g>
</svg>`;

// 3. Fusion Fashion White D-Cut Bag
const fusionFashionBag = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <filter id="shadowD" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000" flood-opacity="0.2"/>
    </filter>
    <linearGradient id="nwTexture" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f4f5f8" />
    </linearGradient>
  </defs>

  <rect width="800" height="800" fill="#f8f4f0"/>

  <g filter="url(#shadowD)">
    <!-- Bag Rect -->
    <rect x="180" y="100" width="440" height="620" rx="14" fill="url(#nwTexture)" stroke="#e2e4e9" stroke-width="2"/>
    
    <!-- Top Hem Stitch Line -->
    <line x1="180" y1="130" x2="620" y2="130" stroke="#cbd0d8" stroke-width="2" stroke-dasharray="6,4"/>
    <!-- Bottom Hem Stitch Line -->
    <line x1="180" y1="690" x2="620" y2="690" stroke="#cbd0d8" stroke-width="2" stroke-dasharray="6,4"/>

    <!-- Oval D-Cut Punch Handle -->
    <rect x="330" y="145" width="140" height="42" rx="21" fill="#f8f4f0" stroke="#cbd0d8" stroke-width="3"/>

    <!-- Top Contact Headers -->
    <text x="210" y="220" font-family="sans-serif" font-size="12" font-weight="bold" fill="#333333">KANIZA MALAK</text>
    <text x="210" y="238" font-family="sans-serif" font-size="12" font-weight="600" fill="#555555">9303230521</text>

    <text x="590" y="220" font-family="sans-serif" font-size="12" font-weight="bold" fill="#333333" text-anchor="end">FATEMA MALAK</text>
    <text x="590" y="238" font-family="sans-serif" font-size="12" font-weight="600" fill="#555555" text-anchor="end">+919424830920</text>

    <!-- Pink Floral Geometric Diamond Frame -->
    <polygon points="400,270 510,380 400,490 290,380" fill="none" stroke="#e0658b" stroke-width="2" opacity="0.6"/>
    
    <!-- Stylized Bridal Modest Rida/Gown Figure in Rose Pink -->
    <path d="M 400 295 Q 408 305 408 320 Q 400 330 392 320 Z" fill="#d84d76"/>
    <path d="M 390 320 C 375 350, 360 410, 350 460 C 385 470, 415 470, 450 460 C 440 410, 425 350, 410 320 Z" fill="#d84d76" opacity="0.85"/>
    <path d="M 370 380 Q 400 395 430 380" stroke="#ffffff" stroke-width="2" fill="none"/>

    <!-- Quote -->
    <text x="525" y="340" font-family="'Playfair Display', cursive" font-size="11" font-style="italic" fill="#b0345b">Elegance</text>
    <text x="525" y="355" font-family="sans-serif" font-size="9" fill="#b0345b">is the only</text>
    <text x="525" y="370" font-family="sans-serif" font-size="9" fill="#b0345b">Beauty that</text>
    <text x="525" y="385" font-family="sans-serif" font-size="9" fill="#b0345b">never fades. ♡</text>

    <!-- Brand Name: Fusion Fashion -->
    <text x="400" y="535" font-family="'Brush Script MT', 'Great Vibes', 'Playfair Display', cursive" font-size="44" font-weight="bold" fill="#b02652" text-anchor="middle">Fusion Fashion</text>

    <!-- Services Bullet List -->
    <text x="400" y="570" font-family="sans-serif" font-size="12" font-weight="700" fill="#333333" text-anchor="middle">• Designer Rida •</text>
    <text x="400" y="590" font-family="sans-serif" font-size="11" font-weight="600" fill="#444444" text-anchor="middle">• Boutique Style Rida • Masallah Bag • Safra</text>
    <text x="400" y="608" font-family="sans-serif" font-size="11" font-weight="600" fill="#444444" text-anchor="middle">Set • Fancy Jodi</text>

    <!-- Address in Indore -->
    <text x="400" y="640" font-family="sans-serif" font-size="11" font-weight="bold" fill="#222222" text-anchor="middle">85, saifee nagar opposite garden</text>
    <text x="400" y="658" font-family="sans-serif" font-size="11" font-weight="bold" fill="#222222" text-anchor="middle">khatiwala tank Indore (M.P.)</text>
  </g>
</svg>`;

// 4. Brown Kraft Paper Bags with Twisted Handles (3 Sizes)
const kraftBagsTrio = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <linearGradient id="kraftBrown" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#cca073" />
      <stop offset="50%" stop-color="#b68858" />
      <stop offset="100%" stop-color="#9a6e3e" />
    </linearGradient>
    <linearGradient id="kraftDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a37648" />
      <stop offset="100%" stop-color="#7a5229" />
    </linearGradient>
    <filter id="drop3" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#2a1a0c" flood-opacity="0.3"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="#f5ede3"/>
  <rect y="600" width="800" height="200" fill="#e0d1c0"/>

  <g filter="url(#drop3)">
    <!-- 1. Large Bag (Back Left) -->
    <g>
      <path d="M 180 250 C 180 120, 290 120, 290 250" fill="none" stroke="#7a5229" stroke-width="14" stroke-linecap="round"/>
      <polygon points="90,260 130,220 130,640 90,670" fill="url(#kraftDark)"/>
      <polygon points="130,220 380,220 380,640 130,640" fill="url(#kraftBrown)"/>
      <line x1="130" y1="220" x2="380" y2="220" stroke="#7a5229" stroke-width="2" stroke-dasharray="4,3"/>
    </g>

    <!-- 2. Medium Bag (Right) -->
    <g>
      <path d="M 540 270 C 540 160, 640 160, 640 270" fill="none" stroke="#7a5229" stroke-width="14" stroke-linecap="round"/>
      <polygon points="460,280 500,240 500,660 460,690" fill="url(#kraftDark)"/>
      <polygon points="500,240 710,240 710,660 500,660" fill="url(#kraftBrown)"/>
      <line x1="500" y1="240" x2="710" y2="240" stroke="#7a5229" stroke-width="2" stroke-dasharray="4,3"/>
    </g>

    <!-- 3. Small Bag (Front Center) -->
    <g>
      <path d="M 270 380 C 270 280, 350 280, 350 380" fill="none" stroke="#7a5229" stroke-width="12" stroke-linecap="round"/>
      <polygon points="200,390 235,360 235,700 200,720" fill="url(#kraftDark)"/>
      <polygon points="235,360 410,360 410,700 235,700" fill="url(#kraftBrown)"/>
      <line x1="235" y1="360" x2="410" y2="360" stroke="#7a5229" stroke-width="2" stroke-dasharray="4,3"/>
    </g>
  </g>
</svg>`;

// 5. Tiered Kraft Grocery & Pharmacy Flat Bottom Pouches
const kraftGroceryPouches = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <linearGradient id="pouchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d6ab7d" />
      <stop offset="100%" stop-color="#9a6e3f" />
    </linearGradient>
    <filter id="pouchShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="4" dy="12" stdDeviation="14" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="#faf6f0"/>

  <g filter="url(#pouchShadow)">
    <!-- 7 Tiered Bags from Tallest to Smallest -->
    <!-- Bag 1 (Tallest) -->
    <polygon points="80,180 200,180 180,680 70,680" fill="url(#pouchGrad)"/>
    <line x1="80" y1="180" x2="200" y2="180" stroke="#68451f" stroke-width="3" stroke-dasharray="3,3"/>

    <!-- Bag 2 -->
    <polygon points="160,260 280,260 260,680 150,680" fill="url(#pouchGrad)"/>
    <line x1="160" y1="260" x2="280" y2="260" stroke="#68451f" stroke-width="3" stroke-dasharray="3,3"/>

    <!-- Bag 3 -->
    <polygon points="240,320 360,320 340,680 230,680" fill="url(#pouchGrad)"/>
    <line x1="240" y1="320" x2="360" y2="320" stroke="#68451f" stroke-width="3" stroke-dasharray="3,3"/>

    <!-- Bag 4 -->
    <polygon points="320,380 440,380 420,680 310,680" fill="url(#pouchGrad)"/>
    <line x1="320" y1="380" x2="440" y2="380" stroke="#68451f" stroke-width="3" stroke-dasharray="3,3"/>

    <!-- Bag 5 -->
    <polygon points="400,440 520,440 500,680 390,680" fill="url(#pouchGrad)"/>
    <line x1="400" y1="440" x2="520" y2="440" stroke="#68451f" stroke-width="3" stroke-dasharray="3,3"/>

    <!-- Bag 6 -->
    <polygon points="480,500 600,500 580,680 470,680" fill="url(#pouchGrad)"/>
    <line x1="480" y1="500" x2="600" y2="500" stroke="#68451f" stroke-width="3" stroke-dasharray="3,3"/>

    <!-- Bag 7 (Smallest) -->
    <polygon points="560,560 680,560 660,680 550,680" fill="url(#pouchGrad)"/>
    <line x1="560" y1="560" x2="680" y2="560" stroke="#68451f" stroke-width="3" stroke-dasharray="3,3"/>
  </g>
</svg>`;

// 6. Rainbow Collection of 8 Non-Woven Loop Bags
const rainbowLoopBags = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <filter id="rainShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="3" dy="10" stdDeviation="12" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="#f8fafc"/>

  <g filter="url(#rainShadow)">
    <!-- 8 Bags Row -->
    <!-- Red -->
    <path d="M 100 240 C 100 130, 140 130, 140 240" fill="none" stroke="#dc2626" stroke-width="12"/>
    <polygon points="70,240 170,240 150,700 50,700" fill="#ef4444"/>

    <!-- Yellow -->
    <path d="M 170 240 C 170 130, 210 130, 210 240" fill="none" stroke="#eab308" stroke-width="12"/>
    <polygon points="140,240 240,240 220,700 120,700" fill="#facc15"/>

    <!-- Orange -->
    <path d="M 240 240 C 240 130, 280 130, 280 240" fill="none" stroke="#ea580c" stroke-width="12"/>
    <polygon points="210,240 310,240 290,700 190,700" fill="#fb923c"/>

    <!-- Green -->
    <path d="M 310 240 C 310 130, 350 130, 350 240" fill="none" stroke="#16a34a" stroke-width="12"/>
    <polygon points="280,240 380,240 360,700 260,700" fill="#4ade80"/>

    <!-- White -->
    <path d="M 380 240 C 380 130, 420 130, 420 240" fill="none" stroke="#cbd5e1" stroke-width="12"/>
    <polygon points="350,240 450,240 430,700 330,700" fill="#f8fafc" stroke="#e2e8f0"/>

    <!-- Black -->
    <path d="M 450 240 C 450 130, 490 130, 490 240" fill="none" stroke="#0f172a" stroke-width="12"/>
    <polygon points="420,240 520,240 500,700 400,700" fill="#1e293b"/>

    <!-- Cyan -->
    <path d="M 520 240 C 520 130, 560 130, 560 240" fill="none" stroke="#0284c7" stroke-width="12"/>
    <polygon points="490,240 590,240 570,700 470,700" fill="#38bdf8"/>

    <!-- Royal Blue -->
    <path d="M 590 240 C 590 130, 630 130, 630 240" fill="none" stroke="#1d4ed8" stroke-width="12"/>
    <polygon points="560,240 680,240 660,700 540,700" fill="#2563eb"/>
  </g>
</svg>`;

// 7. Panchmeva Prasadi Ujjain Devotional Bag
const panchmevaBag = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <filter id="sh" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="#f7f5f0"/>

  <g filter="url(#sh)">
    <!-- Bag -->
    <rect x="180" y="90" width="440" height="630" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <line x1="180" y1="120" x2="620" y2="120" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="6,4"/>
    <rect x="330" y="140" width="140" height="40" rx="20" fill="#f7f5f0" stroke="#cbd5e1" stroke-width="2.5"/>

    <!-- Header Invocation -->
    <text x="400" y="225" font-family="'Noto Sans Devanagari', sans-serif" font-size="24" font-weight="900" fill="#800000" text-anchor="middle">॥ जय श्री महाकाल ॥</text>

    <!-- Mahakal Oval Portrait Badge -->
    <ellipse cx="400" cy="285" rx="75" ry="48" fill="#b91c1c" stroke="#800000" stroke-width="3"/>
    <!-- Sacred Om / Tripundra / Mahakal representation -->
    <circle cx="400" cy="285" r="30" fill="#fef08a"/>
    <text x="400" y="295" font-family="'Noto Sans Devanagari', sans-serif" font-size="28" font-weight="bold" fill="#b91c1c" text-anchor="middle">ॐ</text>

    <!-- Main Title -->
    <text x="400" y="380" font-family="'Noto Sans Devanagari', sans-serif" font-size="44" font-weight="900" fill="#b91c1c" text-anchor="middle">पंचमेवा प्रसादी</text>
    <text x="400" y="425" font-family="'Noto Sans Devanagari', sans-serif" font-size="30" font-weight="bold" fill="#b91c1c" text-anchor="middle">~ होलसेल प्रसादी ~</text>

    <text x="400" y="470" font-family="'Noto Sans Devanagari', sans-serif" font-size="20" font-weight="bold" fill="#1e293b" text-anchor="middle">पोहा एवं जीरावन भी मिलता है।</text>

    <!-- Prasad Circular Bowl Graphics -->
    <circle cx="400" cy="540" r="50" fill="#fef2f2" stroke="#b91c1c" stroke-width="2"/>
    <text x="400" y="547" font-family="sans-serif" font-size="12" font-weight="bold" fill="#b91c1c" text-anchor="middle">शुद्ध प्रसादी</text>

    <!-- Business Name & Address in Ujjain -->
    <text x="400" y="625" font-family="'Noto Sans Devanagari', sans-serif" font-size="22" font-weight="900" fill="#800000" text-anchor="middle">मे. घनश्यामदास कन्हैयालाल</text>
    <text x="400" y="658" font-family="'Noto Sans Devanagari', sans-serif" font-size="22" font-weight="bold" fill="#800000" text-anchor="middle">104/2, गुदरी चौराहा, उज्जैन</text>
    <text x="400" y="690" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e293b" text-anchor="middle">मो. 9826950541</text>
  </g>
</svg>`;

// 8. Bhanwarlal Bakery & Food Packaging Pouches
const bakeryFoodBags = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <filter id="fsh" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="#fdfbf7"/>

  <g filter="url(#fsh)">
    <!-- 3 Overlapping Food & Bakery Bags -->
    <!-- Left Bag: Green Print (Bhanwarlal) -->
    <g>
      <polygon points="120,180 280,180 260,680 100,680" fill="#ffffff" stroke="#e2e8f0"/>
      <text x="180" y="240" font-family="'Noto Sans Devanagari', sans-serif" font-size="18" font-weight="900" fill="#16a34a" text-anchor="middle">भंवरिलाल</text>
      <text x="180" y="260" font-family="sans-serif" font-size="12" font-weight="bold" fill="#16a34a" text-anchor="middle">Bhanwarlal</text>
      <text x="180" y="340" font-family="'Noto Sans Devanagari', sans-serif" font-size="18" font-weight="900" fill="#16a34a" text-anchor="middle">भंवरिलाल</text>
      <text x="180" y="440" font-family="'Noto Sans Devanagari', sans-serif" font-size="18" font-weight="900" fill="#16a34a" text-anchor="middle">भंवरिलाल</text>
    </g>

    <!-- Center Bag: Pink/Brown Print (Cakes 365) -->
    <g>
      <polygon points="260,220 440,220 420,700 240,700" fill="#ffffff" stroke="#e2e8f0"/>
      <circle cx="335" cy="300" r="28" fill="none" stroke="#dc2626" stroke-width="2"/>
      <text x="335" y="298" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626" text-anchor="middle">CAKES</text>
      <text x="335" y="312" font-family="sans-serif" font-size="12" font-weight="900" fill="#dc2626" text-anchor="middle">365</text>
      <text x="335" y="340" font-family="sans-serif" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle">ERY &amp; SNACKS</text>
      
      <circle cx="335" cy="420" r="28" fill="none" stroke="#dc2626" stroke-width="2"/>
      <text x="335" y="418" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626" text-anchor="middle">CAKES</text>
      <text x="335" y="432" font-family="sans-serif" font-size="12" font-weight="900" fill="#dc2626" text-anchor="middle">365</text>
    </g>

    <!-- Right Bag: Food & Burger Graphics Print -->
    <g>
      <polygon points="420,250 660,250 630,710 390,710" fill="#ffffff" stroke="#e2e8f0"/>
      <!-- Gourmet Burger Line Art -->
      <path d="M 470 340 Q 530 300 590 340 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="2"/>
      <rect x="470" y="345" width="120" height="15" rx="5" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/>
      <path d="M 470 365 Q 530 390 590 365 Z" fill="#fed7aa" stroke="#ea580c" stroke-width="2"/>
      <!-- Snack & Drinks Art -->
      <circle cx="530" cy="460" r="25" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      <text x="530" y="465" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ca8a04" text-anchor="middle">FRESH</text>
    </g>
  </g>
</svg>`;

// 9. Best in Burger Greaseproof Wrapping Paper
const burgerWrapPaper = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <rect width="800" height="800" fill="#ffffff"/>
  
  <!-- Repeated Circular Red Stamp Pattern -->
  <g fill="#dc2626">
    <g transform="translate(100, 100)">
      <circle cx="0" cy="0" r="40" fill="none" stroke="#dc2626" stroke-width="2.5"/>
      <text x="0" y="-12" font-family="sans-serif" font-size="8" font-weight="900" text-anchor="middle">AWARDED AS</text>
      <text x="0" y="6" font-family="sans-serif" font-size="16" font-weight="900" text-anchor="middle">BEST</text>
      <text x="0" y="22" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">IN BURGER</text>
    </g>
    <g transform="translate(300, 100)">
      <circle cx="0" cy="0" r="40" fill="none" stroke="#dc2626" stroke-width="2.5"/>
      <text x="0" y="-12" font-family="sans-serif" font-size="8" font-weight="900" text-anchor="middle">AWARDED AS</text>
      <text x="0" y="6" font-family="sans-serif" font-size="16" font-weight="900" text-anchor="middle">BEST</text>
      <text x="0" y="22" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">IN BURGER</text>
    </g>
    <g transform="translate(500, 100)">
      <circle cx="0" cy="0" r="40" fill="none" stroke="#dc2626" stroke-width="2.5"/>
      <text x="0" y="-12" font-family="sans-serif" font-size="8" font-weight="900" text-anchor="middle">AWARDED AS</text>
      <text x="0" y="6" font-family="sans-serif" font-size="16" font-weight="900" text-anchor="middle">BEST</text>
      <text x="0" y="22" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">IN BURGER</text>
    </g>
    <g transform="translate(700, 100)">
      <circle cx="0" cy="0" r="40" fill="none" stroke="#dc2626" stroke-width="2.5"/>
      <text x="0" y="-12" font-family="sans-serif" font-size="8" font-weight="900" text-anchor="middle">AWARDED AS</text>
      <text x="0" y="6" font-family="sans-serif" font-size="16" font-weight="900" text-anchor="middle">BEST</text>
      <text x="0" y="22" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">IN BURGER</text>
    </g>

    <!-- Row 2 -->
    <text x="400" y="260" font-family="sans-serif" font-size="44" font-weight="900" text-anchor="middle" letter-spacing="4">BURGER</text>
    <text x="400" y="320" font-family="sans-serif" font-size="28" font-weight="900" text-anchor="middle" letter-spacing="2">AWARDED AS BEST</text>

    <!-- Row 3 Repeated Stamps -->
    <g transform="translate(200, 450)">
      <circle cx="0" cy="0" r="40" fill="none" stroke="#dc2626" stroke-width="2.5"/>
      <text x="0" y="-12" font-family="sans-serif" font-size="8" font-weight="900" text-anchor="middle">AWARDED AS</text>
      <text x="0" y="6" font-family="sans-serif" font-size="16" font-weight="900" text-anchor="middle">BEST</text>
      <text x="0" y="22" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">IN BURGER</text>
    </g>
    <g transform="translate(600, 450)">
      <circle cx="0" cy="0" r="40" fill="none" stroke="#dc2626" stroke-width="2.5"/>
      <text x="0" y="-12" font-family="sans-serif" font-size="8" font-weight="900" text-anchor="middle">AWARDED AS</text>
      <text x="0" y="6" font-family="sans-serif" font-size="16" font-weight="900" text-anchor="middle">BEST</text>
      <text x="0" y="22" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">IN BURGER</text>
    </g>

    <!-- Row 4 -->
    <text x="400" y="600" font-family="sans-serif" font-size="44" font-weight="900" text-anchor="middle" letter-spacing="4">BURGER</text>
    <text x="400" y="660" font-family="sans-serif" font-size="28" font-weight="900" text-anchor="middle" letter-spacing="2">AWARDED AS BEST</text>
  </g>
</svg>`;

// 10. W-Cut Yellow & White Grocery Bags
const wcutBags = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <filter id="wsh" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="#f3f4f6"/>

  <g filter="url(#wsh)">
    <!-- Yellow W-Cut Vest Bag -->
    <g>
      <!-- Vest Straps & Cutout -->
      <path d="M 220 180 L 290 180 L 290 300 Q 360 360 430 300 L 430 180 L 500 180 L 520 700 L 200 700 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      <!-- Side Gusset fold -->
      <polygon points="200,700 240,700 250,220 220,180" fill="#fde047" opacity="0.6"/>
      <polygon points="520,700 480,700 470,220 500,180" fill="#fde047" opacity="0.6"/>
      <!-- Non-woven cross-hatch texture line -->
      <line x1="200" y1="670" x2="520" y2="670" stroke="#ca8a04" stroke-width="3" stroke-dasharray="6,4"/>
    </g>
  </g>
</svg>`;

// Write all SVGs into public directories
writeSvg('./public/images/products/rajputi-saafe-luxury-bag.svg', rajputiLuxuryBag);
writeSvg('./public/images/products/jalsa-clothing-bag.svg', jalsaBag);
writeSvg('./public/images/products/fusion-fashion-bag.svg', fusionFashionBag);
writeSvg('./public/images/products/kraft-twisted-handle-bags.svg', kraftBagsTrio);
writeSvg('./public/images/products/kraft-grocery-pouches.svg', kraftGroceryPouches);
writeSvg('./public/images/products/rainbow-loop-bags.svg', rainbowLoopBags);
writeSvg('./public/images/products/panchmeva-prasadi-bag.svg', panchmevaBag);
writeSvg('./public/images/products/bhanwarlal-bakery-pouches.svg', bakeryFoodBags);
writeSvg('./public/images/products/burger-wrapping-sheets.svg', burgerWrapPaper);
writeSvg('./public/images/products/wcut-grocery-bags.svg', wcutBags);

// Also copy or link for gallery & categories & industries
writeSvg('./public/images/gallery/rajputi-saafe.svg', rajputiLuxuryBag);
writeSvg('./public/images/gallery/jalsa-clothing.svg', jalsaBag);
writeSvg('./public/images/gallery/fusion-fashion.svg', fusionFashionBag);
writeSvg('./public/images/gallery/panchmeva-prasadi.svg', panchmevaBag);
writeSvg('./public/images/gallery/bhanwarlal-bakery.svg', bakeryFoodBags);
writeSvg('./public/images/gallery/burger-wrapping.svg', burgerWrapPaper);
writeSvg('./public/images/gallery/rainbow-loop.svg', rainbowLoopBags);
writeSvg('./public/images/gallery/kraft-trio.svg', kraftBagsTrio);

writeSvg('./public/images/categories/kraft-bags.svg', kraftBagsTrio);
writeSvg('./public/images/categories/paper-bags.svg', jalsaBag);
writeSvg('./public/images/categories/non-woven-bags.svg', rainbowLoopBags);
writeSvg('./public/images/categories/w-cut-bags.svg', wcutBags);
writeSvg('./public/images/categories/d-cut-bags.svg', fusionFashionBag);
writeSvg('./public/images/categories/designer-bags.svg', rajputiLuxuryBag);
writeSvg('./public/images/categories/gift-bags.svg', rajputiLuxuryBag);
writeSvg('./public/images/categories/customized-bags.svg', jalsaBag);
writeSvg('./public/images/categories/envelopes.svg', kraftGroceryPouches);

console.log('Successfully generated all real product and showcase image assets!');

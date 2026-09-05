/**
 * Generates the nine category tiles in /public/images/categories.
 *
 * Every tile shares one visual language (same canvas, cream backdrop, shelf band
 * and shadow) so the category grid reads as a set, while the bag drawn on each
 * tile actually matches the category it represents.
 *
 * Run with:  node scripts/generate-category-art.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'categories');

const BG = '#f5ede3';
const FLOOR = '#e7dccd';
const INK = '#2a1a0c';

/** Shared defs: one shadow, one shelf, so tiles sit together visually. */
function shell(gradients, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
${gradients}
    <filter id="soft" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="${INK}" flood-opacity="0.28"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="${BG}"/>
  <rect y="600" width="800" height="200" fill="${FLOOR}"/>

  <g filter="url(#soft)">
${body}
  </g>
</svg>
`;
}

function grad(id, from, to) {
  return `    <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>`;
}

/**
 * A carry bag drawn with a front face, a gusset side panel and a top face,
 * which is what gives every tile the same three-quarter perspective.
 */
function bag({ x, y, w, h, fill, side, top, handle = 'twist', handleColor = null, handleWidth = 9 }) {
  const g = Math.round(w * 0.24);
  const lift = Math.round(g * 0.55);
  const hc = handleColor || side;
  const parts = [];

  // side gusset + top face
  parts.push(`      <polygon points="${x + w},${y} ${x + w + g},${y - lift} ${x + w + g},${y + h - lift} ${x + w},${y + h}" fill="${side}"/>`);
  parts.push(`      <polygon points="${x},${y} ${x + g},${y - lift} ${x + w + g},${y - lift} ${x + w},${y}" fill="${top}"/>`);
  // front face
  parts.push(`      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`);

  if (handle === 'twist') {
    const l = x + w * 0.3;
    const r = x + w * 0.7;
    const rise = h * 0.17;
    parts.push(`      <path d="M ${l} ${y} C ${l} ${y - rise}, ${r} ${y - rise}, ${r} ${y}" fill="none" stroke="${hc}" stroke-width="${handleWidth}" stroke-linecap="round"/>`);
  } else if (handle === 'loop') {
    const l = x + w * 0.26;
    const r = x + w * 0.74;
    const rise = h * 0.22;
    parts.push(`      <path d="M ${l} ${y} C ${l} ${y - rise}, ${r} ${y - rise}, ${r} ${y}" fill="none" stroke="${hc}" stroke-width="${handleWidth + 8}" stroke-linecap="round"/>`);
  } else if (handle === 'dcut') {
    const hw = w * 0.34;
    const hh = h * 0.055;
    parts.push(`      <rect x="${x + (w - hw) / 2}" y="${y + h * 0.06}" width="${hw}" height="${hh}" rx="${hh / 2}" fill="${BG}"/>`);
  } else if (handle === 'rope') {
    const l = x + w * 0.3;
    const r = x + w * 0.7;
    const rise = h * 0.2;
    parts.push(`      <path d="M ${l} ${y} C ${l} ${y - rise}, ${r} ${y - rise}, ${r} ${y}" fill="none" stroke="${hc}" stroke-width="${handleWidth}" stroke-linecap="round" stroke-dasharray="14 9"/>`);
  }

  return parts.join('\n');
}

/** Non-woven vest bag: two short straps cut out of the top edge. */
function vestBag({ x, y, w, h, fill, stroke }) {
  const notch = w * 0.2;
  const strapH = h * 0.17;
  return `      <path d="M ${x} ${y + strapH}
        L ${x} ${y + h} Q ${x} ${y + h + 14} ${x + 16} ${y + h + 14}
        L ${x + w - 16} ${y + h + 14} Q ${x + w} ${y + h + 14} ${x + w} ${y + h}
        L ${x + w} ${y + strapH}
        L ${x + w - notch} ${y + strapH}
        L ${x + w - notch} ${y}
        L ${x + w - notch - 10} ${y}
        L ${x + w - notch - 10} ${y + strapH}
        Q ${x + w / 2} ${y + strapH + h * 0.13} ${x + notch + 10} ${y + strapH}
        L ${x + notch + 10} ${y}
        L ${x + notch} ${y}
        L ${x + notch} ${y + strapH} Z"
        fill="${fill}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>`;
}

/** Flat paper envelope pouch with a folded-over flap. */
function envelope({ x, y, w, h, fill, flap, edge, rotate = 0 }) {
  const t = rotate ? ` transform="rotate(${rotate} ${x + w / 2} ${y + h / 2})"` : '';
  return `      <g${t}>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}"/>
        <path d="M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h * 0.3} L ${x + w / 2} ${y + h * 0.46} L ${x} ${y + h * 0.3} Z" fill="${flap}"/>
        <line x1="${x}" y1="${y + h * 0.3}" x2="${x + w / 2}" y2="${y + h * 0.46}" stroke="${edge}" stroke-width="3"/>
        <line x1="${x + w}" y1="${y + h * 0.3}" x2="${x + w / 2}" y2="${y + h * 0.46}" stroke="${edge}" stroke-width="3"/>
      </g>`;
}

const TILES = {
  // Printed retail paper bags with flat handles - a trio at staggered heights.
  'paper-bags': shell(
    [grad('paperA', '#ffffff', '#e9e2d6'), grad('paperB', '#f3ece1', '#ded3c2'), grad('paperC', '#ffffff', '#e4dccd')].join('\n'),
    [
      bag({ x: 120, y: 300, w: 170, h: 250, fill: 'url(#paperB)', side: '#d6c9b4', top: '#e8ded0', handle: 'twist', handleColor: '#b9a68a' }),
      bag({ x: 330, y: 240, w: 190, h: 310, fill: 'url(#paperA)', side: '#ddd2c1', top: '#f0e9dd', handle: 'twist', handleColor: '#b9a68a' }),
      bag({ x: 560, y: 320, w: 150, h: 230, fill: 'url(#paperC)', side: '#d9cdb9', top: '#ece4d6', handle: 'twist', handleColor: '#b9a68a' }),
    ].join('\n')
  ),

  // Unbleached brown kraft with twisted paper handles.
  'kraft-bags': shell(
    [grad('kraftA', '#cca073', '#9a6e3e'), grad('kraftB', '#c0935f', '#8d6132'), grad('kraftC', '#d6ae86', '#a67c4c')].join('\n'),
    [
      bag({ x: 130, y: 290, w: 175, h: 260, fill: 'url(#kraftB)', side: '#7f5628', top: '#b98d5c', handle: 'twist', handleColor: '#8a6134', handleWidth: 11 }),
      bag({ x: 340, y: 230, w: 195, h: 320, fill: 'url(#kraftA)', side: '#83592a', top: '#c59a68', handle: 'twist', handleColor: '#8a6134', handleWidth: 11 }),
      bag({ x: 570, y: 310, w: 150, h: 240, fill: 'url(#kraftC)', side: '#8b6134', top: '#cfa679', handle: 'twist', handleColor: '#8a6134', handleWidth: 11 }),
    ].join('\n')
  ),

  // Reusable non-woven fabric bags with soft loop handles, in brand colours.
  'non-woven-bags': shell(
    [grad('nwA', '#3f8f6d', '#256b4d'), grad('nwB', '#2f6fa8', '#1d4f7d'), grad('nwC', '#c9603f', '#a1442a')].join('\n'),
    [
      bag({ x: 120, y: 300, w: 170, h: 250, fill: 'url(#nwC)', side: '#8d3a23', top: '#d4795a', handle: 'loop', handleColor: '#a1442a' }),
      bag({ x: 330, y: 240, w: 190, h: 310, fill: 'url(#nwA)', side: '#1f5c41', top: '#54a281', handle: 'loop', handleColor: '#256b4d' }),
      bag({ x: 560, y: 310, w: 155, h: 240, fill: 'url(#nwB)', side: '#18456c', top: '#4183bd', handle: 'loop', handleColor: '#1d4f7d' }),
    ].join('\n')
  ),

  // Supermarket vest bags - the W-cut is the defining feature, so show it twice.
  'w-cut-bags': shell(
    [grad('wcA', '#f6d24a', '#e0b021'), grad('wcB', '#fdfaf2', '#e6dfd0')].join('\n'),
    [
      vestBag({ x: 150, y: 250, w: 230, h: 300, fill: 'url(#wcA)', stroke: '#c99a17' }),
      vestBag({ x: 420, y: 285, w: 210, h: 265, fill: 'url(#wcB)', stroke: '#cfc6b4' }),
    ].join('\n')
  ),

  // Punch-handle D-cut bags - the cut-out hole is drawn into the top band.
  'd-cut-bags': shell(
    [grad('dcA', '#d2334a', '#a3132a'), grad('dcB', '#ffffff', '#e3ddd3'), grad('dcC', '#3d434b', '#20242a')].join('\n'),
    [
      bag({ x: 125, y: 300, w: 165, h: 250, fill: 'url(#dcC)', side: '#171a1f', top: '#4a515a', handle: 'dcut' }),
      bag({ x: 330, y: 245, w: 185, h: 305, fill: 'url(#dcA)', side: '#8c0f23', top: '#e05468', handle: 'dcut' }),
      bag({ x: 555, y: 310, w: 160, h: 240, fill: 'url(#dcB)', side: '#d7cfc2', top: '#f6f2ea', handle: 'dcut' }),
    ].join('\n')
  ),

  // Laminated boutique bag: foil band plus a rope handle.
  'designer-bags': shell(
    [grad('dsA', '#2b2f3a', '#12141b'), grad('dsFoil', '#e8c479', '#b8862f'), grad('dsB', '#6d4b7a', '#42294d')].join('\n'),
    [
      bag({ x: 180, y: 250, w: 215, h: 300, fill: 'url(#dsA)', side: '#0d0f14', top: '#3a3f4c', handle: 'rope', handleColor: '#c69a45', handleWidth: 12 }),
      `      <rect x="180" y="360" width="215" height="46" fill="url(#dsFoil)"/>`,
      bag({ x: 460, y: 305, w: 175, h: 245, fill: 'url(#dsB)', side: '#331f3c', top: '#8f6a9c', handle: 'rope', handleColor: '#c69a45', handleWidth: 12 }),
      `      <rect x="460" y="395" width="175" height="36" fill="url(#dsFoil)"/>`,
    ].join('\n')
  ),

  // Small festive gift bags with ribbon handles and a tag.
  'gift-bags': shell(
    [grad('gfA', '#d94f6a', '#a82644'), grad('gfB', '#3f9e8c', '#227263'), grad('gfC', '#e8a33d', '#c07716')].join('\n'),
    [
      bag({ x: 145, y: 355, w: 145, h: 195, fill: 'url(#gfB)', side: '#1b5f52', top: '#59b6a3', handle: 'loop', handleColor: '#f0e4c8', handleWidth: 6 }),
      bag({ x: 330, y: 320, w: 160, h: 230, fill: 'url(#gfA)', side: '#8d1c37', top: '#e5738a', handle: 'loop', handleColor: '#f0e4c8', handleWidth: 6 }),
      bag({ x: 530, y: 360, w: 140, h: 190, fill: 'url(#gfC)', side: '#a56212', top: '#f0bb63', handle: 'loop', handleColor: '#f0e4c8', handleWidth: 6 }),
      `      <circle cx="410" cy="430" r="26" fill="#f7ecd2" opacity="0.9"/>`,
      `      <circle cx="410" cy="430" r="14" fill="#a82644" opacity="0.55"/>`,
    ].join('\n')
  ),

  // Made-to-spec: a blank bag marked up with a print area and dimension lines.
  'customized-bags': shell(
    [grad('cuA', '#ffffff', '#e6e0d5'), grad('cuB', '#4a7f68', '#2c5a47')].join('\n'),
    [
      bag({ x: 250, y: 235, w: 230, h: 315, fill: 'url(#cuA)', side: '#dbd3c5', top: '#f2ece1', handle: 'twist', handleColor: '#9aa79f', handleWidth: 10 }),
      `      <rect x="290" y="320" width="150" height="120" fill="none" stroke="#2c5a47" stroke-width="5" stroke-dasharray="16 12" rx="6"/>`,
      `      <circle cx="365" cy="380" r="26" fill="url(#cuB)" opacity="0.85"/>`,
      `      <line x1="250" y1="585" x2="480" y2="585" stroke="#2c5a47" stroke-width="5"/>`,
      `      <line x1="250" y1="570" x2="250" y2="600" stroke="#2c5a47" stroke-width="5"/>`,
      `      <line x1="480" y1="570" x2="480" y2="600" stroke="#2c5a47" stroke-width="5"/>`,
      `      <line x1="545" y1="235" x2="545" y2="550" stroke="#2c5a47" stroke-width="5"/>`,
      `      <line x1="530" y1="235" x2="560" y2="235" stroke="#2c5a47" stroke-width="5"/>`,
      `      <line x1="530" y1="550" x2="560" y2="550" stroke="#2c5a47" stroke-width="5"/>`,
    ].join('\n')
  ),

  // Flat paper envelope pouches, fanned out.
  'envelopes': shell(
    [grad('enA', '#cfa274', '#a97a48'), grad('enB', '#ffffff', '#e7e0d4'), grad('enC', '#e4d6bf', '#c2ad8e')].join('\n'),
    [
      envelope({ x: 150, y: 280, w: 230, h: 300, fill: 'url(#enC)', flap: '#cbb692', edge: '#a68e66', rotate: -9 }),
      envelope({ x: 300, y: 250, w: 240, h: 310, fill: 'url(#enA)', flap: '#b98a56', edge: '#8f6437', rotate: 0 }),
      envelope({ x: 460, y: 290, w: 220, h: 290, fill: 'url(#enB)', flap: '#ded6c8', edge: '#b8ae9c', rotate: 9 }),
    ].join('\n')
  ),
};

mkdirSync(OUT_DIR, { recursive: true });
for (const [slug, svg] of Object.entries(TILES)) {
  writeFileSync(join(OUT_DIR, `${slug}.svg`), svg, 'utf8');
  console.log(`wrote ${slug}.svg`);
}
console.log(`\n${Object.keys(TILES).length} category tiles generated.`);

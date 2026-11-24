import { BRAND_MARK_DATA_URI } from './brand-mark';
import type { PropertyCategory } from './property-display';

/*
 * Branded cover artwork for a property, generated as SVG (3:2, 1200×800).
 * Follows the Ambiance II / Ambiance Heights covers: dark gradient, fine grid, burgundy/gold glow,
 * double frame, serif title, gold rule, line-drawn building. Every property gets one, so no listing
 * shows a third party's logo. Fonts are system fonts: an SVG shown through <img> can't load web fonts.
 */

export type ArtInput = {
  id: string;
  title: string;
  location: string;
  kind: string;
  categories: PropertyCategory[];
  tag?: string | null;
};

const W = 1200;
const H = 800;
const GOLD = '#c99738';
const GOLD_LIGHT = '#e5c378';
const BRAND = '#800020';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Small, stable hash so each property gets its own glow position. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Greedy word wrap by character budget (serif caps are roughly uniform width). */
function wrap(text: string, maxChars: number, maxLines: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[\s.,]+$/, '')}…`;
    return kept;
  }
  return lines;
}

/* ---------------- illustrations (drawn around 0,0, roughly 360 wide) ---------------- */

function tower() {
  const cols = 4;
  const rows = 7;
  let windows = '';
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const lit = (r * 3 + c * 5) % 7 === 0;
      windows += `<rect x="${-62 + c * 34}" y="${-180 + r * 40}" width="20" height="24" rx="2" fill="${lit ? GOLD : '#ffffff'}" fill-opacity="${lit ? 0.55 : 0.08}" stroke="#ffffff" stroke-opacity="0.18"/>`;
    }
  return `
    <rect x="-80" y="-210" width="160" height="320" rx="6" fill="none" stroke="${GOLD}" stroke-width="3" stroke-opacity="0.85"/>
    <rect x="-130" y="-90" width="50" height="200" rx="4" fill="none" stroke="#ffffff" stroke-opacity="0.28" stroke-width="1.5"/>
    <rect x="80" y="-130" width="62" height="240" rx="4" fill="none" stroke="#ffffff" stroke-opacity="0.28" stroke-width="1.5"/>
    ${windows}
    <path d="M -22 110 L -22 76 C -22 62 22 62 22 76 L 22 110 Z" fill="${GOLD}" fill-opacity="0.25" stroke="${GOLD}" stroke-width="2"/>`;
}

function plots() {
  let cells = '';
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 4; c++) {
      const hl = r === 1 && c === 2;
      cells += `<rect x="${-170 + c * 88}" y="${-150 + r * 92}" width="72" height="74" rx="4" fill="${hl ? BRAND : '#ffffff'}" fill-opacity="${hl ? 0.85 : 0.05}" stroke="${hl ? GOLD : '#ffffff'}" stroke-opacity="${hl ? 0.9 : 0.25}" stroke-width="${hl ? 2 : 1.2}"/>`;
    }
  return `
    <rect x="-190" y="-170" width="380" height="300" rx="10" fill="none" stroke="${GOLD}" stroke-width="2.5" stroke-dasharray="10 7" stroke-opacity="0.8"/>
    ${cells}
    <path d="M 175 -165 L 175 -125 M 168 -140 L 175 -165 L 182 -140" fill="none" stroke="${GOLD_LIGHT}" stroke-width="2"/>
    <text x="175" y="-102" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="${GOLD_LIGHT}">N</text>`;
}

function commercial() {
  let cols = '';
  for (let i = 0; i < 6; i++) cols += `<rect x="${-150 + i * 58}" y="-40" width="14" height="150" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.25"/>`;
  let bands = '';
  for (let r = 0; r < 3; r++) bands += `<line x1="-170" y1="${-150 + r * 36}" x2="170" y2="${-150 + r * 36}" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1.5"/>`;
  return `
    <rect x="-180" y="-180" width="360" height="290" rx="6" fill="none" stroke="${GOLD}" stroke-width="3" stroke-opacity="0.85"/>
    ${bands}
    ${cols}
    <rect x="-180" y="-62" width="360" height="12" fill="${GOLD}" fill-opacity="0.5"/>
    <rect x="-40" y="40" width="80" height="70" rx="3" fill="${BRAND}" fill-opacity="0.7" stroke="${GOLD}" stroke-width="2"/>`;
}

function house(withKey: boolean) {
  return `
    <path d="M -150 110 L -150 -20 L 0 -150 L 150 -20 L 150 110 Z" fill="none" stroke="${GOLD}" stroke-width="3.5" stroke-linejoin="round" stroke-opacity="0.85"/>
    <path d="M -110 110 L -110 0 L 0 -105 L 110 0 L 110 110" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.3"/>
    <circle cx="0" cy="-30" r="38" fill="${BRAND}" fill-opacity="0.4" stroke="${GOLD}" stroke-width="2"/>
    <path d="M -28 110 L -28 55 C -28 36 28 36 28 55 L 28 110 Z" fill="${GOLD}" fill-opacity="0.25" stroke="${GOLD}" stroke-width="2"/>
    ${
      withKey
        ? `<g transform="translate(0,-30)"><circle cx="-10" cy="0" r="11" fill="none" stroke="${GOLD_LIGHT}" stroke-width="3"/><path d="M 1 0 L 22 0 M 14 0 L 14 9 M 20 0 L 20 7" stroke="${GOLD_LIGHT}" stroke-width="3" stroke-linecap="round"/></g>`
        : ''
    }`;
}

function illustration(categories: PropertyCategory[]) {
  if (categories.includes('shortlet')) return house(true);
  if (categories.includes('land') && !categories.includes('residential')) return plots();
  if (categories.includes('commercial') && !categories.includes('residential')) return commercial();
  return tower();
}

/* ---------------- the cover ---------------- */

export function renderPropertyArt(p: ArtInput): string {
  const h = hash(p.id || p.title);
  const glowX = 760 + (h % 160);
  const glowY = 330 + ((h >> 8) % 140);
  const glowTone = (h >> 4) % 2 === 0 ? BRAND : GOLD;
  // Keep the title in the left column (x 104 → ~640). Georgia bold caps ≈ 0.68em per character, so try
  // sizes from largest down until the name fits in three lines.
  const TITLE_WIDTH = 536;
  const upper = p.title.toUpperCase();
  let titleSize = 40;
  let titleLines = wrap(upper, Math.floor(TITLE_WIDTH / (40 * 0.68)), 3);
  for (const size of [60, 52, 46, 40]) {
    const lines = wrap(upper, Math.floor(TITLE_WIDTH / (size * 0.68)), 4);
    if (lines.length <= 3) {
      titleSize = size;
      titleLines = lines;
      break;
    }
  }
  const titleTop = 300 - (titleLines.length - 1) * (titleSize * 0.55);
  const afterTitle = titleTop + (titleLines.length - 1) * titleSize * 1.12;
  const subtitle = (p.tag || p.kind || '').slice(0, 42);
  const status = p.categories.includes('shortlet') ? 'BOOKING OPEN' : 'UNITS AVAILABLE';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(`${p.title}, ${p.location}`)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#141416"/><stop offset="0.5" stop-color="#1d1d22"/><stop offset="1" stop-color="#0f0f11"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${BRAND}"/><stop offset="0.5" stop-color="${GOLD}"/><stop offset="1" stop-color="${BRAND}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${glowTone}" stop-opacity="0.32"/><stop offset="1" stop-color="${glowTone}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.045"/>
    </pattern>
    <clipPath id="disc"><circle cx="0" cy="0" r="24"/></clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <circle cx="${glowX}" cy="${glowY}" r="360" fill="url(#glow)"/>

  <rect x="26" y="26" width="${W - 52}" height="${H - 52}" rx="22" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" rx="14" fill="none" stroke="${GOLD}" stroke-opacity="0.2" stroke-width="1"/>

  <!-- Brand: mark on a light disc + wordmark -->
  <g transform="translate(104, 104)">
    <circle cx="0" cy="0" r="30" fill="#f5f3ee"/>
    <image href="${BRAND_MARK_DATA_URI}" x="-24" y="-24" width="48" height="48" clip-path="url(#disc)"/>
    <text x="46" y="-2" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="20" font-weight="700" fill="#ffffff">PropertyJar</text>
    <text x="46" y="20" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="11" font-weight="700" letter-spacing="3.5" fill="${GOLD_LIGHT}">REALTY</text>
  </g>

  <!-- Type pill -->
  <g transform="translate(${W - 104}, 104)">
    <rect x="-150" y="-19" width="150" height="38" rx="19" fill="${BRAND}" fill-opacity="0.28" stroke="${BRAND}"/>
    <text x="-75" y="5" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="12" font-weight="700" letter-spacing="2.5" fill="${GOLD_LIGHT}">${esc(p.kind.toUpperCase().slice(0, 18))}</text>
  </g>

  <!-- Title block -->
  <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#ffffff" letter-spacing="1.5">
    ${titleLines.map((l, i) => `<text x="104" y="${titleTop + i * titleSize * 1.12}" font-size="${titleSize}">${esc(l)}</text>`).join('\n    ')}
  </g>
  <rect x="104" y="${afterTitle + 30}" width="130" height="3" rx="1.5" fill="url(#rule)"/>
  <text x="104" y="${afterTitle + 78}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="21" font-weight="600" letter-spacing="2.5" fill="${GOLD}">${esc(p.location.toUpperCase().slice(0, 40))}</text>
  ${subtitle ? `<text x="104" y="${afterTitle + 116}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="17" fill="#a0a0ab">${esc(subtitle)}</text>` : ''}

  <!-- Illustration -->
  <g transform="translate(930, 425) scale(0.86)">${illustration(p.categories)}
    <line x1="-210" y1="112" x2="210" y2="112" stroke="${GOLD}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="-180" y1="128" x2="180" y2="128" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1.5"/>
  </g>

  <!-- Status + footer -->
  <g transform="translate(104, ${H - 112})">
    <rect x="0" y="-21" width="232" height="42" rx="21" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.16"/>
    <circle cx="26" cy="0" r="5" fill="#22c55e"/>
    <text x="44" y="5" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="13" font-weight="700" letter-spacing="1.5" fill="#ffffff">${status}</text>
  </g>
  <text x="${W - 104}" y="${H - 106}" text-anchor="end" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="13" font-weight="600" letter-spacing="2" fill="#71717a">PROPERTYJARREALTY.COM</text>
</svg>`;
}

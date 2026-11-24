import type { Property } from './types';
import { parsePriceNGN, NGN_RATES, SYMBOLS, type Currency } from './currency';
import { resolveImageUrl } from './image-url';

export type PropertyCategory = 'land' | 'residential' | 'commercial' | 'shortlet';

/** Serializable, display-ready shape passed from server pages to client components. */
export type PropertyCardData = {
  id: string;
  title: string;
  kind: string;
  categories: PropertyCategory[];
  location: string;
  /** Price in NGN, or 0 if the stored price couldn't be parsed. */
  priceNGN: number;
  /** Unit after the amount, e.g. "night" or "sqm". */
  priceUnit: string | null;
  /** Original stored price, used when it can't be parsed. */
  priceRaw: string;
  details: string;
  image: string;
};

function categoriesOf(p: Property): PropertyCategory[] {
  const text = `${p.type ?? ''} ${p.category ?? ''}`.toLowerCase();
  const cats: PropertyCategory[] = [];
  if (text.includes('shortlet') || text.includes('short-let')) cats.push('shortlet');
  if (text.includes('land')) cats.push('land');
  if (text.includes('residential')) cats.push('residential');
  if (text.includes('commercial')) cats.push('commercial');
  return cats;
}

function kindOf(p: Property, cats: PropertyCategory[]): string {
  if (cats.includes('shortlet')) return 'Short-let';
  return (p.type || p.category || 'Property').replace(/\//g, ' / ');
}

function shortLocation(location: string): string {
  return location
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(-2)
    .join(', ');
}

function detailsOf(p: Property, cats: PropertyCategory[]): string {
  const parts: string[] = [];
  if (cats.includes('shortlet')) {
    const guests = p.shortLetDetails?.maxGuests ?? p.shortLetDetails?.guestCapacity;
    if (guests) parts.push(`Up to ${guests} guests`);
    parts.push('Book by the night');
    return parts.join(' · ');
  }
  const landOnly = cats.length === 1 && cats[0] === 'land';
  if (p.beds && !landOnly) parts.push(`${p.beds} bed${p.beds === 1 ? '' : 's'}`);
  if (p.sqft) {
    const size = String(p.sqft).trim();
    // Admins sometimes enter a unit ("1 Acre"); only append "sqft" to bare numbers.
    parts.push(/[a-z]/i.test(size) ? size : `${size} sqft`);
  }
  if (p.pricingOptions && p.pricingOptions.length > 1) parts.push(`${p.pricingOptions.length} options`);
  if (p.installmentPlan) parts.push('Instalments available');
  if (parts.length === 0 && p.tag) parts.push(p.tag);
  return parts.join(' · ');
}

export function toPropertyCard(p: Property): PropertyCardData {
  const cats = categoriesOf(p);
  const [amount, unit] = (p.price ?? '').split('/').map((s) => s.trim());
  return {
    id: p.id,
    title: p.title,
    kind: kindOf(p, cats),
    categories: cats,
    location: shortLocation(p.location ?? ''),
    priceNGN: amount ? parsePriceNGN(amount) : 0,
    priceUnit: unit || null,
    priceRaw: p.price ?? '',
    details: detailsOf(p, cats),
    image: resolveImageUrl(p.images?.[0] || p.image),
  };
}

/** "₦70,000,000", "₦85,000 / night", "$3,571 / sqm". */
export function formatCardPrice(card: PropertyCardData, currency: Currency = 'NGN'): string {
  if (!card.priceNGN) return card.priceRaw;
  const value = Math.round(card.priceNGN * NGN_RATES[currency]);
  const money = `${SYMBOLS[currency]}${value.toLocaleString('en-US')}`;
  return `${money}${card.priceUnit ? ` / ${card.priceUnit}` : ''}`;
}

/** Formats a stored price string ("₦86.5M", "₦5M/sqm") as full naira ("₦86,500,000", "₦5,000,000 / sqm"). */
export function formatNaira(raw: string): string {
  const [amount, unit] = raw.split('/').map((s) => s.trim());
  const ngn = amount ? parsePriceNGN(amount) : 0;
  if (!ngn) return raw;
  return `₦${Math.round(ngn).toLocaleString('en-US')}${unit ? ` / ${unit}` : ''}`;
}

export { categoriesOf, shortLocation };

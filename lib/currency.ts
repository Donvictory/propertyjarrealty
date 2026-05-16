// lib/currency.ts

export type Currency = 'NGN' | 'USD' | 'GBP';

// Approximate exchange rates relative to NGN (base currency)
export const NGN_RATES: Record<Currency, number> = {
  NGN: 1,
  USD: 1 / 1400,   // 1 NGN = 0.000714 USD (1 USD = 1400 NGN)
  GBP: 1 / 1850,   // 1 NGN = 0.000540 GBP (1 GBP = 1850 NGN)
};

export const SYMBOLS: Record<Currency, string> = {
  NGN: '₦',
  USD: '$',
  GBP: '£',
};

export const CURRENCY_LABELS: Record<Currency, string> = {
  NGN: 'Nigerian Naira (₦)',
  USD: 'US Dollar ($)',
  GBP: 'British Pound (£)',
};

/** Detect which currency a stored price string is in */
export function detectStoredCurrency(price: string): Currency {
  if (price.includes('£')) return 'GBP';
  if (price.includes('$')) return 'USD';
  return 'NGN'; // default assumption
}

/** Parse any price string into NGN */
export function parsePriceNGN(price: string): number {
  const stored = detectStoredCurrency(price);
  const cleaned = price.replace(/[^0-9.]/g, '');
  if (!cleaned) return 0;
  let val = parseFloat(cleaned);
  // Handle "M" shorthand
  if (/\d\s*[Mm]/.test(price) && val < 100_000) val *= 1_000_000;
  // Convert to NGN
  return val / NGN_RATES[stored]; // stored → NGN
}

/** Format an NGN amount into the target display currency */
export function formatDisplay(ngn: number, currency: Currency): string {
  const val = ngn * NGN_RATES[currency];
  const sym = SYMBOLS[currency];

  if (currency === 'NGN') {
    if (val >= 1_000_000_000) return `${sym}${(val / 1_000_000_000).toFixed(2)}B`;
    if (val >= 1_000_000)     return `${sym}${(val / 1_000_000).toFixed(1)}M`;
    return `${sym}${val.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
  }
  if (val >= 1_000_000) return `${sym}${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000)     return `${sym}${(val / 1_000).toFixed(1)}K`;
  return `${sym}${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

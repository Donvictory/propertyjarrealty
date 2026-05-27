 

export type Currency = 'NGN' | 'USD' | 'GBP';


export const NGN_RATES: Record<Currency, number> = {
  NGN: 1,
  USD: 1 / 1400,   
  GBP: 1 / 1850,   
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


export function detectStoredCurrency(price: string): Currency {
  if (price.includes('£')) return 'GBP';
  if (price.includes('$')) return 'USD';
  return 'NGN'; 
}


export function parsePriceNGN(price: string): number {
  const stored = detectStoredCurrency(price);
  const cleaned = price.replace(/[^0-9.]/g, '');
  if (!cleaned) return 0;
  let val = parseFloat(cleaned);
  
  if (/\d\s*[Mm]/.test(price) && val < 100_000) val *= 1_000_000;
  
  return val / NGN_RATES[stored]; 
}


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

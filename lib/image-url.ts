/**
 * Utility to resolve property image URLs to high-availability Vercel Blob CDN
 * ensuring images load reliably across all environments (local, preview, prod).
 */

const BLOB_BASE = 'https://v12rsrt1wfzpoenh.public.blob.vercel-storage.com/uploads';

const RELATIVE_TO_BLOB_MAP: Record<string, string> = {
  '/WVJ-Vault-1.png': `${BLOB_BASE}/WVJ-Vault-1.png`,
  '/WVJ-Vault-2.png': `${BLOB_BASE}/WVJ-Vault-2.png`,
  '/WVJ-Vault-3.png': `${BLOB_BASE}/WVJ-Vault-3.png`,
  '/WVJ-Valut 1.png': `${BLOB_BASE}/WVJ-Vault-1.png`,
  '/WVJ-Vault 2.png': `${BLOB_BASE}/WVJ-Vault-2.png`,
  '/WVJ-Valut 3.png': `${BLOB_BASE}/WVJ-Vault-3.png`,
  '/Grosvenors.jpeg': `${BLOB_BASE}/Grosvenors.jpeg`,
  '/oranje-apartment.jpeg': `${BLOB_BASE}/oranje-apartment.jpeg`,
  '/Oranje Apartment.jpeg': `${BLOB_BASE}/oranje-apartment.jpeg`,
  '/placeholder-ambiance-ii.svg': `${BLOB_BASE}/placeholder-ambiance-ii.svg`,
  '/placeholder-ambiance-heights.svg': `${BLOB_BASE}/placeholder-ambiance-heights.svg`,
  '/placeholder-property.svg': `${BLOB_BASE}/placeholder-property.svg`,
  '/Ambiance_pic.jpeg': `${BLOB_BASE}/Ambiance_pic.jpeg`,
  '/De-Avocado_pic.jpeg': `${BLOB_BASE}/De-Avocado_pic.jpeg`,
  '/fairmont-pic.jpeg': `${BLOB_BASE}/fairmont-pic.jpeg`,
  '/Marbella_pic.jpeg': `${BLOB_BASE}/Marbella_pic.jpeg`,
  '/Micasa_pic.jpeg': `${BLOB_BASE}/Micasa_pic.jpeg`,
};

export function resolveImageUrl(url?: string | null): string {
  if (!url) return `${BLOB_BASE}/placeholder-property.svg`;

  // Already a full remote URL (Vercel Blob, Unsplash, etc.)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Exact known relative path
  if (RELATIVE_TO_BLOB_MAP[url]) {
    return RELATIVE_TO_BLOB_MAP[url];
  }

  // Uploads folder
  if (url.startsWith('/uploads/')) {
    return `${BLOB_BASE}/${url.replace(/^\/uploads\//, '')}`;
  }

  // Clean relative path leading slash
  const filename = url.replace(/^\//, '');
  if (RELATIVE_TO_BLOB_MAP[`/${filename}`]) {
    return RELATIVE_TO_BLOB_MAP[`/${filename}`];
  }

  return url;
}

export function resolveImageUrls(urls?: (string | null | undefined)[] | null): string[] {
  if (!urls || urls.length === 0) return [`${BLOB_BASE}/placeholder-property.svg`];
  return urls.map(u => resolveImageUrl(u)).filter(Boolean);
}

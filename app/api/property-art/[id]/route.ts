import { getProperties } from '@/lib/properties';
import { renderPropertyArt } from '@/lib/property-art';
import { toPropertyCard } from '@/lib/property-display';

/**
 * Branded cover artwork for a property: GET /api/property-art/<id>.svg
 * Generated from the listing's name, location and type, so every property (including new ones added
 * in admin) gets a matching cover with the PropertyJar mark and no third-party branding.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id.replace(/\.svg$/i, '');
  const property = (await getProperties().catch(() => [])).find((p) => p.id === id);

  const svg = property
    ? renderPropertyArt({ ...toPropertyCard(property), tag: property.tag })
    : renderPropertyArt({ id, title: 'PropertyJar Realty', location: 'Lagos, Nigeria', kind: 'Property', categories: [] });

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      // Listings rarely change; let browsers and Vercel's CDN cache, refreshing in the background.
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      // An SVG opened directly should never run scripts or load anything.
      'Content-Security-Policy': "default-src 'none'; img-src data:; style-src 'unsafe-inline'",
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

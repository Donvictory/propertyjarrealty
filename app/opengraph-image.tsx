import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/*
 * The preview image shown when the site is shared (WhatsApp, X, LinkedIn, iMessage…). Built from the
 * current PJR mark at build time, so it always matches the logo on the site.
 */
export const alt = 'PropertyJar Realty Ltd: land, homes and investment property in Lagos';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const [mark, archivoBlack] = await Promise.all([
    readFile(join(process.cwd(), 'public/brand/pjr-mark.png')),
    // Same heavy style as the site headings (Archivo Black, SIL Open Font License: assets/fonts/ArchivoBlack-OFL.txt).
    readFile(join(process.cwd(), 'assets/fonts/ArchivoBlack-Regular.ttf')),
  ]);
  const markSrc = `data:image/png;base64,${mark.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f5f3ee',
          padding: '72px 80px',
          color: '#1c1c1b',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 56 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain <img> */}
          <img src={markSrc} width={260} height={260} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'Archivo Black', fontSize: 76, letterSpacing: -1, lineHeight: 1.05 }}>PropertyJar</div>
            <div style={{ fontFamily: 'Archivo Black', fontSize: 76, letterSpacing: -1, lineHeight: 1.05 }}>Realty Ltd</div>
            <div style={{ width: 96, height: 8, background: '#800020', marginTop: 28, borderRadius: 4 }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 34, color: '#6e6b64', maxWidth: 760, lineHeight: 1.3 }}>
            Land, homes and investment property in Lagos, with a clear plan.
          </div>
          <div style={{ fontFamily: 'Archivo Black', fontSize: 26, color: '#800020' }}>propertyjarrealty.com</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Archivo Black', data: archivoBlack, style: 'normal', weight: 400 }] },
  );
}

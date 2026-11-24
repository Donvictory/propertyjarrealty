import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

/*
 * A light Content-Security-Policy that blocks clickjacking, <base> hijacking, plugins and form posts to
 * other sites without needing per-request nonces (which would force every page to render dynamically).
 */
const csp = [
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
].join('; ');

const nextConfig: NextConfig = {
  serverExternalPackages: ['firebase-admin', '@google-cloud/firestore'],
  images: {
    dangerouslyAllowSVG: true,
    // SVGs passed through the image optimiser can carry scripts: download instead of render, never run scripts.
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Local uploads during development only; production must not fetch from localhost.
      ...(isDev ? [{ protocol: 'http' as const, hostname: 'localhost', port: '3000' }] : []),
      {
        protocol: 'https',
        hostname: 'propertyjarrealty.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'v12rsrt1wfzpoenh.public.blob.vercel-storage.com',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // Microphone is for the chat's voice notes; everything else is off.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(), payment=(), usb=(), interest-cohort=()' },
        ],
      },
    ];
  },
};

export default nextConfig;

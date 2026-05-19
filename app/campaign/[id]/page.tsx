import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getPropertyById, getProperties } from '@/lib/properties';
import CampaignPropertyClient from './CampaignPropertyClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const properties = await getProperties();
    return properties.map((property) => ({
      id: property.id,
    }));
  } catch (error) {
    console.error('[Page] generateStaticParams error:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return {
      title: 'Property Not Found',
    };
  }

  const BASE_URL = 'https://propertyjarrealty.com';

  return {
    title: property.title,
    description: property.description.substring(0, 160),
    openGraph: {
      title: `${property.title} | PropertyJar Realty Ltd`,
      description: property.description.substring(0, 160),
      url: `${BASE_URL}/campaign/${id}`,
      images: [
        {
          url: property.image,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    alternates: {
      canonical: `${BASE_URL}/campaign/${id}`,
    },
  };
}

export default async function CampaignPropertyPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CampaignPropertyClient property={property} />
    </Suspense>
  );
}

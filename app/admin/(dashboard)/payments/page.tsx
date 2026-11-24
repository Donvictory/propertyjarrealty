import type { Metadata } from 'next';
import { getProperties } from '@/lib/properties';
import { listRecentPayments } from '@/lib/payments';
import AdminPaymentsClient from '@/components/admin/AdminPaymentsClient';

export const metadata: Metadata = { title: 'Payments — PropertyJar Admin' };

// The (dashboard) layout has already required an admin session.
export default async function AdminPaymentsPage() {
  const [properties, payments] = await Promise.all([
    getProperties().catch(() => []),
    listRecentPayments(100).catch(() => []),
  ]);
  return (
    <AdminPaymentsClient
      properties={properties.map((p) => ({ id: p.id, title: p.title })).sort((a, b) => a.title.localeCompare(b.title))}
      payments={payments}
    />
  );
}

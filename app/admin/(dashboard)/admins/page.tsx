import { getSession } from '@/lib/session';
import AdminUsersClient from '@/components/admin/AdminUsersClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Users — PropertyJar Admin',
};

export default async function AdminUsersPage() {
  const session = await getSession();

  return <AdminUsersClient session={session!} />;
}

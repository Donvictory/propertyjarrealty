import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import type { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayoutClient session={session}>
      {children}
    </AdminLayoutClient>
  );
}

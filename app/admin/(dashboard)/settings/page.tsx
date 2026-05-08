import type { Metadata } from 'next';
import AdminSettingsClient from '@/components/admin/AdminSettingsClient';

export const metadata: Metadata = {
  title: 'Settings — PropertyJar Admin',
};

export default function SettingsPage() {
  return <AdminSettingsClient />;
}

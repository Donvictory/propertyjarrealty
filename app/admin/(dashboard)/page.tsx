import { getProperties } from '@/lib/properties';
import { getSession } from '@/lib/session';
import PropertyTable from '@/components/admin/PropertyTable';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — PropertyJar Admin',
};

export default async function AdminDashboardPage() {
  const properties = await getProperties();
  const session = await getSession();

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Welcome back</p>
        <h1 className="text-3xl font-bold text-charcoal">{session?.adminName} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here is what is happening with your properties today.</p>
      </div>

      {/* Properties Table — stat cards are now rendered inside PropertyTable
          so they update reactively when properties are added/edited/deleted */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-charcoal">All Properties</h2>
          <p className="text-gray-400 text-xs">Manage your property listings</p>
        </div>
        <PropertyTable initialProperties={properties} />
      </div>
    </div>
  );
}

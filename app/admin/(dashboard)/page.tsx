import { getProperties } from '@/lib/properties';
import { getSession } from '@/lib/session';
import PropertyTable from '@/components/admin/PropertyTable';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — PropertyJar Admin',
};

export default async function AdminDashboardPage() {
  const properties = getProperties();
  const session = await getSession();

  const stats = [
    { label: 'Total Properties', value: properties.length, icon: '🏠', color: 'brand' },
    { label: 'Active Listings', value: properties.filter((p) => p.tag !== 'Sold').length, icon: '✅', color: 'green' },
    { label: 'Sold', value: properties.filter((p) => p.tag === 'Sold').length, icon: '🔑', color: 'gray' },
    { label: 'Featured', value: properties.filter((p) => ['Exclusive', 'Featured', 'New Listing'].includes(p.tag ?? '')).length, icon: '⭐', color: 'yellow' },
  ];

  const colorMap: Record<string, string> = {
    brand: 'text-brand',
    green: 'text-green-400',
    gray: 'text-gray-400',
    yellow: 'text-yellow-400',
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Welcome back</p>
        <h1 className="text-3xl font-bold text-white">{session?.adminName} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here is what is happening with your properties today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#111111] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">{stat.label}</p>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className={`text-4xl font-bold ${colorMap[stat.color]}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Properties Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">All Properties</h2>
          <p className="text-gray-600 text-xs">Manage your property listings</p>
        </div>
        <PropertyTable initialProperties={properties} />
      </div>
    </div>
  );
}

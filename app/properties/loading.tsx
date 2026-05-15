export default function PropertiesLoading() {
  return (
    <main className="min-h-screen pt-32 bg-off-white">
      {/* Header Skeleton */}
      <section className="bg-off-white pt-12 pb-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl w-full">
              <div className="h-12 w-3/4 bg-gray-200 rounded-2xl animate-pulse mb-4" />
              <div className="h-6 w-full bg-gray-100 rounded-xl animate-pulse" />
            </div>
            <div className="h-12 w-48 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Filter Bar Skeleton */}
      <section className="bg-off-white/80 backdrop-blur-md border-y border-gray-100 sticky top-[72px] z-40 py-6">
        <div className="container mx-auto px-6">
          <div className="bg-white/50 p-2 rounded-[2.5rem] border border-white/20 shadow-xl shadow-gray-200/50">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center p-2">
              <div className="h-12 flex-1 bg-gray-100 rounded-2xl animate-pulse" />
              <div className="hidden lg:block w-px h-12 bg-gray-100" />
              <div className="h-12 flex-1 bg-gray-100 rounded-2xl animate-pulse" />
              <div className="hidden lg:block w-px h-12 bg-gray-100" />
              <div className="h-12 flex-1 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm h-[500px] flex flex-col">
                <div className="h-64 w-full bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-8 w-3/4 bg-gray-100 rounded-lg animate-pulse mx-auto" />
                  <div className="h-4 w-1/2 bg-gray-50 rounded-lg animate-pulse mx-auto" />
                  <div className="mt-auto h-12 w-full bg-gray-100 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

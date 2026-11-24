export default function PropertiesLoading() {
  return (
    <main className="shell pb-16 pt-14 lg:pt-20" aria-busy="true" aria-label="Loading properties">
      <div>
        <div className="h-3 w-40 animate-pulse bg-panel" />
        <div className="mt-6 h-12 w-full max-w-xl animate-pulse bg-panel" />
        <div className="mt-6 h-5 w-full max-w-md animate-pulse bg-panel" />
      </div>
      <div className="mt-14 flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 w-28 animate-pulse bg-panel lg:w-36" />
        ))}
      </div>
      <div className="mt-20 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/2] animate-pulse bg-panel" />
            <div className="mt-5 h-3 w-24 animate-pulse bg-panel" />
            <div className="mt-3 h-6 w-40 animate-pulse bg-panel" />
            <div className="mt-4 h-5 w-36 animate-pulse bg-panel" />
          </div>
        ))}
      </div>
    </main>
  );
}

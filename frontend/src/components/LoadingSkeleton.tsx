// Tactical Dossier loading skeleton — mirrors card structure with shimmer cells

function SkeletonBlock({ w = 'w-full', h = 'h-3' }: { w?: string; h?: string }) {
  return <div className={`skeleton ${w} ${h}`} />;
}

function SkeletonCard({ rows = 2, hasTable = false }: { rows?: number; hasTable?: boolean }) {
  return (
    <div className="dossier-card">
      {/* Header */}
      <div className="dossier-card__header justify-between">
        <div className="flex items-center gap-3">
          <SkeletonBlock w="w-24" h="h-3" />
          <SkeletonBlock w="w-48" h="h-3" />
        </div>
        <SkeletonBlock w="w-20" h="h-5" />
      </div>

      {hasTable ? (
        /* Table skeleton */
        <div>
          <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 flex gap-4">
            <SkeletonBlock w="w-6" h="h-3" />
            <SkeletonBlock w="w-16" h="h-3" />
            <SkeletonBlock w="w-32" h="h-3" />
            <SkeletonBlock w="w-48" h="h-3" />
          </div>
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className={`px-3 py-3 border-b border-gray-200 flex gap-4 items-center ${i % 2 === 1 ? 'bg-gray-50' : ''}`}
            >
              <SkeletonBlock w="w-4" h="h-4" />
              <SkeletonBlock w="w-12" h="h-3" />
              <SkeletonBlock w="w-12" h="h-5" />
              <SkeletonBlock w="w-24" h="h-3" />
              <SkeletonBlock w="flex-1 w-0" h="h-3" />
            </div>
          ))}
        </div>
      ) : (
        /* Panel skeleton */
        <div>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="border-b border-gray-200 last:border-0">
              {/* Sub-header */}
              <div className="px-4 py-2.5 border-b border-dashed border-gray-200 bg-gray-50 flex gap-2">
                <SkeletonBlock w="w-20" h="h-4" />
                <SkeletonBlock w="w-32" h="h-4" />
                <SkeletonBlock w="w-40" h="h-4" />
              </div>
              {/* Title */}
              <div className="px-4 pt-3 pb-1">
                <SkeletonBlock w="w-3/4" h="h-3.5" />
              </div>
              {/* Body lines */}
              <div className="px-4 pb-3 space-y-2">
                <SkeletonBlock w="w-full" h="h-3" />
                <SkeletonBlock w="w-5/6" h="h-3" />
              </div>
              {/* Footer */}
              <div className="px-4 py-2 bg-gray-50 border-t border-dashed border-gray-200 flex gap-3">
                <SkeletonBlock w="w-48" h="h-3" />
                <SkeletonBlock w="w-32" h="h-3" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Fault lines skeleton */}
      <SkeletonCard rows={2} hasTable={false} />
      {/* Agenda debt skeleton (timeline) */}
      <div className="dossier-card">
        <div className="dossier-card__header justify-between">
          <div className="flex items-center gap-3">
            <SkeletonBlock w="w-24" h="h-3" />
            <SkeletonBlock w="w-56" h="h-3" />
          </div>
          <SkeletonBlock w="w-32" h="h-3" />
        </div>
        <div className="p-4 pl-2 space-y-5">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-0">
              <div className="flex flex-col items-center" style={{ width: '40px' }}>
                <div className="skeleton w-3 h-3 rounded-full mt-3" />
                {i === 0 && <div className="skeleton w-px flex-1 mt-1" style={{ minHeight: '40px' }} />}
              </div>
              <div className="flex-1 pr-4 pt-2 pb-5 space-y-2">
                <div className="flex gap-2">
                  <SkeletonBlock w="w-24" h="h-4" />
                  <SkeletonBlock w="w-20" h="h-4" />
                </div>
                <SkeletonBlock w="w-2/3" h="h-3.5" />
                <SkeletonBlock w="w-full" h="h-3" />
                <SkeletonBlock w="w-4/5" h="h-3" />
                <div className="flex gap-4 pt-1">
                  <SkeletonBlock w="w-32" h="h-3" />
                  <SkeletonBlock w="w-40" h="h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Hygiene check skeleton (table) */}
      <SkeletonCard rows={5} hasTable={true} />
    </div>
  );
}

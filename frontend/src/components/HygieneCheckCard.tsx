import type { HygieneCheck, HygieneItem, HygieneStatus } from '../types';

// ─── Status indicator ──────────────────────────────────────────────────────────

function StatusCell({ status }: { status: HygieneStatus }) {
  if (status === 'pass')
    return <span className="sys-tag sys-tag--emerald">PASS</span>;
  if (status === 'fail')
    return <span className="sys-tag sys-tag--red">FAIL</span>;
  return <span className="sys-tag sys-tag--amber">WARN</span>;
}

// ─── Table row ─────────────────────────────────────────────────────────────────

function HygieneRow({ item, index }: { item: HygieneItem; index: number }) {
  if (!item) return null;
  const isFail = item.status === 'fail';

  return (
    <>
      <tr className={isFail ? 'bg-red-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
        {/* Row number */}
        <td className="px-3 py-2.5 border-b border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
          {String(index + 1).padStart(2, '0')}
        </td>
        {/* Status */}
        <td className="px-3 py-2.5 border-b border-gray-200 whitespace-nowrap">
          <StatusCell status={item.status} />
        </td>
        {/* Label */}
        <td className={`px-3 py-2.5 border-b border-gray-200 text-xs ${isFail ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
          {item.label}
        </td>
      </tr>
      {/* Detail row for failures */}
      {item.detail && (
        <tr className="bg-red-50">
          <td className="px-3 pb-2 border-b border-gray-200" />
          <td className="px-3 pb-2 border-b border-gray-200" />
          <td className="px-3 pb-2 border-b border-gray-200 font-mono text-xs text-red-600">
            → {item.detail}
          </td>
        </tr>
      )}
    </>
  );
}

// ─── HygieneCheckCard ──────────────────────────────────────────────────────────

interface HygieneCheckCardProps {
  hygieneCheck: HygieneCheck;
}

export default function HygieneCheckCard({ hygieneCheck }: HygieneCheckCardProps) {
  const safeItems = Array.isArray(hygieneCheck?.items) ? hygieneCheck.items : [];
  const safeStatus = hygieneCheck?.overallStatus || 'warning';

  const passCount = safeItems.filter((i) => i?.status === 'pass').length;
  const failCount = safeItems.filter((i) => i?.status === 'fail').length;
  const total = safeItems.length || 1; // avoid division by zero
  const passPercent = Math.round((passCount / total) * 100);

  const accentClass =
    passPercent >= 80 ? 'accent-left--emerald' : passPercent >= 50 ? 'accent-left--amber' : 'accent-left--red';

  const statusTag =
    safeStatus === 'pass' ? (
      <span className="sys-tag sys-tag--emerald">ALL CLEAR</span>
    ) : safeStatus === 'warning' ? (
      <span className="sys-tag sys-tag--amber">ACTION REQUIRED</span>
    ) : (
      <span className="sys-tag sys-tag--red">CRITICAL FAILURES</span>
    );

  return (
    <div className={`dossier-card ${accentClass}`} style={{ borderLeftWidth: '3px' }}>
      {/* Header */}
      <div className="dossier-card__header">
        <div className="flex items-center gap-3">
          <span className="section-label">// Hygiene Check</span>
          <span className="font-mono text-xs text-gray-500">PRE-MEETING READINESS AUDIT</span>
        </div>
        <div className="flex items-center gap-3">
          {statusTag}
          <span className="font-mono text-xs text-gray-500">
            {passCount}/{total} PASSED · {passPercent}%
          </span>
          {failCount > 0 && (
            <span className="sys-tag sys-tag--red">{failCount} FAILED</span>
          )}
        </div>
      </div>

      {/* Progress bar — 1px drafting style */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <span className="section-label">READINESS</span>
        <div className="flex-1 h-1.5 bg-gray-200 border border-gray-300">
          <div
            className={`h-full transition-none ${
              passPercent >= 80 ? 'bg-emerald-500' : passPercent >= 50 ? 'bg-amber-400' : 'bg-red-500'
            }`}
            style={{ width: `${passPercent}%` }}
          />
        </div>
        <span className="font-mono text-xs text-gray-600 w-8">{passPercent}%</span>
      </div>

      {/* Dense data table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="px-3 py-2 text-left font-mono text-xs text-gray-500 uppercase tracking-wide whitespace-nowrap w-8">
                #
              </th>
              <th className="px-3 py-2 text-left font-mono text-xs text-gray-500 uppercase tracking-wide whitespace-nowrap w-24">
                STATUS
              </th>
              <th className="px-3 py-2 text-left font-mono text-xs text-gray-500 uppercase tracking-wide">
                CHECKLIST ITEM
              </th>
            </tr>
          </thead>
          <tbody>
            {safeItems.map((item, i) => (
              <HygieneRow key={item?.id || i} item={item} index={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

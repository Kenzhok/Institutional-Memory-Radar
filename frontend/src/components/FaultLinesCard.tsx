import type { FaultLine, Severity } from '../types';

// ─── Severity config ───────────────────────────────────────────────────────────

interface SeverityConfig {
  tagClass: string;
  tagLabel: string;
  accentClass: string;
  borderClass: string;
}

function getSeverityConfig(severity: Severity): SeverityConfig {
  switch (severity) {
    case 'high':
      return {
        tagClass: 'sys-tag sys-tag--red',
        tagLabel: 'CRITICAL',
        accentClass: 'accent-left--red',
        borderClass: 'border-red-200',
      };
    case 'medium':
      return {
        tagClass: 'sys-tag sys-tag--amber',
        tagLabel: 'ELEVATED',
        accentClass: 'accent-left--amber',
        borderClass: 'border-amber-200',
      };
    default:
      return {
        tagClass: 'sys-tag sys-tag--ink',
        tagLabel: 'ADVISORY',
        accentClass: 'accent-left--ink',
        borderClass: 'border-gray-200',
      };
  }
}

// ─── Single fault line panel ───────────────────────────────────────────────────

interface FaultLinePanelProps {
  item: FaultLine;
  index: number;
}

function FaultLinePanel({ item, index }: FaultLinePanelProps) {
  const cfg = getSeverityConfig(item.severity);

  return (
    <div className={`${cfg.accentClass} border border-gray-200 bg-white`} style={{ borderLeftWidth: '3px' }}>
      {/* Panel header row */}
      <div className="flex items-start justify-between gap-4 px-4 py-3 border-b border-dashed border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cfg.tagClass}>{cfg.tagLabel}</span>
          <span className="sys-tag sys-tag--ink">{item.category}</span>
          <span className="sys-tag sys-tag--ink">
            SYS_RECALL: {item.historicalSignal.split(' ')[0] === 'Conflict' ? '3' : '2'} PAST SESSIONS
          </span>
        </div>
        <span className="font-mono text-xs text-gray-400 flex-shrink-0">FL-{String(index + 1).padStart(3, '0')}</span>
      </div>

      {/* Title */}
      <div className="px-4 pt-3 pb-1">
        <p className="font-semibold text-sm text-gray-900 uppercase tracking-wide">{item.title}</p>
      </div>

      {/* Description */}
      <div className="px-4 pb-3">
        <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
      </div>

      {/* Historical signal */}
      <div className="px-4 py-2 border-t border-dashed border-gray-200 bg-gray-50">
        <p className="font-mono text-xs text-gray-500">
          <span className="text-gray-400 mr-2">HISTORICAL SIGNAL //</span>
          {item.historicalSignal}
        </p>
      </div>

      {/* Trigger keywords */}
      <div className="px-4 py-2 border-t border-gray-200 flex items-center gap-2 flex-wrap">
        <span className="font-mono text-xs text-gray-400 uppercase mr-1">Triggers:</span>
        {item.triggerKeyword.split(',').map((kw) => (
          <span
            key={kw}
            className="font-mono text-xs px-2 py-0.5 border border-gray-300 bg-gray-50 text-gray-700"
          >
            {kw.trim()}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── FaultLinesCard ────────────────────────────────────────────────────────────

interface FaultLinesCardProps {
  faultLines: FaultLine[];
}

export default function FaultLinesCard({ faultLines }: FaultLinesCardProps) {
  const safeFaultLines = Array.isArray(faultLines) ? faultLines : [];
  const highCount = safeFaultLines.filter((f) => f.severity === 'high').length;
  const medCount = safeFaultLines.filter((f) => f.severity === 'medium').length;

  return (
    <div className="dossier-card">
      {/* Header */}
      <div className="dossier-card__header">
        <div className="flex items-center gap-3">
          <span className="section-label">// Fault Lines</span>
          <span className="font-mono text-xs text-gray-500">FRICTION PREDICTION ENGINE OUTPUT</span>
        </div>
        <div className="flex items-center gap-2">
          {highCount > 0 && (
            <span className="sys-tag sys-tag--red">{highCount} CRITICAL</span>
          )}
          {medCount > 0 && (
            <span className="sys-tag sys-tag--amber">{medCount} ELEVATED</span>
          )}
          <span className="font-mono text-xs text-gray-400">{safeFaultLines.length} TOTAL</span>
        </div>
      </div>

      {/* Panels */}
      <div className="divide-y divide-gray-200">
        {safeFaultLines.map((fl, i) => (
          <FaultLinePanel key={fl?.id || i} item={fl} index={i} />
        ))}
      </div>
    </div>
  );
}

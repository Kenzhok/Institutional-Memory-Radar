import type { AgendaDebtItem } from '../types';

// ─── Single timeline entry ─────────────────────────────────────────────────────

interface DebtEntryProps {
  item: AgendaDebtItem;
  index: number;
  isLast: boolean;
}

function DebtEntry({ item, index, isLast }: DebtEntryProps) {
  const isOverdue = item.daysOpen > 14;

  return (
    <div className="flex gap-0">
      {/* Timeline column */}
      <div className="flex flex-col items-center" style={{ width: '40px', flexShrink: 0 }}>
        {/* Node circle */}
        <div
          className="timeline-node mt-3"
          style={{ color: isOverdue ? '#EF4444' : '#F59E0B' }}
        />
        {/* Vertical connector */}
        {!isLast && (
          <div className="flex-1 w-px bg-gray-300" style={{ marginTop: '2px' }} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6 pt-2 pr-4">
        {/* Date + days open */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="font-mono text-xs text-gray-500">{item.openedDate}</span>
          <span
            className={`sys-tag ${isOverdue ? 'sys-tag--red' : 'sys-tag--amber'}`}
          >
            +{item.daysOpen} DAYS OPEN
          </span>
          <span className="sys-tag sys-tag--ink">AD-{String(index + 1).padStart(3, '0')}</span>
        </div>

        {/* Title */}
        <p className="font-semibold text-sm text-gray-900 uppercase tracking-wide mb-1">
          {item.title}
        </p>

        {/* Description */}
        <p className="text-xs text-gray-600 leading-relaxed mb-2">{item.description}</p>

        {/* Meta row */}
        <div className="border-t border-dashed border-gray-200 pt-2 flex flex-wrap gap-4">
          <span className="font-mono text-xs text-gray-500">
            <span className="text-gray-400">OWNER //</span> {item.owner}
          </span>
          <span className="font-mono text-xs text-gray-500">
            <span className="text-gray-400">OPENED IN //</span> {item.openedIn}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── AgendaDebtCard ────────────────────────────────────────────────────────────

interface AgendaDebtCardProps {
  agendaDebt: AgendaDebtItem[];
}

export default function AgendaDebtCard({ agendaDebt }: AgendaDebtCardProps) {
  const safeAgendaDebt = Array.isArray(agendaDebt) ? agendaDebt : [];
  const totalDays = safeAgendaDebt.reduce((sum, item) => sum + (item?.daysOpen || 0), 0);
  const overdueCount = safeAgendaDebt.filter((i) => i?.daysOpen > 14).length;

  return (
    <div className="dossier-card">
      {/* Header */}
      <div className="dossier-card__header">
        <div className="flex items-center gap-3">
          <span className="section-label">// Agenda Debt</span>
          <span className="font-mono text-xs text-gray-500">UNRESOLVED ITEMS FROM PRIOR SESSIONS</span>
        </div>
        <div className="flex items-center gap-2">
          {overdueCount > 0 && (
            <span className="sys-tag sys-tag--red">{overdueCount} OVERDUE</span>
          )}
          <span className="font-mono text-xs text-gray-400">
            {safeAgendaDebt.length} ITEMS · {totalDays} DAYS ACCUMULATED
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4 pl-2">
        {safeAgendaDebt.map((item, i) => (
          <DebtEntry
            key={item?.id || i}
            item={item}
            index={i}
            isLast={i === safeAgendaDebt.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

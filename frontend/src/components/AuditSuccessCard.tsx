import { useState } from 'react';
import type { AuditResponse, ActionItem } from '../types';

// ─── Interactive action item row ───────────────────────────────────────────────

interface ActionRowProps {
  item: ActionItem;
  index: number;
}

function ActionRow({ item, index }: ActionRowProps) {
  const [done, setDone] = useState(false);

  const priorityTag =
    item.priority === 'high' ? (
      <span className="sys-tag sys-tag--red">HIGH</span>
    ) : item.priority === 'medium' ? (
      <span className="sys-tag sys-tag--amber">MED</span>
    ) : (
      <span className="sys-tag sys-tag--ink">LOW</span>
    );

  return (
    <tr className={`border-b border-gray-200 ${done ? 'audit-row--done' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
      {/* Checkbox */}
      <td className="px-3 py-3 w-8 align-top">
        <input
          type="checkbox"
          className="dossier-checkbox"
          checked={done}
          onChange={() => setDone(!done)}
          aria-label={`Mark action item ${index + 1} complete`}
        />
      </td>
      {/* Row number */}
      <td className="px-2 py-3 align-top font-mono text-xs text-gray-400 whitespace-nowrap">
        AI-{String(index + 1).padStart(3, '0')}
      </td>
      {/* Priority */}
      <td className="px-2 py-3 align-top whitespace-nowrap">{priorityTag}</td>
      {/* Owner + deadline */}
      <td className="px-2 py-3 align-top whitespace-nowrap">
        <p className="audit-row__text font-mono text-xs text-gray-700">{item.owner}</p>
        <p className="font-mono text-xs text-gray-400">DUE {item.deadline}</p>
      </td>
      {/* Description */}
      <td className="px-3 py-3 text-xs text-gray-700 leading-relaxed min-w-0">
        <span className="audit-row__text">{item.description}</span>
      </td>
    </tr>
  );
}

// ─── AuditSuccessCard ──────────────────────────────────────────────────────────

interface AuditSuccessCardProps {
  data: AuditResponse;
}

export default function AuditSuccessCard({ data }: AuditSuccessCardProps) {
  const { memoryLayer, extractedInsights } = data || {};
  
  const safeMemory = memoryLayer || { documentId: 'N/A', vectorCount: 0, status: 'N/A', pipelineId: 'N/A', message: '' };
  const safeActionItems = Array.isArray(extractedInsights?.actionItems) ? extractedInsights.actionItems : [];
  const safeDecisions = Array.isArray(extractedInsights?.decisions) ? extractedInsights.decisions : [];
  const safeUnresolved = Array.isArray(extractedInsights?.unresolvedItems) ? extractedInsights.unresolvedItems : [];
  const safeSummary = extractedInsights?.meetingSummary || 'No summary generated.';

  return (
    <div className="space-y-4">
      {/* Memory injection confirmation */}
      <div className="dossier-card accent-left--emerald" style={{ borderLeftWidth: '3px' }}>
        <div className="dossier-card__header">
          <div className="flex items-center gap-3">
            <span className="sys-tag sys-tag--emerald">MEMORY INJECTION: CONFIRMED</span>
            <span className="font-mono text-xs text-gray-500">HINDSIGHT AGENT MEMORY BANK</span>
          </div>
          <span className="font-mono text-xs text-gray-400">
            {new Date(data.processedAt).toLocaleString()}
          </span>
        </div>
        <div className="px-4 py-3 border-b border-dashed border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'DOC ID', value: safeMemory.documentId },
            { label: 'VECTORS', value: String(safeMemory.vectorCount) },
            { label: 'STATUS', value: (safeMemory.status || 'N/A').toUpperCase() },
            { label: 'BANK ID', value: safeMemory.pipelineId },
          ].map((f) => (
            <div key={f.label}>
              <p className="section-label mb-0.5">{f.label}</p>
              <p className="font-mono text-xs text-gray-800 truncate">{f.value}</p>
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5">
          <p className="text-xs text-gray-600 leading-relaxed">{safeMemory.message}</p>
        </div>
      </div>

      {/* Meeting summary */}
      <div className="dossier-card">
        <div className="dossier-card__header">
          <span className="section-label">// Meeting Summary</span>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-gray-700 leading-relaxed border-l-2 border-yellow-300 pl-3 bg-yellow-50 py-2 pr-2">
            {safeSummary}
          </p>
        </div>
      </div>

      {/* Action items — interactive table */}
      <div className="dossier-card">
        <div className="dossier-card__header">
          <div className="flex items-center gap-3">
            <span className="section-label">// Action Items</span>
            <span className="font-mono text-xs text-gray-500">CLICK CHECKBOX TO MARK RESOLVED</span>
          </div>
          <span className="sys-tag sys-tag--ink">{safeActionItems.length} OPEN</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-3 py-2 w-8" />
                <th className="px-2 py-2 text-left font-mono text-xs text-gray-500 uppercase w-16">REF</th>
                <th className="px-2 py-2 text-left font-mono text-xs text-gray-500 uppercase w-20">PRI</th>
                <th className="px-2 py-2 text-left font-mono text-xs text-gray-500 uppercase w-36">OWNER / DUE</th>
                <th className="px-3 py-2 text-left font-mono text-xs text-gray-500 uppercase">DESCRIPTION</th>
              </tr>
            </thead>
            <tbody>
              {safeActionItems.map((item, i) => (
                <ActionRow key={item?.id || i} item={item} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decisions + Unresolved side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Decisions */}
        <div className="dossier-card">
          <div className="dossier-card__header">
            <span className="section-label">// Decisions Logged</span>
            <span className="font-mono text-xs text-gray-400">
              {safeDecisions.length} ITEMS
            </span>
          </div>
          <div className="divide-y divide-gray-200">
            {safeDecisions.map((d, i) => (
              <div key={d?.id || i} className="px-4 py-3">
                <p className="text-xs text-gray-700 leading-relaxed mb-1.5">{d.summary}</p>
                <div className="flex gap-4">
                  <span className="font-mono text-xs text-gray-400">
                    <span className="text-gray-300">BY //</span> {d.madeBy}
                  </span>
                  <span className="font-mono text-xs text-gray-400 ml-auto">
                    DEC-{String(i + 1).padStart(3, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unresolved / Escalated */}
        <div className="dossier-card accent-left--amber" style={{ borderLeftWidth: '3px' }}>
          <div className="dossier-card__header">
            <span className="section-label">Escalated / Unresolved</span>
            <span className="font-mono text-xs text-gray-400">
              {safeUnresolved.length} ITEMS
            </span>
          </div>
          <div className="divide-y divide-gray-200">
            {safeUnresolved.map((u, i) => (
              <div key={u?.id || i} className="px-4 py-3 bg-amber-50">
                <p className="font-semibold text-xs text-gray-900 uppercase tracking-wide mb-1">
                  {u.topic}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mb-2">{u.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="section-label">PARTIES:</span>
                  {(Array.isArray(u?.participants) ? u.participants : []).map((p) => (
                    <span key={p} className="sys-tag sys-tag--ink">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

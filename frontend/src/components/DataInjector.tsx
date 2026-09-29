import { useState, useRef } from 'react';

interface DataInjectorProps {
  onStageChange: (stage: number) => void;
  onSyncStart: () => void;
  onSyncEnd: () => void;
}

export default function DataInjector({ onStageChange, onSyncStart, onSyncEnd }: DataInjectorProps) {
  const [busy, setBusy] = useState(false);  // true from click until sync window ends
  const [status, setStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStage = async (stage: number) => {
    // Clear any previous error / sync timer
    setErrorMsg(null);
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);

    onStageChange(stage);

    setBusy(true);
    setStatus(null);
    onSyncStart();

    try {
      if (stage === 1) {
        const res = await fetch('/api/demo/reset', { method: 'POST' });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error((body as { error?: string }).error || `Reset failed: HTTP ${res.status}`);
        }
        // Stage 1 reset is instant — no vector indexing needed
        setStatus('[ BANK RESET — CLEAN SLATE ]');
        syncTimerRef.current = setTimeout(() => {
          setStatus(null);
          setBusy(false);
          onSyncEnd();
        }, 2000);
      } else {
        const res = await fetch('/api/demo/advance-stage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error((body as { error?: string }).error || `Advance failed: HTTP ${res.status}`);
        }

        // 4-second sync delay to allow Hindsight vector indexing
        setStatus('[ SYNCHRONIZING VECTOR BANK... ]');
        syncTimerRef.current = setTimeout(() => {
          setStatus(`Stage ${stage} — Ready.`);
          setBusy(false);
          onSyncEnd();
          // Clear the "Ready" label after 3s
          syncTimerRef.current = setTimeout(() => setStatus(null), 3000);
        }, 4000);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown network error';
      console.error('[DataInjector]', msg);
      setErrorMsg(msg);
      setStatus(null);
      setBusy(false);
      onSyncEnd();
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] rounded px-6 py-3 flex items-center gap-4">
        <div className="flex flex-col mr-2">
          <span className="font-mono text-[10px] font-bold text-amber-500 uppercase tracking-widest leading-none">Admin Tool</span>
          <span className="font-mono text-xs text-slate-300 tracking-widest leading-none mt-1">Memory Time-Lapse</span>
        </div>

        <div className="h-8 w-px bg-slate-700 mx-2"></div>

        <button
          disabled={busy}
          onClick={() => handleStage(1)}
          className="font-mono text-xs px-3 py-1.5 rounded text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          [ Stage 1: Cold Start ]
        </button>

        <button
          disabled={busy}
          onClick={() => handleStage(2)}
          className="font-mono text-xs px-3 py-1.5 rounded text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          [ Stage 2: 3 Weeks Later ]
        </button>

        <button
          disabled={busy}
          onClick={() => handleStage(3)}
          className="font-mono text-xs px-3 py-1.5 rounded text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          [ Stage 3: 3 Months Later ]
        </button>

        {(busy || status) && (
          <span className="font-mono text-xs ml-2 border px-2 py-1 rounded text-amber-400 border-amber-900/50 bg-amber-900/20 animate-pulse">
            {status || 'Injecting memories...'}
          </span>
        )}
      </div>

      {/* Persistent error toast — stays until dismissed */}
      {errorMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-red-900 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] rounded px-6 py-3 flex items-center gap-4 max-w-2xl">
          <span className="font-mono text-xs text-red-200">
            <span className="font-bold text-red-400">[INJECTION FAILED]</span> {errorMsg}
          </span>
          <button
            onClick={() => setErrorMsg(null)}
            className="font-mono text-xs text-red-400 hover:text-white border border-red-700 px-2 py-0.5 rounded ml-auto flex-shrink-0"
          >
            DISMISS
          </button>
        </div>
      )}
    </>
  );
}

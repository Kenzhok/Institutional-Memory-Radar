import { useState } from 'react';
import type { PrepResponse, AuditResponse } from './types';
import FaultLinesCard from './components/FaultLinesCard';
import AgendaDebtCard from './components/AgendaDebtCard';
import HygieneCheckCard from './components/HygieneCheckCard';
import AuditSuccessCard from './components/AuditSuccessCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import DataInjector from './components/DataInjector';

// ─── Imports & Data ────────────────────────────────────────────────────────────

import { demoScripts } from './data/demoScripts';

// ─── Types ─────────────────────────────────────────────────────────────────────

type ActiveTab = 'prep' | 'audit';

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="bg-white border-b border-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        {/* Wordmark */}
        <div className="flex items-center gap-4">
          <div className="bg-gray-900 px-2 py-1">
            <span className="font-mono text-xs font-bold text-white tracking-widest">IMR</span>
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-gray-900 tracking-widest uppercase leading-none">
              Institutional Memory Radar
            </p>
            <p className="font-mono text-xs text-gray-400 leading-none mt-0.5">
              Friction Prediction System · v1.0.0
            </p>
          </div>
        </div>

        {/* Minimal status indicators — no heavy borders */}
        <div className="hidden sm:flex items-center divide-x divide-gray-200">
          {[
            { label: 'GEMINI: LIVE',       dot: 'bg-emerald-500' },
            { label: 'HINDSIGHT: LIVE',   dot: 'bg-emerald-500' },
            { label: 'MODEL: GEMINI-3.1-FLASH-LITE', dot: 'bg-emerald-500' },
          ].map(({ label, dot }) => (
            <div key={label} className="flex items-center gap-1.5 px-4 first:pl-0 last:pr-0">
              <span className={`h-2 w-2 rounded-full flex-shrink-0 ${dot}`} />
              <span className="font-mono text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

// ─── Tab Navigation ────────────────────────────────────────────────────────────

interface TabNavProps {
  active: ActiveTab;
  onSwitch: (t: ActiveTab) => void;
}

function TabNav({ active, onSwitch }: TabNavProps) {
  const tabs: { id: ActiveTab; label: string; sub: string }[] = [
    { id: 'prep',  label: 'Pre-Flight Prep',    sub: 'Recall Cycle' },
    { id: 'audit', label: 'Post-Meeting Audit',  sub: 'Retain Cycle' },
  ];

  return (
    <div className="flex bg-slate-100 border-b border-gray-300">
      {tabs.map(({ id, label, sub }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            id={`tab-${id}`}
            onClick={() => onSwitch(id)}
            className={`
              relative px-7 py-3 text-left cursor-pointer border-r border-gray-300
              transition-colors duration-100
              ${isActive
                ? 'bg-white border-t-4 border-t-gray-900 -mt-px'
                : 'bg-slate-100 border-t-4 border-t-transparent hover:bg-slate-50'}
            `}
          >
            <p
              className={`font-mono text-xs font-bold uppercase tracking-widest leading-none
                ${isActive ? 'text-gray-900' : 'text-slate-500'}`}
            >
              {label}
            </p>
            <p
              className={`font-mono text-xs leading-none mt-1
                ${isActive ? 'text-gray-400' : 'text-slate-400'}`}
            >
              [{sub}]
            </p>
          </button>
        );
      })}
      {/* Right fill strip to close the tab bar */}
      <div className="flex-1 bg-slate-100 border-t-4 border-t-transparent" />
    </div>
  );
}

// ─── Empty State Card ──────────────────────────────────────────────────────────

function EmptyState({ message, sub }: { message: string; sub?: string }) {
  return (
    <div className="empty-state h-full">
      <div className="w-8 h-8 border border-dashed border-gray-400 flex items-center justify-center mb-4">
        <span className="font-mono text-xs text-gray-400">◌</span>
      </div>
      <p className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed max-w-xs">
        {message}
      </p>
      {sub && (
        <p className="font-mono text-xs text-gray-300 mt-2 max-w-xs leading-relaxed">{sub}</p>
      )}
    </div>
  );
}

// ─── Pre-Flight Prep Tab ───────────────────────────────────────────────────────

interface PrepTabProps {
  currentStage: number;
  isSynchronizing: boolean;
}

function PrepTab({ currentStage, isSynchronizing }: PrepTabProps) {
  const [inviteText, setInviteText] = useState('');
  const [highlight, setHighlight] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<PrepResponse | null>(null);
  const [error, setError]     = useState<string | null>(null);

  const handleAutoFill = () => {
    setInviteText(demoScripts[currentStage].invite);
    setHighlight(true);
    setTimeout(() => setHighlight(false), 800);
  };

  const handleGenerate = async () => {
    if (!inviteText.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteText }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error((d as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      setResult((await res.json()) as PrepResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Left column: Input ───────────────────────────────────────────── */}
      <div className="lg:col-span-5 space-y-3">
        {/* Panel header */}
        <div className="dossier-card__header dossier-card border-b-0">
          <span className="section-label">Calendar Invite Input</span>
        </div>

        {/* Textarea */}
        <div className={`dossier-card transition-colors duration-300 ${highlight ? 'border-emerald-500 bg-emerald-50/10' : ''}`}>
          <textarea
            id="invite-text-input"
            className="dossier-textarea"
            style={{ maxHeight: '200px' }}
            value={inviteText}
            onChange={(e) => setInviteText(e.target.value)}
            rows={8}
            placeholder="Paste calendar invite text here..."
          />
        </div>

        {/* Char counter */}
        <div className="flex justify-end">
          <span className="font-mono text-xs text-gray-400">{inviteText.length} chars</span>
        </div>

        {/* Load sample */}
        <button
          id="btn-load-sample-invite"
          className="dossier-btn dossier-btn--ghost"
          onClick={handleAutoFill}
        >
          Load Sample Invite (Stage {currentStage})
        </button>

        {/* Generate radar */}
        <button
          id="btn-generate-radar"
          className="dossier-btn"
          onClick={handleGenerate}
          disabled={loading || inviteText.trim().length < 10 || isSynchronizing}
        >
          {isSynchronizing ? '[ SYNCHRONIZING VECTOR BANK ]' : (loading ? 'Generating...' : 'Generate Radar →')}
        </button>

        {/* Error */}
        {error && (
          <div className="border border-red-200 bg-red-50 px-3 py-2.5">
            <p className="font-mono text-xs text-red-700">
              <span className="font-bold">[ERROR]</span> {error}
            </p>
          </div>
        )}

        {/* Meeting context strip — shown after result */}
        {result && !loading && (
          <div className="border border-gray-200 bg-gray-50 divide-y divide-gray-200">
            {[
              { label: 'Topic',       value: result.meetingContext?.topic || 'N/A' },
              { label: 'Scheduled',   value: result.meetingContext?.scheduledFor || 'N/A' },
              { label: 'Attendees',   value: Array.isArray(result.meetingContext?.participants) ? result.meetingContext.participants.join(', ') : 'N/A' },
              { label: 'Generated',   value: result.generatedAt ? new Date(result.generatedAt).toLocaleTimeString() : 'N/A' },
            ].map(({ label, value }) => (
              <div key={label} className="px-3 py-2">
                <p className="section-label mb-0.5">{label}</p>
                <p className="font-mono text-xs text-gray-800 leading-snug">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Right column: Output ─────────────────────────────────────────── */}
      <div className="lg:col-span-7 space-y-4">
        {loading && <LoadingSkeleton />}

        {!loading && !result && (
          <EmptyState
            message="Telemetry Radar Idle"
            sub="Awaiting calendar invite input. Paste an invite and click Generate Radar to surface friction signals."
          />
        )}

        {result && !loading && (
          <>
            <FaultLinesCard faultLines={result.faultLines} />
            <AgendaDebtCard agendaDebt={result.agendaDebt} />
            <HygieneCheckCard hygieneCheck={result.hygieneCheck} />
          </>
        )}
      </div>
    </div>
  );
}

// ─── Post-Meeting Audit Tab ────────────────────────────────────────────────────

interface AuditTabProps {
  currentStage: number;
}

function AuditTab({ currentStage }: AuditTabProps) {
  const [minutes, setMinutes]   = useState('');
  const [highlight, setHighlight] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<AuditResponse | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const handleAutoFill = () => {
    setMinutes(demoScripts[currentStage].transcript);
    setHighlight(true);
    setTimeout(() => setHighlight(false), 800);
  };

  const isReady = minutes.trim().length >= 20;

  const handleProcess = async () => {
    if (!isReady) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingMinutes: minutes }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error((d as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      setResult((await res.json()) as AuditResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Left column: Input ───────────────────────────────────────────── */}
      <div className="lg:col-span-5 space-y-3">
        {/* Panel header */}
        <div className="dossier-card__header dossier-card border-b-0">
          <span className="section-label">Raw Transcript Ingestion</span>
        </div>

        {/* Textarea */}
        <div className={`dossier-card transition-colors duration-300 ${highlight ? 'border-emerald-500 bg-emerald-50/10' : ''}`}>
          <textarea
            id="minutes-text-input"
            className="dossier-textarea"
            style={{ maxHeight: '200px' }}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            rows={8}
            placeholder="Paste meeting minutes or transcript here..."
          />
        </div>

        {/* Char counter */}
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs text-gray-400">{minutes.length} chars</span>
          {!isReady && minutes.length > 0 && (
            <span className="font-mono text-xs text-amber-600">
              {20 - minutes.trim().length} more chars needed
            </span>
          )}
        </div>

        {/* Load sample */}
        <button
          id="btn-load-sample-minutes"
          className="dossier-btn dossier-btn--ghost"
          onClick={handleAutoFill}
        >
          Auto-Fill Transcript (Stage {currentStage})
        </button>

        {/* Process & Retain — high contrast when active */}
        <button
          id="btn-process-retain"
          className={`dossier-btn ${isReady && !loading ? 'dossier-btn--emerald' : ''}`}
          onClick={handleProcess}
          disabled={loading || !isReady}
        >
          {loading ? 'Processing...' : 'Process & Retain →'}
        </button>

        {/* Error */}
        {error && (
          <div className="border border-red-200 bg-red-50 px-3 py-2.5">
            <p className="font-mono text-xs text-red-700">
              <span className="font-bold">[ERROR]</span> {error}
            </p>
          </div>
        )}

        {/* Processing progress indicator */}
        {loading && (
          <div className="border border-gray-200 bg-gray-50 px-3 py-3 space-y-2">
            <p className="font-mono text-xs text-gray-600">
              Extracting insights via Gemini → Injecting into Hindsight Memory Bank...
            </p>
            <div className="h-0.5 skeleton" />
          </div>
        )}
      </div>

      {/* ── Right column: Output ─────────────────────────────────────────── */}
      <div className="lg:col-span-7">
        {!loading && !result && (
          <EmptyState
            message="[ SYSTEM IDLE ]"
            sub="Awaiting transcript to extract action items and update Memory Bank."
          />
        )}

        {result && !loading && <AuditSuccessCard data={result} />}
      </div>
    </div>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('prep');
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isSynchronizing, setIsSynchronizing] = useState<boolean>(false);

  const handleDemoStageChange = (stage: number) => {
    setCurrentStage(stage);
    setActiveTab('prep'); // Auto-switch to Prep tab to get ready
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <TabNav active={activeTab} onSwitch={setActiveTab} />
      
      <DataInjector 
        onStageChange={handleDemoStageChange} 
        onSyncStart={() => setIsSynchronizing(true)}
        onSyncEnd={() => setIsSynchronizing(false)}
      />

      {/* Main content — grows to fill remaining height */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-6">
        {activeTab === 'prep'  ? <PrepTab currentStage={currentStage} isSynchronizing={isSynchronizing} />  : <AuditTab currentStage={currentStage} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <p className="font-mono text-xs text-gray-400">
            IMR v1.0.0 · Gemini 3.1 Flash-Lite + Hindsight Agent Memory API
          </p>
          <p className="font-mono text-xs text-emerald-500">
            ✅ APIs Connected
          </p>
        </div>
      </footer>
    </div>
  );
}
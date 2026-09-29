// ─── Shared API Types ──────────────────────────────────────────────────────────

export type Severity = 'high' | 'medium' | 'low';
export type HygieneStatus = 'pass' | 'fail' | 'warning';

// ─── Prep Response (POST /api/prep) ───────────────────────────────────────────

export interface MeetingContext {
  participants: string[];
  scheduledFor: string;
  topic: string;
}

export interface FaultLine {
  id: string;
  severity: Severity;
  category: string;
  title: string;
  description: string;
  historicalSignal: string;
  triggerKeyword: string;
}

export interface AgendaDebtItem {
  id: string;
  title: string;
  openedDate: string;
  openedIn: string;
  owner: string;
  description: string;
  daysOpen: number;
}

export interface HygieneItem {
  id: string;
  label: string;
  status: HygieneStatus;
  detail?: string;
}

export interface HygieneCheck {
  overallStatus: HygieneStatus;
  items: HygieneItem[];
}

export interface PrepResponse {
  status: string;
  generatedAt: string;
  meetingContext: MeetingContext;
  faultLines: FaultLine[];
  agendaDebt: AgendaDebtItem[];
  hygieneCheck: HygieneCheck;
}

// ─── Audit Response (POST /api/audit) ─────────────────────────────────────────

export interface MemoryLayerStatus {
  status: string;
  documentId: string;
  message: string;
  vectorCount: number;
  pipelineId: string;
}

export interface ActionItem {
  id: string;
  owner: string;
  deadline: string;
  priority: Severity;
  description: string;
  status: string;
}

export interface Decision {
  id: string;
  summary: string;
  madeBy: string;
  madeAt: string;
}

export interface UnresolvedItem {
  id: string;
  topic: string;
  description: string;
  participants: string[];
}

export interface ExtractedInsights {
  actionItems: ActionItem[];
  decisions: Decision[];
  unresolvedItems: UnresolvedItem[];
  meetingSummary: string;
}

export interface AuditResponse {
  status: string;
  processedAt: string;
  memoryLayer: MemoryLayerStatus;
  extractedInsights: ExtractedInsights;
}

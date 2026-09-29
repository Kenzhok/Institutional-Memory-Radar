/**
 * Hindsight Adapter — Vectorize Hindsight Agent Memory API
 *
 * Connects to the Vectorize Hindsight Agent Memory REST API.
 * Base URL: https://api.hindsight.vectorize.io
 *
 * Required environment variables:
 *   HINDSIGHT_API_KEY  — your Hindsight API key
 *   HINDSIGHT_BANK_ID  — the Memory Bank ID for this deployment
 *
 * RETAIN endpoint: POST /v1/banks/{BANK_ID}/retain
 *   Body: { content: string }
 *
 * RECALL endpoint: POST /v1/banks/{BANK_ID}/recall
 *   Body: { query: string }
 */

const BASE_URL = 'https://api.hindsight.vectorize.io';

export interface RecalledDocument {
  id: string;
  content: string;
  score: number;
  metadata: Record<string, unknown>;
}

// ── Response shapes for typed deserialization ───────────────────────────────

interface RetainResponse {
  id: string;
  [key: string]: unknown;
}

interface RecallResponse {
  documents: RecalledDocument[];
  [key: string]: unknown;
}

/**
 * Retains meeting content into the Hindsight Memory Bank.
 *
 * @param text - The full meeting transcript or summary to store.
 * @returns A promise resolving to the stored document ID.
 */
export async function retain(text: string): Promise<string> {
  const bankId = process.env.HINDSIGHT_BANK_ID;
  if (!bankId) throw new Error('HINDSIGHT_BANK_ID is not set in environment variables.');

  console.log(`[Hindsight] retain → POST /v1/default/banks/${bankId}/memories (${text.length} chars)`);

  const res = await fetch(`${BASE_URL}/v1/default/banks/${bankId}/memories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HINDSIGHT_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items: [{ content: text }] }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[Hindsight] retain failed: ${res.status} — ${err}`);
    throw new Error(`Hindsight retain failed: ${res.status} ${err}`);
  }

  const data = (await res.json()) as RetainResponse;
  console.log(`[Hindsight] retain success → doc ID: ${data.id}`);
  return data.id;
}

/**
 * Recalls semantically relevant memories for a given query context.
 *
 * @param context - The meeting context string to use as the recall query.
 * @returns A promise resolving to an array of recalled memory documents.
 */
export async function recall(context: string): Promise<RecalledDocument[]> {
  const bankId = process.env.HINDSIGHT_BANK_ID;
  if (!bankId) throw new Error('HINDSIGHT_BANK_ID is not set in environment variables.');

  console.log(`[Hindsight] recall → POST /v1/default/banks/${bankId}/memories/recall`);

  const res = await fetch(`${BASE_URL}/v1/default/banks/${bankId}/memories/recall`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HINDSIGHT_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: context }),
  });

  if (!res.ok) {
    if (res.status === 404) {
      console.log(`[Hindsight] recall bank not found (404), treating as empty memory.`);
      return [];
    }
    const err = await res.text();
    console.error(`[Hindsight] recall failed: ${res.status} — ${err}`);
    throw new Error(`Hindsight recall failed: ${res.status} ${err}`);
  }

  const data = (await res.json()) as RecallResponse;
  const docs = data.documents ?? [];
  console.log(`[Hindsight] recall success → ${docs.length} document(s) returned`);
  return docs;
}

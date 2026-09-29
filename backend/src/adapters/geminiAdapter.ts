/**
 * Gemini Adapter — AI Inference Layer
 *
 * Uses the @google/genai SDK to call Gemini 1.5 Flash with structured JSON output.
 * responseMimeType: "application/json" forces the model to output valid JSON.
 *
 * CRITICAL: If JSON.parse fails (malformed LLM output, network error, etc.),
 * a fallback mock is returned so the React frontend never crashes.
 */

import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ── Fallback mock — prevents white-screen crash if Gemini returns garbage ───

const FALLBACK_PREP = {
  meetingContext: {
    participants: ['Unable to parse participants'],
    scheduledFor: 'Unknown',
    topic: 'Gemini response could not be parsed',
  },
  faultLines: [
    {
      id: 'fl-fallback',
      severity: 'medium' as const,
      category: 'System Warning',
      title: 'LLM Response Parse Failure',
      description:
        'The Gemini API returned a response that could not be parsed as valid JSON. This is a fallback card. Please retry the request or check the server logs.',
      historicalSignal: 'N/A — system-generated fallback.',
      triggerKeyword: 'parse error, fallback',
    },
  ],
  agendaDebt: [],
  hygieneCheck: {
    overallStatus: 'warning' as const,
    items: [
      {
        id: 'hc-fallback',
        label: 'LLM JSON integrity check',
        status: 'fail' as const,
        detail: 'Gemini response was malformed. Fallback mock returned.',
      },
    ],
  },
};

const FALLBACK_AUDIT = {
  actionItems: [],
  decisions: [],
  unresolvedItems: [],
  meetingSummary: 'Gemini response could not be parsed. This is a fallback. Please retry.',
};

/**
 * Sends a prompt to Gemini 1.5 Flash and returns the parsed JSON response.
 *
 * @param prompt - The full prompt string (including any recalled memory context).
 * @returns The parsed JSON object from Gemini's response.
 */
export async function generateInsights(prompt: string): Promise<Record<string, unknown>> {
  console.log(`[Gemini] generateInsights called — prompt length: ${prompt.length} chars`);

  const MAX_RETRIES = 3;
  const INITIAL_BACKOFF_MS = 1000;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an objective Institutional Memory Radar. Output strictly in JSON format matching the requested structure. Do not include markdown formatting like ```json in the output.',
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text ?? '';
      console.log(`[Gemini] Raw response length: ${rawText.length} chars`);

      if (!rawText.trim()) {
        console.warn('[Gemini] Empty response from Gemini. Returning fallback.');
        return isMeetingPrepPrompt(prompt) ? FALLBACK_PREP : FALLBACK_AUDIT;
      }

      // Robustly extract JSON from the raw text to handle markdown backticks
      const jsonMatch = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('[Gemini] Could not find valid JSON in response. Returning fallback.');
        return isMeetingPrepPrompt(prompt) ? FALLBACK_PREP : FALLBACK_AUDIT;
      }

      const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
      console.log('[Gemini] JSON parsed successfully.');
      return parsed;
    } catch (error: any) {
      if (error?.status === 503 && attempt < MAX_RETRIES) {
        const waitMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        console.warn(`[Gemini] 503 High Demand (Attempt ${attempt}/${MAX_RETRIES}). Retrying in ${waitMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        continue;
      }
      
      console.error('[Gemini] CRITICAL — generateInsights failed:', error);
      break;
    }
  }

  // Determine which fallback to return based on the prompt content
  const fallback = isMeetingPrepPrompt(prompt) ? FALLBACK_PREP : FALLBACK_AUDIT;
  console.warn('[Gemini] Returning fallback mock to prevent frontend crash.');
  return fallback;
}

/**
 * Heuristic to determine which fallback shape to use.
 */
function isMeetingPrepPrompt(prompt: string): boolean {
  return prompt.includes('faultLines') || prompt.includes('hygieneCheck') || prompt.includes('MEETING INVITE');
}

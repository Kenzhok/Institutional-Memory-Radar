import { Router, Request, Response } from 'express';
import { generateInsights } from '../adapters/geminiAdapter';
import { recall } from '../adapters/hindsightAdapter';

const router = Router();

/**
 * POST /api/prep
 * Pre-Flight Meeting Preparation — The Recall Cycle
 *
 * Accepts a calendar invite text, recalls relevant memory from Hindsight,
 * and generates structured friction-prediction insights via Gemini.
 *
 * Body: { inviteText: string }
 */
router.post('/prep', async (req: Request, res: Response) => {
  const { inviteText } = req.body as { inviteText?: string };

  if (!inviteText || inviteText.trim().length < 10) {
    res.status(400).json({ error: 'inviteText is required and must be at least 10 characters.' });
    return;
  }

  try {
    // 1. Call Hindsight to recall relevant historical context
    const _recalledDocs = await recall(inviteText);

    // 2. Build a structured prompt combining invite + recalled memory for Gemini
    const _prompt = `
      You are an Institutional Memory AI. Analyze this meeting invite using the recalled historical context below.
      Identify friction fault lines, unresolved agenda debt, and hygiene check items.

      MEETING INVITE:
      ${inviteText}

      RECALLED MEMORY CONTEXT:
      ${_recalledDocs.map((d) => d.content).join('\n\n')}

      Return a strict JSON object that exactly matches this TypeScript interface:
      {
        "meetingContext": { "participants": string[], "scheduledFor": string, "topic": string },
        "faultLines": [
          {
            "id": "unique-id",
            "severity": "high" | "medium" | "low",
            "category": string,
            "title": string,
            "description": string,
            "historicalSignal": string,
            "triggerKeyword": string
          }
        ],
        "agendaDebt": [
          {
            "id": "unique-id",
            "title": string,
            "openedDate": string,
            "openedIn": string,
            "owner": string,
            "description": string,
            "daysOpen": number
          }
        ],
        "hygieneCheck": {
          "overallStatus": "pass" | "fail" | "warning",
          "items": [
            {
              "id": "unique-id",
              "label": string,
              "status": "pass" | "fail" | "warning",
              "detail": string
            }
          ]
        }
      }
    `;
    const _rawInsights = await generateInsights(_prompt);

    const finalResponse = {
      status: 'success',
      generatedAt: new Date().toISOString(),
      ..._rawInsights
    };

    res.json(finalResponse);
  } catch (error) {
    console.error('[/api/prep] Error generating insights:', error);
    res.status(500).json({ error: 'Internal server error during insight generation.' });
  }
});

export default router;

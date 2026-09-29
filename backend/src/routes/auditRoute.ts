import { Router, Request, Response } from 'express';
import { generateInsights } from '../adapters/geminiAdapter';
import { retain } from '../adapters/hindsightAdapter';

const router = Router();

/**
 * POST /api/audit
 * Post-Meeting Audit — The Retain Cycle
 *
 * Accepts raw meeting minutes or a transcript, extracts structured
 * action items via Gemini, and persists the document into the Hindsight
 * memory layer for future recall.
 *
 * Body: { meetingMinutes: string }
 */
router.post('/audit', async (req: Request, res: Response) => {
  const { meetingMinutes } = req.body as { meetingMinutes?: string };

  if (!meetingMinutes || meetingMinutes.trim().length < 20) {
    res.status(400).json({ error: 'meetingMinutes is required and must be at least 20 characters.' });
    return;
  }

  try {
    // 1. Use Gemini to extract structured action items from the meeting minutes
    const _extractionPrompt = `
      You are an Institutional Memory AI. Analyze these meeting minutes.
      Extract: action items (with id, owner, deadline, priority, description, status fields),
      key decisions made (with id, summary, madeBy fields),
      unresolved debates (with id, topic, description, participants fields),
      and a concise meetingSummary string.
      Return a strict JSON object that exactly matches this TypeScript interface:
      {
        "actionItems": [{ "id": string, "owner": string, "deadline": string, "priority": "high" | "medium" | "low", "description": string, "status": string }],
        "decisions": [{ "id": string, "summary": string, "madeBy": string, "madeAt": string }],
        "unresolvedItems": [{ "id": string, "topic": string, "description": string, "participants": string[] }],
        "meetingSummary": string
      }

      MEETING MINUTES:
      ${meetingMinutes}
    `;
    const _rawExtraction = await generateInsights(_extractionPrompt);

    // 2. Retain the full meeting text into the Hindsight memory pipeline
    const docId = await retain(meetingMinutes);

    const finalResponse = {
      status: 'success',
      processedAt: new Date().toISOString(),
      memoryLayer: {
        status: 'injected',
        documentId: docId,
        message: 'Meeting transcript successfully embedded into the Hindsight memory pipeline.',
        vectorCount: 1, // Vector count not exposed by /retain response
        pipelineId: process.env.HINDSIGHT_BANK_ID ?? 'pipeline_stub_demo',
      },
      extractedInsights: {
        actionItems: _rawExtraction.actionItems || [],
        decisions: _rawExtraction.decisions || [],
        unresolvedItems: _rawExtraction.unresolvedItems || [],
        meetingSummary: _rawExtraction.meetingSummary || "Meeting processed successfully."
      },
    };

    res.json(finalResponse);
  } catch (error) {
    console.error('[/api/audit] Error processing meeting minutes:', error);
    res.status(500).json({ error: 'Internal server error during audit processing.' });
  }
});

export default router;

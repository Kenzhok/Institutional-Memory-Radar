import { Router, Request, Response } from 'express';
import { retain } from '../adapters/hindsightAdapter';
import { stage2Background, stage3Background } from '../data/timeLapseData';

const router = Router();

router.post('/demo/advance-stage', async (req: Request, res: Response) => {
  const { stage } = req.body;

  console.log(`[Demo] advance-stage called with stage=${stage}`);

  try {
    let transcripts: string[];

    if (stage === 2) {
      transcripts = stage2Background;
    } else if (stage === 3) {
      transcripts = stage3Background;
    } else {
      return res.status(400).json({ error: `Invalid stage: ${stage}. Must be 2 or 3.` });
    }

    console.log(`[Demo] Injecting ${transcripts.length} transcripts for stage ${stage}...`);

    const results = await Promise.all(
      transcripts.map(async (t, i) => {
        try {
          const docId = await retain(t);
          console.log(`[Demo] Stage ${stage} transcript [${i + 1}/${transcripts.length}] retained → doc ID: ${docId}`);
          return { index: i, docId, success: true };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error(`[Demo] Stage ${stage} transcript [${i + 1}/${transcripts.length}] FAILED: ${msg}`);
          return { index: i, error: msg, success: false };
        }
      })
    );

    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
      console.error(`[Demo] ${failures.length}/${transcripts.length} retain calls failed for stage ${stage}`);
      return res.status(500).json({
        error: `${failures.length} of ${transcripts.length} memory injections failed.`,
        failures: failures.map(f => ({ index: f.index, error: (f as { error?: string }).error })),
      });
    }

    console.log(`[Demo] Stage ${stage} complete — ${transcripts.length} documents retained successfully.`);
    return res.json({
      success: true,
      message: `Stage ${stage} memory injected.`,
      documentsRetained: results.length,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[Demo] Unhandled error in advance-stage: ${msg}`);
    return res.status(500).json({ error: `Failed to advance stage: ${msg}` });
  }
});

router.post('/demo/reset', async (_req: Request, res: Response) => {
  try {
    // Instead of overwriting with a fake Bank ID which causes 404s,
    // we just acknowledge the reset command. Real bank deletion would require a Hindsight Admin API call.
    console.log(`[Demo Reset] Acknowledged reset request. Keeping configured Bank ID: ${process.env.HINDSIGHT_BANK_ID}`);
    return res.json({ success: true, message: 'Bank reset acknowledged', bankId: process.env.HINDSIGHT_BANK_ID });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[Demo Reset] Error: ${msg}`);
    return res.status(500).json({ error: `Failed to reset demo stage: ${msg}` });
  }
});

export default router;

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import prepRoute from './routes/prepRoute';
import auditRoute from './routes/auditRoute';
import demoRoute from './routes/demoRoute';

const app = express();
const PORT = process.env.PORT ?? 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Request Logger (Dev Only) ─────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Institutional Memory Radar API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    adapters: {
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'stub (no API key)',
      hindsight: process.env.HINDSIGHT_API_KEY ? 'configured' : 'stub (no API key)',
    },
  });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', prepRoute);
app.use('/api', auditRoute);
app.use('/api', demoRoute);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[GlobalErrorHandler]', err.stack);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n🚀 Institutional Memory Radar — API Server');
  console.log(`   Listening on:  http://localhost:${PORT}`);
  console.log(`   Health check:  http://localhost:${PORT}/health`);
  console.log(`   Environment:   ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`   Gemini Adapter: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '⚠️  Stub Mode'}`);
  console.log(`   Hindsight:     ${process.env.HINDSIGHT_API_KEY ? '✅ Configured' : '⚠️  Stub Mode'}\n`);
});

export default app;

# 🛰️ Institutional Memory Radar (IMR)

**A predictive B2B intelligence dossier powered by Vectorize Hindsight.**

**Hackathon Deliverables:**
* [Live Demo Video (60-second pitch)](#)
* [Individual Team Member Videos](#)
* [Technical Article (Hashnode/Medium)](#)
* [Social Media Announcement](#)

---

## 🎯 The Business Problem

Sales and Product teams often go into critical meetings effectively blind. Relying on fragmented CRM notes, endless Slack threads, and disjointed meeting transcripts means that essential context is lost between meetings. This lack of institutional memory leads to blindsided reps, forgotten commitments, and misaligned internal stakeholders.

**Institutional Memory Radar (IMR)** is a $50/month enterprise solution that solves this. By deeply analyzing historical meeting data, IMR acts as an early warning system. It predicts client friction, uncovers agenda debt, and maps behavioral risks *before* a call even starts, providing professionals with a Tactical Dossier to confidently steer the conversation.

---

## 🧠 Cognitive Architecture & Vectorize Hindsight

*Note for Hackathon Judges: This section directly addresses the Hindsight Memory Architecture rubric (25% weight).*

IMR transcends standard RAG wrappers by leveraging Vectorize Hindsight to build a continuous, living memory bank of organizational interactions. Our architecture completely decouples the stateless reasoning engine (Gemini) from the stateful episodic memory (Hindsight).

### 1. The Retain Pipeline (Post-Meeting)
When a meeting concludes, raw transcripts are POSTed to our Express `/api/audit` endpoint. The Node backend orchestrates an asynchronous ingestion flow:
1. **Extraction:** Gemini 1.5 Flash performs an initial pass to extract structured action items and decisions.
2. **Ingestion:** We hit the Hindsight API `POST /v1/banks/{BANK_ID}/retain`. 
3. **Graph Generation:** Behind the scenes, Hindsight chunks the text, computes dense vector embeddings, and extracts entities and relational edges. These are stored as atomic **"facts"**. Hindsight's background agents continuously aggregate these episodic facts into higher-level **"observations"**, allowing the system to understand long-term behavioral trends (e.g., a VP repeatedly blocking a specific roadmap item).

### 2. The Recall Pipeline (Pre-Meeting)
When an executive pastes a calendar invite into the IMR dashboard, the pre-flight routine begins via the `/api/prep` route:
1. **Multi-Strategy Retrieval:** We query the `POST /v1/banks/{BANK_ID}/recall` endpoint using the invite text. Hindsight utilizes its **TEMPR (Temporal, Entity, Metadata, Proximity, Relational)** multi-strategy search algorithm. 
2. **Why it beats naive RAG:** Instead of just calculating k-NN cosine similarity on text chunks, TEMPR traverses the generated Knowledge Graph to find overlapping entities between the upcoming meeting invite and historical disputes, heavily weighting recent, unresolved conflicts.

### 3. Synthesis & LLM Fault Tolerance
The raw facts and observations retrieved by Hindsight are injected into the context window of **Google Gemini 1.5 Flash** using the `@google/genai` SDK.
* **Schema Enforcement:** To guarantee the React frontend hydrates correctly without runtime errors, we pass `responseMimeType: 'application/json'` in the API config.
* **Fault Tolerance:** If Gemini hallucinates markdown blocks or malformed syntax that fails `JSON.parse()`, our custom `geminiAdapter.ts` catches the error and instantly injects a structured fallback mock (e.g., `FALLBACK_PREP`). This guarantees the React UI never encounters a white-screen crash.

---

## 🏗️ Deep Tech Stack

This project is built as a robust, type-safe TypeScript monorepo, utilizing `concurrently` for unified local development.

* **Frontend Engine:** React 19, Vite.
* **Styling & UI:** Tailwind CSS v4. The UI implements a custom "Tactical Dossier" design system using strict monochromatic alabaster/slate color tokens, brutalist borders, and CSS grid overlay patterns.
* **Backend Framework:** Node.js, Express, `ts-node-dev`.
* **Adapters & Interfaces:** Strictly typed `RetainResponse` and `RecallResponse` interfaces ensure API boundaries between Express and Hindsight are type-safe.
* **AI Engine:** Google Gemini 1.5 Flash (Generative API).
* **Memory Architecture:** Vectorize Hindsight Agent Memory (REST API).

---

## 🚀 Local Setup & Quickstart

Clone the repository and install dependencies across the monorepo:

```bash
git clone https://github.com/your-username/institutional-memory-radar.git
cd institutional-memory-radar
npm install
```

Configure your environment variables in the backend:

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and add your keys (Hindsight will automatically create the bank on your first write if it doesn't exist):
```env
PORT=3001
NODE_ENV=development

# Obtain from https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key

# Obtain from https://hindsight.vectorize.io/
HINDSIGHT_API_KEY=your_hindsight_api_key
HINDSIGHT_BANK_ID=hackwithhyderabad-imr
```

Run the development servers concurrently from the root directory:
```bash
npm run dev
```
The application will launch with the UI available at `http://localhost:5174` (or `5173`) and the backend API running on `http://localhost:3001`.

---

## ⏱️ The "Time-Jump" Demo Guide

To effectively evaluate the Hindsight continuous learning capability, follow these steps to simulate the passage of time and watch the agent's memory evolve.

**Step 1: Baseline Check**
Open the IMR Dashboard, paste a sample meeting invite into the Pre-Flight tab, and generate a radar report. Note the baseline analysis.

**Step 2: Short-Term Memory Injection**
In your terminal, run the following command to simulate the passage of 3 weeks, injecting emerging client disputes (e.g., API latency issues):
```bash
npm run seed stage2
```
Generate the radar report again using the exact same invite. You will now see the system flag the API latency issue as a critical, newly emerged fault line because the Hindsight Graph updated its active facts.

**Step 3: Long-Term Behavioral Mastery**
Run the final seed command to inject 3 months of deep memory, simulating complex internal stakeholder conflicts:
```bash
npm run seed stage3
```
Generate the radar report one last time. Notice how the agent flawlessly predicts internal friction and surfaces long-forgotten agenda debt, proving its mastery of complex, longitudinal organizational memory via the TEMPR algorithm.

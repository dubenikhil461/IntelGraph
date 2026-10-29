---
label: wayfinder:map
tracker: local-markdown
---

## Destination

A decided, hand-off-ready spec for a deployed career-intelligence service with an interactive web page. It collects public data (GitHub, tech-blog RSS, company career pages, Hacker News) about roles, companies and tech trends, stores embeddings in a vector DB, and answers questions through an agentic RAG loop. The same Render deployment serves the API and a Vue chat page. Every stack, source, hosting and design decision is recorded, so building can start without re-deciding.

## Notes

- Owner is a beginner with this stack. Prefer the simplest choice that still reads well on a resume.
- Backend first. One Render deployment: the Node API serves a Vue (Vite) build of an interactive chat page. The UI is a thin layer over the API, not a second app.
- Public data only. OSINT here means public companies, roles, posts and repos, not private individuals.
- Stack is TypeScript on Node with LangChain.js and LangGraph.js. Gemini API key already exists from the day 2 work.
- Hosting is deployed online, so auth, secrets, and cost limits matter.
- Skills to call when resolving tickets: `grilling` and `domain-modeling` for HITL, `research` for AFK, `prototype` for prototypes.
- No issue tracker is configured for this repo. This map uses the local-markdown tracker under `.scratch/wayfinder-osint-rag/`.

## Decisions so far

- [Pick the implementation language](tickets/001-language.md): TypeScript on Node with LangChain.js and LangGraph.js, chosen by the owner over Python.
- [Pin the source set](tickets/002-sources.md): GitHub API, tech-blog RSS, company career pages, Hacker News API. Chosen by the owner.
- [Pick the hosting model](tickets/003-hosting.md): deployed online, chosen by the owner. Host and auth still open (see the hosting ticket below).
- [Design the agentic RAG loop and answer contract](tickets/007-agentic-rag.md): simple tool-calling agent with vector search and a metadata filter; answers return sources and a found, partial, or not_found confidence.
- [Choose host, auth, and secrets for the deployed API](tickets/008-deploy.md): Botnix Standard 4GB at ₹400 a month for the app; Neon free for Postgres with pgvector; paid Gemini. Query endpoint is public and rate-limited; collection needs an API key; secrets are environment variables. Total about $8 a month without summaries, about $20 with them.
- [Sketch the API surface with sample calls](tickets/009-api-sketch.md): streamed answers; a daily collection run (set in the deploy ticket); confidence label plus a 0 to 1 score.
- Collection runs daily, triggered by an external scheduler calling the collect endpoint, so the job doesn't depend on the app staying awake. Recorded in [the deploy ticket](tickets/008-deploy.md).
- Scope redrawn: a small interactive UI is in scope, served by the same deployment, built with Vue. Recorded in [the UI ticket](tickets/010-ui.md).
- [Check terms and robots rules for the four sources](tickets/006-source-terms.md): GitHub, Hacker News, and RSS are go. Career pages only through public ATS JSON (Greenhouse, Lever, Ashby). Individual career sites and blog robots.txt still need checking.
- [Compare vector DBs for a TypeScript, deployed backend](tickets/004-vector-db.md): pgvector on Postgres, fallback Qdrant. Postgres is the usual default and filters are plain SQL. Job-posting demand is unmeasured.
- [Check free-tier limits for embedding and generation](tickets/005-model-limits.md): `gemini-embedding-2` (3072 dims) and Gemini 3.1 Flash-Lite. Free tier is fine for a demo but not reliable for a daily collection run. Voyage `voyage-3.5-lite` is the fallback.

## Live tickets

- Model billing: paid Gemini, chosen by the owner. Estimate about $3 a month for embeddings and queries, about $15 a month if items are summarised by the model. Hosting not priced yet. Assumptions and sources are in the deploy ticket.
- [Build the interactive Vue chat page](tickets/010-ui.md) (prototype, HITL), blocked by 009
- [Scaffold the Vue app and serve it from the API](tickets/011-vue-scaffold.md) (task, AFK), blocked by 010
- [Stream answers into the chat page](tickets/012-chat-streaming.md) (task, AFK), blocked by 011
- [Show collection status in the chat page](tickets/013-status-panel.md) (task, AFK), blocked by 009 and 011

## Not yet specified

- How collection runs and dedupes: schedule, retries, and how repeat postings are detected.
- How RAG quality is measured: an eval set and metrics that can go on a resume.
- Retention of stored data and how often the stored corpus is refreshed.

## Out of scope

- A separate frontend host or app. The UI ships inside the same deployment.
- Mobile apps, user accounts, and a full dashboard. Only the one chat page is in scope.
- Profiling or scraping private individuals (people search, personal social accounts). Outside public-company career intel and carries privacy risk.
- Auto-applying to jobs or sending messages on the user's behalf.

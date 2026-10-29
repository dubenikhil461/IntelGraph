---
title: Sketch the API surface with sample calls
label: wayfinder:prototype
type: HITL
status: closed
assignee:
blocked_by: [007, 008]
resolution: stream answers; collection on demand first; confidence label plus numeric score
---

## Question

What do the endpoints look like, and does a sample call feel right?

Prototype:
- Collection: trigger or schedule a collect run per source
- Ingest status: what has been stored, and when it was last updated
- Ask: the question endpoint, returning the answer contract from the agentic RAG ticket

Output: a short list of endpoints with one sample request and response each, and the owner's reaction in one line.

## Draft (for review)

Auth default, pending ticket 008: the query endpoint is public and rate-limited. Collection endpoints need an API key from an environment variable.

**GET /api/health**
Response: `{"status": "ok"}`

**POST /api/ask** (public, rate-limited)
Request: `{"question": "Which backend skills appear most in agentic RAG roles this month?"}`
Response:
```json
{
  "answer": "pgvector and LangGraph appear most often in the recent postings...",
  "confidence": "partial",
  "sources": [
    {"title": "Backend Engineer, RAG", "link": "https://example.com/job/123", "date": "2026-10-20", "source": "greenhouse"}
  ]
}
```

**GET /api/status** (public)
Response:
```json
{
  "sources": [
    {"source": "github", "last_run": "2026-10-29T06:00:00Z", "items_stored": 412},
    {"source": "hackernews", "last_run": "2026-10-29T06:00:00Z", "items_stored": 180}
  ]
}
```

**POST /api/collect** (API key required)
Request: `{"source": "github"}`
Response: `{"run_id": "run_8f2a", "status": "queued"}`

## Resolution

- `/api/ask` streams its answer word by word.
- Collection runs daily. "Collection" means the job that fetches public items from the four sources, embeds them, and stores them in pgvector. The schedule is an external scheduler calling `POST /api/collect` each day, not a timer inside the app, since a sleeping free service would miss it. Details are in the deploy ticket. `POST /api/collect` stays available for manual runs.
- `confidence` stays as the label `found`, `partial`, or `not_found`, and the response also carries a numeric `score` from 0 to 1.

Revised `/api/ask` response:
```json
{
  "answer": "pgvector and LangGraph appear most often in the recent postings...",
  "confidence": "partial",
  "score": 0.62,
  "sources": [
    {"title": "Backend Engineer, RAG", "link": "https://example.com/job/123", "date": "2026-10-20", "source": "greenhouse"}
  ]
}
```

Still assumed, pending the deploy ticket: the query endpoint is public and rate-limited, and collection needs an API key.

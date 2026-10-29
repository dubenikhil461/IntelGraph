---
title: Compare vector DBs for a TypeScript, deployed backend
label: wayfinder:research
type: AFK
status: closed
assignee:
blocked_by: []
resolution: pgvector on Postgres, fallback Qdrant
---

## Question

Which vector store fits a TypeScript backend that is deployed online, and is worth naming on a resume?

Compare Chroma, pgvector (Postgres), Qdrant, and LanceDB on:
- Setup for a beginner, and whether it runs as a managed service, in Docker, or as a single file
- TypeScript client support and maturity
- Metadata filtering, which the agent needs for queries like "roles posted this month"
- Cost on a deployed free or low tier
- How often it appears in current backend and RAG job postings

Output: one recommended store, one fallback, and the reason for each.

## Resolution

Recommended: pgvector on Postgres. Postgres is already the default database in most backends, so it adds no new service. Metadata filters are plain SQL `WHERE` clauses, so "roles posted this month" is a date filter combined with the vector `ORDER BY`. Node client: `pgvector-node`, which works with `pg`, Drizzle, or Prisma. Caveat: approximate HNSW or IVFFlat indexes filter after the index scan, so use iterative scans or a B-tree on the filter column. Supabase's free tier (500 MB, pauses after a week of inactivity) is not confirmed to support pgvector; verify before deploying.

Fallback: Qdrant. One-command Docker setup, official `@qdrant/js-client-rest` client, payload filtering with payload indexes. Qdrant Cloud Free is a 0.5 vCPU, 1 GB node.

Not recommended: Chroma (workable, but cloud free detail is thin, and it adds a service); LanceDB (embedded, no clear managed free tier, weaker for a deployed service).

Job-posting demand is unmeasured. An Indeed search for these names returned no matching titles. Name pgvector on the resume with a concrete project; SQL plus Postgres is the most transferable skill.

Sources: https://github.com/pgvector/pgvector, https://supabase.com/pricing, https://qdrant.tech/documentation/quickstart/, https://qdrant.tech/pricing/, https://docs.trychroma.com/docs/overview/getting-started, https://docs.lancedb.com/search/filtering.

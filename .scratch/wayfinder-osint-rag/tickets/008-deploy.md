---
title: Choose host, auth, and secrets for the deployed API
label: wayfinder:grilling
type: HITL
status: closed
assignee:
blocked_by: [004, 005]
resolution: Botnix Standard 4GB for the app, Neon free for Postgres with pgvector, public rate-limited query, API-key collection, secrets in environment variables
---

## Question

Since the backend is deployed online, which host, auth model, and secrets handling fit a beginner on a free or low budget?

Decide with the owner:
- Host: a PaaS (Render, Railway, Fly.io) or a container platform (Cloud Run). Weigh free-tier limits and cold starts.
- Vector DB placement: managed, or self-hosted next to the API. Follows from ticket 004.
- Auth for the query endpoint: public read, API key, or none. Collection endpoints must not be public.
- Secrets: where the Gemini key and any source tokens live, and how they are rotated.
- Cost ceiling per month, and what happens when a limit is hit.

Output: host, auth model, secrets location, and monthly cost ceiling.

## Resolution (partial)

Host: owner chose Render or Railway, a PaaS that deploys from GitHub. Postgres add-on for pgvector.

Model billing: owner chose paid Gemini. Estimated model cost is about $3 a month with no LLM summaries, and about $15 a month if each collected item is summarised by the model. Hosting is extra and not yet priced. Full estimate in the map's Decisions so far.

Cost estimate, paid Gemini (prices from Google's pricing page, checked 2026-10-29):
- Assumptions: 500 new items a day, about 500 tokens each, so 250K embedding tokens a day, 7.5M a month. 200 questions a month, about 9K input and 1.5K output tokens each across the agent's calls.
- Embeddings (`gemini-embedding-2`, $0.20 per 1M text tokens standard, $0.10 batch): about $1.50 a month standard, $0.75 batch.
- Questions (`gemini-3.1-flash-lite`, $0.25 input and $1.50 output per 1M tokens): about $0.90 a month for 200 questions, about $4.50 for 1,000.
- Optional item summaries by the model: about $12 a month at 500 items a day.
- Total model cost: about $3 a month without summaries, about $15 with them. Heavier use scales linearly.
- Set a $10 monthly budget alert in the Google billing account as the ceiling.
- Caveat: the pricing page has a conflicting intro line for the embedding model. Verify the table before relying on it.

Hosting: owner is using Render's free tier. Web service is free but sleeps when idle, so the first request after a sleep is slow. Free Postgres expires after 30 days unless upgraded, which matters for pgvector data. Both points are from memory of Render's docs and not re-checked this session; verify before relying on them.

Collection schedule: owner chose a daily scheduled run. Plan: a scheduler (for example GitHub Actions on a cron trigger) calls `POST /api/collect` each day, so the job does not depend on the app staying awake. Check GitHub's free minutes for the repo before relying on it.

Host alternative (monthly billing, not annual), researched 2026-10-29:
- **Railway:** usage-based. The Hobby plan is $5 a month and includes $5 of usage credit. Extra usage is billed on top at community-reported rates of about $10 per GB RAM, $20 per vCPU, $0.15 per GB storage, and $0.05 per GB egress per month (not checked on the official page). Unused credit does not carry over. One user saw about $1.74 over five days for a Postgres instance plus test services. Not a managed database: no automated failover or point-in-time recovery on lower tiers.
- **Fly.io:** pay-as-you-go by machine size; billed while a machine runs, with hibernation available. Example Postgres cost around $15 a month from one anecdote, not verified.
- **Render (current):** free web service sleeps when idle; the free database expires after 30 days. Paid plans are also billed monthly.
- **Google Cloud Run:** scale-to-zero and a free tier, but pricing was not found in this check.

Recommendation: Railway Hobby for a monthly plan with a predictable $5 base, pending a check of the live Postgres price. Owner has not yet chosen; the host decision stays open until then.

Database decision: owner chose Neon's free plan for Postgres with pgvector, with the app still on Render's free web service. Neon's free plan includes pgvector and suspends compute after five minutes idle. Free-tier figures reported by two sources: 100 compute-hours and 0.5 GB per project. Sources disagree, and the markaicode page lists a smaller figure, so check neon.com/docs/introduction/plans before relying on them. Because Neon holds the data, Render's 30-day free-database expiry no longer applies.

Host decision (supersedes the Render plan above): owner chose Botnix Cloud as an instance-based host for the API and the Vue build. Its pricing and billing could not be verified by search, so the monthly cost of the instance is unknown. Needed before closing: the provider's pricing page and whether billing is monthly.

Auth decision: the query endpoint (`POST /api/ask`) is public and rate-limited, with no login. Collection (`POST /api/collect`) stays behind an API key.

Secrets decision: the Gemini key, the Neon database URL, and the collection API key are set as Botnix Cloud environment variables. None are committed to the repo.

Botnix pricing (read from https://botnix.in/vps-hosting, 2026-10-29): Standard 4GB at ₹400 a month, 2 vCPU, 4 GB RAM, 50 GB NVMe. Larger plans: 8GB ₹800, 16GB ₹1,600, 32GB ₹2,999, 64GB ₹5,499. The page lists INR only, with no USD figures. Each plan shows "/mo" with the same price at renewal and cancel anytime. No setup fee is listed, and the page says "zero convenience fees". No free trial; there is a 7-day money-back guarantee. Annual billing is not mentioned as required, but the page does not say that monthly is the only option either. Node.js is not named on the page, so confirm it can run the API before deploy.

Monthly total (chosen setup: Standard 4GB, Neon free, Gemini paid without summaries):
- Botnix Standard 4GB: ₹400 (about $5 at roughly ₹85 to ₹90 per dollar; check the current rate).
- Gemini: about $3 a month, or about $15 with summaries.
- Neon free plan: $0 within its limits.
- Total: about $8 a month without summaries, about $20 with them.

Closed: host, auth, and secrets are decided. Rotation of secrets is left for later.

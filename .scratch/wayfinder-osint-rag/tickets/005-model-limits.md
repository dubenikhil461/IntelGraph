---
title: Check free-tier limits for embedding and generation
label: wayfinder:research
type: AFK
status: closed
assignee:
blocked_by: []
resolution: Gemini embedding and generation, with a daily-run caveat; Voyage as paid-ish fallback
---

## Question

Can a deployed backend run on free tiers? Check the current limits and terms for:
- Google Gemini embedding and generation models (the owner already has a free API key)
- One low-cost or free fallback embedding option

For each: requests per minute, requests per day, embedding dimension, context size, and whether the free tier allows the planned use (automated collection and public deployment).

Output: the chosen embedding model and its dimension (the vector DB must match it), the chosen generation model, and any limit that would break a daily collection run.

## Resolution

Checked 2026-10-29. The free tier can run a deployed demo and small runs. It cannot be relied on for a daily automated collection run, because Google does not publish per-project limits and third-party figures are very low.

- Embedding: `gemini-embedding-2`, default 3072 dimensions (`output_dimensionality` takes 128 to 3072; 768, 1536, or 3072 recommended). 8,192-token input. No `task_type` parameter, so use a task prefix in the text. Listed as free for input. `gemini-embedding-001` is the text-only alternative, with a 2,048-token limit. The vector DB dimension must match whichever is chosen.
- Generation: Gemini 3.1 Flash-Lite, listed as free. Grounding is not available on the free tier.
- Limits: unverified. A third-party report from Sept 2026 cites about 500 requests/day for 3.x Flash-Lite and 20 for 3.x Flash. Limits reset at midnight Pacific. Check the live numbers in AI Studio, which needs a login.
- Terms: free-tier inputs and outputs may be used to improve Google products, and human reviewers may read them. Do not send personal data. In the EEA, client apps exposed to users must use paid services.
- Fallback: Voyage AI `voyage-3.5-lite`, 1024 dimensions, 32,000-token context. It has a free token allowance, but a payment method is needed for useful rate limits (the trial without one is 3 RPM).

Decision this creates for the deploy ticket: either pay for Gemini, or accept a demo-only daily cap and collect in small batches. Cost ceiling goes in the deploy ticket.

Sources: https://ai.google.dev/gemini-api/docs/rate-limits, https://ai.google.dev/gemini-api/docs/pricing, https://ai.google.dev/gemini-api/docs/embeddings, https://ai.google.dev/gemini-api/terms, https://docs.voyageai.com/docs/pricing.

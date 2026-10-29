---
title: Design the agentic RAG loop and answer contract
label: wayfinder:grilling
type: HITL
status: closed
assignee:
blocked_by: [004, 005]
resolution: simple tool-calling agent, not a LangGraph state machine
---

## Question

What does the agent do between a user question and an answer?

Decide with the owner:
- The loop shape: a single tool-calling agent, or a LangGraph state machine with steps such as route, retrieve, grade, rewrite, answer. Pick the simplest that still shows agentic behaviour.
- The tools the agent can call: vector search, metadata filter, and possibly a live fetch.
- The answer contract: what it must return (answer, sources with links, confidence or "not found"), and when it must refuse.
- The three to five career questions from the destination, and which step each one exercises.

Output: a one-page loop diagram in text, and the answer schema.

## Resolution

Owner chose a simple agent with tools. One LLM decides when to call the search tools, then answers with sources. Not a LangGraph state machine, which is noted as a later upgrade.

Tools: vector search over the stored postings, and a metadata filter (source, date, company). No live fetch in v1.

Answer contract: `answer`, `sources` (title, link, date for each), and `confidence` (`found`, `partial`, or `not_found`). When nothing relevant is retrieved, return `not_found` rather than guess.

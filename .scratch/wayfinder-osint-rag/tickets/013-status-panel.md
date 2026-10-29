---
title: Show collection status in the chat page
label: wayfinder:task
type: AFK
status: open
assignee:
blocked_by: [009, 011]
---

## Question

Add a small panel to the chat page that reads `GET /api/status` and shows, for each source, the last collection run and the number of items stored.

Done when:
- The panel loads on page open and refreshes when the user clicks it.
- A source with no run yet shows "never run", not an error.

Output: the panel working in the deployed page.

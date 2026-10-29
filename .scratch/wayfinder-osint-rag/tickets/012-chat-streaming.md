---
title: Stream answers into the chat page
label: wayfinder:task
type: AFK
status: open
assignee:
blocked_by: [011]
---

## Question

Connect the chat page to `POST /api/ask` and show the answer as it streams, word by word, as decided in the API sketch.

Done when:
- A question typed in the page shows the answer streaming in.
- The sources list and the `found`, `partial`, `not_found` badge with the 0 to 1 score appear when the stream ends.
- A failed or slow request shows a clear message, not a blank page.

Output: the working chat flow, and a note of any stream format the API must send.

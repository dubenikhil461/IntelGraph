---
title: Scaffold the Vue app and serve it from the API
label: wayfinder:task
type: AFK
status: open
assignee:
blocked_by: [010]
---

## Question

Set up a Vue 3 + Vite app in the repo and make the API serve its built files at `/`, so one Botnix Cloud deployment serves both.

Done when:
- `npm run build` produces static files in a `dist` folder.
- The API serves `dist` at `/` and keeps `/api/*` for JSON.
- A placeholder page loads from the deployed URL.

Output: the scaffold committed on a branch, and the one-line result of loading the placeholder page.

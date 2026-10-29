---
title: Check terms and robots rules for the four sources
label: wayfinder:research
type: AFK
status: closed
assignee:
blocked_by: []
resolution: GitHub, Hacker News, and RSS go; career pages only via public ATS JSON
---

## Question

For each source (GitHub API, tech-blog RSS, company career pages, Hacker News API), what may an automated collector legally and politely do?

Check:
- Terms of service and API usage limits
- robots.txt behaviour for career pages, and whether any page forbids automated access
- Whether each source requires attribution or limits storage and redistribution of content
- Which company career sites expose a feed or public JSON, which would need a parser per site

Output: a go/no-go per source, the rate limit each collector must respect, and what the collector must store (link and summary only, or full text).

## Resolution

Checked 2026-10-29 against primary pages. This is research for a personal portfolio project, not legal advice.

Go/no-go:
- GitHub REST API: go, with an authenticated token. The ToS bars using the API to sell personal information to recruiters or job boards, so do not harvest profile emails or personal data.
- Hacker News: go, official Firebase API only. Do not scrape the HTML site; the YC terms prohibit scraping. The collector must be read-only.
- Tech-blog RSS: go per feed, after checking each site's robots.txt and ToS.
- Company career pages: go only for public ATS JSON (Greenhouse, Lever, Ashby). A custom career site without a public feed is no-go unless its robots.txt and ToS allow it, and it needs a per-site parser.

Rate limits:
- GitHub: 5,000 requests/hour authenticated. Secondary limit of 900 points/min for REST. Back off on 403/429.
- Hacker News: no published limit. Courtesy limit of 1 request/second.
- RSS: no published limit. Poll at most hourly per feed, using ETag or Last-Modified.
- Career ATS: no read limit published for Greenhouse or Ashby; Lever documents only a 2 POST/s application limit. Courtesy limit of 1 request/second per host.

Robots notes: github.com has no /api/ disallow for generic agents. boards.greenhouse.io disallows only /embed/. jobs.lever.co allows / but carries Content-Signal ai-train=no. jobs.ashbyhq.com disallows /api/ for generic agents, and its posting API is on a different host that still needs checking.

What to store: GitHub repo metadata only. HN item metadata and the item link, no comment text. RSS title, link, date, and excerpt, with the source link kept. Career postings title, company, location, posted date, link, and a short summary, not the full description. No listed API requires attribution beyond linking to the source.

Gaps: individual company career sites and blog robots.txt files were not checked. Each needs its own check before the collector touches it.

Sources: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api, https://github.com/HackerNews/API, https://news.ycombinator.com/robots.txt, https://docs.greenhouse.io/job-board.html, https://github.com/lever/postings-api, https://developers.ashbyhq.com/docs/public-job-posting-api, https://jobs.ashbyhq.com/robots.txt, https://www.rssboard.org/rss-specification.

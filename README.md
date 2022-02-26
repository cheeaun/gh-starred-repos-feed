# 👷 gh-starred-repos-feed

A Cloudflare Worker that returns the starred repos of a GitHub user as a RSS feed

# Give it a try

```
https://gh-starred-repos-feed.cheeaun.workers.dev/[USERNAME].[FORMAT]
```

- `USERNAME`: GitHub username
- `FORMAT`: `rss` or `json` (JSON Feed)

Example: <https://gh-starred-repos-feed.cheeaun.workers.dev/cheeaun.rss>

## Technicalities

- `wrangler dev` - start local development server
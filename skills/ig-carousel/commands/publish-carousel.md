# /publish-carousel — Publish a generated carousel to Instagram via Postiz

**Trigger:** user says "publish carousel", "post this", "schedule the carousel", "ship it", or runs `/publish-carousel`.

**Purpose:** take an exported carousel folder (`{output_dir}/YYMMDD-topic-slug/`) and submit it to Postiz as either a draft or a scheduled post on the brand's connected Instagram account. Captions, hashtags, and slide PNGs all come from files already produced by the skill.

**Prerequisites:**
1. Postiz CLI installed globally: `npm install -g postiz`
2. Authenticated: run `postiz auth:login` once (device flow, credentials saved to `~/.postiz/credentials.json`)
3. `.carousel.md` has `publishing.postiz.enabled: true` AND a non-empty `integration_id`
4. The target carousel folder contains: `index.html`, `caption.md`, `slide-01.png` … `slide-NN.png`

If any prerequisite is missing, stop and tell the user concretely what's missing. Don't attempt to fix it without permission.

## Inputs

This command expects ONE positional argument — the path to the carousel folder.

```
/publish-carousel ig-carousel/260421-claude-design-economics/
```

Optional flags (parse from the user's message):
- `--draft` — force `type: "draft"` (overrides config; safest)
- `--now` — schedule for current time + 1 minute
- `--at "<ISO-8601>"` — schedule for a specific UTC timestamp (e.g. `--at "2026-04-22T14:00:00Z"`)
- `--dry-run` — upload images and build the payload, but do NOT submit to Postiz. Print the would-be command and exit.

If no schedule flag is given, use `publishing.postiz.default_type` from `.carousel.md` (typically `draft` initially) and `publishing.postiz.default_offset_minutes` (typically 60) for the schedule time.

## Step 1 — Validate inputs

1. Confirm the carousel folder exists.
2. Confirm `index.html`, `caption.md` exist.
3. Find all `slide-*.png` files. Sort lexically. Must be at least 1.
4. Read `.carousel.md` from the project root. Confirm:
   - `publishing.postiz.enabled: true`
   - `publishing.postiz.integration_id` is a non-empty string (e.g. `cmoszdgm901t8mq0y2su6zxe3`)
5. Confirm Postiz auth is valid: run `postiz auth:status`. If "Not authenticated," stop and tell the user to run `postiz auth:login`.

If anything fails, abort and report the specific issue. Never attempt to publish a partial deliverable.

## Step 2 — Build the caption text

Read `caption.md`. The file contains:
- Caption body (multi-paragraph)
- A separator line (often `---`)
- Hashtags

The ENTIRE file content goes into the post's `content` field. Postiz treats the caption as one string.

Strip:
- The standalone `---` separator line if present (replace with a blank line for visual breathing room).
- Any leading or trailing whitespace.

Verify the caption is ≤ 2,200 characters (IG limit). If over, abort and ask the user to trim.

## Step 3 — Resolve schedule time

Determine the schedule timestamp (always required by Postiz):

| User input | Schedule time | Type |
|---|---|---|
| `--draft` (no time flag) | now + 1 min (placeholder; type=draft means it doesn't fire) | `draft` |
| `--now` | now + 1 min | `schedule` |
| `--at "2026-04-22T14:00:00Z"` | parse as UTC | `schedule` |
| nothing | now + `default_offset_minutes` | `default_type` |

Format as ISO 8601 UTC (e.g. `2026-04-22T14:00:00Z`). Include the `Z` suffix.

## Step 4 — Show the user a preview and confirm

Always show this preview, even when `--dry-run` is set. Block until user confirms.

```
Publish Preview
───────────────
Folder:        ig-carousel/260421-claude-design-economics/
Account:       Looplinq (instagram-standalone)
Integration:   cmoszdgm901t8mq0y2su6zxe3
Type:          draft (or schedule)
Schedule:      2026-04-22T14:00:00Z (in 60 minutes)
Slides:        6 PNGs (slide-01.png ... slide-06.png)
Caption:       1,216 chars / 191 words

Caption preview (first 200 chars):
  "I watched a creator drop $800 on a brand package last week.

  She didn't need to.

  For two years, creators had three options: pay a designer..."

Confirm publish? (y / n / preview-full)
```

If user types `preview-full`, print the entire caption then re-prompt. If `n`, abort. Only proceed on explicit `y`.

For `require_confirmation: false` (rare; only set by power users) skip the confirmation but ALWAYS show the preview as a one-shot summary before submitting.

## Step 5 — Upload each slide PNG

For each PNG in the folder, sequentially:

```bash
postiz upload "<absolute-path-to-slide-NN.png>"
```

Each call returns JSON like:
```json
{
  "id": "e639003b-f727-4a1e-87bd-74a2c48ae41e",
  "name": "slide-01.png",
  "path": "https://uploads.postiz.com/<...>.png",
  "organizationId": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

Collect the `path` (URL) from each response. You'll need them in slide order (slide-01, slide-02, ...).

**Rate limit awareness:** Postiz limits to 30 requests/hour. A 6-slide carousel uses 6 uploads + 1 post = 7 requests. ~4 carousels/hour max if you publish back-to-back.

If any upload fails, abort and report which slide failed. Do not proceed with a partial upload set.

## Step 6 — Submit the post

Build the `posts:create` command using the simple flag form:

```bash
postiz posts:create \
  -c "<caption-content>" \
  -m "<comma-separated-paths>" \
  -i "<integration-id>" \
  -s "<ISO-8601-schedule>" \
  -t <schedule-or-draft> \
  --settings '{"__type":"<integration-type>","post_type":"post","is_trial_reel":false,"collaborators":[]}'
```

Example for the LeCun carousel:
```bash
postiz posts:create \
  -c "Yann LeCun spent 3 years calling generative AI a dead end..." \
  -m "https://uploads.postiz.com/abc.png,https://uploads.postiz.com/def.png,..." \
  -i "cmoszdgm901t8mq0y2su6zxe3" \
  -s "2026-04-22T14:00:00Z" \
  -t draft \
  --settings '{"__type":"instagram-standalone","post_type":"post","is_trial_reel":false,"collaborators":[]}'
```

**Bash escaping:** the caption contains newlines, quotes, hashtags, and `$` signs. Two safe approaches:
1. **Heredoc to a temp file**, then use `-c "$(cat /tmp/caption.txt)"`. Most reliable.
2. **Use `--json <file>`** with a complete payload. The JSON shape:
   ```json
   {
     "type": "draft",
     "date": "2026-04-22T14:00:00Z",
     "shortLink": false,
     "tags": [],
     "posts": [
       {
         "integration": { "id": "cmoszdgm901t8mq0y2su6zxe3" },
         "value": [
           {
             "content": "<caption with \\n newlines>",
             "image": [
               { "id": "<upload-id-1>", "path": "https://uploads.postiz.com/...png" },
               { "id": "<upload-id-2>", "path": "..." }
             ]
           }
         ],
         "settings": {
           "__type": "instagram-standalone",
           "post_type": "post",
           "is_trial_reel": false,
           "collaborators": []
         }
       }
     ]
   }
   ```
   Write to `{folder}/post.json`, then `postiz posts:create --json {folder}/post.json`.

**Use the JSON path for any caption with newlines** (which is every carousel caption we generate). The flag form is for simple single-line content.

## Step 7 — If `--dry-run`, stop here

Print the would-be `posts:create` command (or the post.json contents) and exit. Do NOT call the API. Tell the user: "Dry run complete. Re-run without --dry-run to actually publish."

## Step 8 — Submit and capture response

Run the actual command. Postiz returns:
```json
[
  { "postId": "post-123", "integration": "integration-456" }
]
```

Write a `published.json` to the carousel folder with:
```json
{
  "submitted_at": "<current-ISO-timestamp>",
  "type": "draft",
  "schedule": "2026-04-22T14:00:00Z",
  "integration_id": "cmoszdgm901t8mq0y2su6zxe3",
  "postiz_response": [
    { "postId": "post-123", "integration": "integration-456" }
  ],
  "uploaded_media": [
    { "slide": "slide-01.png", "id": "e639003b-...", "path": "https://uploads.postiz.com/...png" },
    ...
  ]
}
```

This is the audit trail. Even if the same carousel is published twice, both `published.json` versions get committed to git, so the history is auditable.

## Step 9 — Confirmation message

Tell the user:

```
✅ Published.

  Carousel:      ig-carousel/260421-claude-design-economics/
  Type:          draft (review in Postiz dashboard)
  Schedule:      2026-04-22T14:00:00Z
  Postiz post:   post-123
  Status:        Open https://platform.postiz.com to review

  Manifest written to: published.json
```

If type was `draft`, remind the user that they must promote the draft to scheduled in Postiz's UI for it to actually publish. If type was `schedule`, the post is committed and will fire at the given time.

## Safety rails — what this command MUST NEVER do

1. **Never publish without confirmation.** Even with `require_confirmation: false`, show a preview before submitting.
2. **Never default to `type: "now"` or even `type: "schedule"` immediately on first use.** First time a brand publishes, type should be `draft` regardless of config — let the user verify in Postiz before going live. Override only when user explicitly says "schedule" or "publish now."
3. **Never publish if `enabled: false` in `.carousel.md`.** Hard gate.
4. **Never silently retry on failure.** If upload or post creation fails, surface the error to the user with the specific slide / step that failed.
5. **Never modify `caption.md` or any source file.** Read only. The only file written is `published.json` in the carousel folder.

## Failure modes

| Symptom | Likely cause | Fix |
|---|---|---|
| `Not authenticated` | Token expired or missing | Run `postiz auth:login` |
| `Rate limit exceeded` | More than 30 req/hr | Wait 1 hour or use a different hour window |
| Upload returns non-JSON | Network issue or large file | Retry once; if still failing, check `postiz upload <file>` manually |
| Post submitted but doesn't appear in IG | Postiz draft must be scheduled in their UI | Open Postiz dashboard, find the draft, schedule it |
| `Settings validation failed` | `__type` or `post_type` mismatch | Check `integration_type` in `.carousel.md` matches `postiz integrations:list` output |

## Multi-platform (deferred — Phase 2+)

The Postiz `posts[]` array accepts multiple integration entries — meaning the same content can publish to IG, X, LinkedIn, etc. in one API call. For now, this command only handles a single integration (the IG one in `publishing.postiz.integration_id`). Multi-platform support waits until single-platform is reliable.

## Where this fits in SKILL.md

This is Step 9 of the carousel pipeline (after Export). It is OPTIONAL:
- Step 1-8 produce a complete shippable carousel (HTML + caption + PNGs)
- Step 9 takes that carousel and publishes it via Postiz

A carousel can sit in its folder indefinitely without being published. Conversely, a folder must have all of HTML + caption + PNGs before this command will run.

---
name: prospects
description: Find UK businesses by type and location (agencies, freelancers, coaches, solicitors, tradespeople, ecommerce stores, etc.), extract their Instagram handle as the primary contact, and publish a DM-ready list to Notion. Use to build cold IG outreach lists for @chrisgarlick.ai.
user-invocable: true
argument-hint: <type> <location> · or --help for suggestions
---

# Prospects Skill - IG Outreach List Builder

Find UK businesses of a given type in a given location, pull their Instagram handle off their website, and publish a DM-ready list to Notion under "Chris Garlick / IG Prospects".

The output is built for one job: opening Notion on a phone, tapping an `@handle` link, and sending a personal DM from `@chrisgarlick.ai`. Everything else is secondary.

## Input

The user's prompt: `$ARGUMENTS`

The first token (or two tokens if they're a known multi-word type like "estate agents") is the **type**. The remaining tokens are the **location**.

### Examples

| Command | Type | Location |
|---|---|---|
| `/prospects agencies manchester` | marketing/digital agencies | Manchester |
| `/prospects coaches london` | coaches & consultants | London |
| `/prospects accountants newcastle` | accountancy firms | Newcastle |
| `/prospects solicitors uk` | law firms | UK-wide |
| `/prospects freelance developers leeds` | freelance web developers | Leeds |
| `/prospects shopify stores bristol` | Shopify ecommerce stores | Bristol |
| `/prospects builders north east` | building firms | North East England |
| `/prospects dentists birmingham` | dental practices | Birmingham |
| `/prospects estate agents glasgow` | estate agents | Glasgow |
| `/prospects help` | shows the type cheatsheet below | - |

### Special argument: `help`, `--help`, or `-h`

If the user passes any of `help`, `--help`, or `-h` as the first argument, show the cheatsheet below and stop. Do not run any searches.

````
/prospects - IG outreach list builder for @chrisgarlick.ai

Usage:  /prospects <type> <location>

────────────────────────────────────────────────────────────────────
SUGGESTED RUNS - copy, tweak, send.
────────────────────────────────────────────────────────────────────

▸ Quick wins (heavy IG users, fast to qualify)
    /prospects coaches manchester
    /prospects coaches london
    /prospects business coaches uk
    /prospects mindset coaches uk
    /prospects brand consultants london

▸ UK marketing & creative agencies (fit your AI Reporting blog)
    /prospects agencies manchester
    /prospects digital agencies leeds
    /prospects creative studios bristol
    /prospects independent agencies north east
    /prospects shopify agencies uk

▸ Freelancers & solo operators (fit /for/freelancers, /for/solo-operators)
    /prospects freelance developers london
    /prospects freelance designers manchester
    /prospects freelance seo uk
    /prospects copywriters uk
    /prospects photographers newcastle

▸ Professional services (fit /industries/ai-for-* pages)
    /prospects solicitors newcastle
    /prospects accountants leeds
    /prospects architects manchester
    /prospects financial advisors uk

▸ Local & trades (fit /for/tradespeople)
    /prospects electricians newcastle
    /prospects builders north east
    /prospects estate agents glasgow
    /prospects dentists birmingham

▸ Ecommerce & DTC brands (visual, IG-native)
    /prospects shopify stores uk
    /prospects fashion brands manchester
    /prospects beauty brands london
    /prospects food and drink brands uk
    /prospects homeware brands bristol

▸ Niche / open mode (any phrase works, skill expands it)
    /prospects yoga studios bristol
    /prospects vegan bakeries uk
    /prospects boutique gyms leeds
    /prospects independent breweries north east

────────────────────────────────────────────────────────────────────
PROSPECT TYPE REFERENCE
────────────────────────────────────────────────────────────────────

Service businesses (heaviest IG users)
  agencies                marketing, digital, web design, creative agencies
  coaches                 business, life, mindset, executive coaches
  consultants             management, brand, marketing consultants
  freelancers             freelance developers, designers, SEO, copywriters
  photographers           photographers, videographers

Professional services
  solicitors              law firms, legal practices
  accountants             accountancy firms, bookkeepers
  architects              architecture practices
  financial-advisors      IFAs, mortgage brokers, wealth managers

Local / trades
  dentists                dental practices
  estate-agents           estate & letting agents
  builders                construction firms
  electricians            electrical contractors
  plumbers                plumbing & heating firms

Ecommerce
  shopify-stores          any Shopify store
  woocommerce-stores      any WooCommerce store
  fashion                 fashion / clothing brands
  beauty                  skincare, cosmetics
  homeware                home & living
  food-and-drink          specialty food, coffee, drinks

ANY phrase also works (open mode) - the skill turns it into search queries.

────────────────────────────────────────────────────────────────────
LOCATION TIPS
────────────────────────────────────────────────────────────────────
  city                    manchester · london · leeds · bristol · newcastle
  region                  north east · north west · midlands · scotland
  national                uk · united kingdom · britain

────────────────────────────────────────────────────────────────────
WHAT A GOOD RUN LOOKS LIKE
────────────────────────────────────────────────────────────────────
  • 30 to 50 candidate domains discovered
  • 15 to 25 qualified prospects with IG handles
  • Each one gets a Notion entry with: handle (clickable), site,
    one-line summary, score, and a "DM hook" checkbox you fill in
    before sending from @chrisgarlick.ai

A re-run for the same type + location automatically skips anything
already checked (via docs/prospects/known-domains.txt). Delete that
file to force a full re-scan.

────────────────────────────────────────────────────────────────────
DM PLAYBOOK
────────────────────────────────────────────────────────────────────
Templates by prospect type (DTC brand, trade, coach, agency, ecom)
plus rules for hooks, timing, and follow-ups, live in:

    .claude/skills/prospects/dm-playbook.md

The one rule: every DM = personal hook (1 sentence, specific to them)
+ templated body (1 to 3 sentences). Never a bare template.

────────────────────────────────────────────────────────────────────
SEE ALSO
────────────────────────────────────────────────────────────────────
  /prospects help              this screen
  /prospects --help            same
  /prospects <type> <location> run a search
````

## Workflow

### 1. Parse the input

- **First, check for help flags.** If the argument is `help`, `--help`, or `-h` (or empty), show the cheatsheet from the "Special argument" section below and stop. Do not run any searches.
- Otherwise, extract `type` (one or two tokens, see examples above for multi-word types)
- Extract `location` (everything else; treat "uk" / "united kingdom" / "britain" as national)
- Slugify: `<type-slug>-<location-slug>` for the output folder name

### 2. Search for prospects

Read `search-strategy.md` for the full query playbook.

Run **5 to 8 WebSearches** combining the type, location, and IG-flavoured modifiers (e.g. `"<type>" "<location>" instagram`, `"<type>" "<location>"`, `best <type> <location>`, `<type> <location> directory`).

For each result:
- Extract business names and root domains
- WebFetch the most promising directory / listicle pages (Yell, Google Maps, Clutch for agencies, Bark, etc.) to harvest more domains
- If a result IS an Instagram link directly (e.g. `instagram.com/<handle>`), capture that as a seed prospect with no website yet

### 3. Compile and deduplicate domains

- Normalise each domain (strip `www.`, lowercase, root host only)
- Drop social-media URLs, directory homepages, marketplaces (amazon, ebay, etsy, etc.)
- Drop anything already in `docs/prospects/known-domains.txt`
- Save the deduped list to `docs/prospects/<type-slug>-<location-slug>-<YYYY-MM-DD>/raw-domains.txt`

Report the count to the user:
```
Found 36 candidate businesses for "agencies / manchester". Checking websites + extracting IG handles now...
```

### 4. Check + extract (IG-focused)

Run:

```bash
bash .claude/skills/prospects/check-and-extract.sh \
  docs/prospects/<type-slug>-<location-slug>-<date>/raw-domains.txt \
  docs/prospects/<type-slug>-<location-slug>-<date>/prospects.json \
  "<type-slug>"
```

The third argument is the type slug - passed in so the script can apply the right keyword filter (agency keywords for `agencies`, freelance keywords for `freelancers`, ecommerce signals for `*-stores`, none / open mode for everything else).

Per domain the script does:

1. HTTPS / HTTP liveness check
2. Homepage HTML parse (title, meta description, tech stack, social links, has-form)
3. Fetch `/contact`, `/about`, footer-linked pages to harvest more social links
4. **Extract Instagram handle** from any `instagram.com/<handle>` URL, plus `<meta property="og:see_also">` tags, plus body-text `@handle` mentions where consistent
5. Optional email extraction (generic prefixes only - `hello@`, `info@`, etc.) as a secondary contact
6. Score the prospect 0 to 100, weighted heavily on **IG presence**:
    - IG handle found: +40
    - IG handle is a real account (looks human, not a generic share button): +10 more
    - Site is live, has SSL, has real content: +20
    - Type signal matches (agency keyword for agencies, etc.): +10
    - Secondary signals (email, contact form, other socials): +20
7. Filter: keep prospects with score >= 50 AND an IG handle (the handle is what makes them DM-able)

For ~40 domains this takes 2 to 4 minutes. The script reports per-domain progress and is restartable.

### 5. Present a summary table

Show the user a compact table before publishing:

```
## IG Prospects: Agencies / Manchester (19/36)

| Business             | @ handle              | Score | Website        |
|----------------------|------------------------|-------|----------------|
| Acme Digital         | @acmedigital           |   88  | acme.digital   |
| ...                  | ...                    |  ...  | ...            |

17 dropped: 6 no IG handle, 5 parked / dead, 4 not the right type, 2 already known
```

### 6. Publish to Notion

Run:

```bash
bash .claude/skills/prospects/publish-to-notion.sh \
  docs/prospects/<type-slug>-<location-slug>-<date>/prospects.json \
  "<Type>" "<Location>" <total-discovered>
```

Notion structure:

```
Workspace root
  └── Chris Garlick - IG Prospects   (auto-created on first run)
        └── <Type>                   (auto-created per type)
              └── <Type> - <Location> - <YYYY-MM-DD>   (this run)
```

On first run, the publisher searches Notion for "Chris Garlick - IG Prospects". If not found, it creates the page under the first accessible anchor it finds (looks for a "Chris Garlick" page, falls back to "Kritano", then to the workspace root). It caches the page ID in `.claude/skills/prospects/.notion-ids.json`. Same nesting pattern for each type.

**Note for first-time setup:** if you want the IG Prospects hierarchy to live under a specific page (e.g. a "Chris Garlick" workspace page), share that page with the Notion integration first. Otherwise the script will park it under whatever it can reach (typically the Kritano page) and you can drag it to its final home in Notion.

Each prospect appears as a sub-block with:

- Business name (heading)
- IG handle as a clickable link to `https://instagram.com/<handle>`
- Website link
- One-line "what they do" summary (from meta description, trimmed)
- Score
- Other socials (LinkedIn, TikTok) if present
- An empty `DM hook:` line for the user to write a personal opener before sending

### 7. Output summary

Report:
- Count qualified / discovered
- Local file paths
- Notion page link
- Reminder: every DM should be personalised. The IG handle is the door, the hook is the key.

## Deduplication

`docs/prospects/known-domains.txt` is the shared memory across every run. Every domain ever checked (qualified or not) gets appended after each run, so future runs skip it automatically. Delete the file to force a fresh pass.

## Output Files

`docs/prospects/<type-slug>-<location-slug>-<YYYY-MM-DD>/`:

- `raw-domains.txt` - all candidate domains discovered (after dedup, before checks)
- `prospects.json` - qualified prospects with full extracted data

## Content Rules

- **IG handle is the primary qualifier.** No handle, no DM, no inclusion (regardless of score).
- **Personalisation is mandatory.** This skill outputs a list. The user writes every DM by hand from `@chrisgarlick.ai`. No mass / templated DMs.
- **Generic / role-based emails only** if extracted as a secondary contact. Never `firstname@`.
- **British English** in all surfaced text.
- **No competitor bashing** in suggested hooks if hooks are ever added.

## Compliance

- All data extracted is publicly visible on the prospect's own website.
- IG handles are listed where the prospect themselves linked to them publicly.
- The skill produces a list. Outreach is manual and one-to-one. No automation, no scraping IG itself.

## Reference Files

| File | Purpose |
|------|---------|
| `search-strategy.md` | WebSearch query templates by type + location |
| `check-and-extract.sh` | Domain liveness + IG handle extraction script (Python inside bash) |
| `publish-to-notion.sh` | Auto-creates / reuses the Notion IG Prospects hierarchy |
| `dm-playbook.md` | DM templates by prospect type + personalisation guide + IG-specific rules |

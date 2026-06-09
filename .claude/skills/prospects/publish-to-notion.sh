#!/bin/bash
# publish-to-notion.sh — Publish an IG prospect list to Notion under
#   Chris Garlick — IG Prospects
#     └── <Type>
#           └── <Type> — <Location> — <YYYY-MM-DD>
#
# Usage: ./publish-to-notion.sh <prospects.json> <type-label> <location-label> [total-discovered]
# Example: ./publish-to-notion.sh prospects.json "Agencies" "Manchester" 36
#
# Auto-creates parent + per-type pages on first run, caches IDs in
# .claude/skills/prospects/.notion-ids.json so subsequent runs reuse them.

set -euo pipefail

PROSPECTS_FILE="${1:?Usage: publish-to-notion.sh <prospects.json> <type-label> <location-label> [total]}"
TYPE_LABEL="${2:?Usage: publish-to-notion.sh <prospects.json> <type-label> <location-label> [total]}"
LOCATION_LABEL="${3:?Usage: publish-to-notion.sh <prospects.json> <type-label> <location-label> [total]}"
TOTAL_DISCOVERED="${4:-0}"

NOTION_VERSION="2022-06-28"
ROOT_TITLE="Chris Garlick - IG Prospects"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
IDS_CACHE="$SCRIPT_DIR/.notion-ids.json"

# Source NOTION_API from .env if not present in environment
if [ -z "${NOTION_API:-}" ]; then
  if [ -f "$PROJECT_ROOT/.env" ]; then
    export NOTION_API=$(grep '^NOTION_API=' "$PROJECT_ROOT/.env" | head -1 | cut -d= -f2-)
  fi
  if [ -z "${NOTION_API:-}" ] && [ -f "./.env" ]; then
    export NOTION_API=$(grep '^NOTION_API=' "./.env" | head -1 | cut -d= -f2-)
  fi
fi

if [ -z "${NOTION_API:-}" ]; then
  echo "ERROR: NOTION_API not set and not found in .env"
  exit 1
fi

if [ ! -f "$PROSPECTS_FILE" ]; then
  echo "ERROR: Prospects file not found: $PROSPECTS_FILE"
  exit 1
fi

PROSPECT_COUNT=$(python3 -c "import json; print(len(json.load(open('$PROSPECTS_FILE'))))")

if [ "$PROSPECT_COUNT" -eq 0 ]; then
  echo "No qualified prospects in $PROSPECTS_FILE. Nothing to publish."
  exit 0
fi

TODAY=$(date +%Y-%m-%d)
RUN_TITLE="${TYPE_LABEL} - ${LOCATION_LABEL} - ${TODAY}"

# --- Run the python publisher (all the Notion API logic + block construction) ---
NOTION_API="$NOTION_API" \
  python3 - "$PROSPECTS_FILE" "$TYPE_LABEL" "$RUN_TITLE" "$TOTAL_DISCOVERED" \
            "$IDS_CACHE" "$ROOT_TITLE" "$NOTION_VERSION" <<'PYEOF'
import os, sys, json, urllib.request, urllib.error

(PROSPECTS_FILE, TYPE_LABEL, RUN_TITLE, TOTAL_DISCOVERED,
 IDS_CACHE, ROOT_TITLE, NOTION_VERSION) = sys.argv[1:8]

NOTION_API = os.environ['NOTION_API']
TOTAL_DISCOVERED = int(TOTAL_DISCOVERED or 0)


def notion(method, path, payload=None):
    url = f'https://api.notion.com/v1{path}'
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header('Authorization', f'Bearer {NOTION_API}')
    req.add_header('Notion-Version', NOTION_VERSION)
    req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        raise RuntimeError(f'Notion API {e.code}: {body}') from None


def load_cache():
    if os.path.exists(IDS_CACHE):
        with open(IDS_CACHE) as f:
            return json.load(f)
    return {}


def save_cache(cache):
    with open(IDS_CACHE, 'w') as f:
        json.dump(cache, f, indent=2)


def search_page(title):
    resp = notion('POST', '/search', {
        'query': title,
        'filter': {'property': 'object', 'value': 'page'},
        'page_size': 25,
    })
    title_lower = title.strip().lower()
    for r in resp.get('results', []):
        props = r.get('properties', {}) or {}
        # Title prop name varies; gather all title-typed values
        for prop_name, prop in props.items():
            if prop.get('type') == 'title':
                text = ''.join(p.get('plain_text', '') for p in prop.get('title', []))
                if text.strip().lower() == title_lower:
                    return r['id']
        # Fallback: parent could be a child_page, then title is in the page's child_page object
    return None


def create_page(parent_id, title, icon_emoji=None, children=None):
    payload = {
        'parent': {'page_id': parent_id},
        'properties': {
            'title': {'title': [{'text': {'content': title}}]}
        },
    }
    if icon_emoji:
        payload['icon'] = {'type': 'emoji', 'emoji': icon_emoji}
    if children:
        payload['children'] = children
    return notion('POST', '/pages', payload)['id']


def append_blocks(page_id, blocks):
    # Notion limits children to 100 per request
    for i in range(0, len(blocks), 100):
        chunk = blocks[i:i + 100]
        notion('PATCH', f'/blocks/{page_id}/children', {'children': chunk})


def find_or_pick_workspace_parent():
    """Find a sensible accessible page under which to create the root.
    Strategy:
      1. Look for any page literally titled 'Chris Garlick' (preferred future state).
      2. Fall back to 'Kritano' (current accessible workspace for the integration).
      3. As a last resort, walk up from any accessible page until we find a top-level
         page (one whose parent type is 'workspace' or whose parent we can't see).
    """
    for query in ('Chris Garlick', 'Kritano'):
        resp = notion('POST', '/search', {
            'query': query,
            'filter': {'property': 'object', 'value': 'page'},
            'page_size': 25,
        })
        for r in resp.get('results', []):
            props = r.get('properties', {}) or {}
            for prop_name, prop in props.items():
                if prop.get('type') == 'title':
                    text = ''.join(p.get('plain_text', '') for p in prop.get('title', []))
                    t = text.strip().lower()
                    # Prefer a page whose title IS the query, not just contains it
                    if t == query.lower():
                        return r['id'], text.strip()
                    if query.lower() in t and 'prospect' not in t and 'trend' not in t and 'blog' not in t:
                        return r['id'], text.strip()

    # Last resort: walk up from any accessible page
    resp = notion('POST', '/search', {
        'filter': {'property': 'object', 'value': 'page'},
        'page_size': 5,
    })
    for r in resp.get('results', []):
        page_id = r['id']
        for _ in range(5):  # max depth
            page = notion('GET', f'/pages/{page_id}')
            parent = page.get('parent') or {}
            if parent.get('type') == 'workspace':
                return page_id, '(workspace root child)'
            if parent.get('type') != 'page_id':
                return page_id, '(no page parent)'
            page_id = parent['page_id']
    return None, None


# ----- Resolve / create the root and per-type pages -----
cache = load_cache()
root_id = cache.get('root_id')
type_pages = cache.get('type_pages', {})

if not root_id:
    # Look for an existing root page
    root_id = search_page(ROOT_TITLE)

if not root_id:
    # Need to create it - find a sensible parent first
    parent_id, parent_name = find_or_pick_workspace_parent()
    if not parent_id:
        print('ERROR: Could not find any accessible parent page in Notion. '
              'Create a page called "Chris Garlick - IG Prospects" manually and rerun.',
              file=sys.stderr)
        sys.exit(1)
    print(f'  Creating root page "{ROOT_TITLE}" under "{parent_name}"...')
    root_id = create_page(parent_id, ROOT_TITLE, icon_emoji='\U0001F3AF', children=[
        {
            'object': 'block', 'type': 'callout',
            'callout': {
                'icon': {'type': 'emoji', 'emoji': '\U0001F4E9'},
                'rich_text': [{'type': 'text', 'text': {
                    'content': 'IG outreach prospects for @chrisgarlick.ai. Sub-pages by business type. Each run is a dated sub-page with one block per prospect.'
                }}]
            }
        }
    ])

cache['root_id'] = root_id

# Per-type page
type_key = TYPE_LABEL.strip().lower()
type_page_id = type_pages.get(type_key)
# Note: we do NOT do a workspace-wide title search for type pages, because old pages
# from prior prospect runs (e.g. the deleted prospects-local skill) might have the
# same name and the script would mistakenly nest the run under them. The cache is
# the only source of truth for "where does this type page live".

if not type_page_id:
    print(f'  Creating type page "{TYPE_LABEL}" under root...')
    type_page_id = create_page(root_id, TYPE_LABEL, icon_emoji='\U0001F4C1')

type_pages[type_key] = type_page_id
cache['type_pages'] = type_pages
save_cache(cache)


# ----- Build blocks for this run -----
with open(PROSPECTS_FILE) as f:
    prospects = json.load(f)

prospects.sort(key=lambda p: p.get('quality_score', 0), reverse=True)

blocks = []

blocks.append({
    'object': 'block', 'type': 'callout',
    'callout': {
        'icon': {'type': 'emoji', 'emoji': '\U0001F4CA'},
        'rich_text': [{'type': 'text', 'text': {
            'content': f'{len(prospects)} prospects with IG handles, from {TOTAL_DISCOVERED or len(prospects)} businesses discovered. '
                       f'DM from @chrisgarlick.ai. Personalise every message.'
        }}]
    }
})

blocks.append({'object': 'block', 'type': 'divider', 'divider': {}})


def text(content, link=None, bold=False):
    rt = {'type': 'text', 'text': {'content': content}}
    if link:
        rt['text']['link'] = {'url': link}
    if bold:
        rt['annotations'] = {'bold': True}
    return rt


for p in prospects:
    # Business name
    name = (p.get('title') or p['domain']).strip()
    for sep in (' | ', ' - ', ' – ', ' — '):
        if sep in name:
            name = name.split(sep)[0].strip()
    name = name[:120]

    handle = p['ig_handle']
    ig_url = p['ig_url']
    domain = p['domain']
    website_url = f'https://{domain}'

    blocks.append({
        'object': 'block', 'type': 'heading_3',
        'heading_3': {'rich_text': [text(name)]}
    })

    # IG handle line - clickable
    blocks.append({
        'object': 'block', 'type': 'paragraph',
        'paragraph': {'rich_text': [
            text('IG: '),
            text(f'@{handle}', link=ig_url, bold=True),
        ]}
    })

    # Website
    blocks.append({
        'object': 'block', 'type': 'paragraph',
        'paragraph': {'rich_text': [
            text('Site: '),
            text(domain, link=website_url),
        ]}
    })

    # Summary (truncated meta description)
    summary = (p.get('meta_description') or '').strip()
    if summary:
        blocks.append({
            'object': 'block', 'type': 'paragraph',
            'paragraph': {'rich_text': [text(summary[:280])]}
        })

    # Compact details line
    detail_bits = [f'Score {p.get("quality_score", 0)}']
    sigs = p.get('type_signals') or []
    if sigs:
        detail_bits.append('Signals: ' + ', '.join(sorted(set(sigs))[:3]))
    tech = p.get('technology_stack') or []
    if tech:
        detail_bits.append('Tech: ' + ', '.join(tech[:3]))
    other_socials = {k: v for k, v in (p.get('social_links') or {}).items()
                     if k in ('linkedin', 'tiktok', 'twitter', 'youtube') and v}
    if other_socials:
        detail_bits.append('Other: ' + ', '.join(other_socials.keys()))
    if p.get('primary_email'):
        detail_bits.append(f'Email: {p["primary_email"]}')

    blocks.append({
        'object': 'block', 'type': 'paragraph',
        'paragraph': {'rich_text': [text(' · '.join(detail_bits))],
                      'color': 'gray'}
    })

    # DM hook placeholder (the user fills this in before sending)
    blocks.append({
        'object': 'block', 'type': 'to_do',
        'to_do': {
            'rich_text': [text('DM hook: '),
                          text('write a one-line personal opener referencing their latest post / a project on their site', bold=False)],
            'checked': False,
        }
    })

    blocks.append({'object': 'block', 'type': 'divider', 'divider': {}})


# ----- Create the run page -----
print(f'  Publishing {len(prospects)} prospects to Notion run page "{RUN_TITLE}"...')

# Create page with the first 100 blocks
first_chunk = blocks[:100]
remaining = blocks[100:]

payload = {
    'parent': {'page_id': type_page_id},
    'icon': {'type': 'emoji', 'emoji': '\U0001F4CD'},
    'properties': {
        'title': {'title': [{'text': {'content': RUN_TITLE}}]}
    },
    'children': first_chunk,
}
run_page_id = notion('POST', '/pages', payload)['id']

if remaining:
    append_blocks(run_page_id, remaining)

clean_id = run_page_id.replace('-', '')
print(f'\nDone! View: https://www.notion.so/{clean_id}')
PYEOF

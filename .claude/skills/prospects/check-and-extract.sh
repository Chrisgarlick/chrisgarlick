#!/bin/bash
# check-and-extract.sh — Check domains for liveness + extract IG handle as primary qualifier
#
# Usage: ./check-and-extract.sh <domains-file> <output-json> <type-slug>
#
# <type-slug> drives the keyword filter mode:
#   - "agencies", "agency", "marketing-agencies", "digital-agencies"  → agency mode
#   - "freelancers", "freelance-*"                                     → freelance mode
#   - "*-stores", "shopify-stores", "woocommerce-stores", "ecommerce"  → ecommerce mode
#   - anything else                                                    → open mode (liveness only)
#
# A prospect is QUALIFIED only if:
#   1. Domain is live and not parked
#   2. An Instagram handle was extracted (this is what makes them DM-able)
#   3. Quality score >= 50

set -euo pipefail

DOMAINS_FILE="${1:?Usage: check-and-extract.sh <domains-file> <output-json> <type-slug>}"
OUTPUT_FILE="${2:?Usage: check-and-extract.sh <domains-file> <output-json> <type-slug>}"
TYPE_SLUG="${3:-open}"

if [ ! -f "$DOMAINS_FILE" ]; then
  echo "ERROR: Domains file not found: $DOMAINS_FILE"
  exit 1
fi

# Filter out already-known domains (across all previous runs)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
KNOWN_FILE="$PROJECT_ROOT/docs/prospects/known-domains.txt"

mkdir -p "$(dirname "$KNOWN_FILE")"
touch "$KNOWN_FILE"

BEFORE=$(wc -l < "$DOMAINS_FILE" | tr -d ' ')
TEMP_FILE=$(mktemp)
grep -vxFf "$KNOWN_FILE" "$DOMAINS_FILE" > "$TEMP_FILE" 2>/dev/null || true
AFTER=$(wc -l < "$TEMP_FILE" | tr -d ' ')
SKIPPED=$((BEFORE - AFTER))
if [ "$SKIPPED" -gt 0 ]; then
  echo "Filtered $SKIPPED already-known domains ($BEFORE -> $AFTER new)"
fi
cp "$TEMP_FILE" "$DOMAINS_FILE"
rm "$TEMP_FILE"

TOTAL=$(wc -l < "$DOMAINS_FILE" | tr -d ' ')

if [ "$TOTAL" -eq 0 ]; then
  echo "No new domains to process (all already known)."
  echo "[]" > "$OUTPUT_FILE"
  exit 0
fi

echo "Processing $TOTAL new domains in mode: $TYPE_SLUG"

python3 - "$DOMAINS_FILE" "$OUTPUT_FILE" "$TYPE_SLUG" <<'PYEOF'
import urllib.request
import urllib.error
import ssl
import re
import json
import sys
import time
from html.parser import HTMLParser

# ----- Config -----
TIMEOUT = 10
CONTACT_PATHS = ['/contact', '/contact-us', '/about', '/about-us', '/get-in-touch']

PARKED_SIGNALS = [
    'domain for sale', 'this domain is for sale', 'buy this domain',
    'parked domain', 'godaddy parked', 'sedo.com', 'afternic',
    'coming soon', 'under construction', 'future home of',
    'this page is not yet available', 'website coming soon',
    'apache2 default page', 'it works!', 'welcome to nginx',
    'default web site page', 'iis windows server',
    'index of /', 'directory listing for',
]

AGENCY_KEYWORDS = [
    'agency', 'agencies', 'digital', 'web design', 'web development',
    'marketing agency', 'creative agency', 'design studio', 'studio',
    'development company', 'seo agency', 'seo company', 'media agency',
    'branding agency', 'creative studio', 'digital studio', 'consultancy',
    'web agency', 'shopify partner', 'wordpress agency', 'ecommerce agency',
]

FREELANCE_KEYWORDS = [
    'freelance', 'freelancer', 'independent', 'consultant', 'portfolio',
    'available for hire', 'available for projects', 'working with', 'i build',
    'i design', 'i develop', "i'm a", 'hello, i', 'about me',
]

ECOM_KEYWORDS = [
    'add to cart', 'add to basket', 'shop now', 'checkout', 'my cart',
    'view basket', 'continue shopping', 'product reviews', '/collections/',
    '/products/', '/shop/', '/cart',
]

ECOM_PLATFORMS = ['shopify', 'woocommerce', 'bigcommerce', 'magento']

TECH_PATTERNS = {
    'WordPress':   [r'wp-content', r'wp-includes'],
    'Shopify':     [r'cdn\.shopify\.com', r'shopify\.com'],
    'Wix':         [r'wix\.com', r'wixsite\.com'],
    'Squarespace': [r'squarespace\.com', r'sqsp\.com'],
    'Webflow':     [r'webflow\.com', r'assets\.website-files\.com'],
    'Next.js':     [r'_next/', r'__next'],
    'React':       [r'react\.production', r'react-dom'],
    'WooCommerce': [r'woocommerce', r'wc-'],
    'HubSpot':     [r'hubspot', r'hs-scripts'],
    'Ghost':       [r'ghost\.org', r'ghost\.io'],
}

# IG handles to discard (these are paths, not accounts)
IG_RESERVED_PATHS = {
    'p', 'reel', 'reels', 'tv', 'stories', 'explore', 'accounts', 'about',
    'directory', 'developer', 'legal', 'press', 'web', 'embed', 'login',
    'signup', 'session', 'graphql', 'static', 'oauth', 'developers', 'help',
}
IG_HANDLE_RE = re.compile(r'^[A-Za-z0-9._]{1,30}$')

# ----- HTML parser -----
class MetaParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ''
        self.in_title = False
        self.meta_desc = ''
        self.emails = set()
        self.social = {}
        self.has_form = False
        self.body_text = ''
        self.in_body = False
        self.internal_links = 0
        self.og_see_also = []

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == 'title':
            self.in_title = True
        elif tag == 'meta':
            name = d.get('name', '').lower()
            prop = d.get('property', '').lower()
            content = d.get('content', '')
            if name == 'description' and content:
                self.meta_desc = content[:500]
            if prop == 'og:see_also' and content:
                self.og_see_also.append(content)
        elif tag == 'a':
            href = d.get('href', '')
            if href.startswith('mailto:'):
                email = href.replace('mailto:', '').split('?')[0].strip().lower()
                if '@' in email:
                    self.emails.add(email)
            href_lower = href.lower()
            if 'instagram.com/' in href_lower:
                self.social.setdefault('instagram_urls', []).append(href)
            if 'linkedin.com/' in href_lower:
                self.social['linkedin'] = href
            if 'tiktok.com/' in href_lower:
                self.social['tiktok'] = href
            if 'twitter.com/' in href_lower or 'x.com/' in href_lower:
                self.social['twitter'] = href
            if 'facebook.com/' in href_lower:
                self.social['facebook'] = href
            if 'youtube.com/' in href_lower:
                self.social['youtube'] = href
            if not href.startswith(('http', 'mailto:', 'tel:', '#', 'javascript')):
                self.internal_links += 1
        elif tag == 'form':
            self.has_form = True
        elif tag == 'body':
            self.in_body = True

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        elif tag == 'body':
            self.in_body = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_body:
            self.body_text += data + ' '


def fetch_url(url, timeout=TIMEOUT):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (compatible; ChrisGarlickProspects/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-GB,en;q=0.9',
    })
    try:
        resp = urllib.request.urlopen(req, timeout=timeout, context=ctx)
        ct = resp.headers.get('Content-Type', '')
        if 'text/html' not in ct and 'application/xhtml' not in ct:
            return None, resp.status
        body = resp.read(500_000).decode('utf-8', errors='replace')
        return body, resp.status
    except Exception:
        return None, None


def parse_ig_handle_from_url(url):
    """Pull a clean @handle out of an instagram URL. None if not a profile URL."""
    m = re.search(r'instagram\.com/+([^/?#\s"\']+)', url, re.I)
    if not m:
        return None
    handle = m.group(1).strip().lstrip('@')
    handle = handle.split('?')[0].split('#')[0].rstrip('/')
    if not handle:
        return None
    if handle.lower() in IG_RESERVED_PATHS:
        return None
    if not IG_HANDLE_RE.match(handle):
        return None
    return handle.lower()


def collect_ig_handles(parser_list):
    """Pull all candidate IG handles from one or more parsed pages. Returns ordered unique list."""
    seen = []
    for parser in parser_list:
        urls = list(parser.social.get('instagram_urls') or []) + list(parser.og_see_also or [])
        for url in urls:
            handle = parse_ig_handle_from_url(url)
            if handle and handle not in seen:
                seen.append(handle)
    return seen


def detect_tech(html_lower):
    out = []
    for tech, patterns in TECH_PATTERNS.items():
        for pat in patterns:
            if re.search(pat, html_lower):
                out.append(tech)
                break
    return out


def is_parked(text):
    for sig in PARKED_SIGNALS:
        if sig in text:
            return True
    return False


def detect_type_signals(text, mode):
    """Return list of matched type-signal keywords for the given mode."""
    if mode == 'agency':
        return [k for k in AGENCY_KEYWORDS if k in text]
    if mode == 'freelance':
        return [k for k in FREELANCE_KEYWORDS if k in text]
    if mode == 'ecommerce':
        hits = [k for k in ECOM_KEYWORDS if k in text]
        hits += [p for p in ECOM_PLATFORMS if p in text]
        return hits
    return []


def mode_from_slug(slug):
    s = slug.lower()
    if 'freelance' in s:
        return 'freelance'
    if 'agency' in s or 'agencies' in s:
        return 'agency'
    if 'ecommerce' in s or s.endswith('-stores') or s.endswith('-shops'):
        return 'ecommerce'
    if s in ('shopify', 'woocommerce', 'shopify-stores', 'woocommerce-stores'):
        return 'ecommerce'
    return 'open'


# ----- Main per-domain check -----
def check_domain(domain, mode):
    result = {
        'domain': domain,
        'is_live': False,
        'has_ssl': False,
        'http_status': None,
        'title': None,
        'meta_description': None,
        'technology_stack': [],
        'is_parked': False,
        'type_signals': [],
    }

    html = None
    parser = None
    for scheme in ('https', 'http'):
        body, status = fetch_url(f'{scheme}://{domain}')
        if body:
            html = body
            result['is_live'] = True
            result['has_ssl'] = scheme == 'https'
            result['http_status'] = status
            break

    if not html:
        return result, None

    parser = MetaParser()
    try:
        parser.feed(html)
    except Exception:
        pass

    result['title'] = (parser.title.strip() or None)
    result['meta_description'] = (parser.meta_desc.strip() or None) and parser.meta_desc.strip()[:500]

    html_lower = html.lower()
    result['technology_stack'] = detect_tech(html_lower)

    combined = (
        (result['title'] or '').lower() + ' ' +
        (result['meta_description'] or '').lower() + ' ' +
        html_lower[:8000]
    )
    result['is_parked'] = is_parked(combined)
    result['type_signals'] = detect_type_signals(combined, mode)

    return result, parser


def fetch_contact_pages(domain, has_ssl):
    scheme = 'https' if has_ssl else 'http'
    extra_parsers = []
    for path in CONTACT_PATHS:
        body, _ = fetch_url(f'{scheme}://{domain}{path}', timeout=8)
        if not body:
            continue
        p = MetaParser()
        try:
            p.feed(body)
        except Exception:
            pass
        extra_parsers.append(p)
        time.sleep(0.4)
        if len(extra_parsers) >= 2:
            break
    return extra_parsers


def score(check, ig_handles, secondary):
    s = 0
    if ig_handles:
        s += 40
        # Prefer when the handle isn't a generic share button - heuristic: at least one handle contains
        # part of the domain root or business name keyword
        root = check['domain'].split('.')[0].lower()
        if any(root[:6] in h or h in root for h in ig_handles):
            s += 10
    if check['has_ssl']:
        s += 10
    if check['title'] and len(check['title']) > 5:
        s += 5
    if check['meta_description'] and len(check['meta_description']) > 20:
        s += 5
    if check['technology_stack']:
        s += 5
    if check['type_signals']:
        s += 10
    if secondary.get('primary_email'):
        s += 10
    if secondary.get('has_contact_form'):
        s += 3
    if any(k in secondary.get('socials', {}) for k in ('linkedin', 'tiktok', 'twitter', 'youtube')):
        s += 5
    return min(s, 100)


def primary_email_from(emails_set, domain):
    if not emails_set:
        return None
    allowed = {
        'info', 'hello', 'contact', 'enquiries', 'team', 'sales', 'help',
        'office', 'general', 'mail', 'hi', 'hey', 'studio', 'business',
        'admin', 'support', 'reception', 'press', 'partnerships', 'marketing',
        'newbusiness', 'enquiry', 'projects', 'work',
    }
    generic_providers = {
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
        'icloud.com', 'protonmail.com', 'proton.me', 'live.com', 'msn.com',
        'btinternet.com', 'sky.com', 'virginmedia.com', 'talktalk.net',
    }
    candidates = []
    for e in emails_set:
        if '@' not in e:
            continue
        local, _, edom = e.partition('@')
        local = local.lower()
        edom = edom.lower()
        if edom in generic_providers:
            continue
        if local in {'noreply', 'no-reply', 'postmaster', 'webmaster', 'abuse'}:
            continue
        if edom.endswith(('.png', '.jpg', '.gif', '.svg', '.css', '.js')):
            continue
        if local not in allowed:
            continue
        candidates.append(e)
    if not candidates:
        return None
    # Prefer domain-matching
    for e in candidates:
        if domain in e:
            return e
    return candidates[0]


# ----- Driver -----
domains_file, output_file, type_slug = sys.argv[1], sys.argv[2], sys.argv[3]
mode = mode_from_slug(type_slug)

with open(domains_file) as f:
    domains = [line.strip() for line in f if line.strip()]

total = len(domains)
prospects = []
stats = {
    'total': total, 'live': 0, 'qualified': 0, 'parked': 0, 'dead': 0,
    'no_ig': 0, 'wrong_type': 0, 'low_score': 0,
}

for i, domain in enumerate(domains, start=1):
    sys.stdout.write(f'\r  [{i}/{total}] {domain[:50]}{"":40}')
    sys.stdout.flush()

    try:
        check, homepage_parser = check_domain(domain, mode)
    except Exception:
        stats['dead'] += 1
        continue

    if not check['is_live']:
        stats['dead'] += 1
        time.sleep(0.3)
        continue

    stats['live'] += 1

    if check['is_parked']:
        stats['parked'] += 1
        time.sleep(0.3)
        continue

    # In strict modes (agency / freelance / ecommerce), require at least one type signal.
    # In open mode, skip this check.
    if mode != 'open' and not check['type_signals']:
        stats['wrong_type'] += 1
        time.sleep(0.3)
        continue

    # Collect IG handles + secondary socials/emails from homepage + contact pages
    extra_parsers = []
    try:
        extra_parsers = fetch_contact_pages(domain, check['has_ssl'])
    except Exception:
        pass

    all_parsers = [homepage_parser] + extra_parsers
    ig_handles = collect_ig_handles(all_parsers)

    if not ig_handles:
        stats['no_ig'] += 1
        time.sleep(0.3)
        continue

    # Merge socials and emails across parsers
    merged_socials = {}
    merged_emails = set()
    has_form = False
    for p in all_parsers:
        if not p:
            continue
        for k, v in p.social.items():
            if k == 'instagram_urls':
                continue
            merged_socials.setdefault(k, v)
        merged_emails.update(p.emails)
        # Regex emails from body
        for e in re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', p.body_text):
            merged_emails.add(e.lower().strip('.'))
        if p.has_form:
            has_form = True

    primary_email = primary_email_from(merged_emails, domain)

    secondary = {
        'primary_email': primary_email,
        'socials': merged_socials,
        'has_contact_form': has_form,
    }

    quality = score(check, ig_handles, secondary)
    if quality < 50:
        stats['low_score'] += 1
        time.sleep(0.3)
        continue

    stats['qualified'] += 1
    prospects.append({
        'domain': domain,
        'title': check['title'],
        'meta_description': check['meta_description'],
        'technology_stack': check['technology_stack'],
        'has_ssl': check['has_ssl'],
        'type_signals': check['type_signals'],
        'quality_score': quality,
        'ig_handle': ig_handles[0],
        'ig_handles_all': ig_handles,
        'ig_url': f'https://instagram.com/{ig_handles[0]}',
        'primary_email': primary_email,
        'social_links': merged_socials,
        'has_contact_form': has_form,
    })

    time.sleep(0.5)

with open(output_file, 'w') as f:
    json.dump(prospects, f, indent=2)

print()
print()
print(f'Results: {stats["qualified"]} qualified / {total} checked  (mode: {mode})')
print(f'  Live: {stats["live"]} | Qualified: {stats["qualified"]}')
print(f'  Filtered: {stats["dead"]} dead, {stats["parked"]} parked, '
      f'{stats["wrong_type"]} wrong type, {stats["no_ig"]} no IG, '
      f'{stats["low_score"]} below score')
print(f'Output: {output_file}')
PYEOF

# Append all processed domains (qualified or not) to known-domains.txt so future runs skip them
cat "$DOMAINS_FILE" >> "$KNOWN_FILE"
sort -u "$KNOWN_FILE" -o "$KNOWN_FILE"
echo "Updated known-domains.txt ($(wc -l < "$KNOWN_FILE" | tr -d ' ') total)"

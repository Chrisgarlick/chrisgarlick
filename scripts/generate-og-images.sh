#!/bin/bash
# Generate OG images for all pages using Playwright CLI
# Output: 1200x630 WebP (16:9) in public/og/

set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
OUT="$DIR/../public/og"
TEMPLATE="$DIR/generate-og.html"

mkdir -p "$OUT/article"

generate() {
  local file="$1"
  local label="$2"
  local title="$3"
  local subtitle="$4"
  local large="${5:-false}"

  local titleClass="title"
  if [ "$large" = "true" ]; then
    titleClass="title title--large"
  fi

  local tmp="$DIR/_tmp_og.html"
  sed \
    -e "s|id=\"label\"></div>|id=\"label\">$label</div>|" \
    -e "s|id=\"title\"></div>|id=\"title\" class=\"$titleClass\">$title</div>|" \
    -e "s|id=\"subtitle\"></div>|id=\"subtitle\">$subtitle</div>|" \
    "$TEMPLATE" > "$tmp"

  npx playwright screenshot \
    --viewport-size="1200,630" \
    "file://$tmp" \
    "$OUT/$file" 2>/dev/null

  echo "  Generated: $file"
}

echo "Generating OG images (1200x630 WebP)..."

# Static pages
generate "home.png" "Chris Garlick" "I build software that replaces manual work." "AI integration for law firms, agencies, and accountancies. Fixed-fee projects. UK-based." true
generate "about.png" "About" "I'm Chris Garlick. I build software that actually gets used." "AI workflow partner for service businesses."
generate "contact.png" "Contact" "Get in touch." "Tell me about your business. If we are a fit, you will hear back within 2 working days." true
generate "work.png" "Case Studies" "Real projects. Measured outcomes." "AI integration projects for service businesses. Architecture shown. Results tracked." true
generate "article.png" "Articles" "Practical guides on AI integration." "No hype. Just what works for service businesses adopting AI." true
generate "privacy.png" "Legal" "Privacy Policy" "How I handle your data. UK GDPR compliant. No cookies. No tracking." true
generate "terms.png" "Legal" "Terms of Service" "Standard terms for working with Chris Garlick." true

# Articles
generate "article/ai-adoption-disappointment-why-companies-fail.png" "AI Strategy" "Why 48% of Companies Say AI Adoption Has Been a Disappointment" "Nearly half of enterprises call AI adoption a massive disappointment."
generate "article/what-ai-implementation-means-law-firm.png" "AI Implementation" "What AI Implementation Actually Means for a Law Firm" "A practical guide to AI implementation for law firms in 2026."
generate "article/agency-workflows-automate-first.png" "AI for Agencies" "The 3 Workflows Every Agency Should Automate First" "Practical guide to agency automation that cuts hours off client delivery."
generate "article/ai-generated-code-security-risk.png" "AI Development Tools" "51% of Code on GitHub is AI-Generated. That Should Worry You." "45% of AI-generated code ships with known security flaws."

# Clean up
rm -f "$DIR/_tmp_og.html"

echo ""
echo "Done! $(find "$OUT" -name "*.png" | wc -l | tr -d ' ') OG images generated in public/og/"

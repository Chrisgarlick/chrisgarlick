#!/usr/bin/env node
/**
 * Rebrand the 7 resource JSONs from the IG-carousel gold scheme to the
 * chrisgarlick.com homepage parchment + service-neon scheme.
 *
 * - Base palette aligned to /src/styles/global.css tokens
 *   - bg-primary  #FAF8F5 -> #F6F2EB  (warm parchment)
 *   - border      #E8E4DE -> #D8D2C8  (parchment border)
 *   - bg-dark     #1A1715 -> #131510  (oxide green-black)
 *   - text-dark   #F0EDE8 -> #E4E0D8  (text on dark)
 *
 * - Per-resource neon mapping (replaces the #C4A96B gold accent)
 *   - Tradespeople + Solo Operator        → workflow base  #08743F + dark #39FF8C
 *   - Freelancers + Agency Playbook       → agents base    #0F60C4 + dark #39C6FF
 *   - One Framework (content extraction)  → data base      #A14809 + dark #FF9F40
 *   - LLM Cheat + Prompt Library          → engineering base #7E1FE8 + dark #C97FFF
 *
 * - Dark cards get the NEON variant for their accent border so they "glow",
 *   light cards get the BASE variant so they read confidently on parchment.
 */

import fs from 'node:fs'
import path from 'node:path'

const RESOURCE_DIR = 'public/resources'

const CORE_REMAP = {
  '#FAF8F5': '#F6F2EB',
  '#E8E4DE': '#D8D2C8',
  '#1A1715': '#131510',
  '#F0EDE8': '#E4E0D8',
}

const SERVICE_BY_SLUG = {
  '5-ai-tools-tradespeople-2026':         { base: '#08743F', neon: '#39FF8C', label: 'workflow' },
  'ai-stack-under-two-hours-a-day':       { base: '#08743F', neon: '#39FF8C', label: 'workflow' },
  'freelancers-ai-proposal-pack':         { base: '#0F60C4', neon: '#39C6FF', label: 'agents' },
  'zero-team-agency-playbook':            { base: '#0F60C4', neon: '#39C6FF', label: 'agents' },
  'one-framework-six-months-of-content':  { base: '#A14809', neon: '#FF9F40', label: 'data' },
  'llm-cheat-sheet-2026':                 { base: '#7E1FE8', neon: '#C97FFF', label: 'engineering' },
  'prompt-library-for-professional-services': { base: '#7E1FE8', neon: '#C97FFF', label: 'engineering' },
}

const GOLD = '#C4A96B'

/**
 * Recursively walk a parsed JSON tree. For any container that has a
 * background and a border, if the border equals GOLD, swap it for the
 * service-appropriate accent: NEON if the bg is the dark oxide tone,
 * BASE otherwise (parchment / white / cream).
 */
function rebrandTree(node, service) {
  if (Array.isArray(node)) {
    for (const child of node) rebrandTree(child, service)
    return
  }
  if (node && typeof node === 'object') {
    // Container with border + background
    if (node.border && node.border.color === GOLD) {
      const isDark = (node.background || '').toLowerCase() === '#131510'
        || (node.background || '').toLowerCase() === '#1c1f19'
      node.border.color = isDark ? service.neon : service.base
    }
    // Some containers use background = GOLD (none in our files but safe)
    if (node.background === GOLD) node.background = service.base

    for (const key of Object.keys(node)) {
      rebrandTree(node[key], service)
    }
  }
}

function remapCore(text) {
  let out = text
  for (const [from, to] of Object.entries(CORE_REMAP)) {
    out = out.split(from).join(to)
  }
  return out
}

let totalFiles = 0
let totalSwaps = 0

for (const slug of Object.keys(SERVICE_BY_SLUG)) {
  const file = path.join(RESOURCE_DIR, slug, `${slug}.json`)
  if (!fs.existsSync(file)) {
    console.error(`Missing: ${file}`)
    continue
  }
  const raw = fs.readFileSync(file, 'utf8')
  const remapped = remapCore(raw)
  const coreSwaps = (raw.match(/#FAF8F5|#E8E4DE|#1A1715|#F0EDE8/g) || []).length

  const parsed = JSON.parse(remapped)
  const service = SERVICE_BY_SLUG[slug]

  // Count gold occurrences before rebrand
  const goldBefore = (remapped.match(new RegExp(GOLD, 'g')) || []).length

  rebrandTree(parsed.pages, service)
  // Any remaining stray GOLD literal (unlikely now) – fall through:
  const out = JSON.stringify(parsed, null, 2).split(GOLD).join(service.base)

  fs.writeFileSync(file, out + '\n')

  const goldAfter = (out.match(new RegExp(GOLD, 'g')) || []).length
  const accentSwaps = goldBefore - goldAfter

  console.log(`✓ ${slug.padEnd(48)}  ${service.label.padEnd(12)}  core: ${coreSwaps}  accents: ${accentSwaps}`)
  totalFiles++
  totalSwaps += coreSwaps + accentSwaps
}

console.log(`\n${totalFiles} files updated. ${totalSwaps} colour tokens remapped.`)

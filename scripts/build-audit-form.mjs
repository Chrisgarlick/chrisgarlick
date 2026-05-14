#!/usr/bin/env bun
/**
 * Convert config/audit-form.yml → config/audit-form.json
 *
 * The YAML is the human-editable source of truth; the JSON is the machine-consumed
 * artefact imported by both the Astro frontend (for rendering the form) and the
 * Bun server (for server-side validation of submissions).
 *
 * Run manually after editing the YAML, or via the package.json prebuild step
 * which chains this in before `cms build` / `bunx astro build`.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const yamlPath = resolve(projectRoot, 'config/audit-form.yml')
const jsonPath = resolve(projectRoot, 'config/audit-form.json')

if (!existsSync(yamlPath)) {
  console.error(`✗ Source file missing: ${yamlPath}`)
  process.exit(1)
}

// Use the `yaml` npm package if present (richer parsing), otherwise fall back to
// a minimal inline parser sufficient for the subset of YAML used in audit-form.yml.
let parse
try {
  ;({ parse } = await import('yaml'))
} catch {
  console.error('✗ `yaml` package not installed. Run: bun add -D yaml')
  process.exit(1)
}

const yamlText = readFileSync(yamlPath, 'utf8')
let data
try {
  data = parse(yamlText)
} catch (err) {
  console.error(`✗ YAML parse error: ${err.message}`)
  process.exit(1)
}

// Basic sanity checks — fail loudly if the schema shape is off.
const errors = []
if (!data || typeof data !== 'object') errors.push('Top-level YAML is not an object.')
if (!data.version) errors.push('Missing `version`.')
if (!data.privacy_notice_version) errors.push('Missing `privacy_notice_version`.')
if (!Array.isArray(data.sectors) || data.sectors.length === 0) errors.push('`sectors` must be a non-empty array.')
if (!Array.isArray(data.steps)  || data.steps.length === 0) errors.push('`steps` must be a non-empty array.')

if (Array.isArray(data.steps)) {
  for (const step of data.steps) {
    if (!step.id) errors.push(`Step missing id: ${JSON.stringify(step).slice(0, 80)}`)
    if (step.conditional) {
      if (!step.fieldsBySector) errors.push(`Conditional step ${step.id} missing fieldsBySector`)
      else {
        const sectorValues = data.sectors.map((s) => s.value)
        for (const sector of Object.keys(step.fieldsBySector)) {
          if (!sectorValues.includes(sector)) errors.push(`Step ${step.id} references unknown sector '${sector}'`)
        }
      }
    }
  }
}

if (errors.length) {
  console.error('✗ Validation failed:')
  errors.forEach((e) => console.error(`  - ${e}`))
  process.exit(1)
}

// Compact-but-pretty JSON output (2-space indent).
const json = JSON.stringify(data, null, 2)
writeFileSync(jsonPath, json + '\n', 'utf8')

const fieldCount = data.steps.reduce((acc, s) => {
  if (s.fields) return acc + s.fields.length
  if (s.fieldsBySector) return acc + Object.values(s.fieldsBySector).reduce((a, arr) => a + arr.length, 0)
  return acc
}, 0)

console.log(`✓ Built config/audit-form.json (${data.steps.length} steps, ~${fieldCount} fields, ${data.sectors.length} sectors)`)
console.log(`  Privacy notice version: ${data.privacy_notice_version}`)

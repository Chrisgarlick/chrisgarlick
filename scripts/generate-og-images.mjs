#!/usr/bin/env node
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(resolve(__dirname, 'generate-og.html'), 'utf-8');
const outDir = resolve(__dirname, '..', 'public', 'og');

const pages = [
  {
    file: 'home.png',
    label: 'Chris Garlick',
    title: 'I build software that replaces manual work.',
    subtitle: 'AI integration for law firms, agencies, and accountancies. Fixed-fee projects. UK-based.',
    large: true,
  },
  {
    file: 'about.png',
    label: 'About',
    title: "I'm Chris Garlick. I build software that actually gets used.",
    subtitle: 'AI workflow partner for service businesses.',
  },
  {
    file: 'contact.png',
    label: 'Contact',
    title: 'Get in touch.',
    subtitle: 'Tell me about your business. If we are a fit, you will hear back within 2 working days.',
    large: true,
  },
  {
    file: 'work.png',
    label: 'Case Studies',
    title: 'Real projects. Measured outcomes.',
    subtitle: 'AI integration projects for service businesses. Architecture shown. Results tracked.',
    large: true,
  },
  {
    file: 'article.png',
    label: 'Articles',
    title: 'Practical guides on AI integration.',
    subtitle: 'No hype. Just what works for service businesses adopting AI.',
    large: true,
  },
  {
    file: 'privacy.png',
    label: 'Legal',
    title: 'Privacy Policy',
    subtitle: 'How I handle your data. UK GDPR compliant. No cookies. No tracking.',
    large: true,
  },
  {
    file: 'terms.png',
    label: 'Legal',
    title: 'Terms of Service',
    subtitle: 'Standard terms for working with Chris Garlick.',
    large: true,
  },
  // Articles
  {
    file: 'article/ai-adoption-disappointment-why-companies-fail.png',
    label: 'AI Strategy & Adoption',
    title: 'Why 48% of Companies Say AI Adoption Has Been a Disappointment',
    subtitle: 'Nearly half of enterprises call AI adoption a massive disappointment. Here is why most fail.',
  },
  {
    file: 'article/what-ai-implementation-means-law-firm.png',
    label: 'AI Implementation',
    title: 'What AI Implementation Actually Means for a Law Firm',
    subtitle: 'A practical guide to AI implementation for law firms in 2026.',
  },
  {
    file: 'article/agency-workflows-automate-first.png',
    label: 'AI for Agencies',
    title: 'The 3 Workflows Every Agency Should Automate First',
    subtitle: 'Practical guide to agency automation that cuts hours off client delivery.',
  },
  {
    file: 'article/ai-generated-code-security-risk.png',
    label: 'AI Development Tools',
    title: '51% of Code on GitHub is AI-Generated. That Should Worry You.',
    subtitle: '45% of AI-generated code ships with known security flaws. The productivity story is hiding a crisis.',
  },

  // ─── Post-pivot outcome service pages ───────────────────────────
  { file: 'services/workflow-automation.png',          label: 'Workflow Automation', title: 'Stop doing the same task thirty times a week.',     subtitle: 'Custom AI pipelines that replace repetitive multi-step workflows.', large: true },
  { file: 'services/ai-agents.png',                    label: 'Custom AI Agents',    title: 'For the tasks that need judgement, not just execution.', subtitle: 'Lead research, email triage, document review, meeting summaries.',  large: true },
  { file: 'services/data-extraction.png',              label: 'Data Extraction',     title: 'Get the data out of the PDFs.',                      subtitle: 'Structured pipelines for contracts, statements, receipts, web pages.', large: true },
  { file: 'services/ai-implementation.png',            label: 'AI Implementation',   title: 'AI that actually replaces manual work.',             subtitle: 'Custom systems, fixed pricing, one-person delivery. UK-based.',     large: true },

  // ─── Rewritten industry pages ───────────────────────────────────
  { file: 'services/ai-for-law-firms.png',             label: 'AI for Law Firms',    title: 'Automating document-heavy workflows for law firms.', subtitle: 'Contract extraction, intake, first-pass review, matter summarisation.', large: true },
  { file: 'services/ai-for-accountancy-firms.png',     label: 'AI for Accountancy',  title: 'Reducing manual processing for accountancy practices.', subtitle: 'Statement parsing, monthly reporting, client onboarding, narrative drafting.', large: true },
  { file: 'services/ai-for-agencies.png',              label: 'AI for Agencies',     title: 'Replacing repetitive delivery tasks for agencies.', subtitle: 'Reporting, brief processing, content production, competitor research.', large: true },

  // ─── Services hub ───────────────────────────────────────────────
  { file: 'services.png',                              label: 'Services',            title: 'AI that replaces real work, not just decks.',        subtitle: 'Three outcome lanes. Direct execution. Fixed pricing from £500.', large: true },

  // ─── Resources hub + the prompt library ─────────────────────────
  { file: 'resources.png',                             label: 'Free Resources',      title: 'Resources for AI implementation.',                   subtitle: 'Scorecards, checklists, prompt libraries, policy templates.',       large: true },
  { file: 'resources/prompt-library-for-professional-services.png', label: 'Prompt Library', title: 'The Prompt Library for Professional Services.', subtitle: 'Copy-paste prompts for law firms, accountancies and agencies.', large: true },

  // ─── New articles ───────────────────────────────────────────────
  { file: 'article/automate-client-intake-without-custom-software.png', label: 'Workflow Automation', title: 'How to Automate Client Intake Without Custom Software', subtitle: 'The three-tool stack that replaces 80% of custom intake builds.' },
  { file: 'article/replacing-manual-data-entry-with-ai-agents.png',     label: 'Data Extraction',     title: 'Replacing Manual Data Entry with AI Agents',           subtitle: 'The four-stage pattern that actually works in 2026.' },
];

async function generate() {
  const browser = await chromium.launch({ headless: true });

  for (const page of pages) {
    const html = template
      .replace('id="label"></div>', `id="label">${page.label}</div>`)
      .replace('id="title"></div>', `id="title" class="title${page.large ? ' title--large' : ''}">${page.title}</div>`)
      .replace('id="subtitle"></div>', `id="subtitle">${page.subtitle || ''}</div>`);

    const tmpPath = resolve(__dirname, '_tmp_og.html');
    writeFileSync(tmpPath, html);

    const ctx = await browser.newPage();
    await ctx.setViewportSize({ width: 1200, height: 630 });
    await ctx.goto('file://' + tmpPath, { waitUntil: 'networkidle' });
    await ctx.waitForTimeout(1500);
    await ctx.screenshot({ path: resolve(outDir, page.file), type: 'png' });
    await ctx.close();

    console.log(`Generated: ${page.file}`);
  }

  await browser.close();

  // Clean up
  const { unlinkSync } = await import('fs');
  try { unlinkSync(resolve(__dirname, '_tmp_og.html')); } catch {}

  console.log(`\nDone! ${pages.length} OG images generated in public/og/`);
}

generate().catch(console.error);

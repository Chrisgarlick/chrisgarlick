<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>chrisgarlick.com — Hybrid Palette System</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --font-serif: 'Instrument Serif', serif;
    --font-mono: 'DM Mono', monospace;

    /* BASE SYSTEM — Parchment/Ink foundation with Oxide green darks */
    --bg:           #F6F2EB;   /* warm parchment */
    --bg-surface:   #EDE8DF;   /* slightly deeper parchment for cards */
    --bg-dark:      #131510;   /* oxide green-black */
    --bg-dark-surface: #1C1F19; /* elevated dark surface */
    --bg-dark-deeper:  #0D0F0B; /* deeper dark for gaps */

    --text:         #1A1814;   /* near-black, warm */
    --text-muted:   #6B6358;   /* warm brown-grey */
    --text-faint:   #A09890;   /* faint warm grey */
    --text-dark:    #E4E0D8;   /* off-white on dark */
    --text-dark-muted: #888078; /* muted on dark */

    --border:       #D8D2C8;   /* parchment border */
    --border-dark:  #252820;   /* dark section border */

    /* SERVICE COLOURS — all muted, desaturated, from same tonal family */
    --workflow:     #4A7A60;   /* sage forest — Workflow Automation */
    --workflow-bg:  rgba(74, 122, 96, 0.08);
    --workflow-dark: #5A8A70;  /* lighter on dark bg */

    --agents:       #5A6E8A;   /* steel slate — AI Agents */
    --agents-bg:    rgba(90, 110, 138, 0.08);
    --agents-dark:  #6A7E9A;

    --data:         #8A6A40;   /* oxidised amber — Data Extraction */
    --data-bg:      rgba(138, 106, 64, 0.08);
    --data-dark:    #9A7A50;

    --engineering:      #6A5A7A;   /* muted violet — AI Engineering */
    --engineering-bg:   rgba(106, 90, 122, 0.08);
    --engineering-dark: #7A6A8A;
  }

  /*
   * Decision log (2026-05-18):
   *   - Services are the colour classification axis. Industries are content lenses (monochrome).
   *   - 4 service colours map to the 4 non-pillar services:
   *       Workflow Automation = sage
   *       AI Agents           = slate
   *       Data Extraction     = amber
   *       AI Engineering      = violet  (moved from Audit on 2026-05-18)
   *   - AI Implementation (pillar) stays monochrome — the umbrella, the brand ink.
   *   - AI Readiness Audit form stays monochrome — it's a conversion tool, not a service.
   *   - Industry pages are monochrome at the page level; service cards on those pages carry the
   *     relevant service colour (so an industry hero is neutral, but its "what I build for
   *     [sector]" cards explode into a sage/slate/amber/violet patchwork).
   */

  body {
    font-family: var(--font-mono);
    background: #111;
    color: #bbb;
    padding: 2.5rem 1.5rem;
    min-height: 100vh;
  }

  .masthead {
    max-width: 980px;
    margin: 0 auto 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #222;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .masthead h1 { font-family: var(--font-serif); font-size: clamp(1.3rem, 3vw, 2rem); font-weight: 400; color: #e8e4dc; }
  .masthead p { font-size: 0.62rem; color: #555; letter-spacing: 0.08em; text-align: right; line-height: 1.7; }

  .intro {
    max-width: 980px;
    margin: 0 auto 3rem;
    padding: 1.2rem 1.5rem;
    background: #181818;
    border: 1px solid #222;
    font-size: 0.7rem;
    line-height: 1.7;
    color: #777;
  }

  .intro strong { color: #bbb; }

  /* ===================== */
  /* SECTION LABELS        */
  /* ===================== */
  .section-label {
    max-width: 980px;
    margin: 0 auto 1.2rem;
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    color: #555;
    text-transform: uppercase;
  }

  /* ===================== */
  /* SITE MOCK             */
  /* ===================== */
  .site-wrap {
    max-width: 980px;
    margin: 0 auto 4rem;
    border: 1px solid #222;
    overflow: hidden;
  }

  /* NAV */
  .mock-nav {
    background: var(--bg);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border);
  }

  .mock-logo { font-family: var(--font-serif); font-size: 1.1rem; color: var(--text); }
  .mock-logo span { color: var(--workflow); }

  .mock-nav-links { display: flex; gap: 2rem; align-items: center; }
  .mock-nav-link { font-size: 0.62rem; letter-spacing: 0.08em; color: var(--text-muted); cursor: pointer; }
  .mock-nav-cta {
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    padding: 0.45rem 1rem;
    background: var(--text);
    color: var(--bg);
    cursor: pointer;
  }

  /* HERO */
  .mock-hero {
    background: var(--bg);
    padding: 3.5rem 2rem 4rem;
  }

  .mock-eyebrow {
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    color: var(--text-muted);
    margin-bottom: 1.2rem;
  }

  .mock-h1 {
    font-family: var(--font-serif);
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 400;
    color: var(--text);
    line-height: 1.08;
    margin-bottom: 1.4rem;
    max-width: 640px;
  }

  .mock-body {
    font-size: 0.72rem;
    line-height: 1.8;
    color: var(--text-muted);
    max-width: 500px;
    margin-bottom: 2.2rem;
  }

  .mock-btns { display: flex; gap: 0.8rem; flex-wrap: wrap; }

  .mock-btn-primary {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    padding: 0.75rem 1.5rem;
    background: var(--text);
    color: var(--bg);
    border: none;
    cursor: pointer;
  }

  .mock-btn-secondary {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    padding: 0.75rem 1.5rem;
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border);
    cursor: pointer;
  }

  /* STAT BAR */
  .mock-statbar {
    background: var(--bg-dark-deeper);
    padding: 0.9rem 2rem;
    display: flex;
    gap: 2.5rem;
    font-size: 0.6rem;
    letter-spacing: 0.06em;
    color: var(--text-dark-muted);
    flex-wrap: wrap;
    border-top: 1px solid var(--border-dark);
    border-bottom: 1px solid var(--border-dark);
  }

  /* SERVICES SECTION — coloured */
  .mock-services {
    background: var(--bg-dark);
    padding: 3rem 2rem;
  }

  .mock-section-eyebrow {
    font-size: 0.6rem;
    letter-spacing: 0.16em;
    color: var(--text-dark-muted);
    margin-bottom: 0.8rem;
  }

  .mock-section-h2 {
    font-family: var(--font-serif);
    font-size: 1.8rem;
    font-weight: 400;
    color: var(--text-dark);
    margin-bottom: 2rem;
  }

  .service-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: var(--bg-dark-deeper);
  }

  .service-card {
    background: var(--bg-dark-surface);
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .service-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }

  .service-card.workflow::before { background: var(--workflow); }
  .service-card.agents::before { background: var(--agents); }
  .service-card.data::before { background: var(--data); }
  .service-card.engineering::before { background: var(--engineering); }

  .service-tag {
    display: inline-block;
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    padding: 0.25rem 0.6rem;
    margin-bottom: 1rem;
  }

  .service-card.workflow .service-tag { color: var(--workflow-dark); background: rgba(74,122,96,0.12); }
  .service-card.agents .service-tag { color: var(--agents-dark); background: rgba(90,110,138,0.12); }
  .service-card.data .service-tag { color: var(--data-dark); background: rgba(138,106,64,0.12); }
  .service-card.engineering .service-tag { color: var(--engineering-dark); background: rgba(106,90,122,0.12); }

  .service-title {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    font-weight: 400;
    color: var(--text-dark);
    margin-bottom: 0.6rem;
  }

  .service-body {
    font-size: 0.66rem;
    line-height: 1.7;
    color: var(--text-dark-muted);
    margin-bottom: 1.2rem;
  }

  .service-link {
    font-size: 0.6rem;
    letter-spacing: 0.08em;
  }

  .service-card.workflow .service-link { color: var(--workflow-dark); }
  .service-card.agents .service-link { color: var(--agents-dark); }
  .service-card.data .service-link { color: var(--data-dark); }
  .service-card.engineering .service-link { color: var(--engineering-dark); }

  /* ARTICLE SECTION */
  .mock-articles {
    background: var(--bg);
    padding: 3rem 2rem;
    border-top: 1px solid var(--border);
  }

  .mock-articles .mock-section-eyebrow { color: var(--text-faint); }
  .mock-articles .mock-section-h2 { color: var(--text); }

  .article-list { display: flex; flex-direction: column; gap: 0; }

  .article-row {
    display: grid;
    grid-template-columns: 80px 1fr auto;
    gap: 1.5rem;
    align-items: center;
    padding: 1.2rem 0;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
  }

  .article-row:last-child { border-bottom: none; }

  .article-tag {
    font-size: 0.58rem;
    letter-spacing: 0.08em;
    padding: 0.2rem 0.5rem;
    text-align: center;
  }

  .article-row.workflow .article-tag { color: var(--workflow); background: var(--workflow-bg); }
  .article-row.agents .article-tag { color: var(--agents); background: var(--agents-bg); }
  .article-row.data .article-tag { color: var(--data); background: var(--data-bg); }
  .article-row.engineering .article-tag { color: var(--engineering); background: var(--engineering-bg); }

  .article-title {
    font-family: var(--font-serif);
    font-size: 1rem;
    font-weight: 400;
    color: var(--text);
  }

  .article-arrow { font-size: 0.8rem; color: var(--text-faint); }

  /* CASE STUDIES — coloured */
  .mock-cases {
    background: var(--bg-dark);
    padding: 3rem 2rem;
    border-top: 1px solid var(--border-dark);
  }

  .mock-cases .mock-section-eyebrow { color: var(--text-dark-muted); }
  .mock-cases .mock-section-h2 { color: var(--text-dark); }

  .case-list { display: flex; flex-direction: column; gap: 1px; background: var(--bg-dark-deeper); }

  .case-row {
    background: var(--bg-dark-surface);
    padding: 1.5rem;
    display: grid;
    grid-template-columns: 3px 1fr auto;
    gap: 1.5rem;
    align-items: center;
    cursor: pointer;
  }

  .case-stripe { align-self: stretch; }
  .case-row.workflow .case-stripe { background: var(--workflow); }
  .case-row.agents .case-stripe { background: var(--agents); }
  .case-row.data .case-stripe { background: var(--data); }

  .case-content {}

  .case-meta {
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    margin-bottom: 0.4rem;
  }

  .case-row.workflow .case-meta { color: var(--workflow-dark); }
  .case-row.agents .case-meta { color: var(--agents-dark); }
  .case-row.data .case-meta { color: var(--data-dark); }

  .case-title {
    font-family: var(--font-serif);
    font-size: 1.05rem;
    color: var(--text-dark);
    margin-bottom: 0.3rem;
  }

  .case-stat { font-size: 0.65rem; color: var(--text-dark-muted); }
  .case-arrow { font-size: 0.8rem; color: var(--text-dark-muted); }

  /* CONTACT STRIP */
  .mock-contact {
    background: var(--bg);
    padding: 3rem 2rem;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .mock-contact-left {}
  .mock-contact-h2 { font-family: var(--font-serif); font-size: 1.6rem; color: var(--text); margin-bottom: 0.4rem; }
  .mock-contact-body { font-size: 0.68rem; color: var(--text-muted); line-height: 1.6; }
  .mock-contact-cta {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    padding: 0.9rem 2rem;
    background: var(--text);
    color: var(--bg);
    border: none;
    cursor: pointer;
    white-space: nowrap;
  }

  /* FOOTER */
  .mock-footer {
    background: var(--bg-dark-deeper);
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.6rem;
    color: var(--text-dark-muted);
    flex-wrap: wrap;
    gap: 1rem;
  }

  /* ===================== */
  /* SYSTEM DOCS BELOW     */
  /* ===================== */
  .system-section {
    max-width: 980px;
    margin: 0 auto 4rem;
    border: 1px solid #222;
    overflow: hidden;
  }

  .system-header {
    padding: 1.5rem 2rem;
    background: #181818;
    border-bottom: 1px solid #222;
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    color: #555;
    text-transform: uppercase;
  }

  /* COLOUR SYSTEM GRID */
  .colour-system {
    padding: 2rem;
    background: #111;
  }

  .colour-row {
    margin-bottom: 2.5rem;
  }

  .colour-row:last-child { margin-bottom: 0; }

  .colour-row-label {
    font-size: 0.58rem;
    letter-spacing: 0.14em;
    color: #444;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .colour-chips { display: flex; gap: 0.6rem; flex-wrap: wrap; }

  .chip {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    min-width: 100px;
  }

  .chip-swatch { height: 48px; }
  .chip-name { font-size: 0.58rem; color: #666; letter-spacing: 0.04em; }
  .chip-hex { font-size: 0.62rem; color: #888; }
  .chip-use { font-size: 0.56rem; color: #444; line-height: 1.4; }

  /* SERVICE PAGE PREVIEWS */
  .service-pages {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: #111;
    padding: 2rem;
    gap: 1.5rem;
  }

  .service-page-mock {
    border: 1px solid #222;
    overflow: hidden;
  }

  .spm-hero {
    padding: 2rem 1.5rem;
    background: var(--bg);
  }

  .spm-eyebrow {
    font-size: 0.58rem;
    letter-spacing: 0.14em;
    margin-bottom: 0.8rem;
  }

  .spm-h1 {
    font-family: var(--font-serif);
    font-size: 1.4rem;
    color: var(--text);
    margin-bottom: 0.6rem;
    line-height: 1.15;
  }

  .spm-body {
    font-size: 0.65rem;
    line-height: 1.7;
    color: var(--text-muted);
    margin-bottom: 1.2rem;
  }

  .spm-cta {
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    padding: 0.6rem 1.2rem;
    border: none;
    cursor: pointer;
    font-family: var(--font-mono);
  }

  .spm-dark {
    padding: 1.5rem;
    background: var(--bg-dark);
    font-size: 0.62rem;
    line-height: 1.6;
  }

  .spm-dark-label { font-size: 0.56rem; letter-spacing: 0.12em; margin-bottom: 0.6rem; }
  .spm-dark-stat { font-family: var(--font-serif); font-size: 1.8rem; margin-bottom: 0.2rem; }
  .spm-dark-stat-label { font-size: 0.58rem; color: var(--text-dark-muted); }

  /* Workflow — sage */
  .spm-workflow .spm-eyebrow { color: var(--workflow); }
  .spm-workflow .spm-cta { background: var(--workflow); color: var(--bg); }
  .spm-workflow .spm-dark-label { color: var(--workflow-dark); }
  .spm-workflow .spm-dark-stat { color: var(--workflow-dark); }

  /* Agents — slate */
  .spm-agents .spm-eyebrow { color: var(--agents); }
  .spm-agents .spm-cta { background: var(--agents); color: var(--bg); }
  .spm-agents .spm-dark-label { color: var(--agents-dark); }
  .spm-agents .spm-dark-stat { color: var(--agents-dark); }

  /* Data — amber */
  .spm-data .spm-eyebrow { color: var(--data); }
  .spm-data .spm-cta { background: var(--data); color: var(--bg); }
  .spm-data .spm-dark-label { color: var(--data-dark); }
  .spm-data .spm-dark-stat { color: var(--data-dark); }

  /* Engineering — violet */
  .spm-engineering .spm-eyebrow { color: var(--engineering); }
  .spm-engineering .spm-cta { background: var(--engineering); color: var(--bg); }
  .spm-engineering .spm-dark-label { color: var(--engineering-dark); }
  .spm-engineering .spm-dark-stat { color: var(--engineering-dark); }

  /* TOKEN TABLE */
  .token-table {
    padding: 2rem;
    background: #111;
  }

  .token-row {
    display: grid;
    grid-template-columns: 40px 160px 90px 1fr 1fr;
    gap: 1rem;
    align-items: center;
    padding: 0.55rem 0;
    border-bottom: 1px solid #1a1a1a;
    font-size: 0.63rem;
  }

  .token-row:last-child { border-bottom: none; }
  .token-dot { width: 40px; height: 26px; border: 1px solid rgba(255,255,255,0.04); flex-shrink: 0; }
  .token-var { color: #666; letter-spacing: 0.04em; }
  .token-hex { color: #555; font-size: 0.6rem; }
  .token-role { color: #444; }
  .token-use { color: #3a3a3a; font-size: 0.58rem; }

  .token-group-label {
    font-size: 0.56rem;
    letter-spacing: 0.14em;
    color: #333;
    text-transform: uppercase;
    padding: 1rem 0 0.3rem;
    grid-column: 1 / -1;
  }
</style>
</head>
<body>

<div class="masthead">
  <h1>Hybrid Palette System</h1>
  <p>Parchment/Oxide base · Service-specific colour layer<br>
  All muted, same tonal family · No AI brand DNA</p>
</div>

<div class="intro">
  <strong>The concept:</strong> The base is Parchment & Ink meets Chalk & Oxide — warm off-white light sections, oxide green-black dark sections, black primary CTAs. Colour is introduced as a <em>service classification system</em> rather than a brand accent. Four services get muted hues from the same desaturated family: sage forest (Workflow Automation), steel slate (AI Agents), oxidised amber (Data Extraction), muted violet (AI Engineering). Colour appears on tags, labels, stat numbers, card top borders, and article category pills, not on primary CTAs or body text.<br><br>
  <strong>What stays monochrome:</strong> AI Implementation (the pillar), the AI Readiness Audit form (a conversion tool), industry pages (content lenses, not services), nav, body text, headings, the About page, the Contact page, the footer. The homepage reads mostly monochrome; colour only appears when you're looking at service-specific content. Industry pages stay neutral at the page level but show the relevant service colours in their "what I build for [sector]" cards.
</div>

<!-- ======================== -->
<!-- FULL HOMEPAGE MOCK       -->
<!-- ======================== -->
<div class="section-label">HOMEPAGE PREVIEW</div>
<div class="site-wrap">

  <div class="mock-nav">
    <div class="mock-logo">Chris Garlick<span>.</span></div>
    <div class="mock-nav-links">
      <div class="mock-nav-link">Services</div>
      <div class="mock-nav-link">Work</div>
      <div class="mock-nav-link">Articles</div>
      <div class="mock-nav-cta">GET IN TOUCH</div>
    </div>
  </div>

  <div class="mock-hero">
    <div class="mock-eyebrow">VERTICAL AI IMPLEMENTATION</div>
    <div class="mock-h1">If it can be documented, it can be automated.</div>
    <div class="mock-body">A one-person AI implementation partner for businesses that need workflows automated, agents built, or data extracted. Direct execution. No account managers, no agency overhead, no brief-to-delivery translation loss.</div>
    <div class="mock-btns">
      <button class="mock-btn-primary">START WITH A FREE AUDIT</button>
      <button class="mock-btn-secondary">SEE HOW IT WORKS</button>
    </div>
  </div>

  <div class="mock-statbar">
    <div>4 projects delivered · 2026</div>
    <div>40% avg. reduction in manual processing</div>
    <div>Fixed-fee from £5k</div>
    <div>2 working day response guarantee</div>
  </div>

  <div class="mock-services">
    <div class="mock-section-eyebrow">WHAT I BUILD</div>
    <div class="mock-section-h2">Three types of automation.</div>
    <div class="service-cards">

      <div class="service-card workflow">
        <div class="service-tag">WORKFLOW AUTOMATION</div>
        <div class="service-title">Repetitive multi-step processes, eliminated.</div>
        <div class="service-body">Client intake, document generation, approval chains, report assembly. If your team does it the same way every time, it can be automated.</div>
        <div class="service-link">View service →</div>
      </div>

      <div class="service-card agents">
        <div class="service-tag">AI AGENTS</div>
        <div class="service-title">Tasks that need judgement, not just execution.</div>
        <div class="service-body">Lead research, email triage, document review, meeting summarisation. Agents that make decisions within defined parameters.</div>
        <div class="service-link">View service →</div>
      </div>

      <div class="service-card data">
        <div class="service-tag">DATA EXTRACTION</div>
        <div class="service-title">Data locked in documents, freed.</div>
        <div class="service-body">PDFs, emails, forms, web pages. Structured output from unstructured input. Contract data, competitor monitoring, intake processing.</div>
        <div class="service-link">View service →</div>
      </div>

      <div class="service-card engineering">
        <div class="service-tag">AI ENGINEERING</div>
        <div class="service-title">Model selection. RAG. The technical depth.</div>
        <div class="service-body">Beyond prompt-writing. Choosing the right model, designing retrieval, evaluating outputs, instrumenting failure modes. The engineering work that turns prototypes into production.</div>
        <div class="service-link">View service →</div>
      </div>

    </div>
  </div>

  <div class="mock-articles">
    <div class="mock-section-eyebrow">RECENT WRITING</div>
    <div class="mock-section-h2" style="color:var(--text)">From the archive.</div>
    <div class="article-list">
      <div class="article-row workflow">
        <div class="article-tag">WORKFLOW</div>
        <div class="article-title">How to automate client intake without custom software</div>
        <div class="article-arrow">→</div>
      </div>
      <div class="article-row agents">
        <div class="article-tag">AGENTS</div>
        <div class="article-title">Replacing manual data entry with AI agents: a practical guide</div>
        <div class="article-arrow">→</div>
      </div>
      <div class="article-row data">
        <div class="article-tag">DATA</div>
        <div class="article-title">What vertical AI implementation actually looks like</div>
        <div class="article-arrow">→</div>
      </div>
      <div class="article-row engineering">
        <div class="article-tag">ENGINEERING</div>
        <div class="article-title">How to choose an LLM for business: a no-hype framework</div>
        <div class="article-arrow">→</div>
      </div>
    </div>
  </div>

  <div class="mock-cases">
    <div class="mock-section-eyebrow">RECENT WORK</div>
    <div class="mock-section-h2">Built, delivered, measured.</div>
    <div class="case-list">
      <div class="case-row workflow">
        <div class="case-stripe"></div>
        <div class="case-content">
          <div class="case-meta">WORKFLOW AUTOMATION · LAW FIRM</div>
          <div class="case-title">Client intake reduced from 45 minutes to 4</div>
          <div class="case-stat">Custom intake pipeline · Claude API + Node.js · 3 weeks</div>
        </div>
        <div class="case-arrow">→</div>
      </div>
      <div class="case-row agents">
        <div class="case-stripe"></div>
        <div class="case-content">
          <div class="case-meta">AI AGENTS · AGENCY</div>
          <div class="case-title">Weekly client reports generated automatically</div>
          <div class="case-stat">Reporting agent · Claude API + Astro · 2 weeks</div>
        </div>
        <div class="case-arrow">→</div>
      </div>
      <div class="case-row data">
        <div class="case-stripe"></div>
        <div class="case-content">
          <div class="case-meta">DATA EXTRACTION · ACCOUNTANCY</div>
          <div class="case-title">Statement processing time cut by 70%</div>
          <div class="case-stat">Document pipeline · Claude API + Playwright · 4 weeks</div>
        </div>
        <div class="case-arrow">→</div>
      </div>
    </div>
  </div>

  <div class="mock-contact">
    <div class="mock-contact-left">
      <div class="mock-contact-h2">Ready to start?</div>
      <div class="mock-contact-body">Run a free audit of your operations or book a 30-minute scoping call.<br>Engagements typically start at £5k. Two working day response guaranteed.</div>
    </div>
    <button class="mock-contact-cta">REQUEST FREE AUDIT</button>
  </div>

  <div class="mock-footer">
    <div>© 2026 Chris Garlick · chrisgarlick.com</div>
    <div style="display:flex;gap:1.5rem">
      <span>Privacy</span>
      <span>Terms</span>
      <span>LinkedIn</span>
    </div>
  </div>

</div>

<!-- ======================== -->
<!-- SERVICE PAGE PREVIEWS    -->
<!-- ======================== -->
<div class="section-label">SERVICE PAGE PREVIEWS — Colour per service</div>
<div class="system-section">
  <div class="system-header">Each service page uses its own hue — same base layout, different colour signature</div>
  <div class="service-pages">

    <div class="service-page-mock">
      <div class="spm-hero spm-workflow">
        <div class="spm-eyebrow">WORKFLOW AUTOMATION</div>
        <div class="spm-h1">Repetitive processes, automated.</div>
        <div class="spm-body">Client intake, document generation, approval chains. If your team does it the same way every time, it can be removed from their to-do list entirely.</div>
        <button class="spm-cta">BOOK A SCOPING CALL</button>
      </div>
      <div class="spm-dark">
        <div class="spm-dark-label" style="color:var(--workflow-dark);letter-spacing:0.12em;font-size:0.58rem">TYPICAL OUTCOME</div>
        <div class="spm-dark-stat" style="color:var(--workflow-dark)">4 hrs</div>
        <div class="spm-dark-stat-label">Saved per workflow per week, on average</div>
      </div>
    </div>

    <div class="service-page-mock">
      <div class="spm-hero spm-agents">
        <div class="spm-eyebrow">AI AGENTS</div>
        <div class="spm-h1">Judgement at scale, without headcount.</div>
        <div class="spm-body">Research, triage, drafting, review. Agents that make decisions within defined parameters — not just execute fixed steps.</div>
        <button class="spm-cta">BOOK A SCOPING CALL</button>
      </div>
      <div class="spm-dark">
        <div class="spm-dark-label" style="color:var(--agents-dark);letter-spacing:0.12em;font-size:0.58rem">TYPICAL OUTCOME</div>
        <div class="spm-dark-stat" style="color:var(--agents-dark)">6 hrs</div>
        <div class="spm-dark-stat-label">Of research or triage work automated per week</div>
      </div>
    </div>

    <div class="service-page-mock">
      <div class="spm-hero spm-data">
        <div class="spm-eyebrow">DATA EXTRACTION</div>
        <div class="spm-h1">Data locked in documents, freed.</div>
        <div class="spm-body">PDFs, emails, forms, contracts. Structured output from unstructured input — feeding your systems instead of your spreadsheets.</div>
        <button class="spm-cta">BOOK A SCOPING CALL</button>
      </div>
      <div class="spm-dark">
        <div class="spm-dark-label" style="color:var(--data-dark);letter-spacing:0.12em;font-size:0.58rem">TYPICAL OUTCOME</div>
        <div class="spm-dark-stat" style="color:var(--data-dark)">70%</div>
        <div class="spm-dark-stat-label">Reduction in manual data processing time</div>
      </div>
    </div>

    <div class="service-page-mock">
      <div class="spm-hero spm-engineering">
        <div class="spm-eyebrow">AI ENGINEERING</div>
        <div class="spm-h1">Model selection. RAG. Private deployment.</div>
        <div class="spm-body">Beyond the prompt. Choosing the right model for each job, designing retrieval, evaluating outputs, instrumenting failure modes. The work that turns a clever demo into a production build.</div>
        <button class="spm-cta">BOOK A SCOPING CALL</button>
      </div>
      <div class="spm-dark">
        <div class="spm-dark-label" style="color:var(--engineering-dark);letter-spacing:0.12em;font-size:0.58rem">STACK COVERED</div>
        <div class="spm-dark-stat" style="color:var(--engineering-dark)">6+</div>
        <div class="spm-dark-stat-label">Model families across Claude, GPT, Llama, Mistral, Qwen, Gemma</div>
      </div>
    </div>

  </div>
</div>

<!-- ======================== -->
<!-- COLOUR SYSTEM DOCS       -->
<!-- ======================== -->
<div class="section-label">COLOUR SYSTEM</div>
<div class="system-section">
  <div class="system-header">Full token set — ready for CSS custom properties</div>
  <div class="colour-system">

    <div class="colour-row">
      <div class="colour-row-label">Base — Light</div>
      <div class="colour-chips">
        <div class="chip"><div class="chip-swatch" style="background:#F6F2EB;border:1px solid #333"></div><div class="chip-name">--bg</div><div class="chip-hex">#F6F2EB</div><div class="chip-use">Page bg, hero sections</div></div>
        <div class="chip"><div class="chip-swatch" style="background:#EDE8DF;border:1px solid #333"></div><div class="chip-name">--bg-surface</div><div class="chip-hex">#EDE8DF</div><div class="chip-use">Cards on light bg</div></div>
        <div class="chip"><div class="chip-swatch" style="background:#D8D2C8;border:1px solid #333"></div><div class="chip-name">--border</div><div class="chip-hex">#D8D2C8</div><div class="chip-use">Dividers, card edges</div></div>
      </div>
    </div>

    <div class="colour-row">
      <div class="colour-row-label">Base — Dark</div>
      <div class="colour-chips">
        <div class="chip"><div class="chip-swatch" style="background:#131510"></div><div class="chip-name">--bg-dark</div><div class="chip-hex">#131510</div><div class="chip-use">Dark section bg</div></div>
        <div class="chip"><div class="chip-swatch" style="background:#1C1F19"></div><div class="chip-name">--bg-dark-surface</div><div class="chip-hex">#1C1F19</div><div class="chip-use">Cards on dark</div></div>
        <div class="chip"><div class="chip-swatch" style="background:#0D0F0B"></div><div class="chip-name">--bg-dark-deeper</div><div class="chip-hex">#0D0F0B</div><div class="chip-use">Gaps, footer, stat bar</div></div>
        <div class="chip"><div class="chip-swatch" style="background:#252820"></div><div class="chip-name">--border-dark</div><div class="chip-hex">#252820</div><div class="chip-use">Dark section dividers</div></div>
      </div>
    </div>

    <div class="colour-row">
      <div class="colour-row-label">Text</div>
      <div class="colour-chips">
        <div class="chip"><div class="chip-swatch" style="background:#1A1814;border:1px solid #333"></div><div class="chip-name">--text</div><div class="chip-hex">#1A1814</div><div class="chip-use">Body + primary CTA bg</div></div>
        <div class="chip"><div class="chip-swatch" style="background:#6B6358;border:1px solid #333"></div><div class="chip-name">--text-muted</div><div class="chip-hex">#6B6358</div><div class="chip-use">Body on light sections</div></div>
        <div class="chip"><div class="chip-swatch" style="background:#A09890;border:1px solid #333"></div><div class="chip-name">--text-faint</div><div class="chip-hex">#A09890</div><div class="chip-use">Timestamps, labels</div></div>
        <div class="chip"><div class="chip-swatch" style="background:#E4E0D8"></div><div class="chip-name">--text-dark</div><div class="chip-hex">#E4E0D8</div><div class="chip-use">Primary text on dark</div></div>
        <div class="chip"><div class="chip-swatch" style="background:#888078"></div><div class="chip-name">--text-dark-muted</div><div class="chip-hex">#888078</div><div class="chip-use">Secondary on dark</div></div>
      </div>
    </div>

    <div class="colour-row">
      <div class="colour-row-label">Service — Workflow Automation</div>
      <div class="colour-chips">
        <div class="chip"><div class="chip-swatch" style="background:#4A7A60"></div><div class="chip-name">--workflow</div><div class="chip-hex">#4A7A60</div><div class="chip-use">Tags on light bg</div></div>
        <div class="chip"><div class="chip-swatch" style="background:#5A8A70"></div><div class="chip-name">--workflow-dark</div><div class="chip-hex">#5A8A70</div><div class="chip-use">Labels on dark bg, stats</div></div>
        <div class="chip"><div class="chip-swatch" style="background:rgba(74,122,96,0.08);border:1px solid #333"></div><div class="chip-name">--workflow-bg</div><div class="chip-hex">rgba(74,122,96,.08)</div><div class="chip-use">Tag background tint</div></div>
      </div>
    </div>

    <div class="colour-row">
      <div class="colour-row-label">Service — AI Agents</div>
      <div class="colour-chips">
        <div class="chip"><div class="chip-swatch" style="background:#5A6E8A"></div><div class="chip-name">--agents</div><div class="chip-hex">#5A6E8A</div><div class="chip-use">Tags on light bg</div></div>
        <div class="chip"><div class="chip-swatch" style="background:#6A7E9A"></div><div class="chip-name">--agents-dark</div><div class="chip-hex">#6A7E9A</div><div class="chip-use">Labels on dark bg, stats</div></div>
        <div class="chip"><div class="chip-swatch" style="background:rgba(90,110,138,0.08);border:1px solid #333"></div><div class="chip-name">--agents-bg</div><div class="chip-hex">rgba(90,110,138,.08)</div><div class="chip-use">Tag background tint</div></div>
      </div>
    </div>

    <div class="colour-row">
      <div class="colour-row-label">Service — Data Extraction</div>
      <div class="colour-chips">
        <div class="chip"><div class="chip-swatch" style="background:#8A6A40"></div><div class="chip-name">--data</div><div class="chip-hex">#8A6A40</div><div class="chip-use">Tags on light bg</div></div>
        <div class="chip"><div class="chip-swatch" style="background:#9A7A50"></div><div class="chip-name">--data-dark</div><div class="chip-hex">#9A7A50</div><div class="chip-use">Labels on dark bg, stats</div></div>
        <div class="chip"><div class="chip-swatch" style="background:rgba(138,106,64,0.08);border:1px solid #333"></div><div class="chip-name">--data-bg</div><div class="chip-hex">rgba(138,106,64,.08)</div><div class="chip-use">Tag background tint</div></div>
      </div>
    </div>

    <div class="colour-row">
      <div class="colour-row-label">Service — AI Engineering</div>
      <div class="colour-chips">
        <div class="chip"><div class="chip-swatch" style="background:#6A5A7A"></div><div class="chip-name">--engineering</div><div class="chip-hex">#6A5A7A</div><div class="chip-use">Tags on light bg</div></div>
        <div class="chip"><div class="chip-swatch" style="background:#7A6A8A"></div><div class="chip-name">--engineering-dark</div><div class="chip-hex">#7A6A8A</div><div class="chip-use">Labels on dark bg, stats</div></div>
        <div class="chip"><div class="chip-swatch" style="background:rgba(106,90,122,0.08);border:1px solid #333"></div><div class="chip-name">--engineering-bg</div><div class="chip-hex">rgba(106,90,122,.08)</div><div class="chip-use">Tag background tint</div></div>
      </div>
    </div>

  </div>
</div>

<!-- ======================== -->
<!-- USAGE RULES              -->
<!-- ======================== -->
<div class="section-label">USAGE RULES</div>
<div class="system-section">
  <div class="system-header">Where colour appears — and where it doesn't</div>
  <div style="padding:2rem;background:#111;display:grid;grid-template-columns:1fr 1fr;gap:2rem;font-size:0.68rem;line-height:1.8">
    <div>
      <div style="font-size:0.58rem;letter-spacing:0.14em;color:#444;text-transform:uppercase;margin-bottom:1rem">COLOUR APPEARS ON</div>
      <div style="color:#888;display:flex;flex-direction:column;gap:0.4rem">
        <div style="color:#6bbd8a">✓</div>
        <div>Service category tags (WORKFLOW AUTOMATION etc.)</div>
        <div style="color:#6bbd8a;margin-top:0.4rem">✓</div>
        <div>Section eyebrow labels on service pages</div>
        <div style="color:#6bbd8a;margin-top:0.4rem">✓</div>
        <div>Stat numbers on service pages (4 hrs, 70% etc.)</div>
        <div style="color:#6bbd8a;margin-top:0.4rem">✓</div>
        <div>Card top border stripe (2px accent line)</div>
        <div style="color:#6bbd8a;margin-top:0.4rem">✓</div>
        <div>Article category pills in blog list</div>
        <div style="color:#6bbd8a;margin-top:0.4rem">✓</div>
        <div>Case study left stripe on work pages</div>
        <div style="color:#6bbd8a;margin-top:0.4rem">✓</div>
        <div>Service page primary CTA button</div>
        <div style="color:#6bbd8a;margin-top:0.4rem">✓</div>
        <div>PDF audit report — each workflow type colour-coded</div>
      </div>
    </div>
    <div>
      <div style="font-size:0.58rem;letter-spacing:0.14em;color:#444;text-transform:uppercase;margin-bottom:1rem">COLOUR DOES NOT APPEAR ON</div>
      <div style="color:#888;display:flex;flex-direction:column;gap:0.4rem">
        <div style="color:#d46b6b">✗</div>
        <div>Homepage primary CTA (stays black on parchment)</div>
        <div style="color:#d46b6b;margin-top:0.4rem">✗</div>
        <div>Navigation links or logo (always monochrome)</div>
        <div style="color:#d46b6b;margin-top:0.4rem">✗</div>
        <div>Body text anywhere</div>
        <div style="color:#d46b6b;margin-top:0.4rem">✗</div>
        <div>Headings (always --text or --text-dark)</div>
        <div style="color:#d46b6b;margin-top:0.4rem">✗</div>
        <div>AI Implementation pillar page (monochrome — it's the umbrella, not a child service)</div>
        <div style="color:#d46b6b;margin-top:0.4rem">✗</div>
        <div>AI Readiness Audit form pages (monochrome — it's a conversion tool, not a service)</div>
        <div style="color:#d46b6b;margin-top:0.4rem">✗</div>
        <div>Industry pages at the hero level (monochrome — service-coloured cards appear inside the page)</div>
        <div style="color:#d46b6b;margin-top:0.4rem">✗</div>
        <div>Contact page · About page · Footer</div>
        <div style="color:#d46b6b;margin-top:0.4rem">✗</div>
        <div>Generic homepage hero eyebrow (stays muted brown)</div>
      </div>
    </div>
  </div>
</div>

</body>
</html>
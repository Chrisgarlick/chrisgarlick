---
title: The LLM Cheat Sheet 2026
subtitle: Every model that matters, on one page (UK business edition)
author: Chris Garlick
date: 2026-05-27
document_type: brief
---

# The LLM Cheat Sheet 2026

Closed-API frontier models and the open-source field that closed the gap in 2025. Price, strengths, gotchas, and when each one is the right pick for a UK business.

This is the companion to the article [How to Choose an LLM for Business Use (UK 2026)](https://chrisgarlick.com/article/how-to-choose-an-llm). Read that for the reasoning. Keep this for the reference.

---

## 1. Closed-API frontier models

Hosted, billed per token, no infrastructure. The right choice when volume is low, workloads are varied, and you have no engineering capacity to spare.

### Claude Sonnet 4.6 — Anthropic

| Field | Value |
|---|---|
| Price per million tokens | $3 in, $15 out |
| Context window | 200K (1M in beta) |
| Best at | Coding, document work, low hallucination |
| UK data residency | Via Azure UK or AWS Bedrock UK only |

**Pick when** you want the safest default for general UK SME work. Pair with Haiku 4.5 for cheap calls in a hybrid setup.

### Claude Opus 4.7 — Anthropic

| Field | Value |
|---|---|
| Price per million tokens | $5 in, $25 out |
| SWE-bench Verified | 83.5% (leading the field) |
| Best at | Hardest coding tasks, lowest hallucination rate (36%) |
| UK data residency | Via Azure UK or AWS Bedrock UK only |

**Pick when** the task genuinely needs frontier reasoning. Not a sensible default. Wasted on classification or simple drafting.

### GPT-5.5 — OpenAI

| Field | Value |
|---|---|
| Price per million tokens | $3 in, $15 out (50% via the Batch API) |
| Terminal-Bench | 82.7% (leading the field) |
| Best at | Agentic tool use, multi-hour autonomous runs, deepest ecosystem (function calls, Codex) |
| UK data residency | Via Azure OpenAI UK region |

**Pick when** the workload is agent loops, function calling, or Codex-shaped work. Hallucinates more than Claude on long-form writing.

### Gemini 3.1 Pro and Flash — Google

| Field | Value |
|---|---|
| Price per million tokens | $1.25 in / $12 out for Pro. Flash is roughly 10x cheaper. |
| Context window | 2M native |
| Best at | Multimodal work, huge contexts, cheapest of the frontier models |
| UK data residency | EU region via Vertex AI. No UK-specific region. |

**Pick when** volume is high and tasks are bulk: classification, extraction, summarisation. Flash for cheap, Pro for hard cases.

### DeepSeek V4 — DeepSeek (China)

**Read this section carefully. There are two ways to use this model and they have completely different risk profiles.**

| Field | Value |
|---|---|
| Price per million tokens | $0.44 in, $0.87 out |
| Quality | Roughly 10x cheaper than Claude Sonnet at similar quality on many tasks |
| Via vendor API (hosted) | Do not use for UK business data. Your prompts transit to servers in China. No GDPR representative in the EU. The hosted database leaked publicly in early 2025. |
| Via self-hosted weights (MIT licence) | Safe. The weights are static and cannot phone home. Run it on your own UK or EU GPU box. |

**Pick when** you self-host the open weights and your use case isn't politically sensitive. Never call the vendor-hosted API for client data.

---

## 2. Open-source models, self-hosted

Run on your own GPU. Data residency is automatic, not a contractual promise. The right choice for regulated UK firms (legal, financial services, accountancy, NHS-adjacent) and for any business processing more than 50 million tokens a month.

### Llama 4 Maverick — Meta (Apache 2.0)

| Field | Value |
|---|---|
| Architecture | 400B total parameters, 17B active (Mixture-of-Experts) |
| Hardware needed | 2 to 4 × A100 or H100 |
| Best at | General reasoning, long agent runs, English-first business work |
| UK data residency | Wherever your GPU box lives |

**Pick when** you want the safest open-source default for UK regulated work. The closest equivalent to "Claude but on your hardware".

### Qwen 3.5 — Alibaba (Apache 2.0)

| Field | Value |
|---|---|
| Architecture | 397B total, 17B active (Mixture-of-Experts) |
| Adoption | 700M+ downloads on Hugging Face, the most-downloaded family in 2025 |
| Best at | Coding, maths, instruction following. Wins several 2026 benchmarks outright. |
| UK data residency | Safe when self-hosted from open weights. Never use the hosted API. |

**Pick when** coding quality matters and you want the best open-source model on your hardware. Avoid for any workflow touching geopolitical content.

### Mistral Large 3 — Mistral (EU, Apache 2.0)

| Field | Value |
|---|---|
| Architecture | 675B total, 41B active (Mixture-of-Experts) |
| Hardware needed | 4 to 8 × A100 or H100 for full quality |
| Best at | European-language work, GDPR-friendly procurement story, document RAG |
| UK data residency | Native. EU-headquartered vendor. |

**Pick when** you need the easiest "yes" from a UK or EU compliance team. The strongest procurement story of the open-source field.

### Gemma 4 and smaller open models — Google and others

| Field | Value |
|---|---|
| Sizes | 7B to 70B parameters |
| Hardware needed | A single GPU, often a consumer card |
| Best at | Narrow fine-tuned tasks: extraction, classification, format conversion |
| UK data residency | Native. Cheap to run anywhere. |

**Pick when** the task is repetitive, narrow, and high-volume. Fine-tune on 10,000 of your own examples. Beats frontier models on the specific task at 1% of the runtime cost.

---

## 3. The honest summary

For most UK SMEs running fewer than 10 million tokens a month, the right setup is a frontier API as the daily driver (Claude Sonnet 4.6 as the safest default, GPT-5.5 if you need agentic tool use, Gemini 3.1 Flash if you want price headroom), with a cheap fallback model for high-volume bulk tasks.

For UK businesses handling regulated data, or anyone processing more than 50 million tokens a month, self-hosted open-source models on UK or EU infrastructure are the better commercial and compliance answer. Not the "free LLM" of three years ago. Production-grade systems that close the quality gap and never let your data leave your servers.

The mistake most UK businesses make is picking a model before defining the workflow. The second is treating "which LLM" as a one-time decision. In 2026 the right answer is almost always a routing layer: frontier API for the hard 20%, cheap or self-hosted models for the predictable 80%.

---

## 4. Next step

Want a second opinion on which model setup fits the work you're actually trying to ship? [Book a free 30-minute scoping call](https://chrisgarlick.com/contact). I'll give you the honest answer, including when that answer is "you don't need any of this yet."

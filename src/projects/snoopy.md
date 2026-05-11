---
slug: snoopy
title: Snoopy
oneLiner: A Python research pipeline. Amplitude in, designer-readable prose out, Python does the math so Claude doesn't have to.
status: live
shippedAt: 2026-02-23
tags: [python, pipeline, amplitude, mcp, claude-haiku, design-research]
screenshot: /screenshots/snoopy.svg
links:
  - { label: "/snoopy skill", url: "#" }
---

## What it actually is

A research pipeline. Not a script, not a one-off. A real Python toolkit. It pulls the right events from Amplitude (project 190118, 18 verified billing events plus backend lifecycle), runs them through a typed aggregator, sanity-checks the result, and asks Claude to turn the structured output into a designer-readable brief. The 4-part billing brief is the first use case. The architecture is reusable.

## Why I built it like this

The naive version ("let Claude read Amplitude and write something") loses fidelity. Numbers get rounded, percentages get vibes-based, "roughly half" hides what would have been a meaningful 47% vs 53% split. So Snoopy is built around one rule: **Python does the math, Claude does the writing.** The pipeline:

1. **Queries in parallel.** 3 Amplitude queries plus 1 Jira lookup, all fired at once via MCP.
2. **Pre-computes everything.** `aggregator.py` produces the funnel, the rates, the churn composition, the formatted summaries. Claude never multiplies two numbers.
3. **Sanity-checks before writing.** If `billing_views == 0`, something broke upstream. If `support_rate > 25%`, there's a product incident. The pipeline catches it before a report goes out and degrades gracefully.
4. **Loads context.** Billing flows, prototype decisions, Jira tickets. So the brief connects the data to what the team is actually building.
5. **Humanizes the output.** Removes banned phrases, swaps adjectives for numbers, names things specifically.
6. **Saves and emails.** `~/snoopy/reports/` plus an inbox drop.

## Why people read it

Designers and PMs across the billing org started asking when the weekly drop landed. The 4-part shape (*what we know · what to do · is the prototype validated · what we still can't measure*) answered the questions design actually has, instead of dumping a dashboard.

## What's portable

The architecture isn't billing-specific. Same shape works for any research question where the data lives in Amplitude (or anything reachable via MCP). Verify the event names, write the aggregator, write the prompt, done. Once the credits-and-usage rebuild is steady, retention or onboarding are the next targets.

## Where it's going next

Phase 2 is team-wide rollout. Right now Snoopy is built for one research question (billing) and one researcher (me). The next chapter: wait for the new analytics events from the credits-and-usage spec to land correctly in production. Validate the aggregator against the cleaner stream. Then open the pipeline up to any designer on the team to point at their own research question. Same architecture, different aggregator file, different prompt. Once that's wired, retention and onboarding are the obvious next targets.

## Day to day

When the cron is on, a designer-facing brief lands Monday morning. I read it like everyone else. When phase 2 lands, the same Monday email goes to whoever asked for the question.
